import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { B as createAstro } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
//#region src/pages/formularios.astro
var formularios_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Formularios,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Formularios = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Formularios;
	const usuario = await getUsuarioDesdeSesion(Astro.cookies.get("session_id")?.value);
	if (!usuario) return Astro.redirect("/login");
	if (usuario.tipo_usuario === "organizacion") return Astro.redirect("/gestion/postulaciones");
	return Astro.redirect("/mis-postulaciones");
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/formularios.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/formularios.astro";
var $$url = "/formularios";
//#endregion
//#region \0virtual:astro:page:src/pages/formularios@_@astro
var page = () => formularios_exports;
//#endregion
export { page };
