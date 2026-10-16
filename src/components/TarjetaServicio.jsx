import { Link } from "react-router-dom";
import { precioTexto } from "../utils/validaciones";
function TarjetaServicio({ objServicio }) {
  return (
    <article className="tarjeta-servicio h-100">
      <div className="d-flex justify-content-between align-items-center">
        <span className="etiqueta">{objServicio.strTipo}</span>
        <span className="codigo">{objServicio.strId}</span>
      </div>
      <h2 className="h5 mt-3">{objServicio.strNombre}</h2>
      <p className="text-secondary flex-grow-1">{objServicio.strDescripcion}</p>
      <p className="small text-secondary">
        {objServicio.strDuracion} · {objServicio.strModalidad}
      </p>
      <div className="d-flex justify-content-between align-items-center gap-2">
        <strong className="precio">{precioTexto(objServicio.numPrecio)}</strong>
        <Link
          className="btn btn-outline-primary btn-sm"
          to={`/servicios/${objServicio.strId}`}
        >
          Ver detalle
        </Link>
      </div>
    </article>
  );
}

export default TarjetaServicio;
