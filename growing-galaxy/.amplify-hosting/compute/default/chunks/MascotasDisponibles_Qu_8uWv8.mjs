import { A as renderTemplate, N as addAttribute, j as maybeRenderHead } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { t as agregarFotosMascotas } from "./fotos_DIX-svjU.mjs";
//#region src/components/MascotasDisponibles.astro
var $$MascotasDisponibles = createComponent(async ($$result, $$props, $$slots) => {
	const resultado = await db.query(`
  SELECT
    id,
    nombre,
    descripcion,
    personalidad,
    historial_medico,
    tipo_mascota,
    estado_adopcion
  FROM mascotas
  WHERE estado_adopcion = 'disponible'
  ORDER BY id DESC
`);
	const mascotas = await agregarFotosMascotas(resultado.rows);
	return renderTemplate`${maybeRenderHead($$result)}<section class="mascotas-disponibles"><div class="mascotas-disponibles-header"><p class="small-title">Encuentra a tu compañero</p><h2>Mascotas disponibles</h2><p>Conoce a las mascotas que están esperando encontrar un nuevo hogar.</p></div>${mascotas.length === 0 ? renderTemplate`<div class="mascotas-vacias"><i class="fa-solid fa-paw"></i><h3>No hay mascotas disponibles</h3><p>Por ahora no hay mascotas publicadas para adopción.</p></div>` : renderTemplate`<div class="mascotas-grid">${mascotas.map((mascota) => renderTemplate`<article class="mascota-card"><div class="mascota-card-image">${mascota.foto ? renderTemplate`<img${addAttribute(mascota.foto, "src")}${addAttribute(`Foto de ${mascota.nombre}`, "alt")} loading="lazy">` : renderTemplate`<div class="mascota-no-image"><i class="fa-solid fa-paw"></i></div>`}</div><div class="mascota-card-content"><span class="mascota-tipo">${mascota.tipo_mascota}</span><h3>${mascota.nombre}</h3>${mascota.descripcion && renderTemplate`<p>${mascota.descripcion}</p>`}${mascota.personalidad && renderTemplate`<div class="mascota-info"><strong>Personalidad</strong><span>${mascota.personalidad}</span></div>`}${mascota.historial_medico && renderTemplate`<div class="mascota-info"><strong>Historial médico</strong><span>${mascota.historial_medico}</span><a${addAttribute(`/postular/${mascota.id}`, "href")} class="btn-primary" style="margin-top: 20px;"><i class="fa-solid fa-clipboard-check"></i>Postular para adoptar</a></div>`}</div></article>`)}</div>`}</section>`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/components/MascotasDisponibles.astro", void 0);
//#endregion
export { $$MascotasDisponibles as t };
