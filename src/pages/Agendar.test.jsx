import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { iniciar } from "../test/renderizarApp";
import { lunesFuturo } from "../test/fixtures";
import { strClaveDatos } from "../data/persistencia";

describe("Agendar", () => {
  it("P05 impide continuar con una solicitud incompleta RF06", async () => {
    const { objPersona } = iniciar("/agendar");
    await objPersona.click(
      screen.getByRole("button", { name: /Revisar solicitud/ }),
    );
    expect(
      screen.getByText("Selecciona un servicio disponible."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Confirmar solicitud" }),
    ).toBeNull();
    expect(
      JSON.parse(localStorage.getItem(strClaveDatos)).arrCitas,
    ).toHaveLength(1);
  });

  it("P06 registra una solicitud valida y muestra su comprobante RF05", async () => {
    const { objPersona } = iniciar("/agendar");
    await objPersona.selectOptions(
      screen.getByLabelText("Servicio o plan"),
      "CN002",
    );
    await objPersona.selectOptions(
      screen.getByLabelText("Nutricionista"),
      "NUT001",
    );
    fireEvent.change(screen.getByLabelText("Fecha"), {
      target: { value: lunesFuturo() },
    });
    fireEvent.change(screen.getByLabelText("Hora"), {
      target: { value: "14:00" },
    });
    await objPersona.type(
      screen.getByLabelText("Motivo de consulta"),
      "Control de seguimiento",
    );
    await objPersona.click(
      screen.getByRole("button", { name: /Revisar solicitud/ }),
    );
    expect(
      screen.getByRole("heading", { name: "Revisa tu solicitud" }),
    ).toBeInTheDocument();
    await objPersona.click(
      screen.getByRole("button", { name: "Confirmar solicitud" }),
    );
    expect(
      screen.getByRole("heading", {
        name: "Tu proxima atencion comienza aqui.",
      }),
    ).toBeInTheDocument();
    const arrCitas = JSON.parse(localStorage.getItem(strClaveDatos)).arrCitas;
    expect(arrCitas).toHaveLength(2);
    expect(arrCitas.at(-1).strEstado).toBe("Pendiente");
  });
});
