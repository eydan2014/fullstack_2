import { Link } from "react-router-dom";
import { citasVisibles } from "../data/operaciones";
import Titulo from "../components/Titulo";
export default function Perfil({ objDatos, objUsuario }) {
  return (
    <>
      <Titulo
        strEtiqueta="MI CUENTA"
        strTitulo={objUsuario.strNombre}
        strDescripcion="Datos de tu cuenta."
      />
      <section className="panel detalle">
        <dl className="row">
          <dt className="col-sm-4">Correo</dt>
          <dd className="col-sm-8">{objUsuario.strCorreo}</dd>
          <dt className="col-sm-4">Rol</dt>
          <dd className="col-sm-8">{objUsuario.strRol}</dd>
          {objUsuario.strRol === "Paciente" && (
            <>
              <dt className="col-sm-4">RUT</dt>
              <dd className="col-sm-8">{objUsuario.strRut}</dd>
              <dt className="col-sm-4">Telefono</dt>
              <dd className="col-sm-8">{objUsuario.strTelefono}</dd>
            </>
          )}
          <dt className="col-sm-4">Citas visibles</dt>
          <dd className="col-sm-8">
            {citasVisibles(objDatos, objUsuario).length}
          </dd>
        </dl>
        <Link className="btn btn-outline-primary" to="/las-citas">
          Consultar mis citas
        </Link>
        <p className="text-secondary small mt-3 mb-0">
          Para corregir los datos de tu cuenta, solicita el cambio al
          administrador.
        </p>
      </section>
    </>
  );
}
