import { A as renderTemplate, B as createAstro, D as renderSlot, M as renderHead, N as addAttribute, P as createRenderInstruction, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { t as $$Controlinactividad } from "./controlinactividad_CtCjSyq1.mjs";
//#region node_modules/astro/dist/runtime/server/render/script.js
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region src/layouts/Layout.astro
createAstro("https://astro.build");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const { title = "KodApp", description = "Plataforma de adopción responsable de mascotas." } = Astro.props;
	const tieneSesion = Boolean(Astro.cookies.get("session_id")?.value);
	const esPaginaAuth = ["/login", "/registro"].includes(Astro.url.pathname);
	const usarControl = tieneSesion && !esPaginaAuth;
	return renderTemplate`<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#1E2229"><meta name="description"${addAttribute(description, "content")}><title>${title}</title><link rel="icon" href="/logo.png" type="image/png"><!-- Iconos utilizados en KodApp --><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"><!-- Tipografías del diseño original --><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700;800&display=swap">${renderHead($$result)}</head><body><!-- Contenido de cada página -->${renderSlot($$result, $$slots["default"])}<!-- Detector global de inactividad -->${usarControl && renderTemplate`${renderComponent($$result, "ControlInactividad", $$Controlinactividad, {})}`}</body></html>`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/layouts/Layout.astro", void 0);
//#endregion
export { renderScript as n, $$Layout as t };
