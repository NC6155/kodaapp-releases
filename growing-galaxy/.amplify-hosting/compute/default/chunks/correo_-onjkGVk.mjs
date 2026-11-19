import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import nodemailer from "nodemailer";
//#region src/lib/seguridad/correo.ts
function generarCodigo() {
	return randomInt(0, 1e6).toString().padStart(6, "0");
}
function obtenerSecreto() {
	const secreto = process.env.EMAIL_CODE_SECRET;
	if (!secreto || secreto.length < 32) throw new Error("EMAIL_CODE_SECRET no está configurado correctamente.");
	return secreto;
}
function hashCodigo(usuarioId, correo, codigo) {
	return createHmac("sha256", obtenerSecreto()).update(`${usuarioId}:${correo}:${codigo}`).digest("hex");
}
function compararCodigos(esperado, recibido) {
	if (!/^[a-f0-9]{64}$/i.test(esperado) || !/^[a-f0-9]{64}$/i.test(recibido)) return false;
	return timingSafeEqual(Buffer.from(esperado, "hex"), Buffer.from(recibido, "hex"));
}
async function enviarCodigo(destinatario, codigo) {
	await nodemailer.createTransport({
		host: process.env.SMTP_HOST || "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_APP_PASSWORD
		}
	}).sendMail({
		from: process.env.SMTP_USER,
		to: destinatario,
		subject: "KodApp - Cambiar correo electrónico",
		text: `Tu código de verificación es: ${codigo}

El código vence en 15 minutos.

Si no solicitaste este cambio, ignora el mensaje.`
	});
}
//#endregion
export { hashCodigo as i, enviarCodigo as n, generarCodigo as r, compararCodigos as t };
