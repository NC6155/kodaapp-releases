import { readFile } from "node:fs/promises";
import { db } from "../src/lib/db.ts";
try {
  await db.query(await readFile(new URL("../sql/02_gestion.sql", import.meta.url), "utf8"));
  console.log("Migración de gestión aplicada.");
} finally { await db.end(); }
