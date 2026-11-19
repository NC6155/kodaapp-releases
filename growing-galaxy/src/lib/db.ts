// Importamos Pool desde la librería pg.
// Pool permite mantener y reutilizar conexiones con PostgreSQL.
import { Pool } from "pg";
import { readFileSync } from "node:fs";

// Creamos el pool de conexiones a la base de datos.
// Los datos de conexión se obtienen desde las variables del archivo .env.
export const db = new Pool({
  // Dirección donde está funcionando PostgreSQL.
  host: process.env.DB_HOST,

  // Puerto de PostgreSQL.
  // Number() convierte el valor de texto a número.
  port: Number(process.env.DB_PORT || 5432),

  // Nombre de la base de datos.
  database: process.env.DB_NAME,

  // Usuario de PostgreSQL.
  user: process.env.DB_USER,

  // Contraseña del usuario de PostgreSQL.
  password: process.env.DB_PASSWORD,

  // Configuración SSL para conexiones seguras.
  ssl: {
    ca: readFileSync(
      "/etc/kodaapp/certs/rds-ca.pem",
      "utf8"
    ),
    rejectUnauthorized: true,
  },
});