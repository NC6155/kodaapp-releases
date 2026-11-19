import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, j as maybeRenderHead, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_BGUEBUzq.mjs";
import { t as $$MascotasAuth } from "./login_DbuF3QpH.mjs";
//#region src/pages/registro.astro
var registro_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Registro,
	file: () => $$file,
	url: () => $$url
});
var $$Registro = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Crear cuenta | KodApp",
		"description": "Regístrate en KodApp con verificación de correo."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main class="ka-auth"><div class="ka-auth__layout"><div class="ka-auth__visual">${renderComponent($$result, "MascotasAuth", $$MascotasAuth, {})}</div><section class="ka-auth__card"><a href="/" class="ka-auth__brand"><i class="fa-solid fa-paw"></i>KodApp</a><h1>¡Únete a nuestra familia!</h1><p class="ka-auth__description">Crea tu cuenta y comienza una nueva historia. Primero verificaremos tu correo electrónico.</p><form id="registro-form" class="ka-form"><!-- NOMBRE --><div class="ka-field"><input id="name" name="nombre" type="text" placeholder=" " maxlength="100" autocomplete="name" required><label for="name">Nombre completo</label></div><!-- RUT --><div class="ka-field"><input id="rut" name="rut" type="text" placeholder=" " maxlength="12" autocomplete="off" aria-describedby="rut-ayuda" required><label for="rut">RUT</label><small id="rut-ayuda" class="ka-field__hint" aria-live="polite">Ejemplo: 12.345.678-5</small></div><!-- CORREO --><div class="ka-field"><input id="email" name="correo" type="email" placeholder=" " maxlength="150" autocomplete="email" required><label for="email">Correo electrónico</label></div><!-- VERIFICACIÓN --><div class="ka-verification"><div class="ka-verification__title"><i class="fa-solid fa-shield-halved"></i><strong>Verificación de correo</strong></div><p>Enviaremos un código de seguridad de 6 dígitos a tu correo.</p><button type="button" id="send-code" class="ka-verify-button"><i class="fa-solid fa-envelope"></i>Enviar código</button><div class="ka-field ka-verification__input"><input id="verification-code" name="codigo" type="text" placeholder=" " inputmode="numeric" autocomplete="one-time-code" maxlength="6" disabled><label for="verification-code">Código de seguridad</label></div><button type="button" id="verify-code" class="ka-verify-button ka-verify-button--confirm" disabled><i class="fa-solid fa-check-circle"></i>Verificar código</button><p id="verification-message" class="ka-verification__message" role="status" aria-live="polite">Tu correo todavía no está verificado.</p></div><!-- TIPO DE CUENTA --><div class="ka-field ka-field--select"><label for="role">Tipo de cuenta</label><select id="role" name="tipoUsuario" required><option value="">Selecciona una opción</option><option value="adoptante">Adoptante</option><option value="organizacion">Organización</option></select></div><!-- CONTRASEÑA --><div class="ka-field"><input id="password" name="contrasena" type="password" placeholder=" " minlength="8" maxlength="72" autocomplete="new-password" required><label for="password">Contraseña</label><button type="button" class="ka-password-toggle" data-ka-toggle aria-label="Mostrar contraseña" aria-pressed="false"><i class="fa-solid fa-eye"></i></button></div><!-- CREAR CUENTA --><button type="submit" class="ka-submit" id="register-submit" disabled><span></span><span></span><span></span><span></span>Crear cuenta<i class="fa-solid fa-heart"></i></button><p id="registro-message" class="ka-form__message" role="status" aria-live="polite"></p></form><p class="ka-auth__footer">¿Ya tienes una cuenta?<a href="/login">Inicia sesión</a></p><a href="/" class="ka-auth__back"><i class="fa-solid fa-arrow-left"></i>Volver al inicio</a></section></div></main>` })}${renderScript($$result, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/registro.astro?astro&type=script&index=0&lang.ts")}`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/registro.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/registro.astro";
var $$url = "/registro";
//#endregion
//#region \0virtual:astro:page:src/pages/registro@_@astro
var page = () => registro_exports;
//#endregion
export { page };
