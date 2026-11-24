import { readFile } from "node:fs/promises";
import { db } from "../src/lib/db.ts";
import { PERSONALIDADES, ANTECEDENTES_MEDICOS, procesarClasificacion } from "../src/lib/CatalogoMatch.ts";

const [archivo, organizacion] = process.argv.slice(2);
if (!archivo || !/^\d{1,10}$/.test(organizacion ?? "")) throw Error("Uso: npm run importar -- archivo.jsonl ID_ORGANIZACION");
const conexion = await db.connect();
try {
  const lineas = (await readFile(archivo,"utf8")).replace(/^\uFEFF/,"").split(/\r?\n/);
  await conexion.query("BEGIN");
  const cuenta = await conexion.query("SELECT id FROM usuarios WHERE id=$1 AND tipo_usuario='organizacion' AND estado_cuenta='activo' FOR SHARE",[organizacion]);
  if (!cuenta.rowCount) throw Error("Selecciona una organización activa.");
  let insertadas = 0, existentes = 0;
  for (const [indice, linea] of lineas.entries()) {
    if (!linea.trim()) continue;
    let fila;
    try { fila = JSON.parse(linea); } catch { throw Error(`Línea ${indice+1}: JSON inválido.`); }
    const texto = valor => typeof valor === "string" ? valor.trim().normalize("NFC") : "";
    const referencia = texto(fila?.referencia), nombre = texto(fila?.nombre);
    const tipo = texto(fila?.tipo).toLowerCase(), descripcion = texto(fila?.descripcion);
    if (!referencia || referencia.length > 100 || nombre.length < 2 || nombre.length > 100 ||
        !["gato","perro","otro"].includes(tipo) || descripcion.length > 5000 ||
        (fila.descripcion != null && typeof fila.descripcion !== "string")) {
      throw Error(`Línea ${indice+1}: revisa referencia, nombre, tipo y descripción.`);
    }
    const personalidad = procesarClasificacion(texto(fila.personalidad).toLowerCase(),fila.detalle_personalidad,PERSONALIDADES,"personalidad");
    const salud = procesarClasificacion(texto(fila.salud).toLowerCase(),fila.detalle_salud,ANTECEDENTES_MEDICOS,"salud");
    if (!personalidad.ok || !salud.ok) throw Error(`Línea ${indice+1}: clasificación inválida.`);
    const resultado = await conexion.query(
      `INSERT INTO mascotas(usuario_id,referencia_origen,nombre,tipo_mascota,descripcion,personalidad_codigo,personalidad,salud_codigo,historial_medico)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (usuario_id,referencia_origen) DO NOTHING`,
      [organizacion,referencia,nombre,tipo,descripcion || null,personalidad.codigo,personalidad.texto,salud.codigo,salud.texto]);
    if (resultado.rowCount) insertadas++; else existentes++;
  }
  await conexion.query("COMMIT");
  console.log(`Importación completada. Nuevas: ${insertadas}. Referencias ya existentes: ${existentes}.`);
} catch (error) {
  await conexion.query("ROLLBACK");
  throw error;
} finally { conexion.release(); await db.end(); }
