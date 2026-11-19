import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, B as createAstro, j as maybeRenderHead, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_BGUEBUzq.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
import { t as $$Header } from "./Header_CDLQqucv.mjs";
import { t as $$ClasificacionMascota } from "./ClasificacionMascota_D2GfEI7k.mjs";
//#region src/pages/gestion/crear-mascota.astro
var crear_mascota_exports = /* @__PURE__ */ __exportAll({
	default: () => $$CrearMascota,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$CrearMascota = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CrearMascota;
	const sessionId = Astro.cookies.get("session_id")?.value;
	const usuario = await getUsuarioDesdeSesion(sessionId);
	if (!usuario) return Astro.redirect("/login");
	if (usuario.tipo_usuario !== "organizacion") return Astro.redirect("/usuario");
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Publicar mascota | KodApp",
		"description": "Publica una mascota para adopción."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="form-page"><div class="form-page-container"><!-- ENCABEZADO --><div class="page-header"><a href="/gestion" class="back-link"><i class="fa-solid fa-arrow-left"></i>Volver al panel</a><span class="section-kicker">Nueva publicación</span><h1>Publicar una mascota</h1><p>Completa la información para que los adoptantes puedan conocerla mejor.</p></div><!-- FORMULARIO --><form id="mascota-form" class="publication-form"><!-- FOTO --><section class="form-section"><div class="form-section-header"><span class="form-step">01</span><div><h2>Imagen de la mascota</h2><p>Una buena foto ayuda a conocerla mejor.</p></div></div><div class="upload-area"><label for="foto" class="upload-label"><div id="preview-container" class="photo-preview"><i class="fa-solid fa-camera"></i><span>Seleccionar imagen</span></div></label><input type="file" id="foto" name="foto" accept="image/jpeg,image/png,image/webp" hidden><small>JPG, PNG o WebP. Máximo 5 MB.</small></div></section><!-- INFORMACIÓN BÁSICA --><section class="form-section"><div class="form-section-header"><span class="form-step">02</span><div><h2>Información básica</h2><p>Cuéntanos quién es esta mascota.</p></div></div><div class="form-grid"><div class="form-field"><label for="nombre">Nombre de la mascota</label><input id="nombre" name="nombre" type="text" maxlength="100" placeholder="Ej: Firulais" required></div><div class="form-field"><label for="tipo-mascota">Tipo de mascota</label><select id="tipo-mascota" name="tipoMascota" required><option value="">Selecciona una opción</option><option value="perro">Perro</option><option value="gato">Gato</option><option value="otro">Otro</option></select></div><div class="form-field form-field-full"><label for="descripcion">Descripción</label><textarea id="descripcion" name="descripcion" rows="5" maxlength="5000" placeholder="Cuéntanos sobre la mascota..."></textarea></div></div></section><!-- DESPLEGABLES --><!-- El componente incluye las secciones
             03 Personalidad y 04 Salud. -->${renderComponent($$result, "ClasificacionMascota", $$ClasificacionMascota, {})}<!-- MENSAJES --><p id="form-message" class="form-message" role="status" aria-live="polite"></p><!-- ACCIONES --><div class="form-actions"><a href="/gestion" class="btn-outline">Cancelar</a><button type="submit" id="publish-button" class="btn-primary">Publicar mascota<i class="fa-solid fa-paw"></i></button></div></form></div></main>` })}${renderScript($$result, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/gestion/crear-mascota.astro?astro&type=script&index=0&lang.ts")}`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/gestion/crear-mascota.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/gestion/crear-mascota.astro";
var $$url = "/gestion/crear-mascota";
//#endregion
//#region \0virtual:astro:page:src/pages/gestion/crear-mascota@_@astro
var page = () => crear_mascota_exports;
//#endregion
export { page };
