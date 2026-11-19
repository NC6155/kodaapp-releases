import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, B as createAstro, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { t as $$Layout } from "./Layout_BGUEBUzq.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
import { t as $$Header } from "./Header_CDLQqucv.mjs";
/* empty css                        */
//#region src/pages/mis-postulaciones.astro
var mis_postulaciones_exports = /* @__PURE__ */ __exportAll({
	default: () => $$MisPostulaciones,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$MisPostulaciones = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$MisPostulaciones;
	const usuario = await getUsuarioDesdeSesion(Astro.cookies.get("session_id")?.value);
	if (!usuario) return Astro.redirect("/login");
	if (usuario.tipo_usuario !== "adoptante") return Astro.redirect("/gestion");
	const postulaciones = (await db.query(`SELECT
     p.id,
     p.mascota_id,
     p.estado,
     p.creada_en,
     p.resuelta_en,
     m.nombre AS mascota_nombre,
     m.tipo_mascota,
     u.nombre AS organizacion_nombre
   FROM postulaciones p
   JOIN mascotas m
     ON m.id = p.mascota_id
   JOIN usuarios u
     ON u.id = m.usuario_id
   WHERE p.adoptante_id = $1
   ORDER BY p.creada_en DESC`, [usuario.id])).rows;
	const fecha = (valor) => new Date(valor).toLocaleDateString("es-CL", {
		day: "2-digit",
		month: "long",
		year: "numeric"
	});
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Mis postulaciones | KodApp",
		"description": "Consulta el estado de tus postulaciones de adopción."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="post-page"><div class="post-container"><div class="post-heading"><a href="/usuario" class="back-link"><i class="fa-solid fa-arrow-left"></i>Volver a mi cuenta</a><span class="section-kicker">Mi proceso</span><h1>Mis postulaciones</h1><p>Aquí puedes consultar las solicitudes que has enviado a las organizaciones.</p></div>${postulaciones.length === 0 ? renderTemplate`<section class="post-empty"><i class="fa-solid fa-paw"></i><h2>Aún no tienes postulaciones</h2><p>Explora las mascotas disponibles y envía tu primera solicitud.</p><a href="/usuario" class="btn-primary">Ver mascotas disponibles</a></section>` : renderTemplate`<div class="post-list">${postulaciones.map((postulacion) => renderTemplate`<article class="post-entry"><span${addAttribute(`post-status is-${postulacion.estado}`, "class")}>${postulacion.estado}</span><h2>${postulacion.mascota_nombre}</h2><p><strong>Organización:</strong>${" "}${postulacion.organizacion_nombre}</p><p><strong>Tipo de mascota:</strong>${" "}${postulacion.tipo_mascota}</p><p class="post-date">Enviada el:${" "}${fecha(postulacion.creada_en)}</p>${postulacion.estado === "pendiente" && renderTemplate`<p>Tu solicitud está esperando la evaluación de la organización.</p>`}${postulacion.estado === "aprobada" && renderTemplate`<p>Tu postulación fue aprobada. La organización puede contactarte para continuar el proceso. Esto todavía no significa que la adopción esté completada.</p>`}${postulacion.estado === "rechazada" && renderTemplate`<p>Tu postulación no fue aprobada. Puedes explorar otras mascotas disponibles en KodApp.</p>`}<div class="post-entry-actions"><a${addAttribute(`/postular/${postulacion.mascota_id}`, "href")} class="btn-secondary">Ver mascota</a></div></article>`)}</div>`}</div></main>` })}`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/mis-postulaciones.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/mis-postulaciones.astro";
var $$url = "/mis-postulaciones";
//#endregion
//#region \0virtual:astro:page:src/pages/mis-postulaciones@_@astro
var page = () => mis_postulaciones_exports;
//#endregion
export { page };
