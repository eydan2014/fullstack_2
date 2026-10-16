import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TarjetaServicio from "./TarjetaServicio";
import { arrServiciosIniciales } from "../data/catalogo";

describe("TarjetaServicio", () => {
  it("P01 muestra el servicio recibido mediante props RF04", () => {
    const objServicio = {
      ...arrServiciosIniciales[0],
      strId: "CN099",
      strNombre: "Consulta de prueba",
      numPrecio: 24000,
    };
    render(
      <MemoryRouter>
        <TarjetaServicio objServicio={objServicio} />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: "Consulta de prueba" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/24\.000/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver detalle" })).toHaveAttribute(
      "href",
      "/servicios/CN099",
    );
  });
});
