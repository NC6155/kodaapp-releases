//#region src/lib/CatalogoMatch.ts
var PERSONALIDADES = [
	{
		valor: "tranquilo",
		etiqueta: "Tranquilo/a"
	},
	{
		valor: "carinoso",
		etiqueta: "Cariñoso/a"
	},
	{
		valor: "jugueton",
		etiqueta: "Juguetón/a"
	},
	{
		valor: "activo",
		etiqueta: "Activo/a y enérgico/a"
	},
	{
		valor: "timido",
		etiqueta: "Tímido/a"
	},
	{
		valor: "sociable",
		etiqueta: "Sociable"
	},
	{
		valor: "independiente",
		etiqueta: "Independiente"
	},
	{
		valor: "protector",
		etiqueta: "Protector/a"
	},
	{
		valor: "tranquilo_carinoso",
		etiqueta: "Tranquilo/a y cariñoso/a"
	},
	{
		valor: "activo_jugueton",
		etiqueta: "Activo/a y juguetón/a"
	},
	{
		valor: "jugueton_sociable",
		etiqueta: "Juguetón/a y sociable"
	},
	{
		valor: "timido_carinoso",
		etiqueta: "Tímido/a y cariñoso/a"
	},
	{
		valor: "independiente_tranquilo",
		etiqueta: "Independiente y tranquilo/a"
	}
];
var ANTECEDENTES_MEDICOS = [
	{
		valor: "sin_antecedentes",
		etiqueta: "Sin antecedentes médicos conocidos"
	},
	{
		valor: "vacunacion_al_dia",
		etiqueta: "Vacunación al día"
	},
	{
		valor: "vacunacion_pendiente",
		etiqueta: "Vacunación pendiente"
	},
	{
		valor: "tratamiento",
		etiqueta: "En tratamiento médico"
	},
	{
		valor: "condicion_cronica",
		etiqueta: "Tiene una condición médica crónica"
	},
	{
		valor: "cuidados_especiales",
		etiqueta: "Requiere cuidados especiales"
	},
	{
		valor: "desconocido",
		etiqueta: "Antecedentes médicos desconocidos"
	}
];
/**
* Resuelve una respuesta de desplegable.
*
* Para opciones estándar: guarda código y etiqueta.
* Para "otro": guarda código y texto personalizado.
*/
function procesarClasificacion(codigo, detalle, opciones, nombreCampo) {
	if (typeof codigo !== "string" || !codigo) return {
		ok: false,
		mensaje: `Selecciona ${nombreCampo}.`
	};
	if (codigo === "otro") {
		if (typeof detalle !== "string") return {
			ok: false,
			mensaje: `Describe ${nombreCampo}.`
		};
		const texto = detalle.trim();
		if (texto.length < 3 || texto.length > 1500) return {
			ok: false,
			mensaje: `La descripción de ${nombreCampo} debe tener entre 3 y 1500 caracteres.`
		};
		return {
			ok: true,
			codigo: "otro",
			texto
		};
	}
	const opcion = opciones.find((item) => item.valor === codigo);
	if (!opcion) return {
		ok: false,
		mensaje: `La opción de ${nombreCampo} no es válida.`
	};
	return {
		ok: true,
		codigo: opcion.valor,
		texto: opcion.etiqueta
	};
}
/**
* Permite editar mascotas antiguas.
*
* Si existe código, lo utiliza.
* Si solo existe texto, busca una equivalencia.
* Si no la encuentra, recupera el texto como "otro".
*/
function seleccionarClasificacion(codigo, texto, opciones) {
	if (typeof codigo === "string" && (codigo === "otro" || opciones.some((item) => item.valor === codigo))) return codigo;
	if (!texto?.trim()) return "";
	return opciones.find((item) => item.etiqueta.toLowerCase() === texto.trim().toLowerCase())?.valor ?? "otro";
}
//#endregion
export { seleccionarClasificacion as i, PERSONALIDADES as n, procesarClasificacion as r, ANTECEDENTES_MEDICOS as t };
