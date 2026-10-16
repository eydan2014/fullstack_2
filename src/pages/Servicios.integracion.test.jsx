import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { iniciar } from "../test/renderizarApp";

describe("Servicios - integracion", () => {
  it("I02 actualiza los resultados cuando cambia el filtro de busqueda RF04", async () => {
    const { objPersona } = iniciar("/servicios");
    expect(screen.getByRole("status")).toHaveTextContent("18 servicios");
    await objPersona.type(
      screen.getByLabelText("Buscar servicio"),
      "bioimpedanciometria",
    );
    expect(screen.getByRole("status")).toHaveTextContent("2 servicios");
    await objPersona.clear(screen.getByLabelText("Buscar servicio"));
    await objPersona.type(screen.getByLabelText("Buscar servicio"), "zzzzzz");
    expect(screen.getByText(/No encontramos servicios/)).toBeInTheDocument();
  });
});
