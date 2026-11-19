import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, B as createAstro, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_BGUEBUzq.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
import { t as $$Header } from "./Header_CDLQqucv.mjs";
/* empty css                        */
//#region src/pages/gestion/postulaciones.astro
var postulaciones_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Postulaciones,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Postulaciones = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Postulaciones;
	const usuario = await getUsuarioDesdeSesion(Astro.cookies.get("session_id")?.value);
	if (!usuario) return Astro.redirect("/login");
	if (usuario.tipo_usuario !== "organizacion") return Astro.redirect("/usuario");
	const postulaciones = (await db.query(`SELECT
     p.id,
     p.mascota_id,
     p.telefono,
     p.vivienda,
     p.motivo,
     p.estado,
     p.creada_en,
     p.resuelta_en,
     m.nombre AS mascota_nombre,
     u.nombre AS adoptante_nombre,
     u.correo AS adoptante_correo
   FROM postulaciones p
   JOIN mascotas m
     ON m.id = p.mascota_id
   JOIN usuarios u
     ON u.id = p.adoptante_id
   WHERE m.usuario_id = $1
   ORDER BY
     CASE WHEN p.estado = 'pendiente' THEN 0 ELSE 1 END,
     p.creada_en DESC`, [usuario.id])).rows;
	const fecha = (valor) => new Date(valor).toLocaleDateString("es-CL", {
		day: "2-digit",
		month: "long",
		year: "numeric"
	});
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Postulaciones recibidas | KodApp",
		"description": "Revisa y evalúa postulaciones para tus mascotas."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="post-page"><div class="post-container"><div class="post-heading"><a href="/gestion" class="back-link"><i class="fa-solid fa-arrow-left"></i>Volver a gestión</a><span class="section-kicker">Panel de organización</span><h1>Postulaciones recibidas</h1><p>Revisa los antecedentes de los adoptantes que postularon a tus mascotas.</p></div><p id="mensaje-evaluacion" class="post-message" role="status" aria-live="polite"></p>${postulaciones.length === 0 ? renderTemplate`<div class="post-empty"><i class="fa-solid fa-clipboard-list"></i><h2>No tienes postulaciones</h2><p>Cuando alguien postule a una de tus mascotas, su solicitud aparecerá aquí.</p></div>` : renderTemplate`<div class="post-list">${postulaciones.map((postulacion) => renderTemplate`<article class="post-entry"><span${addAttribute(`post-status is-${postulacion.estado}`, "class")}>${postulacion.estado}</span><h2>${postulacion.mascota_nombre}</h2><p><strong>Postulante:</strong>${" "}${postulacion.adoptante_nombre}</p><p><strong>Correo:</strong>${" "}${postulacion.adoptante_correo}</p><p><strong>Teléfono:</strong>${" "}${postulacion.telefono}</p><p><strong>Vivienda:</strong>${" "}${postulacion.vivienda}</p><p class="post-date">Postulación recibida:${" "}${fecha(postulacion.creada_en)}</p><div class="post-detail"><strong>Motivación del adoptante</strong><p>${postulacion.motivo}</p></div>${postulacion.estado === "pendiente" && renderTemplate`<form class="post-decision-form"${addAttribute(postulacion.id, "data-postulacion-id")}><button type="submit" name="decision" value="aprobar" class="btn-primary"><i class="fa-solid fa-check"></i>Aprobar postulación</button><button type="submit" name="decision" value="rechazar" class="post-reject"><i class="fa-solid fa-xmark"></i>Rechazar postulación</button></form>`}${postulacion.estado !== "pendiente" && renderTemplate`<p class="post-date">Evaluada:${" "}${postulacion.resuelta_en ? fecha(postulacion.resuelta_en) : "Sin fecha"}</p>`}</article>`)}</div>`}</div></main>` })}${renderScript($$result, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/gestion/postulaciones.astro?astro&type=script&index=0&lang.ts")}`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/gestion/postulaciones.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/gestion/postulaciones.astro";
var $$url = "/gestion/postulaciones";
//#endregion
//#region \0virtual:astro:page:src/pages/gestion/postulaciones@_@astro
var page = () => postulaciones_exports;
//#endregion
export { page };
