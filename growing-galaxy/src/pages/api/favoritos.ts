
import type { APIRoute } from "astro";

import { db } from "../../lib/db";
import { getUsuarioDesdeSesion } from "../../lib/auth";

export const prerender = false;

function responder(datos: object, estado = 200) {
  return new Response(JSON.stringify(datos), {
    status: estado,
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
  const origin = request.headers.get("origin");

  if (origin && origin !== new URL(request.url).origin) {
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
      mensaje: "Solo los adoptantes pueden guardar favoritos."
    }, 403);
  }

  const datos = await request.json().catch(() => null);

  const mascotaId = datos?.mascotaId;
  const accion = datos?.accion;

  if (
    !Number.isSafeInteger(mascotaId) ||
    mascotaId < 1 ||
    mascotaId > 2147483647 ||
    !["guardar", "quitar"].includes(accion)
  ) {
    return responder({
      ok: false,
      mensaje: "Datos inválidos."
    }, 400);
  }

  try {
    if (accion === "guardar") {

      // Solo permitir guardar mascotas publicadas
      // que sigan disponibles para adopción.
      const mascota = await db.query(
        `SELECT id
         FROM mascotas_postulables
         WHERE id = $1`,
        [mascotaId]
      );

      if (mascota.rows.length === 0) {
        return responder({
          ok: false,
          mensaje: "Esta mascota ya no está disponible."
        }, 409);
      }

      await db.query(
        `INSERT INTO favoritos
           (adoptante_id, mascota_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [usuario.id, mascotaId]
      );

      return responder({
        ok: true,
        mensaje: "Mascota guardada en favoritos."
      });
    }

    // Quitar mascota de favoritos.
    await db.query(
      `DELETE FROM favoritos
       WHERE adoptante_id = $1
         AND mascota_id = $2`,
      [usuario.id, mascotaId]
    );

    return responder({
      ok: true,
      mensaje: "Mascota eliminada de favoritos."
    });

  } catch (error) {
    console.error("Error en favoritos:", error);

    return responder({
      ok: false,
      mensaje: "No se pudo actualizar favoritos."
    }, 500);
  }
};
