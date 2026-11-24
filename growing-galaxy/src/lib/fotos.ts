
import { db } from "./db";

export function urlFotoPerfil(
  id: number,
  nombre: string | null
): string | null {
  return nombre
    ? `/api/fotos/perfil/${id}?v=${encodeURIComponent(nombre)}`
    : null;
}

export function urlFotoMascota(
  id: number,
  nombre: string | null
): string | null {
  return nombre
    ? `/api/fotos/mascotas/${id}?v=${encodeURIComponent(nombre)}`
    : null;
}

export async function obtenerFotoPerfil(
  usuarioId: number
): Promise<string | null> {
  const resultado = await db.query(
    "SELECT foto_blob FROM usuarios WHERE id = $1",
    [usuarioId]
  );

  return urlFotoPerfil(
    usuarioId,
    resultado.rows[0]?.foto_blob ?? null
  );
}

export function agregarFotosMascotas<T extends { id: number; foto_blob: string | null }>(mascotas: T[]) {
  return mascotas.map(({ foto_blob, ...mascota }) => ({
    ...mascota,
    foto: urlFotoMascota(Number(mascota.id), foto_blob)
  }));
}
