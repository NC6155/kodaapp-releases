import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, B as createAstro, j as maybeRenderHead, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { t as $$Layout } from "./Layout_BGUEBUzq.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
import { t as $$Header } from "./Header_CDLQqucv.mjs";
//#region src/pages/gestion.astro
var gestion_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Gestion,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Gestion = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Gestion;
	const sessionId = Astro.cookies.get("session_id")?.value;
	const usuario = await getUsuarioDesdeSesion(sessionId);
	if (!usuario) return Astro.redirect("/login");
	if (usuario.tipo_usuario !== "organizacion") return Astro.redirect("/usuario");
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Panel de gestión | Kodapp",
		"description": "Panel de gestión de organizaciones."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="dashboard-page"><div class="dashboard-container"><!-- ========================================= --><!-- CABECERA --><!-- ========================================= --><section class="dashboard-welcome management-welcome"><div class="dashboard-welcome-content"><span class="section-kicker">Panel de gestión</span><h1>Hola, ${usuario.nombre}.</h1><p>Administra tus mascotas y organiza el proceso de adopción.</p></div><div class="management-role"><i class="fa-solid fa-shield-heart"></i><div><span>Tipo de cuenta</span><strong>Organización</strong></div></div></section><!-- ========================================= --><!-- ACCIONES --><!-- ========================================= --><section class="management-grid"><a href="/gestion/crear-mascota" class="management-card management-card-primary"><div class="management-card-icon"><i class="fa-solid fa-plus"></i></div><div><span>Adopción</span><h2>Publicar mascota</h2><p>Registra una mascota y ponla disponible para encontrar un hogar.</p></div><i class="fa-solid fa-arrow-right"></i></a><a href="/gestion/mascotas" class="management-card"><div class="management-card-icon"><i class="fa-solid fa-paw"></i></div><div><span>Administración</span><h2>Mis mascotas</h2><p>Revisa las mascotas que has publicado y su estado actual.</p></div><i class="fa-solid fa-arrow-right"></i></a><a href="/perfil" class="management-card"><div class="management-card-icon"><i class="fa-solid fa-user"></i></div><div><span>Cuenta</span><h2>Mi perfil</h2><p>Administra la información de tu cuenta.</p></div><i class="fa-solid fa-arrow-right"></i></a><a href="/formularios" class="management-card"><div class="management-card-icon"><i class="fa-solid fa-clipboard-list"></i></div><div><span>Postulaciones</span><h2>Formularios respondidos</h2><p>Revisa los formularios completados por los adoptantes.</p></div><i class="fa-solid fa-arrow-right"></i></a></section><!-- ========================================= --><!-- AVISO --><!-- ========================================= --><section class="dashboard-note"><div class="dashboard-note-icon"><i class="fa-solid fa-heart"></i></div><div><h3>Una buena publicación hace la diferencia.</h3><p>Agrega información clara y completa para que los adoptantes puedan conocer mejor a cada mascota.</p></div></section></div></main>` })}`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/gestion.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/gestion.astro";
var $$url = "/gestion";
//#endregion
//#region \0virtual:astro:page:src/pages/gestion@_@astro
var page = () => gestion_exports;
//#endregion
export { page };
