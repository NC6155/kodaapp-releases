import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_BGUEBUzq.mjs";
import { t as $$Header } from "./Header_CDLQqucv.mjs";
//#region src/assets/caniche.jpg
var caniche_default = new Proxy({
	"src": "/_astro/caniche.Bo_rnHa2.jpg",
	"width": 538,
	"height": 371,
	"format": "jpg"
}, { get(target, name, receiver) {
	if (name === "clone") return structuredClone(target);
	if (name === "fsPath") return "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/assets/caniche.jpg";
	return target[name];
} });
//#endregion
//#region src/assets/chihuahua.jpg
var chihuahua_default = new Proxy({
	"src": "/_astro/chihuahua.BKg5LViL.jpg",
	"width": 1200,
	"height": 800,
	"format": "jpg"
}, { get(target, name, receiver) {
	if (name === "clone") return structuredClone(target);
	if (name === "fsPath") return "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/assets/chihuahua.jpg";
	return target[name];
} });
//#endregion
//#region src/assets/hamte.webp
var hamte_default = new Proxy({
	"src": "/_astro/hamte.CMNWm9c6.webp",
	"width": 698,
	"height": 465,
	"format": "webp"
}, { get(target, name, receiver) {
	if (name === "clone") return structuredClone(target);
	if (name === "fsPath") return "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/assets/hamte.webp";
	return target[name];
} });
//#endregion
//#region src/assets/images.jpg
var images_default = new Proxy({
	"src": "/_astro/images.DPmMJ22l.jpg",
	"width": 554,
	"height": 554,
	"format": "jpg"
}, { get(target, name, receiver) {
	if (name === "clone") return structuredClone(target);
	if (name === "fsPath") return "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/assets/images.jpg";
	return target[name];
} });
//#endregion
//#region src/assets/siames.jpg
var siames_default = new Proxy({
	"src": "/_astro/siames.DVB8mGzq.jpg",
	"width": 522,
	"height": 383,
	"format": "jpg"
}, { get(target, name, receiver) {
	if (name === "clone") return structuredClone(target);
	if (name === "fsPath") return "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/assets/siames.jpg";
	return target[name];
} });
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	const fotos = [
		{
			src: caniche_default.src,
			alt: "Perro caniche"
		},
		{
			src: chihuahua_default.src,
			alt: "Perro chihuahua"
		},
		{
			src: hamte_default.src,
			alt: "Hámster"
		},
		{
			src: images_default.src,
			alt: "Mascota"
		},
		{
			src: siames_default.src,
			alt: "Gato siamés"
		}
	];
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "KodApp | Adopta con confianza",
		"description": "Encuentra mascotas que buscan un hogar responsable en KodApp."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main class="home-page"><!-- ======================================
         PRESENTACIÓN PRINCIPAL
         ====================================== --><section class="hero-section"><div class="hero-content"><span class="hero-kicker">Adopción responsable</span><h1>Encuentra a tu<span>próximo compañero.</span></h1><p>Conoce mascotas que buscan un hogar, descubre cuáles pueden ser compatibles contigo y comienza una nueva historia.</p><div class="hero-actions"><a href="/mascotas" class="btn-primary">Explorar mascotas<i class="fa-solid fa-arrow-right"></i></a><a href="/match" class="btn-secondary">Descubrir mi compatibilidad</a></div></div><!-- ======================================
           CARRUSEL DE FOTOGRAFÍAS
           ====================================== --><div class="hero-visual"><!-- Decoraciones existentes --><div class="hero-glow hero-glow-one"></div><div class="hero-glow hero-glow-two"></div><div class="hero-paw hero-paw-one"><i class="fa-solid fa-paw"></i></div><div class="hero-paw hero-paw-two"><i class="fa-solid fa-paw"></i></div><div class="hero-visual-card"><div class="hero-slideshow ka-hero-carousel" role="img" aria-label="Galería rotativa de mascotas de KodApp">${fotos.map((foto, index) => renderTemplate`<img${addAttribute(foto.src, "src")} alt=""${addAttribute({
		"hero-slideshow-image": true,
		"ka-hero-slide": true,
		"is-active": index === 0
	}, "class:list")}${addAttribute(index === 0 ? "eager" : "lazy", "loading")} decoding="async">`)}</div></div></div></section><!-- ======================================
         CARACTERÍSTICAS DE KODAPP
         ====================================== --><section class="features-section"><!-- Característica 1 --><article class="feature-item"><div class="feature-icon"><i class="fa-solid fa-paw"></i></div><div><h3>Perfiles detallados</h3><p>Conoce la personalidad, historia y necesidades de cada mascota.</p></div></article><!-- Característica 2 --><article class="feature-item"><div class="feature-icon"><i class="fa-solid fa-heart-circle-check"></i></div><div><h3>Compatibilidad inteligente</h3><p>Descubre qué mascotas pueden encajar mejor con tu estilo de vida.</p></div></article><!-- Característica 3 --><article class="feature-item"><div class="feature-icon"><i class="fa-solid fa-clipboard-check"></i></div><div><h3>Proceso organizado</h3><p>Mantén tus postulaciones y formularios en un solo lugar.</p></div></article><!-- Característica 4 --><article class="feature-item"><div class="feature-icon"><i class="fa-solid fa-hand-holding-heart"></i></div><div><h3>Apoyo a rescatistas</h3><p>Herramientas pensadas para facilitar la gestión de postulaciones.</p></div></article></section><!-- ======================================
         CÓMO FUNCIONA KODAPP
         ====================================== --><section class="ka-process" id="como-funciona" aria-labelledby="ka-process-title"><div class="ka-process__heading"><span class="ka-process__eyebrow"><i class="fa-solid fa-paw"></i>EMPIEZA TU HISTORIA</span><h2 id="ka-process-title">¿Cómo funciona<span>KodApp?</span></h2><p>Encontrar a tu próximo compañero comienza con tres sencillos pasos.</p></div><div class="ka-process__grid"><!-- PASO 1 --><article class="ka-process__step"><span class="ka-process__number">01</span><div class="ka-process__icon"><i class="fa-solid fa-magnifying-glass"></i></div><h3>Explora mascotas</h3><p>Descubre mascotas disponibles y conoce sus características, personalidad e historia.</p></article><!-- PASO 2 --><article class="ka-process__step"><span class="ka-process__number">02</span><div class="ka-process__icon ka-process__icon--pink"><i class="fa-solid fa-file-pen"></i></div><h3>Envía tu postulación</h3><p>Elige una mascota y completa el formulario con tus datos para que puedan evaluarte.</p></article><!-- PASO 3 --><article class="ka-process__step"><span class="ka-process__number">03</span><div class="ka-process__icon"><i class="fa-solid fa-envelope-circle-check"></i></div><h3>Recibe una respuesta</h3><p>La organización revisa tu solicitud y comunica si fue aprobada o rechazada.</p></article></div><div class="ka-process__bottom"><p><i class="fa-solid fa-heart"></i>Cada nueva conexión puede cambiar una vida.</p><a href="/mascotas" class="btn-primary">Conocer mascotas<i class="fa-solid fa-arrow-right"></i></a></div></section></main>` })}${renderScript($$result, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/index.astro", void 0);
var $$file = "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
