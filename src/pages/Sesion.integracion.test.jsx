import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { iniciar } from "../test/renderizarApp";

describe("Sesion - integracion", () => {
  it("I01 permite iniciar y cerrar la sesion de una cuenta activa RF02", async () => {
    const { objPersona } = iniciar("/sesion", "");
    await objPersona.click(
      screen.getByRole("button", { name: "Paciente", exact: true }),
    );
    await objPersona.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(
      screen.getByRole("heading", { name: /Hola, Alex/ }),
    ).toBeInTheDocument();
    expect(sessionStorage.getItem("nutrivida_sesion")).toBe("PAC001");
    await objPersona.click(screen.getByRole("button", { name: "Salir" }));
    expect(
      screen.getByRole("heading", { name: "Inicia sesion" }),
    ).toBeInTheDocument();
    expect(sessionStorage.getItem("nutrivida_sesion")).toBeNull();
  });
});
