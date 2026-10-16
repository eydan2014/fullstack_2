import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Campo from "../components/Campo";
import Marca from "../components/Marca";
import Mensaje from "../components/Mensaje";
export default function Sesion({
  objUsuario,
  iniciarSesion,
  registrar,
  boolRegistro = false,
}) {
  const fnNavegar = useNavigate();
  const [objFormulario, setFormulario] = useState({
    strCorreo: "",
    strClave: "",
    strNombre: "",
    strRut: "",
    strTelefono: "",
  });
  const [objErrores, setErrores] = useState({});
  const [strMensaje, setMensaje] = useState("");
  if (objUsuario) return <Navigate to="/" replace />;
  function cambiar(strCampo, strValor) {
    setFormulario({ ...objFormulario, [strCampo]: strValor });
    setErrores({ ...objErrores, [strCampo]: "" });
    setMensaje("");
  }
  function enviar(objEvento) {
    objEvento.preventDefault();
    try {
      if (boolRegistro) {
        const objResultado = registrar(objFormulario);
        setErrores(objResultado);
        if (Object.keys(objResultado).length) return;
      }
      iniciarSesion(objFormulario.strCorreo, objFormulario.strClave);
      fnNavegar("/");
    } catch (objError) {
      setMensaje(objError.message);
    }
  }
  return (
    <div className="acceso">
      <section className="acceso-formulario">
        <div className="w-100">
          <div className="acceso-cabecera">
            <Marca />
            <p className="etiqueta mt-4">BIENVENIDO A NUTRIVIDA</p>
            <h2>{boolRegistro ? "Crea tu cuenta" : "Inicia sesion"}</h2>
            <p className="text-secondary">
              {boolRegistro
                ? "Registrate como paciente para solicitar tu primera cita."
                : "Ingresa para continuar con tu cuidado."}
            </p>
          </div>
          <Mensaje strTexto={strMensaje} strTipo="danger" />
          <form noValidate onSubmit={enviar}>
            {boolRegistro && (
              <>
                <Campo
                  strId="nombre"
                  strEtiqueta="Nombre completo"
                  value={objFormulario.strNombre}
                  onChange={(objEvento) =>
                    cambiar("strNombre", objEvento.target.value)
                  }
                  strError={objErrores.strNombre}
                  autoComplete="name"
                />
                <div className="row">
                  <div className="col-sm-6">
                    <Campo
                      strId="rut"
                      strEtiqueta="RUT"
                      placeholder="12.345.678-5"
                      value={objFormulario.strRut}
                      onChange={(objEvento) =>
                        cambiar("strRut", objEvento.target.value)
                      }
                      strError={objErrores.strRut}
                    />
                  </div>
                  <div className="col-sm-6">
                    <Campo
                      strId="telefono"
                      strEtiqueta="Telefono"
                      strTipo="tel"
                      value={objFormulario.strTelefono}
                      onChange={(objEvento) =>
                        cambiar("strTelefono", objEvento.target.value)
                      }
                      strError={objErrores.strTelefono}
                    />
                  </div>
                </div>
              </>
            )}
            <Campo
              strId="correo"
              strEtiqueta="Correo electronico"
              strTipo="email"
              autoComplete="email"
              value={objFormulario.strCorreo}
              onChange={(objEvento) =>
                cambiar("strCorreo", objEvento.target.value)
              }
              strError={objErrores.strCorreo}
            />
            <Campo
              strId="clave"
              strEtiqueta="Clave"
              strTipo="password"
              autoComplete={boolRegistro ? "new-password" : "current-password"}
              value={objFormulario.strClave}
              onChange={(objEvento) =>
                cambiar("strClave", objEvento.target.value)
              }
              strError={objErrores.strClave}
            />
            <button className="btn btn-primary w-100" type="submit">
              {boolRegistro ? "Crear cuenta" : "Ingresar"}
            </button>
          </form>
          <p className="small mt-3">
            {boolRegistro ? "Ya tienes cuenta?" : "Primera vez aqui?"}{" "}
            <Link to={boolRegistro ? "/sesion" : "/registro"}>
              {boolRegistro ? "Inicia sesion" : "Registrate"}
            </Link>
          </p>
          {!boolRegistro && (
            <div className="cuentas-prueba">
              <strong className="small">Cuentas con datos de prueba</strong>
              <p className="small text-secondary mb-2">
                Clave compartida: <code>NutriVida2026!</code>
              </p>
              <div className="d-flex flex-wrap gap-2">
                {[
                  ["paciente", "Paciente"],
                  ["nut001", "Nutricionista"],
                  ["secretaria", "Secretaria"],
                  ["admin", "Administrador"],
                ].map(([strCuenta, strRol]) => (
                  <button
                    key={strCuenta}
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      setFormulario({
                        ...objFormulario,
                        strCorreo: `${strCuenta}@nutrivida.example`,
                        strClave: "NutriVida2026!",
                      });
                      setMensaje("");
                    }}
                  >
                    {strRol}
                  </button>
                ))}
              </div>
              <p className="small text-secondary mt-2 mb-0">
                Usa datos de prueba.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
