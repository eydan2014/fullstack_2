const elmFormulario = document.querySelector("#formulario-agendar");
const elmNombre = document.querySelector("#nombre");
const elmRut = document.querySelector("#rut");
const elmCorreo = document.querySelector("#correo");
const elmTelefono = document.querySelector("#telefono");
const elmServicio = document.querySelector("#servicio");
const elmNutricionista = document.querySelector("#nutricionista");
const elmFecha = document.querySelector("#fecha");
const elmHora = document.querySelector("#hora");
const elmMotivo = document.querySelector("#motivo");
const elmConsentimiento = document.querySelector("#consentimiento");

const elmErrorNombre = document.querySelector("#error-nombre");
const elmErrorRut = document.querySelector("#error-rut");
const elmErrorCorreo = document.querySelector("#error-correo");
const elmErrorTelefono = document.querySelector("#error-telefono");
const elmErrorServicio = document.querySelector("#error-servicio");
const elmErrorNutricionista = document.querySelector("#error-nutricionista");
const elmErrorFecha = document.querySelector("#error-fecha");
const elmErrorHora = document.querySelector("#error-hora");
const elmErrorMotivo = document.querySelector("#error-motivo");
const elmErrorConsentimiento = document.querySelector("#error-consentimiento");

function limpiarErrores() {
  elmErrorNombre.textContent = "";
  elmErrorRut.textContent = "";
  elmErrorCorreo.textContent = "";
  elmErrorTelefono.textContent = "";
  elmErrorServicio.textContent = "";
  elmErrorNutricionista.textContent = "";
  elmErrorFecha.textContent = "";
  elmErrorHora.textContent = "";
  elmErrorMotivo.textContent = "";
  elmErrorConsentimiento.textContent = "";
}

function validarRut(strRut) {
  const strRutLimpio = strRut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
  const regRut = /^\d{7,8}[0-9K]$/;

  if (!regRut.test(strRutLimpio)) {
    return false;
  }

  const strCuerpo = strRutLimpio.slice(0, -1);
  const strDigitoIngresado = strRutLimpio.slice(-1);
  let intSuma = 0;
  let intMultiplicador = 2;

  for (let intPosicion = strCuerpo.length - 1; intPosicion >= 0; intPosicion--) {
    intSuma = intSuma + Number(strCuerpo[intPosicion]) * intMultiplicador;
    intMultiplicador++;

    if (intMultiplicador === 8) {
      intMultiplicador = 2;
    }
  }

  const intResto = 11 - (intSuma % 11);
  let strDigitoCalculado = String(intResto);

  if (intResto === 11) {
    strDigitoCalculado = "0";
  }

  if (intResto === 10) {
    strDigitoCalculado = "K";
  }

  return strDigitoIngresado === strDigitoCalculado;
}

function validarFormulario() {
  limpiarErrores();

  const strNombre = elmNombre.value.trim();
  const strRut = elmRut.value.trim();
  const strCorreo = elmCorreo.value.trim();
  const strTelefono = elmTelefono.value.replace(/\D/g, "");
  const strFecha = elmFecha.value;
  const strMotivo = elmMotivo.value.trim();
  const regCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let boolValido = true;

  if (strNombre.length < 3) {
    elmErrorNombre.textContent = "Ingrese un nombre de al menos 3 caracteres";
    boolValido = false;
  }

  if (!validarRut(strRut)) {
    elmErrorRut.textContent = "Ingrese un RUT valido";
    boolValido = false;
  }

  if (!regCorreo.test(strCorreo)) {
    elmErrorCorreo.textContent = "Ingrese un correo valido";
    boolValido = false;
  }

  if (strTelefono.length < 9 || strTelefono.length > 12) {
    elmErrorTelefono.textContent = "Ingrese un telefono de 9 a 12 numeros";
    boolValido = false;
  }

  if (elmServicio.value === "") {
    elmErrorServicio.textContent = "Seleccione un servicio";
    boolValido = false;
  }

  if (elmNutricionista.value === "") {
    elmErrorNutricionista.textContent = "Seleccione un nutricionista";
    boolValido = false;
  }

  if (strFecha === "" || strFecha < obtenerFechaHoy()) {
    elmErrorFecha.textContent = "Seleccione una fecha actual o futura";
    boolValido = false;
  }

  if (elmHora.value === "") {
    elmErrorHora.textContent = "Seleccione una hora";
    boolValido = false;
  }

  if (strMotivo.length < 10 || strMotivo.length > 300) {
    elmErrorMotivo.textContent = "Escriba entre 10 y 300 caracteres";
    boolValido = false;
  }

  if (!elmConsentimiento.checked) {
    elmErrorConsentimiento.textContent = "Debe confirmar los datos";
    boolValido = false;
  }

  return boolValido;
}

function registrarCita(objEvento) {
  objEvento.preventDefault();

  const boolFormularioValido = validarFormulario();

  if (!boolFormularioValido) {
    return;
  }

  const objCita = {
    intId: Date.now(),
    strNombrePaciente: elmNombre.value.trim(),
    strRut: elmRut.value.trim(),
    strCorreo: elmCorreo.value.trim(),
    strTelefono: elmTelefono.value.trim(),
    strNombreServicio: elmServicio.options[elmServicio.selectedIndex].textContent,
    strNombreNutricionista: elmNutricionista.options[elmNutricionista.selectedIndex].textContent,
    strFecha: elmFecha.value,
    strHora: elmHora.value,
    strMotivo: elmMotivo.value.trim(),
    strEstado: "Pendiente"
  };

  const arrCitas = obtenerCitas();
  arrCitas.push(objCita);
  guardarCitas(arrCitas);

  alert("La cita fue guardada");
  window.location.href = "las-citas.html";
}

elmFecha.min = obtenerFechaHoy();
elmFormulario.addEventListener("submit", registrarCita);

/*
Prefijos=

str  = texto o String
int  = numero entero
num  = numero con o sin decimales
bool = verdadero o falso
arr  = arreglo o lista
obj  = objeto
elm  = elemento HTML
reg  = expresion regular

*/
