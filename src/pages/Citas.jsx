import { useState } from "react";
import { Link } from "react-router-dom";
import { citasVisibles, cambiarEstado } from "../data/operaciones";
import { arrNutricionistas } from "../data/catalogo";
import { fechaTexto } from "../utils/validaciones";
import Titulo from "../components/Titulo";
import Estado from "../components/Estado";
import Vacio from "../components/Vacio";
import Mensaje from "../components/Mensaje";
import Campo from "../components/Campo";
import Seleccion from "../components/Seleccion";
export default function Citas({ objDatos, objUsuario, ejecutar }) {
  const [strBusqueda, setBusqueda] = useState("");
  const [strEstado, setEstado] = useState("");
  const [strMensaje, setMensaje] = useState("");
  const [boolError, setError] = useState(false);
  const boolGestion = objUsuario.strRol !== "Paciente";
  const arrResultados = citasVisibles(objDatos, objUsuario)
    .filter(
      (objCita) =>
        (!strEstado || objCita.strEstado === strEstado) &&
        `${objCita.strServicioNombre} ${objDatos.arrUsuarios.find((objFila) => objFila.strId === objCita.strPacienteId)?.strNombre || ""}`
          .toLowerCase()
          .includes(strBusqueda.toLowerCase()),
    )
    .sort((objA, objB) =>
      (objA.strFecha + objA.strHora).localeCompare(
        objB.strFecha + objB.strHora,
      ),
    );
  function actualizar(strId, strNuevo) {
    if (
      strNuevo === "Cancelada" &&
      !window.confirm("Quieres cancelar esta cita?")
    )
      return;
    try {
      ejecutar((objCopia, objActor) =>
        cambiarEstado(objCopia, objActor, strId, strNuevo),
      );
      setError(false);
      setMensaje("Estado de la cita actualizado.");
    } catch (objError) {
      setError(true);
      setMensaje(objError.message);
    }
  }
  return (
    <>
      <Titulo
        strEtiqueta={boolGestion ? "GESTION DE ATENCIONES" : "TU AGENDA"}
        strTitulo={boolGestion ? "Agenda de citas" : "Mis citas"}
        strDescripcion="Consulta el estado de tus atenciones y organiza tus proximas visitas."
      >
        {objUsuario.strRol !== "Nutricionista" && (
          <Link className="btn btn-primary" to="/agendar">
            Nueva cita +
          </Link>
        )}
      </Titulo>
      <Mensaje
        strTexto={strMensaje}
        strTipo={boolError ? "danger" : "success"}
      />
      <section className="panel">
        <div className="row">
          <div className="col-md-8">
            <Campo
              strId="buscar-citas"
              strEtiqueta="Buscar cita"
              value={strBusqueda}
              onChange={(objEvento) => setBusqueda(objEvento.target.value)}
              placeholder="Servicio o paciente"
            />
          </div>
          <div className="col-md-4">
            <Seleccion
              strId="estado"
              strEtiqueta="Estado"
              value={strEstado}
              onChange={(objEvento) => setEstado(objEvento.target.value)}
            >
              <option value="">Todos los estados</option>
              {[
                "Pendiente",
                "Confirmada",
                "Reprogramacion",
                "Atendida",
                "Cancelada",
                "Inasistencia",
              ].map((strFila) => (
                <option key={strFila}>{strFila}</option>
              ))}
            </Seleccion>
          </div>
        </div>
        {!arrResultados.length ? (
          <Vacio strTexto="No hay citas para mostrar con estos filtros." />
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <caption className="visually-hidden">
                Listado de citas y acciones disponibles
              </caption>
              <thead>
                <tr>
                  <th>Atencion</th>
                  <th>Fecha y hora</th>
                  <th>Profesional</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {arrResultados.map((objCita) => {
                  const boolCerrada = [
                    "Cancelada",
                    "Atendida",
                    "Inasistencia",
                  ].includes(objCita.strEstado);
                  return (
                    <tr key={objCita.strId}>
                      <td>
                        <strong>{objCita.strServicioNombre}</strong>
                        {boolGestion && (
                          <small className="d-block text-secondary">
                            {
                              objDatos.arrUsuarios.find(
                                (objFila) =>
                                  objFila.strId === objCita.strPacienteId,
                              )?.strNombre
                            }
                          </small>
                        )}
                      </td>
                      <td className="text-nowrap">
                        {fechaTexto(objCita.strFecha)}
                        <small className="d-block text-secondary">
                          {objCita.strHora} hrs
                        </small>
                      </td>
                      <td>
                        {
                          arrNutricionistas.find(
                            (objNut) =>
                              objNut.strId === objCita.strNutricionistaId,
                          )?.strNombre
                        }
                      </td>
                      <td>
                        <Estado strEstado={objCita.strEstado} />
                      </td>
                      <td>
                        {!boolCerrada ? (
                          <div className="d-flex flex-wrap gap-1">
                            {objUsuario.strRol !== "Nutricionista" && (
                              <Link
                                className="btn btn-sm btn-outline-secondary"
                                to={`/agendar/${objCita.strId}`}
                              >
                                Reprogramar
                              </Link>
                            )}
                            {boolGestion && (
                              <select
                                className="form-select form-select-sm selector-estado"
                                aria-label={`Cambiar estado ${objCita.strId}`}
                                value=""
                                onChange={(objEvento) =>
                                  actualizar(
                                    objCita.strId,
                                    objEvento.target.value,
                                  )
                                }
                              >
                                <option value="" disabled>
                                  Gestionar
                                </option>
                                {[
                                  "Confirmada",
                                  "Cancelada",
                                  "Atendida",
                                  "Inasistencia",
                                ].map((strFila) => (
                                  <option key={strFila}>{strFila}</option>
                                ))}
                              </select>
                            )}
                            {!boolGestion && (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  actualizar(objCita.strId, "Cancelada")
                                }
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="small text-secondary">
                            Cita cerrada
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
