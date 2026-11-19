import { A as renderTemplate, B as createAstro, N as addAttribute, j as maybeRenderHead } from "./sequence_DWzj4TxR.mjs";
import { t as createComponent } from "./compiler_DcKg_E1-.mjs";
import { n as renderScript } from "./Layout_BGUEBUzq.mjs";
import { t as getUsuarioDesdeSesion } from "./auth_DzGWmYJk.mjs";
//#region src/assets/logo.png
var logo_default = new Proxy({
	"src": "/_astro/logo.CZyJXH9X.png",
	"width": 1254,
	"height": 1254,
	"format": "png"
}, { get(target, name, receiver) {
	if (name === "clone") return structuredClone(target);
	if (name === "fsPath") return "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/assets/logo.png";
	return target[name];
} });
//#endregion
//#region src/components/Header.astro
createAstro("https://astro.build");
var $$Header = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Header;
	const sessionId = Astro.cookies.get("session_id")?.value;
	const usuario = await getUsuarioDesdeSesion(sessionId);
	const pathname = Astro.url.pathname;
	let homeUrl = "/";
	if (usuario) homeUrl = usuario.tipo_usuario === "adoptante" ? "/usuario" : "/gestion";
	return renderTemplate`${maybeRenderHead($$result)}<header class="site-header"><div class="header-inner"><!-- LOGO --><a${addAttribute(homeUrl, "href")} class="brand" aria-label="Ir al inicio de KodApp"><img${addAttribute(logo_default.src, "src")} alt="KodApp"></a><!-- MENÚ MÓVIL --><button type="button" class="mobile-toggle" id="mobile-toggle" aria-label="Abrir menú" aria-expanded="false"><i class="fa-solid fa-bars"></i></button><!-- NAVEGACIÓN PRINCIPAL --><nav class="main-nav" id="main-nav" aria-label="Navegación principal"><!-- INICIO --><a${addAttribute(usuario ? homeUrl : "/", "href")}${addAttribute({ "is-active": pathname === "/" || pathname === "/usuario" || pathname === "/gestion" }, "class:list")}>Inicio</a><!-- MASCOTAS - PÁGINA INDEPENDIENTE --><a href="/mascotas"${addAttribute({ "is-active": pathname === "/mascotas" || pathname.startsWith("/postular/") }, "class:list")}>Mascotas</a><!-- COMPATIBILIDAD --><a href="/match"${addAttribute({ "is-active": pathname.startsWith("/match") }, "class:list")}>Compatibilidad</a></nav><!-- CUENTA --><div class="header-account">${usuario ? renderTemplate`<div class="account-menu"><button type="button" class="account-trigger" id="account-trigger" aria-expanded="false"><span class="account-avatar">${usuario.foto_perfil ? renderTemplate`<img${addAttribute(usuario.foto_perfil, "src")} alt="Foto de perfil">` : renderTemplate`<i class="fa-solid fa-user"></i>`}</span><span class="account-name">${usuario.nombre}</span><i class="fa-solid fa-chevron-down"></i></button><div class="account-dropdown" id="account-dropdown"><div class="account-dropdown-header"><strong>${usuario.nombre}</strong><span>${usuario.tipo_usuario === "organizacion" ? "Organización" : "Adoptante"}</span></div><a${addAttribute(homeUrl, "href")}><i class="fa-solid fa-house"></i>Mi cuenta</a><a href="/perfil"><i class="fa-solid fa-user"></i>Mi perfil</a><button type="button" id="header-logout"><i class="fa-solid fa-right-from-bracket"></i>Cerrar sesión</button></div></div>` : renderTemplate`<a href="/login" class="header-login"><i class="fa-solid fa-user"></i><span>Iniciar sesión</span></a>`}</div></div></header>${renderScript($$result, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/components/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "J:/Programas/VSC/kodaapp-releases/growing-galaxy/src/components/Header.astro", void 0);
//#endregion
export { $$Header as t };
