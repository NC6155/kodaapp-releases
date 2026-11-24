
import type { APIRoute } from "astro";
import { db } from "../../../lib/db";
import { getUsuarioDesdeSesion } from "../../../lib/auth";
import { enviarAvisoKodaApp } from "../../../lib/notificacionesCorreo";

export const prerender = false;

const responder = (datos: object, status = 200) =>
  new Response(JSON.stringify(datos), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });

export const POST: APIRoute = async ({ request, cookies }) => {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
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
      mensaje: "Solo los adoptantes pueden retirar solicitudes."
    }, 403);
  }

  const datos = await request.json().catch(() => null);
  const id = datos?.id;

  if (!Number.isSafeInteger(id) || id <= 0) {
    return responder({
      ok: false,
      mensaje: "Postulación inválida."
    }, 400);
  }

  try {
    const resultado = await db.query(
      `UPDATE postulaciones
       SET estado = 'cancelada',
           resuelta_en = NOW()
       WHERE id = $1
         AND adoptante_id = $2
         AND estado = 'pendiente'
       RETURNING id, mascota_id`,
      [id, usuario.id]
    );

    if (resultado.rowCount === 0) {
      return responder({
        ok: false,
        mensaje: "Solo puedes retirar tus solicitudes pendientes."
      }, 409);
    }

try {
  const informacion = await db.query(
    `SELECT
       m.nombre AS mascota,
       o.correo AS correo_organizacion
     FROM mascotas m
     JOIN usuarios o ON o.id = m.usuario_id
     WHERE m.id = $1`,
    [resultado.rows[0].mascota_id]
  );

  const aviso = informacion.rows[0];

  if (aviso?.correo_organizacion) {
    await enviarAvisoKodaApp({
      para: aviso.correo_organizacion,
      asunto: "Postulación retirada",
      titulo: "Una postulación fue retirada",
      mensaje:
        "Un adoptante retiró una solicitud pendiente. " +
        "Ya no es necesario evaluarla.",
      detalle: `Mascota: ${aviso.mascota}`
    });
  }

    } catch (error) {
    console.error(
        "No se pudo enviar el aviso de retiro:",
        error
    );
    }


    return responder({
      ok: true,
      mensaje: "Postulación retirada correctamente."
    });

  } catch (error) {
    console.error("Error retirando postulación:", error);

    return responder({
      ok: false,
      mensaje: "No se pudo retirar la postulación."
    }, 500);
  }
};
