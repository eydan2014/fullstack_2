import { hashSync } from "bcryptjs";
import { arrServiciosIniciales, arrNutricionistas } from "./catalogo";
import { fechaHoy } from "../utils/validaciones";
export const strClaveDatos = "nutrivida_ep2_v2";
// Datos de prueba; la clave compartida se publica en el inicio de sesion.
export function crearDatosIniciales() {
  const strHash = hashSync("NutriVida2026!", 8);
  const arrUsuarios = [
    {
      strId: "PAC001",
      strNombre: "Alex (datos de prueba)",
      strCorreo: "paciente@nutrivida.example",
      strRut: "12.345.678-5",
      strTelefono: "+56912345678",
      strRol: "Paciente",
    },
    {
      strId: "PAC002",
      strNombre: "Sam (datos de prueba)",
      strCorreo: "sam@nutrivida.example",
      strRut: "11.111.111-1",
      strTelefono: "+56987654321",
      strRol: "Paciente",
    },
    {
      strId: "ADM001",
      strNombre: "Administracion (datos de prueba)",
      strCorreo: "admin@nutrivida.example",
      strRol: "Administrador",
    },
    {
      strId: "SEC001",
      strNombre: "Recepcion (datos de prueba)",
      strCorreo: "secretaria@nutrivida.example",
      strRol: "Secretaria",
    },
    ...arrNutricionistas.map((objNut) => ({
      strId: objNut.strId,
      strNombre: objNut.strNombre,
      strCorreo: `${objNut.strId.toLowerCase()}@nutrivida.example`,
      strRol: "Nutricionista",
    })),
  ].map((objUsuario) => ({ ...objUsuario, strHash, boolActivo: true }));
  const objFecha = new Date(`${fechaHoy()}T12:00:00`);
  objFecha.setDate(objFecha.getDate() + 1);
  while (objFecha.getDay() !== 1) objFecha.setDate(objFecha.getDate() + 1);
  const strFecha = `${objFecha.getFullYear()}-${String(objFecha.getMonth() + 1).padStart(2, "0")}-${String(objFecha.getDate()).padStart(2, "0")}`;
  return {
    intVersion: 2,
    arrUsuarios,
    arrServicios: structuredClone(arrServiciosIniciales),
    arrCitas: [
      {
        strId: "CITA-PRUEBA",
        strPacienteId: "PAC001",
        strNutricionistaId: "NUT001",
        strServicioId: "CN001",
        strServicioNombre: arrServiciosIniciales[0].strNombre,
        numPrecio: 35000,
        intDuracion: 50,
        strFecha,
        strHora: "10:00",
        strMotivo: "Primera evaluacion con datos de prueba",
        strEstado: "Confirmada",
      },
    ],
    arrMediciones: [
      {
        strId: "MED-PRUEBA",
        strPacienteId: "PAC001",
        strNutricionistaId: "NUT001",
        strFecha: fechaHoy(),
        numPeso: 74,
        numAltura: 170,
        numCintura: 84,
        numImc: 25.61,
      },
    ],
    arrPlanes: [
      {
        strId: "PLAN-PRUEBA",
        strPacienteId: "PAC001",
        strNutricionistaId: "NUT001",
        strFecha: fechaHoy(),
        strContenido:
          "Registro con datos de prueba. El profesional registra aqui el plan personalizado despues de una evaluacion.",
      },
    ],
  };
}
export function guardarDatos(objDatos) {
  try {
    localStorage.setItem(strClaveDatos, JSON.stringify(objDatos));
  } catch {
    throw new Error(
      "No fue posible guardar. Revisa el espacio y los permisos del navegador.",
    );
  }
}
export function leerDatos() {
  let strDatos;
  try {
    strDatos = localStorage.getItem(strClaveDatos);
  } catch {
    throw new Error("El navegador no permite acceder al almacenamiento local.");
  }
  if (!strDatos) {
    const objDatos = crearDatosIniciales();
    guardarDatos(objDatos);
    return objDatos;
  }
  try {
    const objDatos = JSON.parse(strDatos);
    if (
      objDatos.intVersion !== 2 ||
      ![
        "arrUsuarios",
        "arrServicios",
        "arrCitas",
        "arrMediciones",
        "arrPlanes",
      ].every((strClave) => Array.isArray(objDatos[strClave]))
    )
      throw new Error();
    return objDatos;
  } catch {
    throw new Error(
      "Los datos locales no son compatibles. Puedes restablecer los datos de prueba desde la pantalla de recuperacion.",
    );
  }
}
export function restablecerDatos() {
  const objDatos = crearDatosIniciales();
  guardarDatos(objDatos);
  sessionStorage.removeItem("nutrivida_sesion");
  return objDatos;
}
