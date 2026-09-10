const strClaveCitas = "nutrivida_citas";

function obtenerCitas() {
  const strDatosGuardados = localStorage.getItem(strClaveCitas);
  let arrCitas = [];

  if (strDatosGuardados !== null) {
    arrCitas = JSON.parse(strDatosGuardados);
  }

  return arrCitas;
}

function guardarCitas(arrCitas) {
  const strCitas = JSON.stringify(arrCitas);
  localStorage.setItem(strClaveCitas, strCitas);
}

function obtenerFechaHoy() {
  const objFecha = new Date();
  const intAnio = objFecha.getFullYear();
  const strMes = String(objFecha.getMonth() + 1).padStart(2, "0");
  const strDia = String(objFecha.getDate()).padStart(2, "0");

  return `${intAnio}-${strMes}-${strDia}`;
}

function formatearFecha(strFecha) {
  const arrFecha = strFecha.split("-");
  return `${arrFecha[2]}-${arrFecha[1]}-${arrFecha[0]}`;
}
