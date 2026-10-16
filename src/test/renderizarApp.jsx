import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { datosPrueba } from "./fixtures";
import { strClaveDatos } from "../data/persistencia";

// Prepara la aplicacion completa cuando la prueba necesita navegar entre vistas.
export function iniciar(
  strRuta = "/",
  strUsuario = "PAC001",
  objDatos = datosPrueba(),
) {
  localStorage.setItem(strClaveDatos, JSON.stringify(objDatos));
  if (strUsuario) sessionStorage.setItem("nutrivida_sesion", strUsuario);
  return {
    ...render(
      <MemoryRouter initialEntries={[strRuta]}>
        <App />
      </MemoryRouter>,
    ),
    objPersona: userEvent.setup(),
  };
}
