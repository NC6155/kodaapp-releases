//#region src/lib/validarcontrasena.ts
/**
* KODAPP - VALIDACIÓN DE CONTRASEÑAS
*
* Reglas:
* - Mínimo 8 caracteres.
* - Una mayúscula.
* - Una minúscula.
* - Un número.
* - Un símbolo especial.
* - Bloquear contraseñas comunes.
*/
function validarContrasena(contrasena) {
	const errores = [];
	if (typeof contrasena !== "string") return ["Debes ingresar una contraseña válida."];
	if (contrasena.length < 8) errores.push("Debe tener al menos 8 caracteres.");
	if (!/[A-Z]/.test(contrasena)) errores.push("Debe contener una mayúscula.");
	if (!/[a-z]/.test(contrasena)) errores.push("Debe contener una minúscula.");
	if (!/[0-9]/.test(contrasena)) errores.push("Debe contener un número.");
	if (!/[^A-Za-z0-9\s]/.test(contrasena)) errores.push("Debe contener un símbolo.");
	if (/\s/.test(contrasena)) errores.push("No se permiten espacios.");
	if (Buffer.byteLength(contrasena, "utf8") > 72) errores.push("La contraseña es demasiado larga.");
	const normalizada = contrasena.toLowerCase().replace(/[@4]/g, "a").replace(/0/g, "o").replace(/[1!]/g, "i").replace(/3/g, "e").replace(/[5$]/g, "s").replace(/[^a-z0-9]/g, "");
	if ([
		"password",
		"contrasena",
		"123456",
		"qwerty",
		"admin",
		"welcome",
		"abcdef"
	].some((palabra) => normalizada.includes(palabra))) errores.push("La contraseña es demasiado común.");
	return errores;
}
//#endregion
export { validarContrasena as t };
