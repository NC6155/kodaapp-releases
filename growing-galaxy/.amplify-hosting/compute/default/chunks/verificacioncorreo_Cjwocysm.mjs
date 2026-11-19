import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import nodemailer from "nodemailer";
//#region src/lib/verificacioncorreo.ts
function generarCodigoCorreo() {
	return randomInt(0, 1e6).toString().padStart(6, "0");
}
function hashCodigoCorreo(correo, codigo) {
	const secreto = process.env.EMAIL_CODE_SECRET;
	if (!secreto || secreto.length < 32) throw new Error("EMAIL_CODE_SECRET no está configurado correctamente.");
	return createHmac("sha256", secreto).update(`${correo.trim().toLowerCase()}:${codigo}`).digest("hex");
}
function comprobarCodigoCorreo(correo, codigo, hashGuardado) {
	if (!/^[a-f0-9]{64}$/.test(hashGuardado)) return false;
	const nuevoHash = hashCodigoCorreo(correo, codigo);
	return timingSafeEqual(Buffer.from(nuevoHash, "hex"), Buffer.from(hashGuardado, "hex"));
}
function generarComprobante() {
	return randomBytes(32).toString("hex");
}
function hashComprobante(comprobante) {
	return createHash("sha256").update(comprobante).digest("hex");
}
async function enviarCodigoCorreo(destinatario, codigo) {
	const usuarioSMTP = process.env.SMTP_USER;
	const passwordSMTP = process.env.SMTP_APP_PASSWORD;
	if (!usuarioSMTP || !passwordSMTP) throw new Error("Falta configurar SMTP_USER o SMTP_APP_PASSWORD.");
	await nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: usuarioSMTP,
			pass: passwordSMTP
		}
	}).sendMail({
		from: `"KodApp" <${usuarioSMTP}>`,
		to: destinatario,
		subject: "KodApp - Verifica tu correo",
		text: `¡Bienvenido a KodApp!\n\nTu código de seguridad es: ${codigo}\n\nEl código vence en 15 minutos.\nNo lo compartas con nadie.`,
		html: `
      <div style="
        background:#1e2229;
        color:#f8f9fa;
        padding:35px;
        max-width:480px;
        margin:auto;
        border-radius:18px;
        font-family:Arial,sans-serif;
        text-align:center;
      ">
        <h1 style="color:#ff6b4a;">
          🐾 KodApp
        </h1>

        <h2>¡Verifica tu correo!</h2>

        <p>
          Introduce este código en tu
          formulario de registro.
        </p>

        <div style="
          margin:25px 0;
          padding:20px;
          background:#303640;
          border:1px solid #ff6b4a;
          border-radius:12px;
          font-size:36px;
          font-weight:bold;
          letter-spacing:8px;
          color:#4ebe96;
        ">
          ${codigo}
        </div>

        <p>Válido durante 15 minutos.</p>

        <p style="color:#aeb7c0;font-size:12px;">
          Si no solicitaste este código,
          puedes ignorar este correo.
        </p>
      </div>
    `
	});
}
//#endregion
export { hashCodigoCorreo as a, generarComprobante as i, enviarCodigoCorreo as n, hashComprobante as o, generarCodigoCorreo as r, comprobarCodigoCorreo as t };
