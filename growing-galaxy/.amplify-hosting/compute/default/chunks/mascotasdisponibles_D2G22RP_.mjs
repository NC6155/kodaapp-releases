import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, N as addAttribute, j as maybeRenderHead } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { t as agregarFotosMascotas } from "./fotos_DIX-svjU.mjs";
//#region src/pages/mascotasdisponibles.astro
var mascotasdisponibles_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Mascotasdisponibles,
	file: () => $$file,
	url: () => $$url
});
var $$Mascotasdisponibles = createComponent(async ($$result, $$props, $$slots) => {
	const resultado = await db.query(`
  SELECT
    m.id,
    m.nombre,
    m.descripcion,
    m.personalidad,
    m.historial_medico,
    m.tipo_mascota,
    m.estado_adopcion
  FROM mascotas m
  WHERE m.estado_adopcion = 'disponible'
    AND NOT EXISTS (
      SELECT 1
      FROM postulaciones p
      WHERE p.mascota_id = m.id
        AND p.estado = 'aprobada'
    )
  ORDER BY m.id DESC
`);
	const mascotas = await agregarFotosMascotas(resultado.rows);
	return renderTemplate`${maybeRenderHead($$result)}<section class="mascotas-disponibles"><div class="mascotas-disponibles-header"><p class="small-title">Encuentra a tu compañero</p><h2>Mascotas disponibles</h2><p>Conoce a las mascotas que están esperando encontrar un nuevo hogar.</p></div>${mascotas.length === 0 ? renderTemplate`<div class="mascotas-vacias"><i class="fa-solid fa-paw"></i><h3>No hay mascotas disponibles</h3><p>Por ahora no hay mascotas disponibles para recibir nuevas postulaciones.</p></div>` : renderTemplate`<div class="mascotas-grid">${mascotas.map((mascota) => renderTemplate`<article class="mascota-card"><!-- FOTOGRAFÍA --><div class="mascota-card-image">${mascota.foto ? renderTemplate`<img${addAttribute(mascota.foto, "src")}${addAttribute(`Foto de ${mascota.nombre}`, "alt")} loading="lazy">` : renderTemplate`<div class="mascota-no-image"><i class="fa-solid fa-paw"></i></div>`}</div><!-- INFORMACIÓN --><div class="mascota-card-content"><span class="mascota-tipo">${mascota.tipo_mascota}</span><h3>${mascota.nombre}</h3>${mascota.descripcion && renderTemplate`<p>${mascota.descripcion}</p>`}${mascota.personalidad && renderTemplate`<div class="mascota-info"><strong>Personalidad</strong><span>${mascota.personalidad}</span></div>`}${mascota.historial_medico && renderTemplate`<div class="mascota-info"><strong>Historial médico</strong><span>${mascota.historial_medico}</span><a${addAttribute(`/postular/${mascota.id}`, "href")} class="btn-primary" style="margin-top: 20px;"><i class="fa-solid fa-clipboard-check"></i>Postular para adoptar</a></div>`}<!-- NUEVO BOTÓN --><div style="margin-top: 20px"><a${addAttribute(`/postular/${mascota.id}`, "href")} class="btn-primary"><i class="fa-solid fa-clipboard-check"></i>Postular para adoptar</a></div></div></article>`)}</div>`}</section>`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/mascotasdisponibles.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/mascotasdisponibles.astro";
var $$url = "/mascotasdisponibles";
//#endregion
//#region \0virtual:astro:page:src/pages/mascotasdisponibles@_@astro
var page = () => mascotasdisponibles_exports;
//#endregion
export { page };
