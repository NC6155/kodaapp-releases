
import nodemailer from "nodemailer";

interface AvisoCorreo {
  para: string;
  asunto: string;
  titulo: string;
  mensaje: string;
  detalle: string;
}

// Evita interpretar como HTML los nombres de
// usuarios, mascotas y organizaciones.
function escaparHTML(texto: string): string {
  return texto.replace(/[&<>"']/g, (caracter) => {
    const reemplazos: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return reemplazos[caracter];
  });
}

export async function enviarAvisoKodaApp({
  para,
  asunto,
  titulo,
  mensaje,
  detalle
}: AvisoCorreo): Promise<void> {

  const usuarioSMTP =
    import.meta.env.SMTP_USER ?? process.env.SMTP_USER;

  const passwordSMTP =
    import.meta.env.SMTP_APP_PASSWORD ??
    process.env.SMTP_APP_PASSWORD;

  if (!usuarioSMTP || !passwordSMTP) {
    throw new Error("Configuración SMTP incompleta.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: usuarioSMTP,
      pass: passwordSMTP
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  });

  await transporter.sendMail({
    from: `"KodaApp" <${usuarioSMTP}>`,
    to: para,
    subject: `KodaApp - ${asunto}`,

    text:
      `🐾 KodaApp\n\n` +
      `${titulo}\n\n` +
      `${mensaje}\n\n` +
      `${detalle}\n\n` +
      `Puedes consultar el estado desde KodaApp.`,

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
          🐾 KodaApp
        </h1>

        <h2>${escaparHTML(titulo)}</h2>

        <p style="line-height:1.7;">
          ${escaparHTML(mensaje)}
        </p>

        <div style="
          margin:25px 0;
          padding:20px;
          background:#303640;
          border:1px solid #ff6b4a;
          border-radius:12px;
          font-size:18px;
          font-weight:bold;
          color:#4ebe96;
        ">
          ${escaparHTML(detalle)}
        </div>

        <p>
          Puedes consultar más información
          iniciando sesión en KodaApp.
        </p>

        <p style="
          color:#aeb7c0;
          font-size:12px;
          margin-top:28px;
        ">
          Este es un mensaje automático de KodaApp.
          No compartas información personal
          respondiendo a este correo.
        </p>

      </div>
    `
  });
}
