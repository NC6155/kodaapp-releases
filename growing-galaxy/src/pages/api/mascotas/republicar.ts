
import type { APIRoute } from "astro";
import { db } from "../../../lib/db";
import { getUsuarioDesdeSesion } from "../../../lib/auth";

export const prerender = false;

function responder(datos: object, status = 200) {
  return new Response(JSON.stringify(datos), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}

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

  if (usuario.tipo_usuario !== "organizacion") {
    return responder({
      ok: false,
      mensaje: "Solo las organizaciones pueden publicar mascotas."
    }, 403);
  }

  const datos = await request.json().catch(() => null);
  const id = datos?.id;

  if (!Number.isSafeInteger(id) || id <= 0) {
    return responder({
      ok: false,
      mensaje: "Mascota inválida."
    }, 400);
  }

  try {
    const resultado = await db.query(
      `UPDATE mascotas AS m
       SET publicada = TRUE
       WHERE m.id = $1
         AND m.usuario_id = $2
         AND m.publicada = FALSE
         AND m.estado_adopcion = 'disponible'

         AND EXISTS (
           SELECT 1
           FROM usuarios u
           WHERE u.id = m.usuario_id
             AND u.estado_cuenta = 'activo'
         )

         AND NOT EXISTS (
           SELECT 1
           FROM postulaciones p
           WHERE p.mascota_id = m.id
             AND p.estado = 'aprobada'
             AND p.fin_tenencia IS NULL
         )

       RETURNING m.id`,
      [id, usuario.id]
    );

    if (resultado.rowCount === 0) {
      return responder({
        ok: false,
        mensaje:
          "No se pudo republicar. Verifica que la mascota esté disponible, pertenezca a tu organización y no tenga una adopción vigente."
      }, 409);
    }

    return responder({
      ok: true,
      mensaje: "Mascota publicada nuevamente."
    });

  } catch (error) {
    console.error("Error al republicar:", error);

    return responder({
      ok: false,
      mensaje: "No se pudo recuperar la publicación."
    }, 500);
  }
};
