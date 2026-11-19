import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { t as validarContrasena } from "./validarcontrasena_Lzm43Qtu.mjs";
import { o as hashComprobante } from "./verificacioncorreo_Cjwocysm.mjs";
import { timingSafeEqual } from "node:crypto";
import bcrypt from "bcrypt";
//#region src/lib/rut.ts
/**
* KODAPP - VALIDACIÓN DE RUT CHILENO
*
* Módulo 11.
* Comprueba formato y dígito verificador.
* NO verifica existencia real ni identidad.
*/
function normalizarRut(valor) {
	if (typeof valor !== "string") return null;
	const limpio = valor.trim().toUpperCase().replace(/[.\-\s]/g, "");
	if (!/^[0-9]{1,8}[0-9K]$/.test(limpio)) return null;
	const cuerpo = limpio.slice(0, -1);
	const dv = limpio.slice(-1);
	if (cuerpo.length > 8 || Number(cuerpo) === 0 || cuerpo.length > 1 && cuerpo.startsWith("0")) return null;
	return `${cuerpo}-${dv}`;
}
function calcularDigitoVerificador(cuerpo) {
	if (!/^[0-9]{1,8}$/.test(cuerpo)) return null;
	let suma = 0;
	let multiplicador = 2;
	for (let i = cuerpo.length - 1; i >= 0; i--) {
		suma += Number(cuerpo[i]) * multiplicador;
		multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
	}
	const resultado = 11 - suma % 11;
	if (resultado === 11) return "0";
	if (resultado === 10) return "K";
	return String(resultado);
}
function validarRut(valor) {
	const normalizado = normalizarRut(valor);
	if (!normalizado) return false;
	const [cuerpo, dv] = normalizado.split("-");
	return calcularDigitoVerificador(cuerpo) === dv;
}
function formatearRut(valor) {
	const normalizado = normalizarRut(valor);
	if (!normalizado) return valor.trim();
	const [cuerpo, dv] = normalizado.split("-");
	return `${cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${dv}`;
}
//#endregion
//#region src/pages/api/registro.ts
var registro_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
function responder(datos, estado = 200) {
	return new Response(JSON.stringify(datos), {
		status: estado,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-store"
		}
	});
}
var POST = async ({ request }) => {
	let conexion;
	try {
		const datos = await request.json().catch(() => ({}));
		const nombre = String(datos.nombre ?? "").trim();
		const rutEntrada = String(datos.rut ?? "").trim();
		const correo = String(datos.correo ?? "").trim().toLowerCase();
		const tipoUsuario = String(datos.tipoUsuario ?? "");
		const contrasena = datos.contrasena;
		const comprobante = datos.comprobante;
		if (!nombre || !rutEntrada || !correo || typeof contrasena !== "string" || !contrasena) return responder({
			ok: false,
			mensaje: "Completa todos los campos."
		}, 400);
		if (nombre.length > 100) return responder({
			ok: false,
			mensaje: "El nombre no puede superar 100 caracteres."
		}, 400);
		if (!validarRut(rutEntrada)) return responder({
			ok: false,
			mensaje: "El RUT ingresado no tiene un dígito verificador válido. Revisa los datos."
		}, 400);
		const rut = formatearRut(rutEntrada);
		if (rut.length > 12) return responder({
			ok: false,
			mensaje: "El formato del RUT es inválido."
		}, 400);
		const rutCompacto = rut.toUpperCase().replace(/[^0-9K]/g, "");
		if (correo.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return responder({
			ok: false,
			mensaje: "Correo electrónico inválido."
		}, 400);
		if (contrasena.length > 72 || Buffer.byteLength(contrasena, "utf8") > 72) return responder({
			ok: false,
			mensaje: "La contraseña es demasiado larga."
		}, 400);
		const erroresContrasena = validarContrasena(contrasena);
		if (erroresContrasena.length > 0) return responder({
			ok: false,
			mensaje: erroresContrasena.join(" ")
		}, 400);
		if (!["adoptante", "organizacion"].includes(tipoUsuario)) return responder({
			ok: false,
			mensaje: "Selecciona un tipo de cuenta válido."
		}, 400);
		if (typeof comprobante !== "string" || !/^[a-f0-9]{64}$/.test(comprobante)) return responder({
			ok: false,
			mensaje: "Primero debes verificar tu correo."
		}, 403);
		const contrasenaHash = await bcrypt.hash(contrasena, 12);
		conexion = await db.connect();
		await conexion.query("BEGIN");
		if (((await conexion.query(`
      SELECT id
      FROM usuarios
      WHERE LOWER(correo) = $1
         OR REGEXP_REPLACE(
              UPPER(rut),
              '[^0-9K]',
              '',
              'g'
            ) = $2
      LIMIT 1
      `, [correo, rutCompacto])).rowCount ?? 0) > 0) {
			await conexion.query("ROLLBACK");
			return responder({
				ok: false,
				mensaje: "El correo o RUT ya están registrados."
			}, 409);
		}
		const registro = (await conexion.query(`
      SELECT
        verificado,
        comprobante_hash,
        comprobante_expira_en
      FROM verificaciones_registro
      WHERE correo = $1
      FOR UPDATE
      `, [correo])).rows[0];
		if (!registro || !registro.verificado || !registro.comprobante_hash || !registro.comprobante_expira_en || new Date(registro.comprobante_expira_en).getTime() <= Date.now()) {
			await conexion.query("ROLLBACK");
			return responder({
				ok: false,
				mensaje: "La verificación expiró. Verifica tu correo nuevamente."
			}, 403);
		}
		const hashEsperado = Buffer.from(registro.comprobante_hash, "hex");
		const hashRecibido = Buffer.from(hashComprobante(comprobante), "hex");
		if (hashEsperado.length !== 32 || hashRecibido.length !== 32 || !timingSafeEqual(hashEsperado, hashRecibido)) {
			await conexion.query("ROLLBACK");
			return responder({
				ok: false,
				mensaje: "El comprobante de verificación no es válido."
			}, 403);
		}
		const resultado = await conexion.query(`
      INSERT INTO usuarios (
        nombre,
        rut,
        correo,
        tipo_usuario,
        contrasena,
        estado_cuenta,
        correo_verificado,
        descripcion_perfil
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        'activo',
        TRUE,
        ''
      )
      RETURNING id
      `, [
			nombre,
			rut,
			correo,
			tipoUsuario,
			contrasenaHash
		]);
		await conexion.query(`
      DELETE FROM verificaciones_registro
      WHERE correo = $1
      `, [correo]);
		await conexion.query("COMMIT");
		return responder({
			ok: true,
			mensaje: "Cuenta creada correctamente.",
			usuarioId: resultado.rows[0].id
		}, 201);
	} catch (error) {
		if (conexion) await conexion.query("ROLLBACK").catch(() => {});
		if ((typeof error === "object" && error !== null && "code" in error ? error.code : void 0) === "23505") return responder({
			ok: false,
			mensaje: "El correo o RUT ya están registrados."
		}, 409);
		console.error("Error de registro:", error);
		return responder({
			ok: false,
			mensaje: "No se pudo crear la cuenta."
		}, 500);
	} finally {
		conexion?.release();
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/registro@_@ts
var page = () => registro_exports;
//#endregion
export { page };
