const elmCuerpoSecretaria = document.querySelector("#cuerpo-secretaria");
const elmSinSolicitudes = document.querySelector("#sin-solicitudes");
const elmTotalCitas = document.querySelector("#total-citas");
const elmTotalPendientes = document.querySelector("#total-pendientes");
const elmTotalConfirmadas = document.querySelector("#total-confirmadas");

function agregarCeldaSecretaria(elmFila, strTexto) {
  const elmCelda = document.createElement("td");
  elmCelda.textContent = strTexto;
  elmFila.appendChild(elmCelda);
}

function cambiarEstado(objEvento) {
  const intIndice = Number(objEvento.target.value);
  const elmEstado = document.querySelector(`#estado-${intIndice}`);
  const arrCitas = obtenerCitas();

  arrCitas[intIndice].strEstado = elmEstado.value;
  guardarCitas(arrCitas);
  mostrarSolicitudes();
  alert("El estado fue actualizado");
}

function actualizarResumen(arrCitas) {
  let intPendientes = 0;
  let intConfirmadas = 0;

  for (const objCita of arrCitas) {
    if (objCita.strEstado === "Pendiente" || objCita.strEstado === "Reprogramacion solicitada") {
      intPendientes++;
    }

    if (objCita.strEstado === "Confirmada") {
      intConfirmadas++;
    }
  }

  elmTotalCitas.textContent = arrCitas.length;
  elmTotalPendientes.textContent = intPendientes;
  elmTotalConfirmadas.textContent = intConfirmadas;
}

function mostrarSolicitudes() {
  const arrCitas = obtenerCitas();
  const arrEstados = ["Pendiente", "Confirmada", "Cancelada", "Reprogramacion solicitada"];
  elmCuerpoSecretaria.innerHTML = "";
  actualizarResumen(arrCitas);

  if (arrCitas.length === 0) {
    elmSinSolicitudes.style.display = "block";
    return;
  }

  elmSinSolicitudes.style.display = "none";

  for (let intIndice = 0; intIndice < arrCitas.length; intIndice++) {
    const objCita = arrCitas[intIndice];
    const elmFila = document.createElement("tr");

    agregarCeldaSecretaria(elmFila, objCita.strNombrePaciente);
    agregarCeldaSecretaria(elmFila, objCita.strNombreServicio);
    agregarCeldaSecretaria(elmFila, objCita.strNombreNutricionista);
    agregarCeldaSecretaria(elmFila, `${formatearFecha(objCita.strFecha)} ${objCita.strHora}`);

    const elmCeldaEstado = document.createElement("td");
    const elmEstado = document.createElement("select");
    elmEstado.id = `estado-${intIndice}`;

    for (const strEstado of arrEstados) {
      const elmOpcion = document.createElement("option");
      elmOpcion.value = strEstado;
      elmOpcion.textContent = strEstado;

      if (strEstado === objCita.strEstado) {
        elmOpcion.selected = true;
      }

      elmEstado.appendChild(elmOpcion);
    }

    elmCeldaEstado.appendChild(elmEstado);
    elmFila.appendChild(elmCeldaEstado);

    const elmCeldaAccion = document.createElement("td");
    const elmBotonGuardar = document.createElement("button");
    elmBotonGuardar.textContent = "Guardar";
    elmBotonGuardar.type = "button";
    elmBotonGuardar.value = intIndice;
    elmBotonGuardar.addEventListener("click", cambiarEstado);
    elmCeldaAccion.appendChild(elmBotonGuardar);
    elmFila.appendChild(elmCeldaAccion);
    elmCuerpoSecretaria.appendChild(elmFila);
  }
}

mostrarSolicitudes();
