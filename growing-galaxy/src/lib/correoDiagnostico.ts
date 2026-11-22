export function mensajeErrorCorreo(error: unknown): string {
  const e = error as {
    code?: string;
    responseCode?: number;
    message?: string;
  } | null;

  // Gmail rechazó las credenciales.
  if (e?.responseCode === 535 || e?.code === "EAUTH") {
    return (
      "Gmail rechazó las credenciales de la cuenta " +
      "que utiliza KodApp para enviar correos. " +
      "Revisa SMTP_USER y la contraseña de aplicación " +
      "SMTP_APP_PASSWORD en el archivo .env."
    );
  }

  // Variables SMTP ausentes.
  if (
    /Falta configurar SMTP_USER|SMTP_APP_PASSWORD/.test(
      e?.message ?? ""
    )
  ) {
    return (
      "Falta configurar SMTP_USER o SMTP_APP_PASSWORD " +
      "en el archivo .env del servidor."
    );
  }

  // Problemas de conexión.
  if (
    ["ECONNECTION", "ETIMEDOUT", "ENOTFOUND", "ESOCKET"]
      .includes(e?.code ?? "")
  ) {
    return (
      "No se pudo conectar con Gmail. " +
      "Revisa la conexión a Internet y el servidor SMTP."
    );
  }

  // Error no identificado.
  return (
    "No se pudo enviar el correo desde KodApp. " +
    "Revisa la configuración SMTP del servidor."
  );
}
