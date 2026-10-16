import { Link } from "react-router-dom";
import { citasVisibles } from "../data/operaciones";
import { arrNutricionistas } from "../data/catalogo";
import TarjetaServicio from "../components/TarjetaServicio";
import Estado from "../components/Estado";
import { fechaTexto, fechaHoy } from "../utils/validaciones";
export default function Inicio({ objDatos, objUsuario }) {
  const arrCitas = citasVisibles(objDatos, objUsuario);
  const arrProximas = arrCitas
    .filter(
      (objCita) =>
        objCita.strFecha >= fechaHoy() &&
        ["Pendiente", "Confirmada", "Reprogramacion"].includes(
          objCita.strEstado,
        ),
    )
    .sort((objA, objB) =>
      (objA.strFecha + objA.strHora).localeCompare(
        objB.strFecha + objB.strHora,
      ),
    );
  const objProxima = arrProximas[0];
  return (
    <>
      <section className="portada">
        <div>
          <p className="etiqueta">BIENESTAR QUE SE CONSTRUYE DIA A DIA</p>
          <h1>
            Hola, {objUsuario.strNombre.split(" ")[0]}.<br />
            Tu salud tiene un lugar.
          </h1>
          <p>
            Atencion cercana y un seguimiento pensado para ti.
            <br className="d-none d-md-block" /> Estamos aqui para acompañarte
            en cada paso.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <Link
              className="btn btn-primary"
              to={
                objUsuario.strRol === "Nutricionista" ? "/fichas" : "/agendar"
              }
            >
              {objUsuario.strRol === "Nutricionista"
                ? "Ver mis pacientes"
                : "Agendar una consulta"}{" "}
              <span aria-hidden="true">→</span>
            </Link>
            <Link to="/servicios" className="btn btn-link">
              Explorar servicios
            </Link>
          </div>
        </div>
        <div className="portada-panel">
          <span className="circulo" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#f4c542"
                d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z"
              />
            </svg>
          </span>
          <p className="etiqueta">TU PROXIMA ATENCION</p>
          {objProxima ? (
            <>
              <h2 className="h4">{fechaTexto(objProxima.strFecha)}</h2>
              <p>
                {objProxima.strHora} hrs ·{" "}
                {
                  arrNutricionistas.find(
                    (objNut) => objNut.strId === objProxima.strNutricionistaId,
                  )?.strNombre
                }
              </p>
              <Estado strEstado={objProxima.strEstado} />
              <Link to="/las-citas" className="d-block mt-3 small">
                Revisar cita →
              </Link>
            </>
          ) : (
            <>
              <h2 className="h4">Comienza con una consulta</h2>
              <p>Revisa los horarios disponibles de nuestro equipo.</p>
            </>
          )}
        </div>
      </section>
      <section className="row g-3 my-3" aria-label="Resumen">
        <div className="col-md-4">
          <div className="estadistica">
            <span className="numero">{arrProximas.length}</span>
            <div>
              <strong>Citas proximas</strong>
              <p>Tu agenda actualizada</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="estadistica">
            <span className="numero">{objDatos.arrServicios.length}</span>
            <div>
              <strong>Servicios y planes</strong>
              <p>Atencion para cada objetivo</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="estadistica">
            <span className="numero">04</span>
            <div>
              <strong>Profesionales</strong>
              <p>Un equipo para acompañarte</p>
            </div>
          </div>
        </div>
      </section>
      <div className="d-flex align-items-center justify-content-between gap-2 mt-5 mb-4">
        <div>
          <p className="etiqueta">ENCUENTRA TU ATENCION</p>
          <h2 className="h3 mb-0">Cuidamos de tu bienestar</h2>
        </div>
        <Link to="/servicios">Ver catalogo →</Link>
      </div>
      <div className="row g-4">
        {objDatos.arrServicios.slice(0, 3).map((objServicio) => (
          <div key={objServicio.strId} className="col-md-4">
            <TarjetaServicio objServicio={objServicio} />
          </div>
        ))}
      </div>
      <section className="franja mt-5">
        <div>
          <p className="etiqueta">UN EQUIPO CERCA DE TI</p>
          <h2 className="h3">Cuatro profesionales. Un mismo compromiso.</h2>
          <p className="mb-0 text-secondary">
            Conoce sus especialidades y encuentra la atencion que necesitas.
          </p>
        </div>
        <Link to="/clinica" className="btn btn-outline-primary">
          Conocer la clinica
        </Link>
      </section>
    </>
  );
}
