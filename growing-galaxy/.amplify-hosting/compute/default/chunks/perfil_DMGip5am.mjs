import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, B as createAstro, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_BGUEBUzq.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
import { t as $$Header } from "./Header_CDLQqucv.mjs";
//#region src/pages/perfil.astro
var perfil_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Perfil,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Perfil = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Perfil;
	const sessionId = Astro.cookies.get("session_id")?.value;
	const usuario = await getUsuarioDesdeSesion(sessionId);
	if (!usuario) return Astro.redirect("/login");
	const esOrganizacion = usuario.tipo_usuario === "organizacion";
	const tipoCuenta = esOrganizacion ? "Organización" : "Adoptante";
	const volver = esOrganizacion ? "/gestion" : "/usuario";
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Mi perfil | KodApp",
		"description": "Consulta y edita tu perfil."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="profile-page"><div class="profile-container"><!-- Encabezado --><div class="page-header"><a${addAttribute(volver, "href")} class="back-link"><i class="fa-solid fa-arrow-left"></i>Volver</a><span class="section-kicker">Cuenta</span><h1>Mi perfil</h1><p>Personaliza tu información y fotografía.</p></div><section class="profile-layout"><!-- =====================================
             COLUMNA IZQUIERDA: FOTOGRAFÍA
             ===================================== --><article class="profile-summary"><!-- Avatar --><div class="profile-summary-avatar" id="profile-avatar">${usuario.foto_perfil ? renderTemplate`<img${addAttribute(usuario.foto_perfil, "src")} alt="Fotografía de perfil">` : renderTemplate`<i class="fa-solid fa-user"></i>`}</div><h2>${usuario.nombre}</h2><p>${tipoCuenta}</p><!-- Selección de fotografía --><label for="profile-photo-input" class="photo-change-button"><i class="fa-solid fa-camera"></i>Cambiar foto</label><input id="profile-photo-input" type="file" accept="image/png,image/jpeg,image/webp" hidden><p id="profile-photo-message" class="profile-action-message" aria-live="polite"></p></article><!-- =====================================
             COLUMNA DERECHA: DATOS
             ===================================== --><article class="profile-details"><div class="profile-details-header"><span class="section-kicker">Información personal</span><h2>Datos de tu cuenta</h2></div><!-- Datos visibles --><div class="profile-data-grid"><div class="profile-data-item"><span>Nombre</span><strong>${usuario.nombre}</strong></div><div class="profile-data-item"><span>Correo electrónico</span><strong>${usuario.correo}</strong></div><div class="profile-data-item"><span>RUT</span><strong>${usuario.rut}</strong></div><div class="profile-data-item"><span>Tipo de cuenta</span><strong>${tipoCuenta}</strong></div><div class="profile-data-item"><span>Estado</span><strong>${usuario.estado_cuenta}</strong></div></div><!-- =====================================
               DESCRIPCIÓN DEL PERFIL
               ===================================== --><section class="profile-description"><h2>${esOrganizacion ? "Acerca de nuestra organización" : "Acerca de mí"}</h2><p>${esOrganizacion ? "Cuenta quiénes son, qué hacen y cómo ayudan a las mascotas." : "Escribe una pequeña presentación sobre ti."}</p><form id="description-form"><label for="profile-description">Descripción</label><textarea id="profile-description" name="descripcion" maxlength="500" rows="5" placeholder="Escribe aquí tu descripción...">${usuario.descripcion_perfil ?? ""}</textarea><div class="profile-description-footer"><span id="description-counter">${(usuario.descripcion_perfil ?? "").length}/500</span><button type="submit" class="btn-primary" id="save-description"><i class="fa-solid fa-floppy-disk"></i>Guardar descripción</button></div><p id="description-message" class="profile-action-message" aria-live="polite"></p></form></section><!-- =====================================
               CONFIGURACIÓN DE LA CUENTA
               ===================================== --><section class="profile-description"><h2>Seguridad y datos personales</h2><p>Cambia tu nombre, correo, contraseña y tipo de cuenta desde la configuración.</p><div class="profile-description-footer"><a href="/configuracion" class="btn-primary"><i class="fa-solid fa-user-gear"></i>Configurar mi cuenta</a></div></section></article></section></div></main>` })}${renderScript($$result, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/perfil.astro?astro&type=script&index=0&lang.ts")}`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/perfil.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/perfil.astro";
var $$url = "/perfil";
//#endregion
//#region \0virtual:astro:page:src/pages/perfil@_@astro
var page = () => perfil_exports;
//#endregion
export { page };
