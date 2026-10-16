import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Seleccion from "./Seleccion";

describe("Seleccion", () => {
  it("P05 muestra la etiqueta y opcion del selector RF05", () => {
    render(
      <Seleccion strId="servicio" strEtiqueta="Servicio">
        <option value="CN001">Consulta inicial</option>
      </Seleccion>,
    );
    expect(screen.getByRole("combobox", { name: "Servicio" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Consulta inicial" })).toHaveValue("CN001");
  });
});
