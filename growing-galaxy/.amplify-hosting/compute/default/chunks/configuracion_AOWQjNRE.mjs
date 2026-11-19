import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, j as maybeRenderHead, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_BGUEBUzq.mjs";
import { t as $$Header } from "./Header_CDLQqucv.mjs";
//#region src/pages/configuracion.astro
var configuracion_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Configuracion,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Configuracion = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Configuración de cuenta | KodApp",
		"description": "Administra los datos y seguridad de tu cuenta."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="configuracion-page"><div class="configuracion-container"><!-- ENCABEZADO --><div class="page-header"><a href="/perfil" class="back-link"><i class="fa-solid fa-arrow-left"></i>Volver a mi perfil</a><span class="section-kicker">MI CUENTA</span><h1>Configuración de cuenta</h1><p>Administra tus datos personales y la seguridad de tu cuenta en KodApp.</p></div><!-- MENSAJES --><p id="mensaje-configuracion" class="config-mensaje" role="status" aria-live="polite"></p><!-- DATOS ACTUALES --><section class="config-card"><h2><i class="fa-solid fa-circle-user"></i>Datos de mi cuenta</h2><p>Correo actual:<strong id="correo-actual">Cargando...</strong></p><p>Tipo de cuenta:<strong id="tipo-actual">Cargando...</strong></p></section><!-- =====================================
           CAMBIAR NOMBRE
           ===================================== --><section class="config-card"><h2><i class="fa-solid fa-signature"></i>Cambiar nombre</h2><form id="form-nombre"><label for="nombre">Nombre completo</label><input id="nombre" name="nombre" type="text" minlength="2" maxlength="100" autocomplete="name" required><button type="submit" class="btn-primary">Guardar nombre</button></form></section><!-- =====================================
           CAMBIAR CORREO
           ===================================== --><section class="config-card"><h2><i class="fa-solid fa-envelope"></i>Cambiar correo electrónico</h2><p>Enviaremos un código de verificación al correo nuevo. Tu dirección actual se conservará hasta confirmar correctamente el cambio.</p><form id="form-correo"><label for="correoNuevo">Nuevo correo electrónico</label><input id="correoNuevo" name="correoNuevo" type="email" maxlength="150" autocomplete="email" required><label for="claveCorreo">Contraseña actual</label><input id="claveCorreo" name="contrasenaActual" type="password" autocomplete="current-password" required><button type="submit" class="btn-primary">Enviar código de verificación</button></form><!-- Verificar código recibido --><form id="form-codigo" hidden><h3>Verificar nuevo correo</h3><label for="codigo">Código de seis dígitos</label><input id="codigo" name="codigo" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required><button type="submit" class="btn-secondary">Confirmar correo</button></form></section><!-- =====================================
           CAMBIAR CONTRASEÑA
           ===================================== --><section class="config-card"><h2><i class="fa-solid fa-lock"></i>Cambiar contraseña</h2><form id="form-contrasena"><label for="claveActual">Contraseña actual</label><input id="claveActual" name="contrasenaActual" type="password" autocomplete="current-password" required><label for="claveNueva">Nueva contraseña</label><input id="claveNueva" name="contrasenaNueva" type="password" autocomplete="new-password" minlength="8" required><small>Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.</small><button type="submit" class="btn-primary">Actualizar contraseña</button></form></section><!-- =====================================
           CAMBIAR TIPO DE CUENTA
           ===================================== --><section id="seccion-organizacion" class="config-card" hidden><h2><i class="fa-solid fa-right-left"></i><span id="titulo-cambio-tipo">Cambiar tipo de cuenta</span></h2><p id="descripcion-cambio-tipo">Cargando información del tipo de cuenta...</p><!-- Aviso especial para organizaciones --><div id="aviso-publicaciones" hidden><p><strong>Importante:</strong>para cambiar de Organización a Adoptante no debes tener publicaciones de mascotas asociadas a tu organización.</p><p>Puedes revisar tus publicaciones en<a href="/gestion/mascotas">Mis mascotas</a>.</p></div><form id="form-organizacion"><label for="claveOrganizacion">Confirma tu contraseña</label><input id="claveOrganizacion" name="contrasenaActual" type="password" autocomplete="current-password" required><button type="submit" class="btn-primary" id="boton-cambio-tipo">Cambiar tipo de cuenta</button></form></section></div></main>` })}${renderScript($$result, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/configuracion.astro?astro&type=script&index=0&lang.ts")}`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/configuracion.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/configuracion.astro";
var $$url = "/configuracion";
//#endregion
//#region \0virtual:astro:page:src/pages/configuracion@_@astro
var page = () => configuracion_exports;
//#endregion
export { page };
