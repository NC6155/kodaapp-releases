import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, j as maybeRenderHead, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { t as $$Layout } from "./Layout_BGUEBUzq.mjs";
import { t as $$Header } from "./Header_CDLQqucv.mjs";
/* empty css                */
//#region src/pages/compatibilidad-organizacion.astro
var compatibilidad_organizacion_exports = /* @__PURE__ */ __exportAll({
	default: () => $$CompatibilidadOrganizacion,
	file: () => $$file,
	url: () => $$url
});
var $$CompatibilidadOrganizacion = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Compatibilidad para adoptantes | KodApp" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="ka-match-page"><div class="ka-match-container"><section class="ka-match-empty"><i class="fa-solid fa-heart" aria-hidden="true"></i><h1>La compatibilidad es para adoptantes</h1><p>Las cuentas de organización no pueden realizar el match. Esta función compara las preferencias de cada adoptante con las mascotas disponibles.</p><a class="ka-match-action" href="/gestion">Volver a mi gestión</a></section></div></main>` })}`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/compatibilidad-organizacion.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/compatibilidad-organizacion.astro";
var $$url = "/compatibilidad-organizacion";
//#endregion
//#region \0virtual:astro:page:src/pages/compatibilidad-organizacion@_@astro
var page = () => compatibilidad_organizacion_exports;
//#endregion
export { page };
