import { describe, it, expect } from "vitest";
import { validarCita } from "./validaciones";
import { arrNutricionistas, arrServiciosIniciales } from "../data/catalogo";
import { citaPrueba } from "../test/fixtures";

describe("Disponibilidad de citas", () => {
  it("P10 rechaza una solicitud que se cruza con otra reserva RF06", () => {
    const objSolicitud = citaPrueba();
    const arrReservas = [
      {
        ...objSolicitud,
        strId: "CITA-OCUPADA",
        strPacienteId: "PAC002",
        strHora: "13:45",
        intDuracion: 30,
        strEstado: "Confirmada",
      },
    ];
    const objErrores = validarCita(
      objSolicitud,
      arrReservas,
      arrNutricionistas,
      arrServiciosIniciales.find((objFila) => objFila.strId === "CN002"),
    );
    expect(objErrores.strHora).toMatch(/ya tiene una cita/);
  });
});
