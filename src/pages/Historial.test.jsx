import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { iniciar } from "../test/renderizarApp";
import { strClaveDatos } from "../data/persistencia";

describe("Historial", () => {
  it("P08 guarda una medicion del paciente asignado y calcula su IMC RF10", async () => {
    const { objPersona } = iniciar("/fichas", "NUT001");
    await objPersona.type(screen.getByLabelText("Peso (kg)"), "72");
    await objPersona.type(screen.getByLabelText("Estatura (cm)"), "180");
    await objPersona.type(screen.getByLabelText("Cintura (cm)"), "80");
    await objPersona.click(
      screen.getByRole("button", { name: "Guardar medicion" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent("Medicion guardada");
    const arrMediciones = JSON.parse(
      localStorage.getItem(strClaveDatos),
    ).arrMediciones;
    expect(arrMediciones).toHaveLength(2);
    expect(arrMediciones.at(-1).numImc).toBe(22.22);
    expect(arrMediciones.at(-1).strPacienteId).toBe("PAC001");
  });
});
