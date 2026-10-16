import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { guardarCita, citasVisibles } from "../data/operaciones";
import { arrNutricionistas } from "../data/catalogo";
import {
  validarCita,
  precioTexto,
  fechaTexto,
  fechaHoy,
} from "../utils/validaciones";
import Campo from "../components/Campo";
import Seleccion from "../components/Seleccion";
import Titulo from "../components/Titulo";
import Mensaje from "../components/Mensaje";
export default function Agendar({ objDatos, objUsuario, ejecutar }) {
  const { strId } = useParams();
  const [objParametros] = useSearchParams();
  const fnNavegar = useNavigate();
  const objAnterior = strId
    ? citasVisibles(objDatos, objUsuario).find(
        (objFila) => objFila.strId === strId,
      )
    : null;
  const [objFormulario, setFormulario] = useState(
    objAnterior || {
      strPacienteId: objUsuario.strRol === "Paciente" ? objUsuario.strId : "",
      strServicioId: objParametros.get("servicio") || "",
      strNutricionistaId: "",
      strFecha: "",
      strHora: "",
      strMotivo: "",
    },
  );
  const [objErrores, setErrores] = useState({});
  const [strError, setError] = useState("");
  const [boolResumen, setResumen] = useState(false);
  const objServicio = objDatos.arrServicios.find(
    (objFila) => objFila.strId === objFormulario.strServicioId,
  );
  const objNut = arrNutricionistas.find(
    (objFila) => objFila.strId === objFormulario.strNutricionistaId,
  );
  const arrProfesionales = arrNutricionistas.filter((objNut) =>
    objDatos.arrUsuarios.some(
      (objFila) => objFila.strId === objNut.strId && objFila.boolActivo,
    ),
  );
  if (strId && !objAnterior)
    return (
      <>
        <Titulo strTitulo="Cita no encontrada" />
        <Link to="/las-citas">Volver a mis citas</Link>
      </>
    );
  function cambiar(strCampo, strValor) {
    setFormulario({ ...objFormulario, [strCampo]: strValor });
    setErrores({ ...objErrores, [strCampo]: "" });
    setError("");
  }
  function revisar(objEvento) {
    objEvento.preventDefault();
    const objResultado = validarCita(
      objFormulario,
      objDatos.arrCitas,
      arrProfesionales,
      objServicio,
      strId,
    );
    if (!objFormulario.strPacienteId)
      objResultado.strPacienteId = "Selecciona un paciente.";
    setErrores(objResultado);
    if (!Object.keys(objResultado).length) setResumen(true);
  }
  function confirmar() {
    try {
      let strGuardada;
      const objResultado = ejecutar((objCopia, objActor) => {
        const objValidacion = guardarCita(
          objCopia,
          objActor,
          objFormulario,
          strId,
        );
        if (!Object.keys(objValidacion).length)
          strGuardada = strId || objCopia.arrCitas.at(-1).strId;
        return objValidacion;
      });
      setErrores(objResultado);
      if (Object.keys(objResultado).length) {
        setResumen(false);
        return;
      }
      fnNavegar(`/solicitud/${strGuardada}`);
    } catch (objError) {
      setError(objError.message);
    }
  }
  return (
    <>
      <Titulo
        strEtiqueta="TU PROXIMO PASO"
        strTitulo={strId ? "Reprogramar cita" : "Agenda tu atencion"}
        strDescripcion="1. Selecciona tu atencion   /   2. Revisa y confirma"
      />
      <Mensaje strTexto={strError} strTipo="danger" />
      {boolResumen ? (
        <section className="panel detalle">
          <h2 className="h4">Revisa tu solicitud</h2>
          <dl className="row mt-4">
            <dt className="col-sm-4">Servicio</dt>
            <dd className="col-sm-8">{objServicio.strNombre}</dd>
            <dt className="col-sm-4">Profesional</dt>
            <dd className="col-sm-8">{objNut.strNombre}</dd>
            <dt className="col-sm-4">Fecha y hora</dt>
            <dd className="col-sm-8">
              {fechaTexto(objFormulario.strFecha)} a las {objFormulario.strHora}
            </dd>
            <dt className="col-sm-4">Valor de referencia</dt>
            <dd className="col-sm-8">{precioTexto(objServicio.numPrecio)}</dd>
            <dt className="col-sm-4">Motivo</dt>
            <dd className="col-sm-8">{objFormulario.strMotivo}</dd>
          </dl>
          <p className="small text-secondary">
            Al confirmar guardas una solicitud local. Recepcion debe confirmar
            el horario. No se realiza ningun cobro.
          </p>
          <div className="d-flex gap-2">
            <button className="btn btn-light" onClick={() => setResumen(false)}>
              Volver y corregir
            </button>
            <button className="btn btn-primary" onClick={confirmar}>
              Confirmar solicitud
            </button>
          </div>
        </section>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <form noValidate onSubmit={revisar} className="panel">
              {objUsuario.strRol !== "Paciente" && (
                <Seleccion
                  strId="paciente"
                  strEtiqueta="Paciente"
                  value={objFormulario.strPacienteId}
                  onChange={(objEvento) =>
                    cambiar("strPacienteId", objEvento.target.value)
                  }
                  strError={objErrores.strPacienteId}
                >
                  <option value="">Selecciona un paciente</option>
                  {objDatos.arrUsuarios
                    .filter(
                      (objFila) =>
                        objFila.strRol === "Paciente" && objFila.boolActivo,
                    )
                    .map((objFila) => (
                      <option key={objFila.strId} value={objFila.strId}>
                        {objFila.strNombre}
                      </option>
                    ))}
                </Seleccion>
              )}
              <Seleccion
                strId="servicio"
                strEtiqueta="Servicio o plan"
                value={objFormulario.strServicioId}
                onChange={(objEvento) =>
                  cambiar("strServicioId", objEvento.target.value)
                }
                strError={objErrores.strServicioId}
              >
                <option value="">Selecciona un servicio</option>
                {objDatos.arrServicios.map((objFila) => (
                  <option key={objFila.strId} value={objFila.strId}>
                    {objFila.strNombre} · {precioTexto(objFila.numPrecio)}
                  </option>
                ))}
              </Seleccion>
              <Seleccion
                strId="nutricionista"
                strEtiqueta="Nutricionista"
                value={objFormulario.strNutricionistaId}
                onChange={(objEvento) =>
                  cambiar("strNutricionistaId", objEvento.target.value)
                }
                strError={objErrores.strNutricionistaId}
              >
                <option value="">Selecciona un profesional</option>
                {arrProfesionales.map((objFila) => (
                  <option key={objFila.strId} value={objFila.strId}>
                    {objFila.strNombre}
                  </option>
                ))}
              </Seleccion>
              {objNut && (
                <p className="small horario">
                  Atencion: {objNut.strDias} · {objNut.strHorario}. Intervalos
                  de 15 min.
                </p>
              )}
              <div className="row">
                <div className="col-sm-6">
                  <Campo
                    strId="fecha"
                    strEtiqueta="Fecha"
                    strTipo="date"
                    min={fechaHoy()}
                    value={objFormulario.strFecha}
                    onChange={(objEvento) =>
                      cambiar("strFecha", objEvento.target.value)
                    }
                    strError={objErrores.strFecha}
                  />
                </div>
                <div className="col-sm-6">
                  <Campo
                    strId="hora"
                    strEtiqueta="Hora"
                    strTipo="time"
                    step="900"
                    value={objFormulario.strHora}
                    onChange={(objEvento) =>
                      cambiar("strHora", objEvento.target.value)
                    }
                    strError={objErrores.strHora}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="motivo" className="form-label">
                  Motivo de consulta
                </label>
                <textarea
                  id="motivo"
                  className={`form-control ${objErrores.strMotivo ? "is-invalid" : ""}`}
                  aria-invalid={!!objErrores.strMotivo}
                  aria-describedby={
                    objErrores.strMotivo ? "motivo-error" : undefined
                  }
                  rows="3"
                  maxLength="300"
                  value={objFormulario.strMotivo}
                  onChange={(objEvento) =>
                    cambiar("strMotivo", objEvento.target.value)
                  }
                />
                {objErrores.strMotivo && (
                  <div id="motivo-error" className="invalid-feedback">
                    {objErrores.strMotivo}
                  </div>
                )}
              </div>
              <button className="btn btn-primary" type="submit">
                Revisar solicitud →
              </button>
            </form>
          </div>
          <aside className="col-lg-4">
            <div className="panel panel-suave">
              <p className="etiqueta">ANTES DE AGENDAR</p>
              <h2 className="h4">Tu tiempo es importante</h2>
              <p>
                El sistema revisa los dias del profesional y evita cruces de
                horarios.
              </p>
              <p>Podras cancelar o reprogramar desde tus citas.</p>
              <p className="small text-secondary mb-0">
                Las teleconsultas CN004 requieren una consulta presencial previa
                atendida.
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
export function Resultado({ objDatos, objUsuario }) {
  const { strId } = useParams();
  const objCita = citasVisibles(objDatos, objUsuario).find(
    (objFila) => objFila.strId === strId,
  );
  if (!objCita)
    return (
      <>
        <Titulo strTitulo="Solicitud no encontrada" />
        <Link to="/las-citas">Ver mis citas</Link>
      </>
    );
  return (
    <section className="panel resultado">
      <div className="resultado-icono" aria-hidden="true">
        ✓
      </div>
      <p className="etiqueta">SOLICITUD REGISTRADA</p>
      <h1>Tu proxima atencion comienza aqui.</h1>
      <p>Recepcion revisara el horario solicitado.</p>
      <div className="resumen-cita">
        <strong>{objCita.strServicioNombre}</strong>
        <p>
          {fechaTexto(objCita.strFecha)} · {objCita.strHora} hrs
        </p>
        <p className="mb-0">
          Estado: {objCita.strEstado} · {precioTexto(objCita.numPrecio)}
        </p>
        <small>Codigo: {objCita.strId}</small>
      </div>
      <Link to="/las-citas" className="btn btn-primary">
        Ver mis citas
      </Link>
    </section>
  );
}
