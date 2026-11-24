
import type { APIRoute } from "astro";
import { db } from "../../../../lib/db";
import { descargarImagen } from "../../../../lib/azure";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return new Response(null, { status: 404 });
  }

  try {
    const resultado = await db.query(
      `SELECT mf.foto_blob
       FROM mascotas_fotos mf
       JOIN mascotas m ON m.id = mf.mascota_id
       JOIN usuarios u ON u.id = m.usuario_id
       WHERE mf.id = $1
         AND u.estado_cuenta = 'activo'`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return new Response(null, { status: 404 });
    }

    const { datos, mime } = await descargarImagen(
      resultado.rows[0].foto_blob
    );

    return new Response(new Uint8Array(datos), {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error) {
    console.error("Error de galería:", error);
    return new Response(null, { status: 500 });
  }
};
