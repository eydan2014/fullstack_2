import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { iniciar } from "../test/renderizarApp";
import { strClaveDatos } from "../data/persistencia";

describe("Citas", () => {
  it("P07 cancela una cita propia conservando su registro RF07", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const { objPersona } = iniciar("/las-citas");
    await objPersona.click(
      screen.getByRole("button", { name: "Cancelar", exact: true }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Estado de la cita actualizado.",
    );
    const arrCitas = JSON.parse(localStorage.getItem(strClaveDatos)).arrCitas;
    expect(arrCitas).toHaveLength(1);
    expect(arrCitas[0].strEstado).toBe("Cancelada");
    expect(screen.getByText("Cita cerrada")).toBeInTheDocument();
  });
});
