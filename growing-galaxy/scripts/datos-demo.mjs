import bcrypt from "bcrypt";
import {formatearRut, calcularDigitoVerificador} from "../src/lib/rut.ts";

export async function insertarDatosDemo(cliente, clave) {
  const hash = await bcrypt.hash(clave,12);
  const cuentas = [];
  for (const [i, nombre] of ["Administración Demo","Refugio Demo","Adoptante Demo","Cuenta Suspendida Demo"].entries()) {
    const cuerpo = String(90000000+i);
    const rut = formatearRut(cuerpo+calcularDigitoVerificador(cuerpo));
    const correo = ["admin","refugio","adoptante","suspendido"][i]+"@example.test";
    const r = await cliente.query(`INSERT INTO usuarios(nombre,rut,correo,tipo_usuario,contrasena,estado_cuenta,correo_verificado)
      VALUES ($1,$2,$3,$4,$5,$6,true) RETURNING id`,
      [nombre,rut,correo,i===1?"organizacion":"adoptante",hash,i===3?"suspendido":"activo"]);
    cuentas.push(r.rows[0].id);
  }
  const [admin,org,adoptante,suspendido] = cuentas;
  await cliente.query("INSERT INTO administradores VALUES($1)",[admin]);
  for (const [i,nombre] of ["Luna","Olmo","Kiwi","Canela","Rayo"].entries()) {
    const m = await cliente.query(`INSERT INTO mascotas(usuario_id,nombre,tipo_mascota,personalidad_codigo,salud_codigo,estado_adopcion)
      VALUES($1,$2,$3,'sociable','sin_antecedentes',$4) RETURNING id`,[org,nombre,i%2?"gato":"perro",i===0?"adoptada":"disponible"]);
    if (i>2) continue;
    const estado = ["aprobada","pendiente","rechazada"][i];
    const p = await cliente.query(`INSERT INTO postulaciones(mascota_id,adoptante_id,telefono,vivienda,motivo,estado,creada_en,resuelta_en)
      VALUES($1,$2,'+56000000000','casa','Solicitud ficticia para la presentación del seminario.',$3::varchar,now()-interval '2 days',
      CASE WHEN $3='pendiente' THEN NULL ELSE now()-interval '1 day' END) RETURNING id`,[m.rows[0].id,i===2?suspendido:adoptante,estado]);
    if (i===2) await cliente.query("INSERT INTO reportes(autor_id,cuenta_id,motivo,postulacion_id) VALUES($1,$2,'Incidente ficticio para revisión del panel.',$3)",[org,suspendido,p.rows[0].id]);
  }
  await cliente.query("INSERT INTO preferencias_match(usuario_id,tipo_preferido,personalidad_preferida,nivel_cuidados) VALUES($1,'indiferente','sociable','basicos')",[adoptante]);
  await cliente.query("INSERT INTO historial_gestion(actor_id,cuenta_id,accion,motivo) VALUES($1,$2,'suspender','Caso sintético preparado para el seminario.')",[admin,suspendido]);
}
