
import type { APIRoute } from "astro";

import { db } from "../../../lib/db";
import { getUsuarioDesdeSesion } from "../../../lib/auth";

import {
  COMUNAS_BIOBIO,
  RAZAS_POR_TIPO
} from "../../../lib/catalogosMascotas";

import {
  validarImagen,
  subirImagen,
  borrarImagen,
  ErrorImagen,
  type ImagenValidada
} from "../../../lib/azure";

import {
  PERSONALIDADES,
  ANTECEDENTES_MEDICOS,
  procesarClasificacion
} from "../../../lib/CatalogoMatch";

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

export const POST: APIRoute = async ({ request, cookies }) => {

  const origin = request.headers.get("origin");

  if (origin && origin !== new URL(request.url).origin) {
    return responder({
      ok: false,
      mensaje: "Origen no permitido."
    }, 403);
  }

  try {
    // Comprobar sesión y permisos
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
        mensaje: "Solo las organizaciones pueden publicar."
      }, 403);
    }

    const datos = await request.formData();

    // Información básica
    const nombre = String(datos.get("nombre") ?? "").trim();
    const tipo = String(datos.get("tipoMascota") ?? "").trim();
    const descripcion = String(datos.get("descripcion") ?? "").trim();

    const personalidad = procesarClasificacion(
      datos.get("personalidadCodigo"),
      datos.get("personalidadDetalle"),
      PERSONALIDADES,
      "la personalidad"
    );

    const salud = procesarClasificacion(
      datos.get("saludCodigo"),
      datos.get("saludDetalle"),
      ANTECEDENTES_MEDICOS,
      "los antecedentes médicos"
    );

    if (!nombre || nombre.length > 100) {
      return responder({ ok: false, mensaje: "Nombre inválido." }, 400);
    }

    if (!["perro", "gato", "otro"].includes(tipo)) {
      return responder({ ok: false, mensaje: "Tipo inválido." }, 400);
    }

    if (descripcion.length > 5000) {
      return responder({ ok: false, mensaje: "Descripción demasiado larga." }, 400);
    }

    if (!personalidad.ok) {
      return responder({ ok: false, mensaje: personalidad.mensaje }, 400);
    }

    if (!salud.ok) {
      return responder({ ok: false, mensaje: salud.mensaje }, 400);
    }

    // Información adicional de la ficha

    const raza = String(datos.get("raza") ?? "").trim();
    const edadTexto = String(datos.get("edadMeses") ?? "").trim();
    const sexo = String(datos.get("sexo") ?? "desconocido");
    const tamano = String(datos.get("tamano") ?? "desconocido");
    const ubicacion = String(datos.get("ubicacion") ?? "").trim();

    const requisitos = String(
      datos.get("requisitosAdopcion") ?? ""
    ).trim();

    const esterilizadoTexto = String(
      datos.get("esterilizado") ?? "desconocido"
    );

    const vacunasTexto = String(
      datos.get("vacunasAlDia") ?? "desconocido"
    );

    // ====================================
    // VALIDAR LONGITUD DE LOS CAMPOS
    // ====================================

    if (
      raza.length > 100 ||
      ubicacion.length > 120 ||
      requisitos.length > 2000
    ) {
      return responder({
        ok: false,
        mensaje: "Raza, ubicación o requisitos demasiado largos."
      }, 400);
    }

    // ====================================
    // VALIDAR COMUNA
    // ====================================

    if (!COMUNAS_BIOBIO.includes(ubicacion)) {
      return responder({
        ok: false,
        mensaje: "Selecciona una comuna válida de la Región del Biobío."
      }, 400);
    }

    // ====================================
    // VALIDAR RAZA SEGÚN TIPO DE MASCOTA
    // ====================================

    const razasPermitidas = RAZAS_POR_TIPO[tipo] ?? [];

    if (!razasPermitidas.includes(raza)) {
      return responder({
        ok: false,
        mensaje: "Selecciona una raza válida para el tipo de mascota."
      }, 400);
    }


    const convertirBooleano = (valor: string): boolean | null => {
      if (valor === "si") return true;
      if (valor === "no") return false;
      return null;
    };

    // Validar fotografía principal
    const fotoPrincipal = await validarImagen(
      datos.get("foto"),
      true
    );

    // Validar galería
    const archivos = datos.getAll("galeria").filter(
      (valor) => valor instanceof File && valor.size > 0
    );

    if (archivos.length > 4) {
      return responder({
        ok: false,
        mensaje: "Máximo 4 fotografías adicionales."
      }, 400);
    }

    const galeria: ImagenValidada[] = [];

    for (const archivo of archivos) {
      const imagen = await validarImagen(archivo);
      if (imagen) galeria.push(imagen);
    }

    // Base de datos + Azure
    const cliente = await db.connect();
    const fotosSubidas: string[] = [];

    try {
      await cliente.query("BEGIN");

      const resultado = await cliente.query(
        `INSERT INTO mascotas (
          usuario_id,
          nombre,
          descripcion,
          personalidad,
          personalidad_codigo,
          historial_medico,
          salud_codigo,
          estado_adopcion,
          tipo_mascota,
          raza,
          edad_meses,
          sexo,
          tamano,
          esterilizado,
          vacunas_al_dia,
          ubicacion,
          requisitos_adopcion
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          'disponible',
          $8, $9, $10, $11, $12, $13,
          $14, $15, $16
        )
        RETURNING id`,
        [
          usuario.id,
          nombre,
          descripcion || null,
          personalidad.texto,
          personalidad.codigo,
          salud.texto,
          salud.codigo,
          tipo,
          raza || null,
          edadMeses,
          sexo,
          tamano,
          convertirBooleano(esterilizadoTexto),
          convertirBooleano(vacunasTexto),
          ubicacion || null,
          requisitos || null
        ]
      );

      const mascotaId = Number(resultado.rows[0].id);

      // Subir portada a Azure
      if (fotoPrincipal) {
        const nombreBlob = await subirImagen(
          "mascotas",
          mascotaId,
          fotoPrincipal
        );

        fotosSubidas.push(nombreBlob);

        await cliente.query(
          `UPDATE mascotas
           SET foto_blob = $1
           WHERE id = $2`,
          [nombreBlob, mascotaId]
        );
      }

      // Subir fotografías adicionales
      for (let i = 0; i < galeria.length; i++) {
        const nombreBlob = await subirImagen(
          "mascotas",
          mascotaId,
          galeria[i]
        );

        fotosSubidas.push(nombreBlob);

        await cliente.query(
          `INSERT INTO mascotas_fotos
             (mascota_id, foto_blob, orden)
           VALUES ($1, $2, $3)`,
          [mascotaId, nombreBlob, i + 1]
        );
      }

      await cliente.query("COMMIT");

      return responder({
        ok: true,
        mensaje: "Mascota publicada correctamente.",
        mascotaId
      }, 201);

    } catch (error) {
      // Revertir los registros si falla la publicación
      await cliente.query("ROLLBACK").catch(console.error);

      // Intentar eliminar de Azure las fotos ya subidas
      for (const nombreBlob of fotosSubidas) {
        await borrarImagen(nombreBlob).catch(console.error);
      }

      throw error;

    } finally {
      cliente.release();
    }

  } catch (error) {
    if (error instanceof ErrorImagen) {
      return responder({
        ok: false,
        mensaje: error.message
      }, 400);
    }

    console.error("Error publicando mascota:", error);

    return responder({
      ok: false,
      mensaje: "No se pudo publicar la mascota."
    }, 500);
  }
};
