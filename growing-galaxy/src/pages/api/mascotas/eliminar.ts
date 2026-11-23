
import type { APIRoute } from "astro";

import { db } from "../../../lib/db";
import { getUsuarioDesdeSesion } from "../../../lib/auth";

export const prerender = false;

function responder(
  datos: Record<string, unknown>,
  status = 200
) {
  return new Response(JSON.stringify(datos), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}

export const DELETE: APIRoute = async ({
  request,
  cookies
}) => {
  const origin = request.headers.get("origin");

  if (
    origin &&
    origin !== new URL(request.url).origin
  ) {
    return responder({
      ok: false,
      mensaje: "Origen no permitido."
    }, 403);
  }

  try {
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
        mensaje: "Sin permisos."
      }, 403);
    }

    const datos = await request.json()
      .catch(() => null);

    const id = Number(datos?.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return responder({
        ok: false,
        mensaje: "ID inválido."
      }, 400);
    }

    
    const resultado = await db.query(
      `UPDATE mascotas
      SET publicada = FALSE
      WHERE id = $1
        AND usuario_id = $2
      RETURNING id`,
      [id, usuario.id]
    );


    if (!resultado.rows.length) {
      return responder({
        ok: false,
        mensaje: "Mascota no encontrada o sin permisos."
      }, 404);
    }

    return responder({
      ok: true,
      mensaje: "La Publicación fue ocultada correctamente."
    });

  } catch (error) {
    if (["23001", "23503"].includes((error as {code?: string}).code ?? "")) {
      return responder({ok: false, mensaje: "Esta mascota tiene postulaciones. Conservamos su historial."}, 409);
    }
    console.error(
      "Error eliminando mascota:",
      error
    );

    return responder({
      ok: false,
      mensaje: "No se pudo eliminar la publicación."
    }, 500);
  }
};
