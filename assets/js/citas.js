const elmCuerpoCitas = document.querySelector("#cuerpo-citas");
const elmSinCitas = document.querySelector("#sin-citas");

function agregarCelda(elmFila, strTexto) {
  const elmCelda = document.createElement("td");
  elmCelda.textContent = strTexto;
  elmFila.appendChild(elmCelda);
}

function cancelarCita(objEvento) {
  const intIndice = Number(objEvento.target.value);
  const arrCitas = obtenerCitas();
  const boolCancelar = confirm("Desea cancelar esta cita?");

  if (boolCancelar) {
    arrCitas[intIndice].strEstado = "Cancelada";
    guardarCitas(arrCitas);
    mostrarCitas();
  }
}

function reprogramarCita(objEvento) {
  const intIndice = Number(objEvento.target.value);
  const arrCitas = obtenerCitas();
  const objCita = arrCitas[intIndice];
  const strNuevaFecha = prompt("Ingrese la nueva fecha con formato AAAA-MM-DD", objCita.strFecha);
  const regFecha = /^\d{4}-\d{2}-\d{2}$/;

  if (strNuevaFecha === null) {
    return;
  }

  if (!regFecha.test(strNuevaFecha) || strNuevaFecha < obtenerFechaHoy()) {
    alert("La fecha ingresada no es valida");
    return;
  }

  const strNuevaHora = prompt("Ingrese la nueva hora con formato HH:MM", objCita.strHora);
  const regHora = /^([01]\d|2[0-3]):[0-5]\d$/;

  if (strNuevaHora === null) {
    return;
  }

  if (!regHora.test(strNuevaHora)) {
    alert("La hora ingresada no es valida");
    return;
  }

  objCita.strFecha = strNuevaFecha;
  objCita.strHora = strNuevaHora;
  objCita.strEstado = "Reprogramacion solicitada";
  guardarCitas(arrCitas);
  mostrarCitas();
}

function mostrarCitas() {
  const arrCitas = obtenerCitas();
  elmCuerpoCitas.innerHTML = "";

  if (arrCitas.length === 0) {
    elmSinCitas.style.display = "block";
    return;
  }

  elmSinCitas.style.display = "none";

  for (let intIndice = 0; intIndice < arrCitas.length; intIndice++) {
    const objCita = arrCitas[intIndice];
    const elmFila = document.createElement("tr");

    agregarCelda(elmFila, objCita.strNombrePaciente);
    agregarCelda(elmFila, objCita.strNombreServicio);
    agregarCelda(elmFila, objCita.strNombreNutricionista);
    agregarCelda(elmFila, formatearFecha(objCita.strFecha));
    agregarCelda(elmFila, objCita.strHora);
    agregarCelda(elmFila, objCita.strEstado);

    const elmCeldaAcciones = document.createElement("td");
    const elmBotonReprogramar = document.createElement("button");
    const elmBotonCancelar = document.createElement("button");

    elmBotonReprogramar.textContent = "Reprogramar";
    elmBotonReprogramar.type = "button";
    elmBotonReprogramar.value = intIndice;
    elmBotonReprogramar.classList.add("boton-secundario");
    elmBotonReprogramar.addEventListener("click", reprogramarCita);

    elmBotonCancelar.textContent = "Cancelar";
    elmBotonCancelar.type = "button";
    elmBotonCancelar.value = intIndice;
    elmBotonCancelar.classList.add("boton-cancelar");
    elmBotonCancelar.addEventListener("click", cancelarCita);

    if (objCita.strEstado === "Cancelada") {
      elmBotonReprogramar.disabled = true;
      elmBotonCancelar.disabled = true;
    }

    elmCeldaAcciones.appendChild(elmBotonReprogramar);
    elmCeldaAcciones.appendChild(elmBotonCancelar);
    elmFila.appendChild(elmCeldaAcciones);
    elmCuerpoCitas.appendChild(elmFila);
  }
}

mostrarCitas();
