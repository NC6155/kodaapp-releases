import {readFile, writeFile} from "node:fs/promises";
import {randomBytes} from "node:crypto";
import {insertarDatosDemo} from "./datos-demo.mjs";
import pg from "pg";
import {db} from "../src/lib/db.ts";

const nombreBD = "koda_seminario_demo";
const acceso = new URL("../.env.demo.local", import.meta.url);
if (!["localhost","127.0.0.1","::1"].includes(process.env.DB_HOST)) throw Error("La demo requiere PostgreSQL local.");
try {
  const existe = await db.query("SELECT 1 FROM pg_database WHERE datname=$1",[nombreBD]);
  if (!existe.rowCount) await db.query("CREATE DATABASE koda_seminario_demo");
} finally { await db.end(); }
const cliente = new pg.Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT || 5432),database:nombreBD,user:process.env.DB_USER,password:process.env.DB_PASSWORD});
await cliente.connect();
try {
  await cliente.query("SELECT pg_advisory_lock(721198)");
  const tablas = await cliente.query("SELECT to_regclass('public.usuarios') AS usuarios,to_regclass('public.demo_seminario') AS marca");
  if (tablas.rows[0].usuarios && !tablas.rows[0].marca) throw Error("Ya existe una base con datos ajenos a esta demo.");
  if (!tablas.rows[0].marca) {
    await cliente.query("CREATE TABLE IF NOT EXISTS demo_seminario (version integer PRIMARY KEY)");
  }
  await cliente.query(await readFile(new URL("../../bdkodapp.txt",import.meta.url),"utf8"));
  await cliente.query(await readFile(new URL("../sql/02_gestion.sql",import.meta.url),"utf8"));
  const lista = await cliente.query("SELECT 1 FROM demo_seminario WHERE version=1");
  if (lista.rowCount) {
    console.log("La base de demostración ya está preparada. Acceso en .env.demo.local.");
  } else {
    let clave;
    try {
      const previo = await readFile(acceso,"utf8");
      clave = previo.match(/^DEMO_CLAVE=([A-Za-z0-9_-]{24,})$/m)?.[1];
      if (!clave) throw Error("Revisa el archivo de acceso existente.");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      clave = randomBytes(24).toString("base64url");
      await writeFile(acceso,`DB_NAME=${nombreBD}\nDEMO_CLAVE=${clave}\n`,{flag:"wx",mode:0o600});
    }
    await cliente.query("BEGIN");
    await insertarDatosDemo(cliente, clave);
    await cliente.query("INSERT INTO demo_seminario VALUES(1)");
    await cliente.query("COMMIT");
    console.log("Demo poblada. Las credenciales locales están en .env.demo.local.");
  }
} catch (error) { await cliente.query("ROLLBACK"); throw error; }
finally { await cliente.end(); }
