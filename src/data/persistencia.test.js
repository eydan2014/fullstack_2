import { describe, it, expect, vi } from "vitest";
import { guardarDatos, strClaveDatos } from "./persistencia";

describe("Persistencia", () => {
  it("P09 guarda el JSON con la clave correcta usando un spy RF15", () => {
    const fnEspia = vi.spyOn(Storage.prototype, "setItem");
    const objDatos = { arrCitas: [{ strId: "CITA-PRUEBA" }] };
    guardarDatos(objDatos);
    expect(fnEspia).toHaveBeenCalledWith(
      strClaveDatos,
      JSON.stringify(objDatos),
    );
  });
});
