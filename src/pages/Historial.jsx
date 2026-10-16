import { useState } from "react";
import {
  pacientesVisibles,
  guardarMedicion,
  guardarPlan,
} from "../data/operaciones";
import Titulo from "../components/Titulo";
import Campo from "../components/Campo";
import Seleccion from "../components/Seleccion";
import Mensaje from "../components/Mensaje";
import Vacio from "../components/Vacio";
import { fechaHoy, fechaTexto } from "../utils/validaciones";
export default function Historial({ objDatos, objUsuario, ejecutar }) {
  const boolProfesional = objUsuario.strRol !== "Paciente";
  const arrPacientes = boolProfesional
    ? pacientesVisibles(objDatos, objUsuario)
    : [objUsuario];
  const [strPacienteId, setPaciente] = useState(arrPacientes[0]?.strId || "");
  const [objFormulario, setFormulario] = useState({
    strFecha: fechaHoy(),
    numPeso: "",
    numAltura: "",
    numCintura: "",
  });
  const [strMedicionId, setMedicionId] = useState("");
  const [objErrores, setErrores] = useState({});
  const [strPlan, setPlan] = useState("");
  const [strMensaje, setMensaje] = useState("");
  const [boolError, setError] = useState(false);
  const arrMediciones = objDatos.arrMediciones
    .filter(
      (objFila) =>
        objFila.strPacienteId === strPacienteId &&
        (objUsuario.strRol !== "Nutricionista" ||
          objFila.strNutricionistaId === objUsuario.strId),
    )
    .sort((objA, objB) => objA.strFecha.localeCompare(objB.strFecha));
  const arrPlanes = objDatos.arrPlanes
    .filter(
      (objFila) =>
        objFila.strPacienteId === strPacienteId &&
        (objUsuario.strRol !== "Nutricionista" ||
          objFila.strNutricionistaId === objUsuario.strId),
    )
    .slice()
    .reverse();
  const objUltima = arrMediciones.at(-1);
  function cambiar(strCampo, strValor) {
    setFormulario({ ...objFormulario, [strCampo]: strValor });
    setErrores({ ...objErrores, [strCampo]: "" });
  }
  function limpiar() {
    setFormulario({
      strFecha: fechaHoy(),
      numPeso: "",
      numAltura: "",
      numCintura: "",
    });
    setMedicionId("");
    setErrores({});
  }
  function guardar(objEvento) {
    objEvento.preventDefault();
    try {
      const objResultado = ejecutar((objCopia, objActor) =>
        guardarMedicion(
          objCopia,
          objActor,
          { ...objFormulario, strPacienteId },
          strMedicionId,
        ),
      );
      setErrores(objResultado);
      if (Object.keys(objResultado).length) return;
      limpiar();
      setError(false);
      setMensaje("Medicion guardada correctamente.");
    } catch (objError) {
      setError(true);
      setMensaje(objError.message);
    }
  }
  function publicar(objEvento) {
    objEvento.preventDefault();
    try {
      ejecutar((objCopia, objActor) =>
        guardarPlan(objCopia, objActor, strPacienteId, strPlan),
      );
      setPlan("");
      setError(false);
      setMensaje("Plan alimenticio guardado.");
    } catch (objError) {
      setError(true);
      setMensaje(objError.message);
    }
  }
  return (
    <>
      <Titulo
        strEtiqueta="SEGUIMIENTO NUTRICIONAL"
        strTitulo={boolProfesional ? "Fichas de pacientes" : "Mi progreso"}
        strDescripcion="Mediciones y planes registrados durante las atenciones."
      />
      <Mensaje
        strTexto={strMensaje}
        strTipo={boolError ? "danger" : "success"}
      />
      {boolProfesional && (
        <section className="panel mb-4">
          <Seleccion
            strId="paciente-ficha"
            strEtiqueta="Paciente asignado"
            value={strPacienteId}
            onChange={(objEvento) => {
              setPaciente(objEvento.target.value);
              limpiar();
              setPlan("");
              setMensaje("");
            }}
          >
            <option value="">Selecciona un paciente</option>
            {arrPacientes.map((objFila) => (
              <option key={objFila.strId} value={objFila.strId}>
                {objFila.strNombre}
              </option>
            ))}
          </Seleccion>
        </section>
      )}
      {!strPacienteId ? (
        <Vacio strTexto="No hay pacientes asignados con una cita activa." />
      ) : (
        <>
          <div className="row g-3 mb-4">
            {[
              ["Peso", objUltima ? `${objUltima.numPeso} kg` : "Sin registro"],
              [
                "Estatura",
                objUltima ? `${objUltima.numAltura} cm` : "Sin registro",
              ],
              ["IMC", objUltima ? objUltima.numImc : "Sin registro"],
            ].map(([strEtiqueta, strValor]) => (
              <div className="col-sm-4" key={strEtiqueta}>
                <div className="panel">
                  <p className="etiqueta">{strEtiqueta}</p>
                  <strong className="h3">{strValor}</strong>
                </div>
              </div>
            ))}
          </div>
          <div className="row g-4">
            {boolProfesional && (
              <div className="col-lg-4">
                <form className="panel" onSubmit={guardar} noValidate>
                  <h2 className="h5">
                    {strMedicionId ? "Editar medicion" : "Registrar medicion"}
                  </h2>
                  <Campo
                    strId="fecha-medicion"
                    strEtiqueta="Fecha de medicion"
                    strTipo="date"
                    max={fechaHoy()}
                    value={objFormulario.strFecha}
                    onChange={(objEvento) =>
                      cambiar("strFecha", objEvento.target.value)
                    }
                    strError={objErrores.strFecha}
                  />
                  {[
                    ["numPeso", "Peso (kg)"],
                    ["numAltura", "Estatura (cm)"],
                    ["numCintura", "Cintura (cm)"],
                  ].map(([strCampo, strEtiqueta]) => (
                    <Campo
                      key={strCampo}
                      strId={strCampo}
                      strEtiqueta={strEtiqueta}
                      strTipo="number"
                      step="0.1"
                      value={objFormulario[strCampo]}
                      onChange={(objEvento) =>
                        cambiar(strCampo, objEvento.target.value)
                      }
                      strError={objErrores[strCampo]}
                    />
                  ))}
                  <button className="btn btn-primary" type="submit">
                    Guardar medicion
                  </button>
                  {strMedicionId && (
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={limpiar}
                    >
                      Cancelar edicion
                    </button>
                  )}
                </form>
              </div>
            )}
            <section className={boolProfesional ? "col-lg-8" : "col-12"}>
              <div className="panel h-100">
                <h2 className="h5">Historial de mediciones</h2>
                {!arrMediciones.length ? (
                  <Vacio strTexto="Todavia no hay mediciones registradas." />
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <caption className="small">
                        IMC = peso / estatura en metros al cuadrado. Valor de
                        seguimiento, sin diagnostico automatico.
                      </caption>
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Peso kg</th>
                          <th>Estatura cm</th>
                          <th>Cintura cm</th>
                          <th>IMC</th>
                          {boolProfesional && <th>Acciones</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {arrMediciones.map((objFila) => (
                          <tr key={objFila.strId}>
                            <td>{fechaTexto(objFila.strFecha)}</td>
                            <td>{objFila.numPeso}</td>
                            <td>{objFila.numAltura}</td>
                            <td>{objFila.numCintura}</td>
                            <td>{objFila.numImc}</td>
                            {boolProfesional && (
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => {
                                    setFormulario(objFila);
                                    setMedicionId(objFila.strId);
                                    setErrores({});
                                  }}
                                >
                                  Editar
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </div>
          <div className="row g-4 mt-1">
            {boolProfesional && (
              <section className="col-lg-4">
                <form className="panel" onSubmit={publicar}>
                  <h2 className="h5">Registrar plan alimenticio</h2>
                  <label className="form-label" htmlFor="plan">
                    Contenido del plan
                  </label>
                  <textarea
                    className="form-control mb-3"
                    id="plan"
                    rows="7"
                    maxLength="3000"
                    value={strPlan}
                    onChange={(objEvento) => setPlan(objEvento.target.value)}
                  />
                  <button className="btn btn-primary" type="submit">
                    Guardar plan
                  </button>
                </form>
              </section>
            )}
            <section className={boolProfesional ? "col-lg-8" : "col-12"}>
              <div className="panel">
                <h2 className="h5">Planes alimenticios</h2>
                {!arrPlanes.length ? (
                  <Vacio strTexto="Tu profesional aun no ha registrado un plan." />
                ) : (
                  arrPlanes.map((objFila) => (
                    <article key={objFila.strId} className="plan">
                      <small className="text-secondary">
                        {fechaTexto(objFila.strFecha)} ·{" "}
                        {
                          objDatos.arrUsuarios.find(
                            (objUsuario) =>
                              objUsuario.strId === objFila.strNutricionistaId,
                          )?.strNombre
                        }
                      </small>
                      <p className="mb-0 texto-plan">{objFila.strContenido}</p>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </>
  );
}
