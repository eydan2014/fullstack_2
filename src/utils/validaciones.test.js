import { describe, it, expect } from "vitest";
import { correoValido, rutValido, calcularImc, validarCita } from "./validaciones";

describe("Validaciones unitarias", () => {
  // ---------- Prueba P06: correo ----------
  it("P06 acepta un correo valido y rechaza uno incompleto RF01", () => {
    expect(correoValido("paciente@nutrivida.example")).toBe(true);
    expect(correoValido("paciente@")).toBe(false);
  });

  // ---------- Prueba P07: RUT ----------
  it("P07 comprueba el digito verificador del RUT RF01", () => {
    expect(rutValido("12.345.678-5")).toBe(true);
    expect(rutValido("12.345.678-0")).toBe(false);
  });

  // ---------- Prueba P08: IMC ----------
  it("P08 calcula el IMC usando peso y altura RF10", () => {
    expect(calcularImc(72, 180)).toBe(22.22);
  });

  // ---------- Prueba P10: disponibilidad ----------
  it("P10 rechaza una cita que se cruza con otra reserva RF06", () => {
    const objSolicitud = {
      strPacienteId: "PAC001",
      strNutricionistaId: "NUT001",
      strFecha: "2099-01-05",
      strHora: "14:00",
      strMotivo: "Control de seguimiento",
    };
    const arrReservas = [{
      ...objSolicitud,
      strId: "CITA-PRUEBA",
      strPacienteId: "PAC002",
      strHora: "13:45",
      intDuracion: 30,
      strEstado: "Confirmada",
    }];
    const arrNutricionistas = [{
      strId: "NUT001",
      arrDias: [0, 1, 2, 3, 4, 5, 6],
      intInicio: 9,
      intFin: 18,
    }];
    const objErrores = validarCita(
      objSolicitud,
      arrReservas,
      arrNutricionistas,
      { strDuracion: "30 minutos" },
    );
    expect(objErrores.strHora).toBe(
      "El paciente o profesional ya tiene una cita en ese horario.",
    );
  });
});
