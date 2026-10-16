import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Campo from "./Campo";

describe("Campo", () => {
  it("P03 muestra el error de un campo obligatorio RNF02", () => {
    render(<Campo strId="correo" strEtiqueta="Correo" strError="Correo obligatorio." />);
    expect(screen.getByLabelText("Correo")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Correo obligatorio.")).toBeInTheDocument();
  });
});
