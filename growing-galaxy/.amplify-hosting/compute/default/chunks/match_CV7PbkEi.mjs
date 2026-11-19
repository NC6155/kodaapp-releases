import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, B as createAstro, N as addAttribute, T as Fragment, j as maybeRenderHead, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_BGUEBUzq.mjs";
import { t as db } from "./db_BgmFgjUe.mjs";
import { t as agregarFotosMascotas } from "./fotos_DIX-svjU.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
import { t as $$Header } from "./Header_CDLQqucv.mjs";
/* empty css                */
//#region src/lib/match/compatibilidad.ts
var PESO_TIPO = 30;
var PESO_PERSONALIDAD = 45;
var PESO_CUIDADOS = 25;
var PERSONALIDADES_BASE = /* @__PURE__ */ new Set([
	"tranquilo",
	"carinoso",
	"jugueton",
	"activo",
	"timido",
	"sociable",
	"independiente",
	"protector"
]);
function normalizar(valor) {
	return (valor ?? "").trim().toLowerCase();
}
function compararTipo(preferido, tipoMascota) {
	if (!preferido || !tipoMascota) return {
		valor: null,
		advertencia: "Falta información sobre el tipo de mascota."
	};
	if (preferido === "indiferente") return {
		valor: 1,
		coincidencia: "No tienes restricciones sobre el tipo de mascota."
	};
	if (preferido === tipoMascota) return {
		valor: 1,
		coincidencia: "Coincide con el tipo de mascota que buscas."
	};
	return {
		valor: 0,
		advertencia: "El tipo de mascota difiere de tu preferencia."
	};
}
function obtenerPersonalidades(codigo) {
	return codigo.split("_").filter((parte) => PERSONALIDADES_BASE.has(parte));
}
function compararPersonalidad(preferida, personalidadMascota) {
	if (!preferida || !personalidadMascota) return {
		valor: null,
		advertencia: "Falta información sobre la personalidad."
	};
	if (preferida === "indiferente") return {
		valor: 1,
		coincidencia: "No tienes una preferencia de personalidad específica."
	};
	if (preferida === "otro" || personalidadMascota === "otro") return {
		valor: null,
		advertencia: "La personalidad requiere una revisión individual."
	};
	if (preferida === personalidadMascota) return {
		valor: 1,
		coincidencia: "La personalidad coincide con tu preferencia."
	};
	const buscadas = obtenerPersonalidades(preferida);
	const encontradas = obtenerPersonalidades(personalidadMascota);
	if (buscadas.length === 0 || encontradas.length === 0) return {
		valor: null,
		advertencia: "No hay una clasificación de personalidad comparable."
	};
	if (buscadas.filter((personalidad) => encontradas.includes(personalidad)).length > 0) return {
		valor: .75,
		coincidencia: "La mascota presenta características de personalidad afines a tus preferencias."
	};
	return {
		valor: 0,
		advertencia: "La personalidad presenta diferencias con tus preferencias."
	};
}
function compararCuidados(disponibilidad, salud) {
	if (!disponibilidad || !salud) return {
		valor: null,
		advertencia: "Faltan datos para evaluar los cuidados médicos."
	};
	if (salud === "desconocido" || salud === "otro") return {
		valor: null,
		advertencia: "Los antecedentes médicos deben confirmarse con la organización."
	};
	if (["sin_antecedentes", "vacunacion_al_dia"].includes(salud)) return {
		valor: 1,
		coincidencia: "No se registran necesidades médicas especiales."
	};
	if (salud === "vacunacion_pendiente") return {
		valor: .85,
		advertencia: "La mascota tiene vacunación pendiente. Consulta sus necesidades veterinarias."
	};
	if (salud === "tratamiento" || salud === "condicion_cronica") {
		if (disponibilidad === "tratamientos" || disponibilidad === "especiales") return {
			valor: 1,
			coincidencia: "Declaraste disponibilidad para asumir tratamientos médicos."
		};
		if (disponibilidad === "indiferente") return {
			valor: null,
			advertencia: "Es necesario confirmar si puedes asumir el tratamiento médico requerido."
		};
		return {
			valor: 0,
			advertencia: "La mascota requiere atención médica que podría superar los cuidados que declaraste poder asumir."
		};
	}
	if (salud === "cuidados_especiales") {
		if (disponibilidad === "especiales") return {
			valor: 1,
			coincidencia: "Declaraste disponibilidad para cuidados especiales."
		};
		return {
			valor: disponibilidad === "indiferente" ? null : 0,
			advertencia: "La mascota requiere cuidados especiales. La organización debe revisar si puedes asumirlos."
		};
	}
	return {
		valor: null,
		advertencia: "No se pudo clasificar el nivel de cuidados requerido."
	};
}
function calcularCompatibilidad(preferencias, mascota) {
	const coincidencias = [];
	const advertencias = [];
	let puntos = 0;
	let pesoEvaluado = 0;
	function agregar(comparacion, peso) {
		if (comparacion.valor !== null) {
			puntos += comparacion.valor * peso;
			pesoEvaluado += peso;
		}
		if (comparacion.coincidencia) coincidencias.push(comparacion.coincidencia);
		if (comparacion.advertencia) advertencias.push(comparacion.advertencia);
	}
	agregar(compararTipo(normalizar(preferencias.tipo_preferido), normalizar(mascota.tipo_mascota)), PESO_TIPO);
	agregar(compararPersonalidad(normalizar(preferencias.personalidad_preferida), normalizar(mascota.personalidad_codigo)), PESO_PERSONALIDAD);
	agregar(compararCuidados(normalizar(preferencias.nivel_cuidados), normalizar(mascota.salud_codigo)), PESO_CUIDADOS);
	const cobertura = pesoEvaluado;
	if (pesoEvaluado < 55) return {
		porcentaje: null,
		nivel: "sin_datos",
		cobertura,
		coincidencias,
		advertencias: [...advertencias, "No existe información suficiente para calcular el Match."]
	};
	const porcentaje = Math.max(0, Math.min(100, Math.round(puntos / pesoEvaluado * 100)));
	let nivel;
	if (porcentaje < 50) nivel = "baja";
	else if (porcentaje < 70) nivel = "moderada";
	else if (porcentaje < 85) nivel = "buena";
	else nivel = "muy_alta";
	if (pesoEvaluado < 100) advertencias.push("Resultado parcial: algunos criterios no pudieron evaluarse.");
	return {
		porcentaje,
		nivel,
		cobertura,
		coincidencias,
		advertencias
	};
}
//#endregion
//#region src/pages/match.astro
var match_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Match,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Match = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Match;
	const sessionId = Astro.cookies.get("session_id")?.value;
	const usuario = await getUsuarioDesdeSesion(sessionId);
	if (!usuario) return Astro.redirect("/login");
	if (usuario.tipo_usuario !== "adoptante") return Astro.redirect("/compatibilidad-organizacion");
	const preferencias = (await db.query(`
  SELECT
    tipo_preferido,
    personalidad_preferida,
    nivel_cuidados
  FROM preferencias_match
  WHERE usuario_id = $1
  `, [usuario.id])).rows[0] ?? null;
	let tarjetas = [];
	if (preferencias) {
		const consultaMascotas = await db.query(`
    SELECT
      id,
      nombre,
      descripcion,
      tipo_mascota,
      personalidad,
      personalidad_codigo,
      historial_medico,
      salud_codigo
    FROM mascotas
    WHERE estado_adopcion = 'disponible'
    ORDER BY id DESC
    `);
		tarjetas = (await agregarFotosMascotas(consultaMascotas.rows)).map((mascota) => ({
			...mascota,
			match: calcularCompatibilidad(preferencias, mascota)
		})).sort((a, b) => {
			const porcentajeA = a.match.porcentaje ?? -1;
			return (b.match.porcentaje ?? -1) - porcentajeA;
		});
	}
	function nombreNivel(nivel) {
		switch (nivel) {
			case "baja": return "Compatibilidad baja";
			case "moderada": return "Compatibilidad moderada";
			case "buena": return "Buena compatibilidad";
			case "muy_alta": return "Compatibilidad muy alta";
			default: return "Información insuficiente";
		}
	}
	function mensajeNivel(nivel) {
		switch (nivel) {
			case "baja": return "Existen diferencias importantes entre tus preferencias y las características de esta mascota.";
			case "moderada": return "Hay coincidencias, pero también algunos aspectos que conviene revisar.";
			case "buena": return "Las características de esta mascota coinciden en buena medida con tus preferencias.";
			case "muy_alta": return "Esta mascota presenta un nivel elevado de coincidencia con tus preferencias.";
			default: return "Todavía no contamos con información suficiente para calcular una compatibilidad completa.";
		}
	}
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Mi Match | KodApp",
		"description": "Conoce mascotas compatibles con tus preferencias."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="ka-match-page"><div class="ka-match-container"><header class="ka-match-header"><a class="ka-match-back" href="/usuario"><i class="fa-solid fa-arrow-left"></i>Mi cuenta</a><span class="ka-match-kicker"><i class="fa-solid fa-heart"></i>CONEXIONES ESPECIALES</span><h1>Un deslizamiento,<span>una nueva amistad.</span></h1><p>Descubre a tu posible compañero de vida. Desliza para explorar y conoce qué tan compatibles son.</p><div class="ka-match-header-decoration" aria-hidden="true"><i class="fa-solid fa-paw"></i></div></header>${!preferencias ? renderTemplate`<section class="ka-match-empty"><div class="ka-match-empty-icon"><i class="fa-solid fa-heart"></i></div><h2>¡Primero queremos conocerte!</h2><p>Completa tus preferencias para descubrir las mascotas que mejor coinciden contigo.</p><a class="ka-match-action" href="/preferencias">Configurar mis preferencias<i class="fa-solid fa-arrow-right"></i></a></section>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<div class="ka-match-toolbar"><div><span class="ka-match-kicker">TU ESPACIO MATCH</span><h2>Conoce a tu próximo amigo<i class="fa-solid fa-paw"></i></h2></div><a class="ka-match-edit" href="/preferencias"><i class="fa-solid fa-sliders"></i>Mis preferencias</a></div>${tarjetas.length === 0 ? renderTemplate`<section class="ka-match-empty"><div class="ka-match-empty-icon"><i class="fa-solid fa-paw"></i></div><h2>Por ahora no hay mascotas disponibles</h2><p>Vuelve a visitarnos para descubrir nuevos compañeros.</p></section>` : renderTemplate`<section class="ka-match-experience" aria-label="Explorar mascotas compatibles"><div class="ka-match-progress-head"><span><i class="fa-solid fa-compass"></i>Explorando mascotas</span><strong id="ka-match-counter" aria-live="polite">1 de ${tarjetas.length}</strong></div><div class="ka-match-track" aria-hidden="true"><span id="ka-match-track-fill"></span></div><!-- MAZO DE TARJETAS --><div class="ka-match-deck" id="ka-match-deck">${tarjetas.map((mascota, index) => renderTemplate`<article class="ka-match-card"${addAttribute(index, "data-index")}${addAttribute(mascota.id, "data-pet-id")}${addAttribute(`Mascota ${mascota.nombre}, ${mascota.match.porcentaje ?? "sin porcentaje"} de compatibilidad`, "aria-label")}${addAttribute(index !== 0 ? "true" : "false", "aria-hidden")}><!-- FOTO --><div class="ka-match-photo">${mascota.foto ? renderTemplate`<img${addAttribute(mascota.foto, "src")}${addAttribute(`Fotografía de ${mascota.nombre}`, "alt")}${addAttribute(index === 0 ? "eager" : "lazy", "loading")} draggable="false">` : renderTemplate`<div class="ka-match-photo-fallback"><i class="fa-solid fa-paw"></i><span>Una amistad por descubrir</span></div>`}<div class="ka-match-photo-shade"></div><span class="ka-match-photo-tag"><i class="fa-solid fa-circle-check"></i>En adopción</span><span${addAttribute(["ka-match-photo-score", `ka-match-photo-score--${mascota.match.nivel}`], "class:list")}><i class="fa-solid fa-heart"></i>${mascota.match.porcentaje === null ? "Sin datos" : `${mascota.match.porcentaje}% match`}</span><div class="ka-match-photo-heading"><h3>${mascota.nombre}</h3><span><i class="fa-solid fa-paw"></i>${mascota.tipo_mascota}</span></div><div class="ka-match-swipe-stamp ka-match-swipe-stamp--no">PASAR</div><div class="ka-match-swipe-stamp ka-match-swipe-stamp--yes">ME ENCANTA</div></div><!-- INFORMACIÓN --><div class="ka-match-content"><div class="ka-match-level-row"><div><span class="ka-match-label">NIVEL DE CONEXIÓN</span><p>${nombreNivel(mascota.match.nivel)}</p></div><span class="ka-match-coverage">${mascota.match.cobertura}% de criterios evaluados</span></div><progress class="ka-match-meter"${addAttribute(mascota.match.porcentaje ?? 0, "value")} max="100"${addAttribute(`Compatibilidad con ${mascota.nombre}`, "aria-label")}></progress><p class="ka-match-description">${mensajeNivel(mascota.match.nivel)}</p>${mascota.descripcion && renderTemplate`<p class="ka-match-bio">${mascota.descripcion}</p>`}<!-- DETALLE COMPATIBILIDAD --><details class="ka-match-details"><summary><i class="fa-solid fa-list-check"></i>¿Por qué este match?<i class="fa-solid fa-chevron-down"></i></summary><div class="ka-match-details-body">${mascota.match.coincidencias.length > 0 && renderTemplate`<h4><i class="fa-solid fa-circle-check"></i>Coincidencias</h4>`}${mascota.match.coincidencias.map((texto) => renderTemplate`<p class="ka-match-positive"><i class="fa-solid fa-check"></i>${texto}</p>`)}${mascota.match.advertencias.length > 0 && renderTemplate`<h4><i class="fa-solid fa-circle-exclamation"></i>Aspectos por revisar</h4>`}${mascota.match.advertencias.map((texto) => renderTemplate`<p class="ka-match-warning"><i class="fa-solid fa-circle-info"></i>${texto}</p>`)}${mascota.match.coincidencias.length === 0 && mascota.match.advertencias.length === 0 && renderTemplate`<p>Faltan datos para explicar esta compatibilidad.</p>`}</div></details><a class="ka-match-postular"${addAttribute(`/postular/${mascota.id}`, "href")}><i class="fa-solid fa-paper-plane"></i>Conocer y postular<i class="fa-solid fa-arrow-right"></i></a></div></article>`)}<!-- FINAL DEL RECORRIDO --><div class="ka-match-finished" id="ka-match-finished" hidden><div class="ka-match-empty-icon"><i class="fa-solid fa-heart"></i></div><h3>¡Ya conociste a todos!</h3><p>Estas son todas las mascotas disponibles por ahora. Puedes volver a recorrerlas.</p><button type="button" id="ka-match-restart"><i class="fa-solid fa-rotate-right"></i>Volver a empezar</button></div></div><!-- CONTROLES --><div class="ka-match-controls" id="ka-match-controls"><button class="ka-match-control ka-match-control--pass" id="ka-match-pass" type="button" aria-label="Pasar a la siguiente mascota"><i class="fa-solid fa-xmark"></i></button><button class="ka-match-control ka-match-control--undo" id="ka-match-undo" type="button" aria-label="Volver a la mascota anterior" disabled><i class="fa-solid fa-rotate-left"></i></button><button class="ka-match-control ka-match-control--like" id="ka-match-like" type="button" aria-label="Me gusta esta mascota y continuar"><i class="fa-solid fa-heart"></i></button></div><p class="ka-match-hint"><i class="fa-solid fa-hand-pointer"></i>Desliza a la <b>izquierda</b> para pasar o a la <b>derecha</b> si te gusta. También puedes usar las flechas del teclado.</p><p class="ka-match-note" role="note">El corazón solo avanza a la siguiente mascota. Para iniciar una solicitud, pulsa<strong>Conocer y postular</strong>.</p></section>`}` })}`}<footer class="ka-match-footer"><i class="fa-solid fa-shield-heart"></i><p>La compatibilidad es orientativa: refleja coincidencias entre tus preferencias y la información disponible de cada mascota. No garantiza una adopción ni reemplaza la evaluación del equipo rescatista.</p></footer></div></main>` })}${renderScript($$result, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/match.astro?astro&type=script&index=0&lang.ts")}`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/match.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/match.astro";
var $$url = "/match";
//#endregion
//#region \0virtual:astro:page:src/pages/match@_@astro
var page = () => match_exports;
//#endregion
export { page };
