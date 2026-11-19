import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { B as createAstro } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
//#region src/pages/rescatista.astro
var rescatista_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Rescatista,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Rescatista = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Rescatista;
	const sessionId = Astro.cookies.get("session_id")?.value;
	const usuario = await getUsuarioDesdeSesion(sessionId);
	if (!usuario) return Astro.redirect("/login");
	if (usuario.tipo_usuario === "organizacion") return Astro.redirect("/gestion");
	return Astro.redirect("/usuario");
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/rescatista.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/rescatista.astro";
var $$url = "/rescatista";
//#endregion
//#region \0virtual:astro:page:src/pages/rescatista@_@astro
var page = () => rescatista_exports;
//#endregion
export { page };
