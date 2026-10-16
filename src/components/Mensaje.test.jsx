import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Mensaje from "./Mensaje";

describe("Mensaje", () => {
  it("P02 muestra el error solamente cuando existe un mensaje RNF02", () => {
    const { rerender } = render(<Mensaje strTexto="" strTipo="danger" />);
    expect(screen.queryByRole("alert")).toBeNull();
    rerender(
      <Mensaje strTexto="Revisa los datos del formulario." strTipo="danger" />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Revisa los datos del formulario.",
    );
  });
});
