import { existsSync, mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

if (process.env.DB_NAME !== "koda_seminario_demo") throw Error("Prepara la base con npm run demo.");
if (!existsSync("dist/server/entry.mjs")) throw Error("Compila primero con npm run build.");
const local = path.resolve(".koda-local");
mkdirSync(local,{recursive:true});
const bin = process.env.CADDY_EXE || (existsSync(path.join(local,"caddy.exe")) ? path.join(local,"caddy.exe") : "caddy");
const entorno = {...process.env, APPDATA:local, XDG_DATA_HOME:local, XDG_CONFIG_HOME:local};
delete entorno.DEMO_CLAVE;
const hijos = [];
let cerrando = false;
function cerrar(codigo) {
  if (cerrando) return;
  cerrando = true;
  process.exitCode = codigo;
  for (const hijo of hijos) if (hijo.pid && hijo.exitCode === null) hijo.kill();
}
for (const [binario,args] of [[process.execPath,["scripts/iniciar.mjs"]],[bin,["run","--config","Caddyfile","--adapter","caddyfile"]]]) {
  const hijo = spawn(binario,args,{env:entorno,stdio:"inherit",windowsHide:true});
  hijos.push(hijo);
  hijo.once("error",e=>{console.error(e.message);cerrar(1);});
  hijo.once("exit",codigo=>cerrar(codigo ?? 1));
}
process.on("SIGINT",()=>cerrar(0));
process.on("SIGTERM",()=>cerrar(0));
