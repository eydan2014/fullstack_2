import { useState } from "react";
import {
  registrarUsuario,
  alternarUsuario,
  guardarServicio,
  eliminarServicio,
} from "../data/operaciones";
import Titulo from "../components/Titulo";
import Campo from "../components/Campo";
import Seleccion from "../components/Seleccion";
import Mensaje from "../components/Mensaje";
import { precioTexto } from "../utils/validaciones";
export default function Administracion({ objDatos, ejecutar }) {
  const [strPestana, setPestana] = useState("usuarios");
  const intAtendidas = objDatos.arrCitas.filter(
    (objFila) => objFila.strEstado === "Atendida",
  ).length;
  const intAusentes = objDatos.arrCitas.filter(
    (objFila) => objFila.strEstado === "Inasistencia",
  ).length;
  const intCerradas = intAtendidas + intAusentes;
  return (
    <>
      <Titulo
        strEtiqueta="PANEL ADMINISTRATIVO"
        strTitulo="Gestion de NutriVida"
        strDescripcion="Usuarios, catalogo y resumen de atenciones."
      />
      <div className="row g-3 mb-4">
        {[
          [
            "Usuarios activos",
            objDatos.arrUsuarios.filter((objFila) => objFila.boolActivo).length,
          ],
          ["Atenciones realizadas", intAtendidas],
          [
            "Tasa de inasistencia",
            intCerradas
              ? `${((intAusentes / intCerradas) * 100).toFixed(1)} %`
              : "Sin atenciones cerradas",
          ],
        ].map(([strTitulo, strValor]) => (
          <div className="col-md-4" key={strTitulo}>
            <div className="panel">
              <p className="etiqueta">{strTitulo}</p>
              <strong className="h4">{strValor}</strong>
            </div>
          </div>
        ))}
      </div>
      <div
        className="nav nav-pills gap-2 mb-4"
        role="tablist"
        aria-label="Administracion"
      >
        {[
          ["usuarios", "Usuarios"],
          ["servicios", "Servicios"],
          ["reportes", "Reportes"],
        ].map(([strId, strTexto]) => (
          <button
            role="tab"
            aria-selected={strPestana === strId}
            className={`nav-link ${strPestana === strId ? "active" : ""}`}
            key={strId}
            onClick={() => setPestana(strId)}
          >
            {strTexto}
          </button>
        ))}
      </div>
      {strPestana === "usuarios" ? (
        <Usuarios objDatos={objDatos} ejecutar={ejecutar} />
      ) : strPestana === "servicios" ? (
        <ServiciosAdmin objDatos={objDatos} ejecutar={ejecutar} />
      ) : (
        <div className="panel">
          <h2 className="h5">Distribucion de citas por profesional</h2>
          {objDatos.arrUsuarios
            .filter((objFila) => objFila.strRol === "Nutricionista")
            .map((objNut) => (
              <div
                className="d-flex justify-content-between border-bottom py-3"
                key={objNut.strId}
              >
                <span>{objNut.strNombre}</span>
                <strong>
                  {
                    objDatos.arrCitas.filter(
                      (objCita) => objCita.strNutricionistaId === objNut.strId,
                    ).length
                  }
                </strong>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
function Usuarios({ objDatos, ejecutar }) {
  const objVacio = {
    strNombre: "",
    strCorreo: "",
    strClave: "",
    strRut: "",
    strTelefono: "",
    strRol: "Paciente",
  };
  const [objFormulario, setFormulario] = useState(objVacio);
  const [strId, setId] = useState("");
  const [objErrores, setErrores] = useState({});
  const [strMensaje, setMensaje] = useState("");
  const [boolError, setError] = useState(false);
  const [strBusqueda, setBusqueda] = useState("");
  function cambiar(strCampo, strValor) {
    setFormulario({ ...objFormulario, [strCampo]: strValor });
    setErrores({ ...objErrores, [strCampo]: "" });
  }
  function enviar(objEvento) {
    objEvento.preventDefault();
    try {
      const objResultado = ejecutar((objCopia, objActor) =>
        registrarUsuario(objCopia, objFormulario, objActor, strId),
      );
      setErrores(objResultado);
      if (Object.keys(objResultado).length) return;
      setFormulario(objVacio);
      setId("");
      setError(false);
      setMensaje("Usuario guardado.");
    } catch (objError) {
      setError(true);
      setMensaje(objError.message);
    }
  }
  function alternar(strUsuarioId) {
    try {
      ejecutar((objCopia, objActor) =>
        alternarUsuario(objCopia, objActor, strUsuarioId),
      );
      setError(false);
      setMensaje("Estado del usuario actualizado.");
    } catch (objError) {
      setError(true);
      setMensaje(objError.message);
    }
  }
  return (
    <>
      <Mensaje
        strTexto={strMensaje}
        strTipo={boolError ? "danger" : "success"}
      />
      <div className="row g-4">
        <section className="col-xl-4">
          <form noValidate className="panel" onSubmit={enviar}>
            <h2 className="h5">{strId ? "Editar usuario" : "Crear usuario"}</h2>
            {[
              ["strNombre", "Nombre"],
              ["strCorreo", "Correo"],
              ["strClave", strId ? "Nueva clave (opcional)" : "Clave"],
              ["strRut", "RUT"],
              ["strTelefono", "Telefono"],
            ].map(([strCampo, strEtiqueta]) => (
              <Campo
                key={strCampo}
                strId={`admin-${strCampo}`}
                strEtiqueta={strEtiqueta}
                strTipo={strCampo === "strClave" ? "password" : "text"}
                value={objFormulario[strCampo]}
                onChange={(objEvento) =>
                  cambiar(strCampo, objEvento.target.value)
                }
                strError={objErrores[strCampo]}
              />
            ))}
            <Seleccion
              strId="rol"
              strEtiqueta="Rol"
              value={objFormulario.strRol}
              onChange={(objEvento) =>
                cambiar("strRol", objEvento.target.value)
              }
              strError={objErrores.strRol}
            >
              {["Paciente", "Secretaria", "Administrador", "Nutricionista"].map(
                (strFila) => (
                  <option key={strFila}>{strFila}</option>
                ),
              )}
            </Seleccion>
            <button className="btn btn-primary" type="submit">
              Guardar usuario
            </button>
            {strId && (
              <button
                className="btn btn-link"
                type="button"
                onClick={() => {
                  setId("");
                  setFormulario(objVacio);
                  setErrores({});
                }}
              >
                Cancelar
              </button>
            )}
          </form>
        </section>
        <section className="col-xl-8">
          <div className="panel">
            <Campo
              strId="buscar-usuario"
              strEtiqueta="Buscar usuario"
              value={strBusqueda}
              onChange={(objEvento) => setBusqueda(objEvento.target.value)}
            />
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {objDatos.arrUsuarios
                    .filter((objFila) =>
                      `${objFila.strNombre} ${objFila.strCorreo}`
                        .toLowerCase()
                        .includes(strBusqueda.toLowerCase()),
                    )
                    .map((objFila) => (
                      <tr key={objFila.strId}>
                        <td>
                          {objFila.strNombre}
                          <small className="d-block text-secondary">
                            {objFila.strCorreo}
                          </small>
                        </td>
                        <td>{objFila.strRol}</td>
                        <td>{objFila.boolActivo ? "Activo" : "Inactivo"}</td>
                        <td>
                          <div className="d-flex gap-1 flex-wrap">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => {
                                setId(objFila.strId);
                                setFormulario({
                                  ...objFila,
                                  strClave: "",
                                  strRut: objFila.strRut || "",
                                  strTelefono: objFila.strTelefono || "",
                                });
                                setErrores({});
                              }}
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => alternar(objFila.strId)}
                            >
                              {objFila.boolActivo ? "Desactivar" : "Activar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
function ServiciosAdmin({ objDatos, ejecutar }) {
  const objVacio = {
    strId: "",
    strNombre: "",
    strTipo: "Consulta",
    strDuracion: "30 min",
    strModalidad: "Presencial",
    numPrecio: "",
    strDescripcion: "",
  };
  const [objFormulario, setFormulario] = useState(objVacio);
  const [strId, setId] = useState("");
  const [strMensaje, setMensaje] = useState("");
  const [boolError, setError] = useState(false);
  function enviar(objEvento) {
    objEvento.preventDefault();
    try {
      ejecutar((objCopia, objActor) =>
        guardarServicio(objCopia, objActor, objFormulario, strId),
      );
      setId("");
      setFormulario(objVacio);
      setError(false);
      setMensaje("Servicio guardado.");
    } catch (objError) {
      setError(true);
      setMensaje(objError.message);
    }
  }
  function eliminar(strServicioId) {
    if (!window.confirm("Eliminar este servicio del catalogo?")) return;
    try {
      ejecutar((objCopia, objActor) =>
        eliminarServicio(objCopia, objActor, strServicioId),
      );
      setError(false);
      setMensaje("Servicio eliminado del catalogo.");
    } catch (objError) {
      setError(true);
      setMensaje(objError.message);
    }
  }
  return (
    <>
      <Mensaje
        strTexto={strMensaje}
        strTipo={boolError ? "danger" : "success"}
      />
      <div className="row g-4">
        <section className="col-xl-4">
          <form className="panel" noValidate onSubmit={enviar}>
            <h2 className="h5">
              {strId ? "Editar servicio" : "Crear servicio"}
            </h2>
            {[
              ["strId", "Codigo (AA000)"],
              ["strNombre", "Nombre del servicio"],
              ["strDuracion", "Duracion (ej. 30 min)"],
              ["strModalidad", "Modalidad"],
              ["numPrecio", "Precio CLP"],
              ["strDescripcion", "Descripcion"],
            ].map(([strCampo, strEtiqueta]) => (
              <Campo
                key={strCampo}
                strId={`servicio-${strCampo}`}
                strEtiqueta={strEtiqueta}
                strTipo={strCampo === "numPrecio" ? "number" : "text"}
                disabled={strCampo === "strId" && !!strId}
                value={objFormulario[strCampo]}
                onChange={(objEvento) =>
                  setFormulario({
                    ...objFormulario,
                    [strCampo]: objEvento.target.value,
                  })
                }
              />
            ))}
            <Seleccion
              strId="servicio-tipo"
              strEtiqueta="Tipo de servicio"
              value={objFormulario.strTipo}
              onChange={(objEvento) =>
                setFormulario({
                  ...objFormulario,
                  strTipo: objEvento.target.value,
                })
              }
            >
              {[
                "Consulta",
                "Plan especializado",
                "Evaluacion",
                "Taller grupal",
              ].map((strFila) => (
                <option key={strFila}>{strFila}</option>
              ))}
            </Seleccion>
            <button className="btn btn-primary" type="submit">
              Guardar servicio
            </button>
            {strId && (
              <button
                className="btn btn-link"
                type="button"
                onClick={() => {
                  setId("");
                  setFormulario(objVacio);
                }}
              >
                Cancelar
              </button>
            )}
          </form>
        </section>
        <section className="col-xl-8">
          <div className="panel table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Servicio</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {objDatos.arrServicios.map((objFila) => (
                  <tr key={objFila.strId}>
                    <td>{objFila.strId}</td>
                    <td>{objFila.strNombre}</td>
                    <td className="text-nowrap">
                      {precioTexto(objFila.numPrecio)}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => {
                            setId(objFila.strId);
                            setFormulario(objFila);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => eliminar(objFila.strId)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
