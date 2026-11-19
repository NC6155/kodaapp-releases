import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, B as createAstro, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_BGUEBUzq.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
import { t as $$Header } from "./Header_CDLQqucv.mjs";
import { t as $$MascotasDisponibles } from "./MascotasDisponibles_Qu_8uWv8.mjs";
//#region src/pages/usuario.astro
var usuario_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Usuario,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Usuario = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Usuario;
	const sessionId = Astro.cookies.get("session_id")?.value;
	const usuario = await getUsuarioDesdeSesion(sessionId);
	if (!usuario) return Astro.redirect("/login");
	if (usuario.tipo_usuario !== "adoptante") return Astro.redirect("/gestion");
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Mi cuenta | KodApp",
		"description": "Panel del adoptante de KodApp."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="dashboard-page"><div class="dashboard-container"><!-- BIENVENIDA --><section class="dashboard-welcome"><div class="dashboard-welcome-content"><span class="section-kicker">Mi espacio</span><h1>Hola, ${usuario.nombre}.</h1><p>Descubre mascotas, encuentra compatibilidades y administra tus procesos de adopción.</p></div><!-- FOTO DE PERFIL --><div class="dashboard-profile"><div class="dashboard-avatar" id="profile-photo">${usuario.foto_perfil ? renderTemplate`<img${addAttribute(usuario.foto_perfil, "src")} alt="Foto de perfil">` : renderTemplate`<i class="fa-solid fa-user"></i>`}</div><label for="photo-input" class="photo-change-button"><i class="fa-solid fa-camera"></i>Cambiar foto</label><input id="photo-input" type="file" accept="image/png,image/jpeg,image/webp" hidden></div></section><!-- ACCIONES --><section class="dashboard-actions"><!-- =========================================
     MIS PREFERENCIAS DE MATCH
     ========================================= --><a href="/preferencias" class="dashboard-action-card"><div class="dashboard-action-icon"><i class="fa-solid fa-sliders"></i></div><div><span>Personalización</span><h2>Mis preferencias</h2><p>Configura qué tipo de mascota buscas y prepara tu perfil de compatibilidad.</p></div><i class="fa-solid fa-arrow-right"></i></a><a href="/match" class="dashboard-action-card dashboard-action-primary"><div class="dashboard-action-icon"><i class="fa-solid fa-heart-circle-bolt"></i></div><div><span>Encuentra tu match</span><h2>Compatibilidad</h2><p>Descubre qué mascotas pueden encajar mejor contigo.</p></div><i class="fa-solid fa-arrow-right"></i></a><a href="/perfil" class="dashboard-action-card"><div class="dashboard-action-icon"><i class="fa-solid fa-user"></i></div><div><span>Tu información</span><h2>Mi perfil</h2><p>Revisa y administra tus datos personales.</p></div><i class="fa-solid fa-arrow-right"></i></a><a href="/formularios" class="dashboard-action-card"><div class="dashboard-action-icon"><i class="fa-solid fa-clipboard-check"></i></div><div><span>Tu proceso</span><h2>Formularios respondidos</h2><p>Revisa los formularios que has completado.</p></div><i class="fa-solid fa-arrow-right"></i></a></section><!-- LISTADO DE MASCOTAS -->${renderComponent($$result, "MascotasDisponibles", $$MascotasDisponibles, {})}</div></main>` })}${renderScript($$result, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/usuario.astro?astro&type=script&index=0&lang.ts")}`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/usuario.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/usuario.astro";
var $$url = "/usuario";
//#endregion
//#region \0virtual:astro:page:src/pages/usuario@_@astro
var page = () => usuario_exports;
//#endregion
export { page };
