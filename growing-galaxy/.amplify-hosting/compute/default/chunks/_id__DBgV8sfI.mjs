import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, B as createAstro, N as addAttribute, T as Fragment, j as maybeRenderHead, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_BGUEBUzq.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { t as agregarFotosMascotas } from "./fotos_DIX-svjU.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
import { t as $$Header } from "./Header_CDLQqucv.mjs";
/* empty css                        */
//#region src/pages/postular/[id].astro
var _id__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Id,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Id = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Id;
	const sessionId = Astro.cookies.get("session_id")?.value;
	const usuario = await getUsuarioDesdeSesion(sessionId);
	if (!usuario) return Astro.redirect("/login");
	if (usuario.tipo_usuario !== "adoptante") return Astro.redirect("/gestion");
	const mascotaId = Number(Astro.params.id);
	if (!Number.isSafeInteger(mascotaId) || mascotaId <= 0) return Astro.redirect("/usuario");
	const consulta = await db.query(`SELECT
     m.id,
     m.nombre,
     m.descripcion,
     m.personalidad,
     m.historial_medico,
     m.tipo_mascota,
     m.estado_adopcion,
     u.nombre AS organizacion_nombre,
     EXISTS (
       SELECT 1
       FROM postulaciones p
       WHERE p.mascota_id = m.id
         AND p.estado = 'aprobada'
     ) AS tiene_aprobada
   FROM mascotas m
   JOIN usuarios u
     ON u.id = m.usuario_id
   WHERE m.id = $1`, [mascotaId]);
	if (consulta.rows.length === 0) return Astro.redirect("/usuario");
	const mascota = (await agregarFotosMascotas(consulta.rows))[0];
	const postulacionAnterior = (await db.query(`SELECT estado
   FROM postulaciones
   WHERE mascota_id = $1
     AND adoptante_id = $2
   LIMIT 1`, [mascotaId, usuario.id])).rows[0] ?? null;
	const admitePostulaciones = mascota.estado_adopcion === "disponible" && !mascota.tiene_aprobada && !postulacionAnterior;
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `Postular por ${mascota.nombre} | KodApp`,
		"description": "Completa tu postulación para adoptar una mascota."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="post-page"><div class="post-container"><div class="post-heading"><a href="/usuario" class="back-link"><i class="fa-solid fa-arrow-left"></i>Volver a mascotas</a><span class="section-kicker">Postulaciones de adopción</span><h1>Postular para adoptar</h1><p>Completa tu información para que la organización pueda evaluar tu solicitud.</p></div><div class="post-layout"><!-- INFORMACIÓN DE LA MASCOTA --><aside class="post-card post-pet"><div class="post-pet-image">${mascota.foto ? renderTemplate`<img${addAttribute(mascota.foto, "src")}${addAttribute(`Foto de ${mascota.nombre}`, "alt")}>` : renderTemplate`<div class="post-pet-placeholder"><i class="fa-solid fa-paw"></i></div>`}</div><div class="post-pet-details"><span class="section-kicker">Mascota seleccionada</span><h2>${mascota.nombre}</h2><p><strong>Tipo:</strong>${" "}${mascota.tipo_mascota}</p><p><strong>Organización:</strong>${" "}${mascota.organizacion_nombre}</p>${mascota.descripcion && renderTemplate`<p>${mascota.descripcion}</p>`}${mascota.personalidad && renderTemplate`<p><strong>Personalidad:</strong>${" "}${mascota.personalidad}</p>`}${mascota.historial_medico && renderTemplate`<p><strong>Historial médico:</strong>${" "}${mascota.historial_medico}</p>`}</div></aside><!-- FORMULARIO --><section class="post-card">${postulacionAnterior ? renderTemplate`<div class="post-existing"><i class="fa-solid fa-circle-check"></i><h2>Ya enviaste tu postulación</h2><p>Tu solicitud para ${mascota.nombre}${" "}está registrada con estado:${" "}<strong>${postulacionAnterior.estado}</strong>.</p><a href="/mis-postulaciones" class="btn-primary">Ver mis postulaciones</a></div>` : !admitePostulaciones ? renderTemplate`<div class="post-existing"><i class="fa-solid fa-circle-info"></i><h2>Postulaciones no disponibles</h2><p>Esta mascota no está recibiendo nuevas postulaciones.</p><a href="/usuario" class="btn-secondary">Buscar otra mascota</a></div>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<h2><i class="fa-solid fa-clipboard-list"></i>Formulario de postulación</h2><p>Hola, <strong>${usuario.nombre}</strong>. Responde los siguientes campos con información real y completa.</p><form id="postulacion-form"${addAttribute(mascota.id, "data-mascota-id")}><div class="post-field"><label for="telefono">Número de contacto</label><input id="telefono" name="telefono" type="tel" placeholder="+56 9 1234 5678" maxlength="25" autocomplete="tel" required><small>La organización utilizará este número para contactarte sobre tu postulación.</small></div><div class="post-field"><label for="vivienda">Tipo de vivienda</label><select id="vivienda" name="vivienda" required><option value="">Selecciona una opción</option><option value="casa">Casa</option><option value="departamento">Departamento</option><option value="otro">Otro</option></select></div><div class="post-field"><label for="motivo">¿Por qué deseas adoptar a${" "}${mascota.nombre}?</label><textarea id="motivo" name="motivo" rows="7" minlength="30" maxlength="1500" placeholder="Cuéntanos sobre tu experiencia, tu hogar y cómo cuidarías a esta mascota." required></textarea><small>Entre 30 y 1500 caracteres.</small></div><label class="post-confirmation"><input type="checkbox" name="confirmacion" value="si" required><span>Confirmo que los datos son correctos y autorizo compartir esta postulación y mis datos de contacto con la organización responsable.</span></label><p class="post-notice"><i class="fa-solid fa-circle-info"></i>Enviar esta solicitud no significa que la adopción esté aprobada. La organización evaluará tus antecedentes.</p><p id="postulacion-mensaje" class="post-message" role="status" aria-live="polite"></p><button id="postulacion-enviar" type="submit" class="btn-primary"><i class="fa-solid fa-paper-plane"></i>Enviar postulación</button></form>` })}`}</section></div></div></main>` })}${renderScript($$result, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/postular/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/postular/[id].astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/postular/[id].astro";
var $$url = "/postular/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/postular/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
