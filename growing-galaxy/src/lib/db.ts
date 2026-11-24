import "dotenv/config";
import { Pool } from "pg";
import { readFileSync } from "node:fs";

// Conexión a la base de datos principal de KodApp.
// Este archivo debe utilizarse solamente en el servidor.
export const db = new Pool({
  host: process.env.DB_HOST,

  port: Number(
    process.env.DB_PORT ?? 5432
  ),

  database: process.env.DB_NAME,

  user: process.env.DB_USER,

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