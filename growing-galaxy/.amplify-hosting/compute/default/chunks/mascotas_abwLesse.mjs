import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, B as createAstro, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { t as $$Layout } from "./Layout_BGUEBUzq.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { t as agregarFotosMascotas } from "./fotos_DIX-svjU.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
import { t as $$Header } from "./Header_CDLQqucv.mjs";
//#region src/pages/gestion/mascotas.astro
var mascotas_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Mascotas,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Mascotas = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Mascotas;
	const sessionId = Astro.cookies.get("session_id")?.value;
	const usuario = await getUsuarioDesdeSesion(sessionId);
	if (!usuario) return Astro.redirect("/login");
	if (usuario.tipo_usuario !== "organizacion") return Astro.redirect("/usuario");
	const resultado = await db.query(`SELECT
    id,
    nombre,
    descripcion,
    personalidad,
    historial_medico,
    estado_adopcion,
    tipo_mascota
   FROM mascotas
   WHERE usuario_id = $1
   ORDER BY id DESC`, [usuario.id]);
	const mascotas = await agregarFotosMascotas(resultado.rows);
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Mis mascotas | KodApp",
		"description": "Mascotas publicadas por mi organización."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="management-page"><div class="management-container"><div class="page-header page-header-inline"><div><a href="/gestion" class="back-link"><i class="fa-solid fa-arrow-left"></i>Volver al panel</a><span class="section-kicker">Administración</span><h1>Mis mascotas</h1><p>Revisa y edita las mascotas que has publicado.</p></div><a href="/gestion/crear-mascota" class="btn-primary"><i class="fa-solid fa-plus"></i>Publicar mascota</a></div>${mascotas.length === 0 ? renderTemplate`<section class="empty-state"><div class="empty-state-icon"><i class="fa-solid fa-paw"></i></div><h2>Todavía no tienes publicaciones</h2><p>Cuando publiques una mascota, aparecerá automáticamente aquí.</p><a href="/gestion/crear-mascota" class="btn-primary">Publicar mi primera mascota</a></section>` : renderTemplate`<section class="management-pets-grid">${mascotas.map((mascota) => renderTemplate`<article class="management-pet-card"><div class="management-pet-image">${mascota.foto ? renderTemplate`<img${addAttribute(mascota.foto, "src")}${addAttribute(`Foto de ${mascota.nombre}`, "alt")} loading="lazy">` : renderTemplate`<div class="management-pet-placeholder"><i class="fa-solid fa-paw"></i></div>`}<span${addAttribute({
		"pet-status-badge": true,
		"is-available": mascota.estado_adopcion === "disponible"
	}, "class:list")}>${mascota.estado_adopcion}</span></div><div class="management-pet-content"><div class="pet-card-meta">${mascota.tipo_mascota === "perro" ? "Perro" : mascota.tipo_mascota === "gato" ? "Gato" : "Otro"}</div><h2>${mascota.nombre}</h2>${mascota.descripcion && renderTemplate`<p>${mascota.descripcion}</p>`}<div class="management-pet-info">${mascota.personalidad && renderTemplate`<div><strong>Personalidad</strong><span>${mascota.personalidad}</span></div>`}${mascota.historial_medico && renderTemplate`<div><strong>Historial médico</strong><span>${mascota.historial_medico}</span></div>`}</div><div class="management-pet-actions"><a${addAttribute(`/gestion/mascotas/${mascota.id}/editar`, "href")} class="btn-outline"><i class="fa-solid fa-pen"></i>Editar publicación</a></div></div></article>`)}</section>`}</div></main>` })}`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/gestion/mascotas.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/gestion/mascotas.astro";
var $$url = "/gestion/mascotas";
//#endregion
//#region \0virtual:astro:page:src/pages/gestion/mascotas@_@astro
var page = () => mascotas_exports;
//#endregion
export { page };
