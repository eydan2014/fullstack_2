import { crearDatosIniciales } from "../data/persistencia";
export function datosPrueba() {
  return crearDatosIniciales();
}
export function lunesFuturo() {
  const objFecha = new Date();
  objFecha.setDate(objFecha.getDate() + 7);
  while (objFecha.getDay() !== 1) objFecha.setDate(objFecha.getDate() + 1);
  return `${objFecha.getFullYear()}-${String(objFecha.getMonth() + 1).padStart(2, "0")}-${String(objFecha.getDate()).padStart(2, "0")}`;
}
export function citaPrueba() {
  return {
    strPacienteId: "PAC001",
    strServicioId: "CN002",
    strNutricionistaId: "NUT001",
    strFecha: lunesFuturo(),
    strHora: "14:00",
    strMotivo: "Control de seguimiento",
  };
}
