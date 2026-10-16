import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import TarjetaServicio from "../components/TarjetaServicio";
import Titulo from "../components/Titulo";
import Campo from "../components/Campo";
import Seleccion from "../components/Seleccion";
import Vacio from "../components/Vacio";
import { precioTexto } from "../utils/validaciones";
export default function Servicios({ objDatos, strTipoInicial = "" }) {
  const [strBusqueda, setBusqueda] = useState("");
  const [strTipo, setTipo] = useState(strTipoInicial);
  const arrTipos = [
    ...new Set(objDatos.arrServicios.map((objServicio) => objServicio.strTipo)),
  ];
  const arrResultados = objDatos.arrServicios.filter(
    (objServicio) =>
      (!strTipo || objServicio.strTipo === strTipo) &&
      `${objServicio.strNombre} ${objServicio.strDescripcion} ${objServicio.strId}`
        .toLowerCase()
        .includes(strBusqueda.toLowerCase()),
  );
  return (
    <>
      <Titulo
        strEtiqueta="NUESTRO CATALOGO"
        strTitulo={
          strTipoInicial === "Taller grupal"
            ? "Talleres para aprender juntos"
            : "Servicios y planes"
        }
        strDescripcion="Encuentra una atencion para tus objetivos. Valores expresados en pesos chilenos."
      />
      <section className="panel mb-4">
        <div className="row">
          <div className="col-md-8">
            <Campo
              strId="buscar"
              strEtiqueta="Buscar servicio"
              value={strBusqueda}
              onChange={(objEvento) => setBusqueda(objEvento.target.value)}
              placeholder="Nombre, descripcion o codigo"
            />
          </div>
          <div className="col-md-4">
            <Seleccion
              strId="tipo"
              strEtiqueta="Categoria"
              value={strTipo}
              onChange={(objEvento) => setTipo(objEvento.target.value)}
            >
              <option value="">Todas las categorias</option>
              {arrTipos.map((strFila) => (
                <option key={strFila}>{strFila}</option>
              ))}
            </Seleccion>
          </div>
        </div>
        <p className="small text-secondary mb-0" role="status">
          {arrResultados.length} servicios encontrados
        </p>
      </section>
      <div className="row g-4">
        {arrResultados.map((objServicio) => (
          <div className="col-md-6 col-xl-4" key={objServicio.strId}>
            <TarjetaServicio objServicio={objServicio} />
          </div>
        ))}
      </div>
      {!arrResultados.length && (
        <Vacio strTexto="No encontramos servicios con esos filtros." />
      )}
      <div className="mt-4">
        <Link to="/talleres">Explorar talleres</Link> ·{" "}
        <Link to="/planes">Explorar planes especializados</Link>
      </div>
    </>
  );
}
export function DetalleServicio({ objDatos, objUsuario }) {
  const { strId } = useParams();
  const objServicio = objDatos.arrServicios.find(
    (objFila) => objFila.strId === strId,
  );
  if (!objServicio)
    return (
      <>
        <Titulo strTitulo="Servicio no encontrado" />
        <Link to="/servicios">Volver al catalogo</Link>
      </>
    );
  return (
    <>
      <Link to="/servicios" className="small">
        ← Volver al catalogo
      </Link>
      <Titulo
        strEtiqueta={`${objServicio.strTipo} / ${objServicio.strId}`}
        strTitulo={objServicio.strNombre}
      />
      <section className="panel detalle">
        <p className="lead">{objServicio.strDescripcion}</p>
        <dl className="row">
          <dt className="col-sm-3">Duracion</dt>
          <dd className="col-sm-9">
            {objServicio.strDuracion === " "
              ? "Segun plan"
              : objServicio.strDuracion || "Segun plan"}
          </dd>
          <dt className="col-sm-3">Modalidad</dt>
          <dd className="col-sm-9">{objServicio.strModalidad}</dd>
          <dt className="col-sm-3">Valor de referencia</dt>
          <dd className="col-sm-9 precio">
            {precioTexto(objServicio.numPrecio)}
          </dd>
        </dl>
        <p className="text-secondary">
          El horario solicitado queda pendiente de confirmacion por recepcion.
          Para planes se agenda la primera sesion. Los talleres se solicitan
          individualmente, recepcion coordina el grupo. Este prototipo no
          procesa pagos.
        </p>
        {objUsuario.strRol !== "Nutricionista" && (
          <Link
            className="btn btn-primary"
            to={`/agendar?servicio=${objServicio.strId}`}
          >
            Solicitar atencion
          </Link>
        )}
      </section>
    </>
  );
}
