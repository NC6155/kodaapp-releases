export function leerPostulacion(cuerpo: unknown) {
  if (!cuerpo || typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
    throw new Error("Datos inválidos.");
  }
  const datos = cuerpo as Record<string, unknown>;
  const id = datos.mascotaId;
  if ((typeof id !== "number" && !(typeof id === "string" && /^\d+$/.test(id)))
      || !Number.isSafeInteger(Number(id)) || Number(id) < 1 || Number(id) > 2147483647) {
    throw new Error("Mascota inválida.");
  }
  const telefono = typeof datos.telefono === "string" ? datos.telefono.trim() : "";
  const motivo = typeof datos.motivo === "string" ? datos.motivo.trim() : "";
  const vivienda = typeof datos.vivienda === "string" ? datos.vivienda.trim() : "";
  if (telefono.length > 25 || !/^[+0-9().\s-]+$/.test(telefono) || telefono.replace(/\D/g, "").length < 7) {
    throw new Error("Introduce un teléfono válido.");
  }
  if (!["casa", "departamento", "otro"].includes(vivienda)) throw new Error("Vivienda inválida.");
  if (motivo.length < 30 || motivo.length > 1500) throw new Error("Explica tu motivación en 30 a 1500 caracteres.");
  if (datos.confirmacion !== "si") throw new Error("Confirma los datos de la postulación.");
  return { mascotaId: Number(id), telefono, vivienda, motivo };
}
