import assert from "node:assert/strict";
import {spawn, execFileSync} from "node:child_process";
import {randomBytes} from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import https from "node:https";
import pg from "pg";
import {insertarDatosDemo} from "./datos-demo.mjs";
import {setTimeout as pausa} from "node:timers/promises";

const directorio = fs.mkdtempSync(path.join(os.tmpdir(),"koda-sf-"));
const temporal = "koda_qa_"+randomBytes(8).toString("hex");
const config = {host:process.env.DB_HOST,port:Number(process.env.DB_PORT || 5432),user:process.env.DB_USER,password:process.env.DB_PASSWORD};
if (!["localhost","127.0.0.1","::1"].includes(config.host)) throw Error("Se requiere PostgreSQL local.");
const llave = randomBytes(24).toString("base64url");
const mantenimiento = new pg.Client({...config,database:"postgres"});
const db = new pg.Client({...config,database:temporal});
const origen = "https://localhost:8443";
const procesos = [];
let creada = false;
const env = {...process.env,DB_NAME:temporal,KODA_BACKEND_PORT:"54321",KODA_SITE:"localhost:8443"};
function iniciar(bin,args) {
  const hijo = spawn(bin,args,{env,windowsHide:true,stdio:["ignore","pipe","pipe"]});
  hijo.on("error",e=>console.error(e.message));
  hijo.stderr.on("data",s=>fs.appendFileSync(path.join(directorio,"servicios.log"),s));
  hijo.stdout.on("data",s=>fs.appendFileSync(path.join(directorio,"servicios.log"),s));
  procesos.push(hijo);
}
function pedir(ruta, {cookie, json, form, metodo, origenPeticion=origen}={}) {
  const cuerpo = form ? new URLSearchParams(form).toString() : json ? JSON.stringify(json) : undefined;
  const ca = fs.readFileSync(path.join(directorio,"pki","authorities","local","root.crt"));
  return new Promise((resolve,reject)=>{
    const req=https.request(origen+ruta,{family:4,ca,method:metodo || (cuerpo?"POST":"GET"),
      headers:{...(cookie && {cookie}),...(cuerpo && {"Content-Length":Buffer.byteLength(cuerpo),"Content-Type":form?"application/x-www-form-urlencoded":"application/json","Origin":origenPeticion})}},
      res=>{let texto="";res.setEncoding("utf8");res.on("data",p=>texto+=p);res.on("end",()=>resolve({status:res.statusCode,texto,headers:res.headers}));});
    req.setTimeout(8000,()=>req.destroy(Error("Tiempo agotado"))); req.on("error",reject); req.end(cuerpo);
  });
}
function estado(res, esperado) {assert.equal(res.status,esperado,res.texto.replace(/<[^>]*>/g," ").slice(0,180));return res;}
async function login(nombre) {
  const r=estado(await pedir("/api/login",{json:{correo:nombre+"@example.test",contrasena:llave}}),200);
  assert.match(r.headers["set-cookie"].join(";"),/httponly/i);
  assert.match(r.headers["set-cookie"].join(";"),/secure/i);
  return r.headers["set-cookie"].find(c=>c.startsWith("session_id=")).split(";")[0];
}
try {
  await mantenimiento.connect();
  await mantenimiento.query("CREATE DATABASE "+temporal+" TEMPLATE template0");
  creada = true;
  await db.connect();
  await db.query(fs.readFileSync("../bdkodapp.txt","utf8"));
  await db.query(fs.readFileSync("sql/02_gestion.sql","utf8"));
  await db.query("BEGIN");
  await insertarDatosDemo(db,llave);
  await db.query("COMMIT");
  const caddyfile = path.join(directorio,"Caddyfile");
  const plantilla=fs.readFileSync("Caddyfile","utf8").replace("{\n",`{\n\tstorage file_system {\n\t\troot "${directorio.replaceAll("\\","/")}"\n\t}\n`);
  fs.writeFileSync(caddyfile,plantilla);
  iniciar(process.execPath,["scripts/iniciar.mjs"]);
  iniciar(process.env.CADDY_EXE || (fs.existsSync(".koda-local/caddy.exe") ? path.resolve(".koda-local/caddy.exe") : "caddy"),["run","--config",caddyfile,"--adapter","caddyfile"]);
  let lista=false;
  for(let i=0;i<100;i++) {
    try {if ((await pedir("/api/test-db")).status===200){lista=true;break;}} catch {}
    if(procesos.some(h=>h.exitCode!==null)) break;
    await pausa(200);
  }
  if (!lista) throw Error("La demo no respondió. Registro: "+path.join(directorio,"servicios.log"));
  const org=await login("refugio"), adoptante=await login("adoptante"), admin=await login("admin");
  estado(await pedir("/admin",{cookie:adoptante}),403);
  estado(await pedir("/admin",{cookie:admin}),200);
  for(const ruta of ["/mascotas","/mascotasdisponibles","/match","/perfil","/preferencias","/mis-postulaciones","/usuario","/configuracion"]) {
    estado(await pedir(ruta,{cookie:adoptante}),200);
  }
  for(const ruta of ["/gestion","/gestion/mascotas","/gestion/crear-mascota","/gestion/postulaciones"]) estado(await pedir(ruta,{cookie:org}),200);
  estado(await pedir("/api/registro",{json:{nombre:{},rut:"invalido"}}),400);
  estado(await pedir("/api/verificarcorreo",{json:{codigo:"123"}}),400);
  console.log("OK HTTPS, cookies, roles, paneles y lecturas.");
  const cuentas=(await db.query("SELECT id,correo FROM usuarios")).rows;
  const idOrg=cuentas.find(u=>u.correo==="refugio@example.test").id;
  const idAdoptante=cuentas.find(u=>u.correo==="adoptante@example.test").id;
  const mascotas=(await db.query("SELECT id,nombre FROM mascotas ORDER BY id")).rows;
  const libres=mascotas.filter(m=>["Canela","Rayo"].includes(m.nombre));
  const segunda=await db.query(
    "INSERT INTO usuarios(nombre,rut,correo,tipo_usuario,contrasena,correo_verificado) SELECT 'Segundo refugio QA','99.999.999-9','otro-refugio@example.test','organizacion',contrasena,true FROM usuarios WHERE id=$1 RETURNING id",
    [idOrg]);
  await db.query("UPDATE mascotas SET usuario_id=$1 WHERE id=$2",[segunda.rows[0].id,libres[1].id]);
  const otraOrg=await login("otro-refugio");
  const datos={mascotaId:libres[0].id,telefono:"+56000000000",vivienda:"casa",motivo:"Mi familia puede ofrecer un hogar estable a esta mascota.",confirmacion:"si"};
  estado(await pedir("/api/postulaciones/crear",{cookie:adoptante,json:{...datos,mascotaId:true}}),400);
  estado(await pedir("/api/postulaciones/crear",{cookie:adoptante,json:datos,origenPeticion:"https://example.test"}),403);
  for(const m of libres) estado(await pedir("/api/postulaciones/crear",{cookie:adoptante,json:{...datos,mascotaId:m.id}}),201);
  estado(await pedir("/api/postulaciones/crear",{cookie:adoptante,json:datos}),409);
  const pendientes=(await db.query("SELECT id FROM postulaciones WHERE mascota_id=ANY($1::int[]) AND adoptante_id=$2 ORDER BY id",[libres.map(m=>m.id),idAdoptante])).rows;
  const decidir=(id,decision)=>pedir("/api/postulaciones/resolver",{cookie:id===pendientes[1].id?otraOrg:org,json:{postulacionId:id,decision}});
  const moderar=(accion,id)=>pedir("/admin",{cookie:admin,form:{accion,id,motivo:"Decisión sintética para la prueba integrada."}});
  estado(await moderar("cupo",2),303);
  estado(await pedir("/api/postulaciones/resolver",{cookie:org,json:{postulacionId:pendientes[1].id,decision:"aprobar"}}),404);
  // Un solo cupo disponible para dos organizaciones que deciden al mismo tiempo.
  const resultados=await Promise.all(pendientes.map(p=>decidir(p.id,"aprobar")));
  assert.deepEqual(resultados.map(r=>r.status).sort(),[200,409]);
  const ganadora=pendientes[resultados.findIndex(r=>r.status===200)].id;
  const perdedora=pendientes[resultados.findIndex(r=>r.status===409)].id;
  estado(await decidir(ganadora,"cerrar"),200);
  estado(await decidir(ganadora,"cerrar"),409);
  estado(await pedir("/reportar/"+ganadora,{cookie:adoptante,form:{motivo:"Incidente ficticio para revisar en el panel."}}),303);
  const reporte=(await db.query("SELECT max(id) AS id FROM reportes")).rows[0].id;
  estado(await moderar("revisar",reporte),303);
  estado(await moderar("suspender",idAdoptante),303);
  estado(await decidir(perdedora,"aprobar"),403);
  estado(await pedir("/api/perfil/datos",{cookie:adoptante}),401);
  estado(await moderar("reactivar",idAdoptante),303);
  estado(await decidir(perdedora,"aprobar"),200);
  const mAprobada=libres[resultados.findIndex(r=>r.status===409)];
  estado(await pedir("/api/mascotas/eliminar",{cookie:mAprobada.id===libres[1].id?otraOrg:org,json:{id:mAprobada.id},metodo:"DELETE"}),409);
  assert.ok(!(await pedir("/mascotas")).texto.includes(">"+mAprobada.nombre+"<"));
  console.log("OK validación, duplicado, último cupo concurrente, cierre, veto, reactivación, reporte e historial.");
  const historial=await db.query("SELECT accion FROM historial_gestion WHERE accion IN ('reactivar','suspender')");
  assert.ok(historial.rowCount>=3);
  const literal="Refugio O'Higgins";
  const descripcion=await pedir("/api/perfil/descripcion",{cookie:org,json:{descripcion:literal}});
  estado(descripcion,200);
  assert.equal((await db.query("SELECT descripcion_perfil FROM usuarios WHERE id=$1",[idOrg])).rows[0].descripcion_perfil,literal);
  const importar=archivo=>execFileSync(process.execPath,["scripts/importar.mjs",archivo,String(idOrg)],{env,encoding:"utf8",stdio:["ignore","pipe","pipe"]});
  assert.match(importar("demo/mascotas.jsonl"),/Nuevas: 2/);
  assert.match(importar("demo/mascotas.jsonl"),/Nuevas: 0/);
  const mala=path.join(directorio,"invalida.jsonl");
  fs.writeFileSync(mala,fs.readFileSync("demo/mascotas.jsonl","utf8").replaceAll("seminario-","incompleto-")+"{");
  assert.throws(()=>importar(mala));
  assert.equal((await db.query("SELECT count(*)::int AS n FROM mascotas WHERE referencia_origen LIKE 'incompleto-%'")).rows[0].n,0);
  console.log("OK importación raw, reintento y reversión por línea inválida.");
} catch (error) {
  const registro=path.join(directorio,"servicios.log");
  if(fs.existsSync(registro)) {
    for(const l of fs.readFileSync(registro,"utf8").split("\n").filter(l=>l.includes("Error eliminando")||l.includes("code: '"))) console.error(l.slice(0,220));
  }
  throw error;
} finally {
  for(const h of procesos) {if(h.pid && h.exitCode===null) h.kill();}
  await db.end().catch(()=>{});
  if(creada) await mantenimiento.query("DROP DATABASE "+temporal+" WITH (FORCE)");
  await mantenimiento.end();
}
