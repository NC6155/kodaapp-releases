import { t as db } from "./db_BgmFgjUe.mjs";
//#region src/lib/fotos.ts
function urlFotoPerfil(id, nombre) {
	return nombre ? `/api/fotos/perfil/${id}?v=${encodeURIComponent(nombre)}` : null;
}
function urlFotoMascota(id, nombre) {
	return nombre ? `/api/fotos/mascotas/${id}?v=${encodeURIComponent(nombre)}` : null;
}
async function agregarFotosMascotas(mascotas) {
	if (!mascotas.length) return [];
	const resultado = await db.query(`SELECT id, foto_blob
     FROM mascotas
     WHERE id = ANY($1::integer[])`, [mascotas.map((m) => Number(m.id))]);
	const fotos = /* @__PURE__ */ new Map();
	for (const fila of resultado.rows) fotos.set(Number(fila.id), urlFotoMascota(Number(fila.id), fila.foto_blob));
	return mascotas.map((mascota) => ({
		...mascota,
		foto: fotos.get(Number(mascota.id)) ?? null
	}));
}
//#endregion
export { urlFotoPerfil as n, agregarFotosMascotas as t };
