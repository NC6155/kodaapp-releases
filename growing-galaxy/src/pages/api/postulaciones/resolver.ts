
import type { APIRoute } from "astro";
import { db } from "../../../lib/db";
import { getUsuarioDesdeSesion } from "../../../lib/auth";

import { comprobarCupo, ReglaAdopcion } from "../../../lib/adopcion";

export const prerender = false;

/**
 * KODAPP - RESOLVER POSTULACIONES
 *
 * Acciones:
 * aprobar  -> estado 'aprobada'
 * rechazar -> estado 'rechazada'
 *
 * Una aprobación inicia la tenencia y actualiza la ficha.
 */

function responder(
  datos: Record<string, unknown>,
  status = 200
): Response {
  return new Response(JSON.stringify(datos), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}

export const POST: APIRoute = async ({
  request,
  cookies
}) => {
  if (
    request.headers.get("origin") !==
    new URL(request.url).origin
  ) {
    return responder({
      ok: false,
      mensaje: "Origen no permitido."
    }, 403);
  }

  const usuario = await getUsuarioDesdeSesion(
    cookies.get("session_id")?.value
  );

  if (!usuario) {
    return responder({
      ok: false,
      mensaje: "Sesión expirada."
    }, 401);
  }

  if (usuario.tipo_usuario !== "organizacion") {
    return responder({
      ok: false,
      mensaje:
        "Solo las organizaciones pueden evaluar postulaciones."
    }, 403);
  }

  const cuerpo: unknown =
    await request.json().catch(() => null);

  if (
    !cuerpo ||
    typeof cuerpo !== "object" ||
    Array.isArray(cuerpo)
  ) {
    return responder({
      ok: false,
      mensaje: "Solicitud inválida."
    }, 400);
  }

  const datos = cuerpo as Record<string, unknown>;

  const postulacionId = Number(datos.postulacionId);
  const decision = datos.decision;

  if (
    !Number.isSafeInteger(postulacionId) ||
    postulacionId <= 0 ||
    (decision !== "aprobar" && decision !== "rechazar" && decision !== "cerrar")
  ) {
    return responder({
      ok: false,
      mensaje: "Postulación o decisión inválida."
    }, 400);
  }

  const nuevoEstado =
    decision === "aprobar"
      ? "aprobada"
      : "rechazada";

  const conexion = await db.connect();

  try {
    await conexion.query("BEGIN");

    // ==========================================
    // BLOQUEAR AL ADOPTANTE ANTES DE LA MASCOTA
    // ==========================================

    // Comprobar que la postulación pertenece
    // a una mascota de esta organización.
    const referencia = await conexion.query(
      `SELECT p.adoptante_id
      FROM postulaciones p
      JOIN mascotas m ON m.id = p.mascota_id
      WHERE p.id = $1
        AND m.usuario_id = $2`,
      [postulacionId, usuario.id]
    );

    if (referencia.rows.length === 0) {
      await conexion.query("ROLLBACK");

      return responder({
        ok: false,
        mensaje:
          "La postulación no existe o no corresponde a tu organización."
      }, 404);
    }

    // Al aprobar, bloquear primero al adoptante.
    // Así distintas organizaciones no pueden
    // superar el cupo mediante aprobaciones simultáneas.
    if (decision === "aprobar") {
      await conexion.query(
        `SELECT id
        FROM usuarios
        WHERE id = $1
        FOR UPDATE`,
        [referencia.rows[0].adoptante_id]
      );
    }


    // Bloquear la mascota de esta postulación.
    // Así dos decisiones simultáneas no pueden
    // aprobar solicitudes incompatibles.
    const mascota = await conexion.query(
      `SELECT
         m.id,
         m.estado_adopcion
       FROM mascotas m
       JOIN postulaciones p
         ON p.mascota_id = m.id
       WHERE p.id = $1
         AND m.usuario_id = $2
       FOR UPDATE OF m`,
      [postulacionId, usuario.id]
    );

    if (mascota.rows.length === 0) {
      await conexion.query("ROLLBACK");

      return responder({
        ok: false,
        mensaje:
          "La postulación no existe o no corresponde a tu organización."
      }, 404);
    }

    const organizacion = await conexion.query(
      "SELECT 1 FROM usuarios WHERE id=$1 AND tipo_usuario='organizacion' AND estado_cuenta='activo' FOR SHARE", [usuario.id]
    );
    if (!organizacion.rowCount) throw new ReglaAdopcion("La organización no está activa.", 403);

    // Bloquear la postulación que vamos a resolver.
    const consulta = await conexion.query(
      `SELECT
         id,
         mascota_id, adoptante_id, fin_tenencia,
         estado
       FROM postulaciones
       WHERE id = $1
       FOR UPDATE`,
      [postulacionId]
    );

    if (consulta.rows.length === 0) {
      await conexion.query("ROLLBACK");

      return responder({
        ok: false,
        mensaje: "Postulación no encontrada."
      }, 404);
    }

    const postulacion = consulta.rows[0];

    if (decision === "cerrar") {
      if (postulacion.estado !== "aprobada" || postulacion.fin_tenencia) {
        throw new ReglaAdopcion("La postulación no tiene una tenencia activa.");
      }
      await conexion.query("UPDATE postulaciones SET fin_tenencia = now() WHERE id = $1", [postulacionId]);
      await conexion.query("UPDATE mascotas SET estado_adopcion = 'reservada' WHERE id = $1", [postulacion.mascota_id]);
      await conexion.query("COMMIT");
      return responder({ ok: true, mensaje: "Tenencia cerrada. La organización puede volver a publicar la mascota." });
    }
    if (postulacion.estado !== "pendiente") {
      await conexion.query("ROLLBACK");

      return responder({
        ok: false,
        mensaje:
          "Esta postulación ya fue evaluada."
      }, 409);
    }

    if (nuevoEstado === "aprobada") {
      if (
        mascota.rows[0].estado_adopcion !== "disponible"
      ) {
        await conexion.query("ROLLBACK");

        return responder({
          ok: false,
          mensaje:
            "La mascota ya no está disponible."
        }, 409);
      }

      await comprobarCupo(conexion, postulacion.adoptante_id);

      // Impedir una segunda postulación aprobada.
      const otraAprobada = await conexion.query(
        `SELECT id
         FROM postulaciones
         WHERE mascota_id = $1
           AND estado = 'aprobada' AND fin_tenencia IS NULL
         LIMIT 1`,
        [postulacion.mascota_id]
      );

      if (otraAprobada.rows.length > 0) {
        await conexion.query("ROLLBACK");

        return responder({
          ok: false,
          mensaje:
            "Esta mascota ya tiene una postulación aprobada."
        }, 409);
      }
    }

    if (nuevoEstado === "aprobada") {
      await conexion.query("UPDATE mascotas SET estado_adopcion = 'adoptada' WHERE id = $1", [postulacion.mascota_id]);
      await conexion.query(
        "UPDATE postulaciones SET estado = 'rechazada', resuelta_en = now() WHERE mascota_id = $1 AND id <> $2 AND estado = 'pendiente'",
        [postulacion.mascota_id, postulacionId]
      );
    }
    await conexion.query(
      `UPDATE postulaciones
       SET estado = $1,
           resuelta_en = NOW()
       WHERE id = $2`,
      [nuevoEstado, postulacionId]
    );

    await conexion.query("COMMIT");

    return responder({
      ok: true,
      mensaje:
        nuevoEstado === "aprobada"
          ? "Postulación aprobada correctamente."
          : "Postulación rechazada correctamente.",
      estado: nuevoEstado
    });

  } catch (error) {
    await conexion.query("ROLLBACK").catch(() => {});

    if (error instanceof ReglaAdopcion) return responder({ ok: false, mensaje: error.message }, error.status);
    const codigo =
      (error as { code?: string }).code;

    if (codigo === "23505") {
      return responder({
        ok: false,
        mensaje:
          "Ya existe una postulación aprobada para esta mascota."
      }, 409);
    }

    console.error(
      "Error al resolver postulación:",
      error
    );

    return responder({
      ok: false,
      mensaje: "No se pudo evaluar la postulación."
    }, 500);

  } finally {
    conexion.release();
  }
};
