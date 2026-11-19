import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, j as maybeRenderHead, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_BGUEBUzq.mjs";
import { t as $$MascotasAuth } from "./login_DbuF3QpH.mjs";
//#region src/pages/login.astro
var login_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Login,
	file: () => $$file,
	url: () => $$url
});
var $$Login = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Iniciar sesión | KodApp",
		"description": "Inicia sesión en KodApp."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main class="ka-auth"><div class="ka-auth__layout"><div class="ka-auth__visual">${renderComponent($$result, "MascotasAuth", $$MascotasAuth, {})}</div><section class="ka-auth__card"><a href="/" class="ka-auth__brand"><i class="fa-solid fa-paw"></i>KodApp</a><h1>¡Bienvenido de vuelta!</h1><p class="ka-auth__description">Inicia sesión para conocer a tu próximo compañero.</p><form id="login-form" class="ka-form"><div class="ka-field"><input id="email" name="correo" type="email" placeholder=" " autocomplete="email" required><label for="email">Correo electrónico</label></div><div class="ka-field"><input id="password" name="contrasena" type="password" placeholder=" " autocomplete="current-password" required><label for="password">Contraseña</label><button type="button" class="ka-password-toggle" data-ka-toggle aria-label="Mostrar contraseña" aria-pressed="false"><i class="fa-solid fa-eye"></i></button></div><button type="submit" class="ka-submit" id="login-submit"><span></span><span></span><span></span><span></span>Iniciar sesión<i class="fa-solid fa-arrow-right"></i></button><p id="login-message" class="ka-form__message" role="status" aria-live="polite"></p></form><p class="ka-auth__footer">¿Todavía no tienes una cuenta?<a href="/registro">Regístrate aquí</a></p><a href="/" class="ka-auth__back"><i class="fa-solid fa-arrow-left"></i>Volver al inicio</a></section></div></main>` })}${renderScript($$result, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/login.astro?astro&type=script&index=0&lang.ts")}`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/login.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/login.astro";
var $$url = "/login";
//#endregion
//#region \0virtual:astro:page:src/pages/login@_@astro
var page = () => login_exports;
//#endregion
export { page };
