import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, B as createAstro, D as renderSlot, M as renderHead, N as addAttribute, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { t as $$Controlinactividad } from "./controlinactividad_CtCjSyq1.mjs";
//#region src/pages/layout.astro
var layout_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Layout,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const tieneSesion = Boolean(Astro.cookies.get("session_id")?.value);
	const paginaPublicaAuth = Astro.url.pathname === "/login" || Astro.url.pathname === "/registro";
	const usarControl = tieneSesion && !paginaPublicaAuth;
	const { title = "Kodapp", description = "Plataforma de adopción responsable de mascotas." } = Astro.props;
	return renderTemplate`<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><!-- Color principal del nuevo diseño --><meta name="theme-color" content="#1E2229"><meta name="description"${addAttribute(description, "content")}><title>${title}</title><link rel="icon" href="/logo.png" type="image/png"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700;800&display=swap">${renderHead($$result)}</head><body><!-- Control de inactividad para usuarios conectados -->${usarControl && renderTemplate`${renderComponent($$result, "ControlInactividad", $$Controlinactividad, {})}`}${renderSlot($$result, $$slots["default"])}</body></html>`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/layout.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/layout.astro";
var $$url = "/layout";
//#endregion
//#region \0virtual:astro:page:src/pages/layout@_@astro
var page = () => layout_exports;
//#endregion
export { page };
