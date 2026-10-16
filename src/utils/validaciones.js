// Prefijos: str=texto, int=entero, num=decimal, bool=booleano,
// arr=arreglo, obj=objeto, elm=elemento HTML, reg=expresion regular.
export function fechaHoy() {
  const objFecha = new Date();
  return `${objFecha.getFullYear()}-${String(objFecha.getMonth() + 1).padStart(2, "0")}-${String(objFecha.getDate()).padStart(2, "0")}`;
}
export function fechaValida(strFecha) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(strFecha || "")) return false;
  const objFecha = new Date(`${strFecha}T12:00:00`);
  return (
    !Number.isNaN(objFecha.getTime()) &&
    objFecha.getFullYear() === Number(strFecha.slice(0, 4)) &&
    objFecha.getMonth() + 1 === Number(strFecha.slice(5, 7)) &&
    objFecha.getDate() === Number(strFecha.slice(8, 10))
  );
}
export function fechaTexto(strFecha) {
  if (!strFecha) return "Sin fecha";
  return strFecha.split("-").reverse().join("-");
}
export function precioTexto(numPrecio) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(numPrecio);
}
export function rutValido(strRut) {
  const strLimpio = strRut.replace(/[.\-\s]/g, "").toUpperCase();
  if (!/^\d{7,8}[0-9K]$/.test(strLimpio)) return false;
  let intSuma = 0,
    intFactor = 2;
  for (const strDigito of strLimpio.slice(0, -1).split("").reverse()) {
    intSuma += Number(strDigito) * intFactor;
    intFactor = intFactor === 7 ? 2 : intFactor + 1;
  }
  const intResto = 11 - (intSuma % 11);
  const strVerificador =
    intResto === 11 ? "0" : intResto === 10 ? "K" : String(intResto);
  return strLimpio.slice(-1) === strVerificador;
}
export function correoValido(strCorreo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strCorreo);
}
export function calcularImc(numPeso, numAltura) {
  return Number((numPeso / (numAltura / 100) ** 2).toFixed(2));
}
export function minutos(strHora) {
  const arrPartes = strHora.split(":").map(Number);
  return arrPartes[0] * 60 + arrPartes[1];
}
export function duracionServicio(objServicio) {
  return parseInt(objServicio.strDuracion, 10) || 50;
}
export function validarCita(
  objCita,
  arrCitas,
  arrNutricionistas,
  objServicio,
  strExcluir = "",
) {
  const objErrores = {};
  const objNut = arrNutricionistas.find(
    (objFila) => objFila.strId === objCita.strNutricionistaId,
  );
  const objFecha = new Date(`${objCita.strFecha}T12:00:00`);
  if (!objServicio)
    objErrores.strServicioId = "Selecciona un servicio disponible.";
  if (!objNut) objErrores.strNutricionistaId = "Selecciona un nutricionista.";
  if (!fechaValida(objCita.strFecha) || objCita.strFecha < fechaHoy())
    objErrores.strFecha = "Selecciona una fecha de hoy o posterior.";
  if (
    objNut &&
    !objErrores.strFecha &&
    !objNut.arrDias.includes(objFecha.getDay())
  )
    objErrores.strFecha = "El profesional no atiende ese dia.";
  const intDuracion = objServicio ? duracionServicio(objServicio) : 30;
  const intMin = minutos(objCita.strHora || "");
  if (
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(objCita.strHora || "") ||
    !Number.isFinite(intMin) ||
    (objNut &&
      (intMin < objNut.intInicio * 60 ||
        intMin + intDuracion > objNut.intFin * 60)) ||
    intMin % 15 !== 0
  )
    objErrores.strHora =
      "Usa intervalos de 15 min dentro del horario del profesional.";
  if (
    !objErrores.strFecha &&
    !objErrores.strHora &&
    new Date(`${objCita.strFecha}T${objCita.strHora}:00`) <= new Date()
  )
    objErrores.strHora = "La hora debe estar en el futuro.";
  if (
    (objCita.strMotivo || "").trim().length < 5 ||
    objCita.strMotivo.length > 300
  )
    objErrores.strMotivo = "Escribe un motivo de 5 a 300 caracteres.";
  const boolChoque = arrCitas.some(
    (objFila) =>
      objFila.strId !== strExcluir &&
      objFila.strEstado !== "Cancelada" &&
      objFila.strEstado !== "Inasistencia" &&
      objFila.strFecha === objCita.strFecha &&
      (objFila.strNutricionistaId === objCita.strNutricionistaId ||
        objFila.strPacienteId === objCita.strPacienteId) &&
      intMin < minutos(objFila.strHora) + objFila.intDuracion &&
      intMin + intDuracion > minutos(objFila.strHora),
  );
  if (boolChoque)
    objErrores.strHora =
      "El paciente o profesional ya tiene una cita en ese horario.";
  return objErrores;
}
