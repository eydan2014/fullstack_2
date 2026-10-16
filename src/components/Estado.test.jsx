import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Estado from "./Estado";

describe("Estado", () => {
  it("P04 muestra el estado recibido de la cita RF09", () => {
    render(<Estado strEstado="Pendiente" />);
    expect(screen.getByText("Pendiente")).toHaveClass("estado-pendiente");
  });
});
