import { arrNutricionistas } from "../data/catalogo";
import Titulo from "../components/Titulo";
export default function Clinica() {
  return (
    <>
      <Titulo
        strEtiqueta="NUESTRO EQUIPO"
        strTitulo="Atencion cercana, en Temuco"
        strDescripcion="Clinica nutricional fundada en 2016. Cuatro profesionales que acompañan distintos objetivos de salud."
      />
      <div className="row g-4">
        {arrNutricionistas.map((objNut, intIndice) => (
          <div key={objNut.strId} className="col-md-6">
            <article className="panel h-100">
              <div className="d-flex gap-3">
                <span className="avatar" aria-hidden="true">
                  0{intIndice + 1}
                </span>
                <div>
                  <h2 className="h5">{objNut.strNombre}</h2>
                  <p className="text-secondary">{objNut.strEspecialidad}</p>
                  <p className="small mb-1">{objNut.strDias}</p>
                  <p className="small mb-0">{objNut.strHorario}</p>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </>
  );
}
