
import type { APIRoute } from "astro";
import { db } from "../../../lib/db";
import { getUsuarioDesdeSesion } from "../../../lib/auth";

import { leerPostulacion } from "../../../lib/postulacion";
import { comprobarCupo, ReglaAdopcion } from "../../../lib/adopcion";

export const prerender = false;

/**
 * KODAPP - CREAR POSTULACIÓN
 *
 * Solo permite postular a usuarios adoptantes.
 * Comprueba los datos y evita postulaciones duplicadas.
 * No modifica el estado de adopción de la mascota.
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
  // Evitar solicitudes desde otro origen.
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
      mensaje: "Debes iniciar sesión."
    }, 401);
  }

  if (usuario.tipo_usuario !== "adoptante") {
    return responder({
      ok: false,
      mensaje: "Solo los adoptantes pueden postular."
    }, 403);
  }

  let entrada;
  try {
    entrada = leerPostulacion(await request.json().catch(() => null));
  } catch (error) {
    return responder({ ok: false, mensaje: (error as Error).message }, 400);
  }
  const { mascotaId, telefono, vivienda, motivo } = entrada;

  const conexion = await db.connect();

  try {
    await conexion.query("BEGIN");

    // Bloquea la mascota durante el registro para
    // evitar decisiones simultáneas incompatibles.
    const consultaMascota = await conexion.query(
      `SELECT id, usuario_id, estado_adopcion
       FROM mascotas
       WHERE id = $1
        AND publicada = TRUE
       FOR UPDATE`,
      [mascotaId]
    );

    if (consultaMascota.rows.length === 0) {
      await conexion.query("ROLLBACK");

      return responder({
        ok: false,
        mensaje: "La mascota no existe."
      }, 404);
    }

    const mascota = consultaMascota.rows[0];

    if (mascota.estado_adopcion !== "disponible") {
      await conexion.query("ROLLBACK");

      return responder({
        ok: false,
        mensaje: "Esta mascota ya no recibe postulaciones."
      }, 409);
    }

    if (Number(mascota.usuario_id) === Number(usuario.id)) {
      await conexion.query("ROLLBACK");

      return responder({
        ok: false,
        mensaje: "No puedes postular a tu propia mascota."
      }, 403);
    }

    const organizacion = await conexion.query(
      "SELECT estado_cuenta FROM usuarios WHERE id = $1 FOR SHARE", [mascota.usuario_id]
    );
    if (organizacion.rows[0]?.estado_cuenta !== "activo") {
      throw new ReglaAdopcion("La organización está suspendida.", 403);
    }
    await comprobarCupo(conexion, usuario.id);

    // Una postulación aprobada cierra nuevas
    // solicitudes para esa mascota.
    const aprobada = await conexion.query(
      `SELECT id
       FROM postulaciones
       WHERE mascota_id = $1
         AND estado = 'aprobada' AND fin_tenencia IS NULL 
       LIMIT 1`,
      [mascotaId]
    );

    if (aprobada.rows.length > 0) {
      await conexion.query("ROLLBACK");

      return responder({
        ok: false,
        mensaje:
          "Esta mascota ya tiene una postulación aprobada."
      }, 409);
    }

    // Evitar duplicados del mismo adoptante.
    const duplicada = await conexion.query(
      `SELECT id
       FROM postulaciones
       WHERE mascota_id = $1
         AND adoptante_id = $2
       LIMIT 1`,
      [mascotaId, usuario.id]
    );

    if (duplicada.rows.length > 0) {
      await conexion.query("ROLLBACK");

      return responder({
        ok: false,
        mensaje: "Ya postulaste para esta mascota."
      }, 409);
    }

    await conexion.query(
      `INSERT INTO postulaciones (
         mascota_id,
         adoptante_id,
         telefono,
         vivienda,
         motivo,
         estado
       )
       VALUES ($1, $2, $3, $4, $5, 'pendiente')`,
      [
        mascotaId,
        usuario.id,
        telefono,
        vivienda,
        motivo
      ]
    );

    await conexion.query("COMMIT");

    return responder({
      ok: true,
      mensaje:
        "Tu postulación fue enviada correctamente."
    }, 201);

  } catch (error) {
    await conexion.query("ROLLBACK").catch(() => {});

    if (error instanceof ReglaAdopcion) return responder({ ok: false, mensaje: error.message }, error.status);
    const codigo =
      (error as { code?: string }).code;

    if (codigo === "23505") {
      return responder({
        ok: false,
        mensaje: "Ya existe una postulación para esta mascota."
      }, 409);
    }

    console.error("Error al crear postulación:", error);

    return responder({
      ok: false,
      mensaje: "Error al guardar la postulación."
    }, 500);

  } finally {
    conexion.release();
  }
};
