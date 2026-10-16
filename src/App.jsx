import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { leerDatos, guardarDatos, restablecerDatos } from "./data/persistencia";
import { autenticar, registrarUsuario } from "./data/operaciones";
import Protegida from "./components/Protegida";
import Mensaje from "./components/Mensaje";
import Layout from "./components/Layout";
import Sesion from "./pages/Sesion";
import Inicio from "./pages/Inicio";
import Servicios, { DetalleServicio } from "./pages/Servicios";
import Agendar, { Resultado } from "./pages/Agendar";
import Citas from "./pages/Citas";
import Historial from "./pages/Historial";
import Administracion from "./pages/Administracion";
import Clinica from "./pages/Clinica";
import Perfil from "./pages/Perfil";
export default function App() {
  // Guia 10: App es el padre que mantiene el estado compartido.
  const [objCarga] = useState(() => {
    try {
      return { objDatos: leerDatos(), strError: "" };
    } catch (objError) {
      return { objDatos: null, strError: objError.message };
    }
  });
  const [objDatos, setDatos] = useState(objCarga.objDatos);
  const [strError, setError] = useState(objCarga.strError);
  const [strUsuarioId, setUsuarioId] = useState(
    () => sessionStorage.getItem("nutrivida_sesion") || "",
  );
  const objUsuario = objDatos
    ? objDatos.arrUsuarios.find(
        (objFila) => objFila.strId === strUsuarioId && objFila.boolActivo,
      ) || null
    : null;

  // El efecto sincroniza la sesion cuando cambia el identificador.
  // useState actualiza la interfaz; useEffect sincroniza con algo externo.
  useEffect(() => {
    if (strUsuarioId) {
      sessionStorage.setItem("nutrivida_sesion", strUsuarioId);
    } else {
      sessionStorage.removeItem("nutrivida_sesion");
    }
  }, [strUsuarioId]);

  function ejecutar(fnOperacion) {
    // Copia de datos JSON para no modificar directamente el estado actual.
    const objCopia = JSON.parse(JSON.stringify(objDatos));
    const objResultado = fnOperacion(objCopia, objUsuario);
    if (objResultado && Object.keys(objResultado).length) return objResultado;
    // Se guarda antes de actualizar React para poder informar un fallo al formulario.
    guardarDatos(objCopia);
    setDatos(objCopia);
    return {};
  }

  function iniciarSesion(strCorreo, strClave) {
    const strId = autenticar(objDatos, strCorreo, strClave);
    setUsuarioId(strId);
  }

  function cerrarSesion() {
    setUsuarioId("");
  }

  function registrar(objFormulario) {
    return ejecutar((objCopia) => registrarUsuario(objCopia, objFormulario));
  }

  function restablecer() {
    setDatos(restablecerDatos());
    setUsuarioId("");
    setError("");
  }

  if (strError)
    return (
      <section className="container py-5">
        <h1>Recuperacion de datos locales</h1>
        <Mensaje strTexto={strError} strTipo="danger" />
        <p>
          Puedes restablecer los datos de prueba. Esto reemplaza los registros
          locales de esta version.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (
              window.confirm(
                "Reemplazar los datos locales por los datos de prueba iniciales?",
              )
            )
              restablecer();
          }}
        >
          Restablecer datos de prueba
        </button>
      </section>
    );
  return (
    <Routes>
      <Route
        path="/sesion"
        element={
          <Sesion
            objUsuario={objUsuario}
            iniciarSesion={iniciarSesion}
            registrar={registrar}
            key="sesion"
          />
        }
      />
      <Route
        path="/registro"
        element={
          <Sesion
            objUsuario={objUsuario}
            iniciarSesion={iniciarSesion}
            registrar={registrar}
            boolRegistro
            key="registro"
          />
        }
      />
      <Route element={<Protegida objUsuario={objUsuario} />}>
        <Route
          element={
            <Layout objUsuario={objUsuario} cerrarSesion={cerrarSesion} />
          }
        >
          <Route
            index
            element={<Inicio objDatos={objDatos} objUsuario={objUsuario} />}
          />
          <Route
            path="servicios"
            element={<Servicios objDatos={objDatos} key="todos" />}
          />
          <Route
            path="servicios/:strId"
            element={
              <DetalleServicio objDatos={objDatos} objUsuario={objUsuario} />
            }
          />
          <Route
            path="talleres"
            element={
              <Servicios
                objDatos={objDatos}
                strTipoInicial="Taller grupal"
                key="talleres"
              />
            }
          />
          <Route
            path="planes"
            element={
              <Servicios
                objDatos={objDatos}
                strTipoInicial="Plan especializado"
                key="planes"
              />
            }
          />
          <Route
            path="las-citas"
            element={
              <Citas
                objDatos={objDatos}
                objUsuario={objUsuario}
                ejecutar={ejecutar}
              />
            }
          />
          <Route
            path="usuario"
            element={<Perfil objDatos={objDatos} objUsuario={objUsuario} />}
          />
          <Route path="clinica" element={<Clinica />} />
          <Route
            path="solicitud/:strId"
            element={<Resultado objDatos={objDatos} objUsuario={objUsuario} />}
          />
          <Route
            element={
              <Protegida
                objUsuario={objUsuario}
                arrRoles={["Paciente", "Administrador", "Secretaria"]}
              />
            }
          >
            <Route
              path="agendar"
              element={
                <Agendar
                  objDatos={objDatos}
                  objUsuario={objUsuario}
                  ejecutar={ejecutar}
                />
              }
            />
            <Route
              path="agendar/:strId"
              element={
                <Agendar
                  objDatos={objDatos}
                  objUsuario={objUsuario}
                  ejecutar={ejecutar}
                />
              }
            />
          </Route>
          <Route
            element={
              <Protegida
                objUsuario={objUsuario}
                arrRoles={["Paciente", "Administrador", "Nutricionista"]}
              />
            }
          >
            <Route
              path="historial"
              element={
                <Historial
                  objDatos={objDatos}
                  objUsuario={objUsuario}
                  ejecutar={ejecutar}
                />
              }
            />
          </Route>
          <Route
            element={
              <Protegida
                objUsuario={objUsuario}
                arrRoles={["Administrador", "Nutricionista"]}
              />
            }
          >
            <Route
              path="fichas"
              element={
                <Historial
                  objDatos={objDatos}
                  objUsuario={objUsuario}
                  ejecutar={ejecutar}
                />
              }
            />
            <Route
              path="nutricionista"
              element={
                <Citas
                  objDatos={objDatos}
                  objUsuario={objUsuario}
                  ejecutar={ejecutar}
                />
              }
            />
          </Route>
          <Route
            element={
              <Protegida
                objUsuario={objUsuario}
                arrRoles={["Administrador", "Secretaria"]}
              />
            }
          >
            <Route
              path="secretaria"
              element={
                <Citas
                  objDatos={objDatos}
                  objUsuario={objUsuario}
                  ejecutar={ejecutar}
                />
              }
            />
          </Route>
          <Route
            element={
              <Protegida objUsuario={objUsuario} arrRoles={["Administrador"]} />
            }
          >
            <Route
              path="admin"
              element={
                <Administracion objDatos={objDatos} ejecutar={ejecutar} />
              }
            />
          </Route>
          <Route path="index.html" element={<Navigate to="/" replace />} />
          <Route
            path="*"
            element={
              <section className="panel">
                <h1>Pagina no encontrada</h1>
                <p>La ruta solicitada no existe.</p>
                <Link to="/">Volver al inicio</Link>
              </section>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}
