import { hashSync, compareSync } from "bcryptjs";
import { arrNutricionistas } from "./catalogo";
import {
  validarCita,
  rutValido,
  correoValido,
  duracionServicio,
  calcularImc,
  fechaHoy,
  fechaValida,
} from "../utils/validaciones";
// Las operaciones trabajan sobre una copia. El contexto guarda y actualiza React.
export function nuevoId(strPrefijo) {
  // Identificador para datos de prueba, compatible con HTTP en EC2.
  return `${strPrefijo}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}
export function autenticar(objDatos, strCorreo, strClave) {
  const objUsuario = objDatos.arrUsuarios.find(
    (objFila) =>
      objFila.boolActivo &&
      objFila.strCorreo === strCorreo.trim().toLowerCase(),
  );
  if (!objUsuario || !compareSync(strClave, objUsuario.strHash))
    throw new Error("Correo o clave incorrectos, o cuenta desactivada.");
  return objUsuario.strId;
}
export function registrarUsuario(
  objDatos,
  objFormulario,
  objActor = null,
  strId = "",
) {
  const boolAdmin = objActor?.strRol === "Administrador";
  const objErrores = {};
  if (strId && !boolAdmin) throw new Error("Acceso denegado.");
  if (objFormulario.strNombre.trim().length < 3)
    objErrores.strNombre = "Ingresa al menos 3 caracteres.";
  if (!correoValido(objFormulario.strCorreo))
    objErrores.strCorreo = "Ingresa un correo valido.";
  if (
    objDatos.arrUsuarios.some(
      (objFila) =>
        objFila.strId !== strId &&
        objFila.strCorreo === objFormulario.strCorreo.trim().toLowerCase(),
    )
  )
    objErrores.strCorreo = "Este correo ya esta registrado.";
  if (!strId && (objFormulario.strClave || "").length < 8)
    objErrores.strClave = "La clave debe tener al menos 8 caracteres.";
  if (strId && objFormulario.strClave && objFormulario.strClave.length < 8)
    objErrores.strClave = "La clave debe tener al menos 8 caracteres.";
  const strRol = boolAdmin ? objFormulario.strRol : "Paciente";
  if (
    !["Paciente", "Administrador", "Secretaria", "Nutricionista"].includes(
      strRol,
    )
  )
    objErrores.strRol = "Selecciona un rol valido.";
  if (strRol === "Paciente" && !rutValido(objFormulario.strRut || ""))
    objErrores.strRut = "Ingresa un RUT valido con digito verificador.";
  if (
    strRol === "Paciente" &&
    !/^\+?\d{9,12}$/.test(objFormulario.strTelefono || "")
  )
    objErrores.strTelefono = "Ingresa de 9 a 12 digitos, con + opcional.";
  if (
    strRol === "Paciente" &&
    !objErrores.strRut &&
    objDatos.arrUsuarios.some(
      (objFila) =>
        objFila.strId !== strId &&
        (objFila.strRut || "").replace(/[.\-\s]/g, "").toUpperCase() ===
          (objFormulario.strRut || "").replace(/[.\-\s]/g, "").toUpperCase(),
    )
  )
    objErrores.strRut = "Este RUT ya esta registrado.";
  if (Object.keys(objErrores).length) return objErrores;
  const objAnterior = objDatos.arrUsuarios.find(
    (objFila) => objFila.strId === strId,
  );
  if (strId && !objAnterior) throw new Error("Usuario no encontrado.");
  if (objAnterior?.strRol === "Nutricionista" && strRol !== "Nutricionista")
    throw new Error("Los profesionales del directorio conservan su rol.");
  if (
    strRol === "Nutricionista" &&
    !arrNutricionistas.some((objNut) => objNut.strId === strId)
  )
    throw new Error(
      "Usa una de las cuatro cuentas profesionales del catalogo.",
    );
  if (objActor?.strId === strId && strRol !== "Administrador")
    throw new Error("No puedes quitarte el rol de administrador.");
  const objUsuario = {
    strId: strId || nuevoId("PAC"),
    strNombre: objFormulario.strNombre.trim(),
    strCorreo: objFormulario.strCorreo.trim().toLowerCase(),
    strRut: objFormulario.strRut || "",
    strTelefono: objFormulario.strTelefono || "",
    strRol,
    boolActivo: objAnterior?.boolActivo ?? true,
    strHash: objFormulario.strClave
      ? hashSync(objFormulario.strClave, 10)
      : objAnterior.strHash,
  };
  if (objAnterior)
    objDatos.arrUsuarios = objDatos.arrUsuarios.map((objFila) =>
      objFila.strId === strId ? objUsuario : objFila,
    );
  else objDatos.arrUsuarios.push(objUsuario);
  return {};
}
export function citasVisibles(objDatos, objUsuario) {
  if (["Administrador", "Secretaria"].includes(objUsuario.strRol))
    return objDatos.arrCitas;
  return objDatos.arrCitas.filter((objCita) =>
    objUsuario.strRol === "Paciente"
      ? objCita.strPacienteId === objUsuario.strId
      : objCita.strNutricionistaId === objUsuario.strId,
  );
}
export function pacientesVisibles(objDatos, objUsuario) {
  return objDatos.arrUsuarios.filter(
    (objFila) =>
      objFila.strRol === "Paciente" &&
      (objUsuario.strRol === "Administrador" ||
        objDatos.arrCitas.some(
          (objCita) =>
            objCita.strPacienteId === objFila.strId &&
            objCita.strNutricionistaId === objUsuario.strId &&
            objCita.strEstado !== "Cancelada",
        )),
  );
}
export function guardarCita(objDatos, objUsuario, objFormulario, strId = "") {
  const objAnterior = objDatos.arrCitas.find(
    (objFila) => objFila.strId === strId,
  );
  if (
    strId &&
    (!objAnterior ||
      !citasVisibles(objDatos, objUsuario).some(
        (objFila) => objFila.strId === strId,
      ))
  )
    throw new Error("No tienes acceso a esta cita.");
  if (objUsuario.strRol === "Nutricionista")
    throw new Error("La solicitud la realiza el paciente o recepcion.");
  if (
    objAnterior &&
    ["Atendida", "Cancelada", "Inasistencia"].includes(objAnterior.strEstado)
  )
    throw new Error("Esta cita ya esta cerrada.");
  const strPacienteId =
    objUsuario.strRol === "Paciente"
      ? objUsuario.strId
      : objFormulario.strPacienteId;
  if (
    !objDatos.arrUsuarios.some(
      (objFila) =>
        objFila.strId === strPacienteId &&
        objFila.strRol === "Paciente" &&
        objFila.boolActivo,
    )
  )
    throw new Error("Selecciona un paciente activo.");
  const objServicio = objDatos.arrServicios.find(
    (objFila) => objFila.strId === objFormulario.strServicioId,
  );
  if (
    !objDatos.arrUsuarios.some(
      (objFila) =>
        objFila.strId === objFormulario.strNutricionistaId &&
        objFila.boolActivo &&
        objFila.strRol === "Nutricionista",
    )
  )
    throw new Error("El profesional no esta disponible.");
  if (
    objServicio?.strId === "CN004" &&
    !objDatos.arrCitas.some(
      (objFila) =>
        objFila.strPacienteId === strPacienteId &&
        objFila.strEstado === "Atendida" &&
        objDatos.arrServicios
          .find((objServicio) => objServicio.strId === objFila.strServicioId)
          ?.strModalidad.startsWith("Presencial"),
    )
  )
    throw new Error(
      "La teleconsulta requiere una consulta presencial previa atendida.",
    );
  const objCita = { ...objFormulario, strPacienteId };
  const objErrores = validarCita(
    objCita,
    objDatos.arrCitas,
    arrNutricionistas,
    objServicio,
    strId,
  );
  if (Object.keys(objErrores).length) return objErrores;
  const objRegistro = {
    ...objCita,
    strId: strId || nuevoId("CITA"),
    strEstado: strId ? "Reprogramacion" : "Pendiente",
    strServicioNombre: objServicio.strNombre,
    numPrecio: objServicio.numPrecio,
    intDuracion: duracionServicio(objServicio),
  };
  if (strId)
    objDatos.arrCitas = objDatos.arrCitas.map((objFila) =>
      objFila.strId === strId ? objRegistro : objFila,
    );
  else objDatos.arrCitas.push(objRegistro);
  return {};
}
export function cambiarEstado(objDatos, objUsuario, strId, strEstado) {
  const objCita = citasVisibles(objDatos, objUsuario).find(
    (objFila) => objFila.strId === strId,
  );
  if (!objCita) throw new Error("Cita no encontrada o acceso denegado.");
  if (["Atendida", "Cancelada", "Inasistencia"].includes(objCita.strEstado))
    throw new Error("Esta cita ya esta cerrada.");
  if (objUsuario.strRol === "Paciente" && strEstado !== "Cancelada")
    throw new Error("Solo puedes cancelar tus propias citas.");
  if (
    !["Confirmada", "Cancelada", "Atendida", "Inasistencia"].includes(strEstado)
  )
    throw new Error("Estado no valido.");
  if (
    ["Atendida", "Inasistencia"].includes(strEstado) &&
    new Date(`${objCita.strFecha}T${objCita.strHora}`) > new Date()
  )
    throw new Error("No puedes cerrar una atencion futura.");
  objCita.strEstado = strEstado;
}
export function guardarMedicion(
  objDatos,
  objUsuario,
  objFormulario,
  strId = "",
) {
  if (
    !["Administrador", "Nutricionista"].includes(objUsuario.strRol) ||
    !pacientesVisibles(objDatos, objUsuario).some(
      (objFila) => objFila.strId === objFormulario.strPacienteId,
    )
  )
    throw new Error("No tienes acceso a este paciente.");
  const objErrores = {};
  if (
    !fechaValida(objFormulario.strFecha) ||
    objFormulario.strFecha > fechaHoy()
  )
    objErrores.strFecha = "Usa una fecha de hoy o anterior.";
  for (const [strCampo, numMin, numMax] of [
    ["numPeso", 2, 350],
    ["numAltura", 40, 250],
    ["numCintura", 20, 250],
  ]) {
    const numValor = Number(objFormulario[strCampo]);
    if (!Number.isFinite(numValor) || numValor < numMin || numValor > numMax)
      objErrores[strCampo] = `Ingresa un valor entre ${numMin} y ${numMax}.`;
  }
  if (Object.keys(objErrores).length) return objErrores;
  const objAnterior = objDatos.arrMediciones.find(
    (objFila) => objFila.strId === strId,
  );
  if (
    strId &&
    (!objAnterior ||
      objAnterior.strPacienteId !== objFormulario.strPacienteId ||
      (objUsuario.strRol !== "Administrador" &&
        objAnterior.strNutricionistaId !== objUsuario.strId))
  )
    throw new Error("No puedes editar esta medicion.");
  const objMedicion = {
    ...objFormulario,
    strId: strId || nuevoId("MED"),
    strNutricionistaId: objAnterior?.strNutricionistaId || objUsuario.strId,
    numPeso: Number(objFormulario.numPeso),
    numAltura: Number(objFormulario.numAltura),
    numCintura: Number(objFormulario.numCintura),
    numImc: calcularImc(
      Number(objFormulario.numPeso),
      Number(objFormulario.numAltura),
    ),
  };
  if (strId)
    objDatos.arrMediciones = objDatos.arrMediciones.map((objFila) =>
      objFila.strId === strId ? objMedicion : objFila,
    );
  else objDatos.arrMediciones.push(objMedicion);
  return {};
}
export function guardarPlan(objDatos, objUsuario, strPacienteId, strContenido) {
  if (
    !["Administrador", "Nutricionista"].includes(objUsuario.strRol) ||
    !pacientesVisibles(objDatos, objUsuario).some(
      (objFila) => objFila.strId === strPacienteId,
    )
  )
    throw new Error("No tienes acceso a este paciente.");
  if (strContenido.trim().length < 10 || strContenido.length > 3000)
    throw new Error("Escribe un plan de 10 a 3000 caracteres.");
  objDatos.arrPlanes.push({
    strId: nuevoId("PLAN"),
    strPacienteId,
    strNutricionistaId: objUsuario.strId,
    strFecha: fechaHoy(),
    strContenido: strContenido.trim(),
  });
}
export function guardarServicio(
  objDatos,
  objUsuario,
  objFormulario,
  strId = "",
) {
  if (objUsuario.strRol !== "Administrador")
    throw new Error("Acceso denegado.");
  if (
    !/^[A-Z]{2}\d{3}$/.test(objFormulario.strId) ||
    objFormulario.strNombre.trim().length < 4 ||
    !Number.isFinite(Number(objFormulario.numPrecio)) ||
    Number(objFormulario.numPrecio) <= 0 ||
    !objFormulario.strDescripcion.trim()
  )
    throw new Error(
      "Revisa codigo (AA000), nombre, descripcion y precio mayor que cero.",
    );
  if (
    !strId &&
    objDatos.arrServicios.some(
      (objFila) => objFila.strId === objFormulario.strId,
    )
  )
    throw new Error("El codigo ya existe.");
  const objServicio = {
    ...objFormulario,
    numPrecio: Number(objFormulario.numPrecio),
    strProfesional: "Nutricionista",
  };
  if (strId)
    objDatos.arrServicios = objDatos.arrServicios.map((objFila) =>
      objFila.strId === strId ? objServicio : objFila,
    );
  else objDatos.arrServicios.push(objServicio);
}
export function eliminarServicio(objDatos, objUsuario, strId) {
  if (objUsuario.strRol !== "Administrador")
    throw new Error("Acceso denegado.");
  if (
    objDatos.arrCitas.some(
      (objFila) =>
        objFila.strServicioId === strId &&
        !["Cancelada", "Atendida", "Inasistencia"].includes(objFila.strEstado),
    )
  )
    throw new Error(
      "El servicio tiene citas activas. Cancela o atiende esas citas primero.",
    );
  objDatos.arrServicios = objDatos.arrServicios.filter(
    (objFila) => objFila.strId !== strId,
  );
}
export function alternarUsuario(objDatos, objActor, strId) {
  if (objActor.strRol !== "Administrador" || objActor.strId === strId)
    throw new Error("No puedes realizar este cambio.");
  const objUsuario = objDatos.arrUsuarios.find(
    (objFila) => objFila.strId === strId,
  );
  if (!objUsuario) throw new Error("Usuario no encontrado.");
  if (
    objUsuario.strRol === "Nutricionista" &&
    objDatos.arrCitas.some(
      (objFila) =>
        objFila.strNutricionistaId === strId &&
        !["Cancelada", "Atendida", "Inasistencia"].includes(objFila.strEstado),
    )
  )
    throw new Error(
      "Reprograma o cancela las citas activas antes de desactivar al profesional.",
    );
  objUsuario.boolActivo = !objUsuario.boolActivo;
}
