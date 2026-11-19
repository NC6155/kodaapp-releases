import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { a as hashCodigoCorreo, n as enviarCodigoCorreo, r as generarCodigoCorreo } from "./verificacioncorreo_Cjwocysm.mjs";
//#region src/pages/api/reenviarcodigo.ts
var reenviarcodigo_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var json = (data, status = 200) => new Response(JSON.stringify(data), {
	status,
	headers: {
		"Content-Type": "application/json",
		"Cache-Control": "no-store",
		...status === 429 && typeof data.esperaSegundos === "number" ? { "Retry-After": String(data.esperaSegundos) } : {}
	}
});
var POST = async ({ request }) => {
	const data = await request.json().catch(() => ({}));
	const correo = typeof data?.correo === "string" ? data.correo.trim().toLowerCase() : "";
	if (correo.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return json({
		ok: false,
		mensaje: "Introduce un correo válido."
	}, 400);
	let client;
	try {
		const codigo = generarCodigoCorreo();
		const codigoHash = hashCodigoCorreo(correo, codigo);
		client = await db.connect();
		await client.query("BEGIN");
		if ((await client.query("SELECT id FROM usuarios WHERE correo = $1", [correo])).rows.length > 0) {
			await client.query("ROLLBACK");
			return json({
				ok: false,
				mensaje: "Este correo ya tiene una cuenta."
			}, 409);
		}
		if ((await client.query(`INSERT INTO verificaciones_registro (
        correo,
        codigo_hash,
        expira_en,
        ultimo_envio
      )
      VALUES (
        $1,
        $2,
        NOW() + INTERVAL '15 minutes',
        NOW()
      )

      ON CONFLICT (correo)
      DO UPDATE SET
        codigo_hash = EXCLUDED.codigo_hash,
        expira_en = EXCLUDED.expira_en,
        intentos = 0,
        verificado = FALSE,
        comprobante_hash = NULL,
        comprobante_expira_en = NULL,
        ultimo_envio = NOW()

      WHERE
        verificaciones_registro.ultimo_envio
          <= NOW() - INTERVAL '60 seconds'

      RETURNING correo`, [correo, codigoHash])).rowCount === 0) {
			const estado = await client.query(`SELECT
           verificado,
           GREATEST(0, CEIL(EXTRACT(EPOCH FROM (
             ultimo_envio + INTERVAL '60 seconds' - NOW()
           ))))::integer AS espera_segundos,
           GREATEST(0, CEIL(EXTRACT(EPOCH FROM (
             expira_en - NOW()
           ))))::integer AS codigo_expira_segundos,
           (verificado = FALSE AND expira_en > NOW() AND intentos < 5)
             AS codigo_pendiente
         FROM verificaciones_registro
         WHERE correo = $1`, [correo]);
			await client.query("ROLLBACK");
			const fila = estado.rows[0];
			if (fila?.verificado) return json({
				ok: false,
				mensaje: "El correo ya fue verificado. Finaliza el registro."
			}, 409);
			const esperaSegundos = Number(fila?.espera_segundos ?? 0);
			return json({
				ok: false,
				esperaSegundos,
				codigoPendiente: Boolean(fila?.codigo_pendiente),
				codigoExpiraSegundos: Number(fila?.codigo_expira_segundos ?? 0),
				mensaje: esperaSegundos > 0 ? `Espera ${esperaSegundos} segundos antes de reenviar el código.` : "No se puede solicitar otro código en este momento."
			}, esperaSegundos > 0 ? 429 : 409);
		}
		try {
			await enviarCodigoCorreo(correo, codigo);
		} catch (error) {
			await client.query("ROLLBACK");
			console.error("Error de envío SMTP:", error);
			return json({
				ok: false,
				mensaje: "No se pudo enviar el correo. Revisa las credenciales SMTP."
			}, 503);
		}
		await client.query("UPDATE verificaciones_registro SET ultimo_envio = clock_timestamp(), expira_en = clock_timestamp() + INTERVAL '15 minutes' WHERE correo = $1", [correo]);
		await client.query("COMMIT");
		return json({
			ok: true,
			esperaSegundos: 60,
			codigoExpiraSegundos: 900,
			mensaje: "¡Código enviado! Es válido durante 15 minutos."
		});
	} catch (error) {
		if (client) await client.query("ROLLBACK").catch(() => {});
		console.error("Error al generar el código:", error);
		return json({
			ok: false,
			mensaje: "No se pudo generar el código."
		}, 500);
	} finally {
		client?.release();
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/reenviarcodigo@_@ts
var page = () => reenviarcodigo_exports;
//#endregion
export { page };
