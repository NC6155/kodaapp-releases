import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, B as createAstro, N as addAttribute, T as Fragment, j as maybeRenderHead, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_BGUEBUzq.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { t as agregarFotosMascotas } from "./fotos_DIX-svjU.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
import { t as $$Header } from "./Header_CDLQqucv.mjs";
import { t as $$ClasificacionMascota } from "./ClasificacionMascota_D2GfEI7k.mjs";
//#region src/pages/gestion/mascotas/[id]/editar.astro
var editar_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Editar,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Editar = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Editar;
	const usuario = await getUsuarioDesdeSesion(Astro.cookies.get("session_id")?.value);
	if (!usuario) return Astro.redirect("/login");
	if (usuario.tipo_usuario !== "organizacion") return Astro.redirect("/usuario");
	const id = Number(Astro.params.id);
	if (!Number.isSafeInteger(id) || id <= 0) return Astro.redirect("/gestion/mascotas");
	const resultado = await db.query(`SELECT
     id,
     nombre,
     descripcion,
     personalidad,
     personalidad_codigo,
     historial_medico,
     salud_codigo,
     tipo_mascota,
     estado_adopcion
   FROM mascotas
   WHERE id = $1
     AND usuario_id = $2`, [id, usuario.id]);
	if (resultado.rows.length === 0) return Astro.redirect("/gestion/mascotas");
	const mascota = (await agregarFotosMascotas(resultado.rows))[0];
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `Editar ${mascota.nombre} | KodApp`,
		"description": "Editar una publicación de mascota."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="form-page"><div class="form-page-container"><!-- ENCABEZADO --><div class="page-header"><a href="/gestion/mascotas" class="back-link"><i class="fa-solid fa-arrow-left"></i>Volver a mis mascotas</a><span class="section-kicker">Administración de publicaciones</span><h1>Editar publicación</h1><p>Modifica los datos de ${mascota.nombre}y guarda los cambios.</p></div><form id="editar-mascota-form" class="publication-form"><input type="hidden" name="id"${addAttribute(mascota.id, "value")}><!-- FOTO --><section class="form-section"><div class="form-section-header"><span class="form-step">01</span><div><h2>Fotografía</h2><p>Puedes mantenerla o reemplazarla.</p></div></div><div class="upload-area"><label for="foto" class="upload-label"><div id="preview-container" class="photo-preview">${mascota.foto ? renderTemplate`<img${addAttribute(mascota.foto, "src")}${addAttribute(`Foto de ${mascota.nombre}`, "alt")}>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<i class="fa-solid fa-camera"></i><span>Seleccionar fotografía</span>` })}`}</div></label><input id="foto" name="foto" type="file" accept="image/jpeg,image/png,image/webp" hidden><small>Si no seleccionas otra imagen, se conserva la actual. Máximo 5 MB.</small></div></section><!-- INFORMACIÓN BÁSICA --><section class="form-section"><div class="form-section-header"><span class="form-step">02</span><div><h2>Datos de la mascota</h2><p>Actualiza su información básica.</p></div></div><div class="form-grid"><div class="form-field"><label for="nombre">Nombre</label><input id="nombre" name="nombre" type="text" maxlength="100" required${addAttribute(mascota.nombre, "value")}></div><div class="form-field"><label for="tipoMascota">Tipo de mascota</label><select id="tipoMascota" name="tipoMascota" required><option value="perro"${addAttribute(mascota.tipo_mascota === "perro", "selected")}>Perro</option><option value="gato"${addAttribute(mascota.tipo_mascota === "gato", "selected")}>Gato</option><option value="otro"${addAttribute(mascota.tipo_mascota === "otro", "selected")}>Otro</option></select></div><div class="form-field form-field-full"><label for="descripcion">Descripción</label><textarea id="descripcion" name="descripcion" rows="5" maxlength="5000">${mascota.descripcion ?? ""}</textarea></div></div></section><!-- DESPLEGABLES -->${renderComponent($$result, "ClasificacionMascota", $$ClasificacionMascota, {
		"personalidad": mascota.personalidad,
		"personalidadCodigo": mascota.personalidad_codigo,
		"historialMedico": mascota.historial_medico,
		"saludCodigo": mascota.salud_codigo
	})}<!-- ESTADO DE ADOPCIÓN --><section class="form-section"><div class="form-section-header"><span class="form-step">05</span><div><h2>Estado de adopción</h2><p>Indica si la mascota continúa disponible para postulaciones.</p></div></div><div class="form-field"><label for="estadoAdopcion">Estado</label><select id="estadoAdopcion" name="estadoAdopcion" required><option value="disponible"${addAttribute(mascota.estado_adopcion === "disponible", "selected")}>Disponible</option><option value="reservada"${addAttribute(mascota.estado_adopcion === "reservada", "selected")}>Reservada</option><option value="adoptada"${addAttribute(mascota.estado_adopcion === "adoptada", "selected")}>Adoptada</option></select></div></section><!-- MENSAJE --><p id="editar-mensaje" class="form-message" role="status" aria-live="polite"></p><!-- BOTONES --><div class="form-actions"><button id="eliminar-publicacion" type="button" class="btn-eliminar-publicacion"><i class="fa-solid fa-trash"></i>Eliminar publicación</button><a href="/gestion/mascotas" class="btn-outline">Cancelar</a><button id="guardar-cambios" type="submit" class="btn-primary"><i class="fa-solid fa-floppy-disk"></i>Guardar cambios</button></div></form></div></main>` })}${renderScript($$result, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/gestion/mascotas/[id]/editar.astro?astro&type=script&index=0&lang.ts")}`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/gestion/mascotas/[id]/editar.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/gestion/mascotas/[id]/editar.astro";
var $$url = "/gestion/mascotas/[id]/editar";
//#endregion
//#region \0virtual:astro:page:src/pages/gestion/mascotas/[id]/editar@_@astro
var page = () => editar_exports;
//#endregion
export { page };
