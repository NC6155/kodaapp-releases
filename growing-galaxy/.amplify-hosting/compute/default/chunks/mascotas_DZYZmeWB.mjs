import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, j as maybeRenderHead, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { t as $$Layout } from "./Layout_BGUEBUzq.mjs";
import { t as $$Header } from "./Header_CDLQqucv.mjs";
import { t as $$MascotasDisponibles } from "./MascotasDisponibles_Qu_8uWv8.mjs";
//#region src/pages/mascotas.astro
var mascotas_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Mascotas,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Mascotas = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Mascotas disponibles | KodApp",
		"description": "Explora las mascotas disponibles y envía tu postulación para adoptar."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="management-page"><div class="management-container"><!-- NAVEGACIÓN --><div class="page-header"><a href="/" class="back-link"><i class="fa-solid fa-arrow-left"></i>Volver al inicio</a><span class="section-kicker">Encuentra a tu compañero</span><h1>Explora nuestras mascotas</h1><p>Conoce a los animales que buscan una familia y encuentra a tu próximo compañero.</p></div><!-- CATÁLOGO DE MASCOTAS -->${renderComponent($$result, "MascotasDisponibles", $$MascotasDisponibles, {})}</div></main>` })}`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/mascotas.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/mascotas.astro";
var $$url = "/mascotas";
//#endregion
//#region \0virtual:astro:page:src/pages/mascotas@_@astro
var page = () => mascotas_exports;
//#endregion
export { page };
