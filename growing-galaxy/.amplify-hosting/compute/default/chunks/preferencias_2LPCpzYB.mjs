import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, B as createAstro, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_BGUEBUzq.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
import { n as PERSONALIDADES } from "./CatalogoMatch_BKZaFKAX.mjs";
import { t as $$Header } from "./Header_CDLQqucv.mjs";
/* empty css                            */
//#region src/pages/preferencias.astro
var preferencias_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Preferencias,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Preferencias = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Preferencias;
	const usuario = await getUsuarioDesdeSesion(Astro.cookies.get("session_id")?.value);
	if (!usuario) return Astro.redirect("/login");
	if (usuario.tipo_usuario !== "adoptante") return Astro.redirect("/gestion");
	const preferencias = (await db.query(`SELECT
     tipo_preferido,
     personalidad_preferida,
     nivel_cuidados
   FROM preferencias_match
   WHERE usuario_id = $1`, [usuario.id])).rows[0] ?? null;
	const bienvenida = Astro.url.searchParams.get("bienvenida") === "1";
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Mis preferencias | KodApp",
		"description": "Configura tus preferencias para el futuro Match."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="form-page"><div class="form-page-container"><!-- ENCABEZADO --><div class="page-header"><a href="/usuario" class="back-link"><i class="fa-solid fa-arrow-left"></i>Volver a mi cuenta</a><span class="section-kicker">Compatibilidad KodApp</span><h1>${bienvenida ? "¡Bienvenido/a a KodApp!" : "Mis preferencias"}</h1><p class="ka-preferences-intro">Queremos conocer tus preferencias para preparar el futuro sistema de Match.</p></div><div class="ka-preferences-notice"><i class="fa-solid fa-circle-info"></i>Este formulario es opcional y podrás modificar tus respuestas cuando quieras. Todavía no calcula compatibilidades.</div><!-- FORMULARIO --><form id="preferencias-form" class="publication-form"><!-- TIPO DE MASCOTA --><section class="form-section"><div class="form-section-header"><span class="form-step">01</span><div><h2>Tipo de mascota</h2><p>¿Qué tipo de animal te gustaría adoptar?</p></div></div><div class="form-field"><label for="tipoPreferido">Mascota preferida</label><select id="tipoPreferido" name="tipoPreferido" required><option value="">Selecciona una opción</option><option value="perro"${addAttribute(preferencias?.tipo_preferido === "perro", "selected")}>Perro</option><option value="gato"${addAttribute(preferencias?.tipo_preferido === "gato", "selected")}>Gato</option><option value="otro"${addAttribute(preferencias?.tipo_preferido === "otro", "selected")}>Otra mascota</option><option value="indiferente"${addAttribute(preferencias?.tipo_preferido === "indiferente", "selected")}>No tengo preferencia</option></select></div></section><!-- PERSONALIDAD --><section class="form-section"><div class="form-section-header"><span class="form-step">02</span><div><h2>Personalidad ideal</h2><p>¿Qué personalidad encajaría mejor contigo?</p></div></div><div class="form-field"><label for="personalidadPreferida">Personalidad que buscas</label><select id="personalidadPreferida" name="personalidadPreferida" required><option value="">Selecciona una opción</option>${PERSONALIDADES.map((opcion) => renderTemplate`<option${addAttribute(opcion.valor, "value")}${addAttribute(preferencias?.personalidad_preferida === opcion.valor, "selected")}>${opcion.etiqueta}</option>`)}<option value="indiferente"${addAttribute(preferencias?.personalidad_preferida === "indiferente", "selected")}>No tengo preferencia</option></select><small class="ka-preferences-description">Esta respuesta se comparará en el futuro con la personalidad de las mascotas.</small></div></section><!-- CUIDADOS --><section class="form-section"><div class="form-section-header"><span class="form-step">03</span><div><h2>Cuidados y necesidades</h2><p>¿Qué nivel de cuidados podrías asumir de manera responsable?</p></div></div><div class="form-field"><label for="nivelCuidados">Disponibilidad para cuidados</label><select id="nivelCuidados" name="nivelCuidados" required><option value="">Selecciona una opción</option><option value="basicos"${addAttribute(preferencias?.nivel_cuidados === "basicos", "selected")}>Prefiero cuidados básicos</option><option value="tratamientos"${addAttribute(preferencias?.nivel_cuidados === "tratamientos", "selected")}>Puedo asumir tratamientos médicos</option><option value="especiales"${addAttribute(preferencias?.nivel_cuidados === "especiales", "selected")}>Puedo asumir cuidados especiales</option><option value="indiferente"${addAttribute(preferencias?.nivel_cuidados === "indiferente", "selected")}>Estoy abierto/a a distintas necesidades</option></select><small class="ka-preferences-description">Considera tu tiempo, recursos y posibilidades reales de cuidado.</small></div></section><!-- MENSAJES --><p id="preferencias-mensaje" class="form-message" role="status" aria-live="polite"></p><!-- BOTONES --><div class="form-actions"><a href="/usuario" class="btn-outline">${preferencias ? "Volver a mi cuenta" : "Completar después"}</a><button type="submit" id="guardar-preferencias" class="btn-primary"><i class="fa-solid fa-floppy-disk"></i>Guardar preferencias</button></div></form></div></main>` })}${renderScript($$result, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/preferencias.astro?astro&type=script&index=0&lang.ts")}`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/preferencias.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/preferencias.astro";
var $$url = "/preferencias";
//#endregion
//#region \0virtual:astro:page:src/pages/preferencias@_@astro
var page = () => preferencias_exports;
//#endregion
export { page };
