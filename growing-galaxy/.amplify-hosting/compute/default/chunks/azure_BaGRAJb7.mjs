import { BlobServiceClient } from "@azure/storage-blob";
import { randomUUID } from "node:crypto";
//#region src/lib/azure.ts
var ErrorImagen = class extends Error {};
var contenedorPendiente;
async function obtenerContenedor() {
	if (!contenedorPendiente) contenedorPendiente = (async () => {
		const conexion = process.env.AZURE_STORAGE_CONNECTION_STRING;
		const nombre = process.env.AZURE_STORAGE_CONTAINER || "kodapp-fotos";
		if (!conexion) throw new Error("Falta AZURE_STORAGE_CONNECTION_STRING en .env");
		const contenedor = BlobServiceClient.fromConnectionString(conexion).getContainerClient(nombre);
		await contenedor.createIfNotExists();
		return contenedor;
	})().catch((error) => {
		contenedorPendiente = void 0;
		throw error;
	});
	return contenedorPendiente;
}
async function validarImagen(valor, opcional = false) {
	if (valor === null || valor instanceof File && valor.size === 0) {
		if (opcional) return null;
		throw new ErrorImagen("Selecciona una fotografía.");
	}
	if (!(valor instanceof File)) throw new ErrorImagen("El archivo no es válido.");
	if (valor.size > 5242880) throw new ErrorImagen("La imagen no puede superar los 5 MB.");
	if (![
		"image/jpeg",
		"image/png",
		"image/webp"
	].includes(valor.type)) throw new ErrorImagen("Solo se permiten imágenes JPG, PNG o WebP.");
	const datos = Buffer.from(await valor.arrayBuffer());
	const esJpg = datos.length >= 3 && datos[0] === 255 && datos[1] === 216 && datos[2] === 255;
	const esPng = datos.length >= 8 && datos.subarray(0, 8).equals(Buffer.from([
		137,
		80,
		78,
		71,
		13,
		10,
		26,
		10
	]));
	const esWebp = datos.length >= 12 && datos.toString("ascii", 0, 4) === "RIFF" && datos.toString("ascii", 8, 12) === "WEBP";
	if (!(valor.type === "image/jpeg" && esJpg || valor.type === "image/png" && esPng || valor.type === "image/webp" && esWebp)) throw new ErrorImagen("El contenido no corresponde a una imagen válida.");
	const extension = valor.type === "image/jpeg" ? "jpg" : valor.type === "image/png" ? "png" : "webp";
	return {
		datos,
		mime: valor.type,
		extension
	};
}
async function subirImagen(carpeta, id, imagen) {
	const nombre = `${carpeta}/${id}/${randomUUID()}.${imagen.extension}`;
	await (await obtenerContenedor()).getBlockBlobClient(nombre).uploadData(imagen.datos, { blobHTTPHeaders: { blobContentType: imagen.mime } });
	return nombre;
}
async function borrarImagen(nombre) {
	if (!nombre) return;
	const contenedor = await obtenerContenedor();
	try {
		await contenedor.deleteBlob(nombre, { deleteSnapshots: "include" });
	} catch (error) {
		if (error.statusCode !== 404) throw error;
	}
}
async function descargarImagen(nombre) {
	const datos = await (await obtenerContenedor()).getBlockBlobClient(nombre).downloadToBuffer();
	const extension = nombre.split(".").pop()?.toLowerCase();
	return {
		datos,
		mime: extension === "jpg" ? "image/jpeg" : extension === "png" ? "image/png" : "image/webp"
	};
}
//#endregion
export { validarImagen as a, subirImagen as i, borrarImagen as n, descargarImagen as r, ErrorImagen as t };
