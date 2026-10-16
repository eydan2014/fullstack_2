import { useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import Marca from "./Marca";
export default function Layout({ objUsuario, cerrarSesion }) {
  const [boolMenu, setMenu] = useState(false);
  const { pathname: strRuta } = useLocation();
  const arrEnlaces = [
    ["/", "Inicio"],
    ["/servicios", "Servicios"],
    ["/las-citas", "Mis citas"],
    ["/historial", "Mi progreso"],
    ["/clinica", "La clinica"],
  ];
  if (objUsuario.strRol === "Secretaria")
    arrEnlaces.splice(2, 2, ["/secretaria", "Agenda"]);
  if (objUsuario.strRol === "Nutricionista")
    arrEnlaces.splice(
      2,
      2,
      ["/nutricionista", "Mi agenda"],
      ["/fichas", "Fichas"],
    );
  if (objUsuario.strRol === "Administrador")
    arrEnlaces.push(["/admin", "Administracion"]);
  return (
    <>
      <a className="visually-hidden-focusable skip" href="#contenido">
        Saltar al contenido
      </a>
      <header className="cabecera">
        <nav
          className="container navbar navbar-expand-lg"
          aria-label="Navegacion principal"
        >
          <Link to="/" className="navbar-brand">
            <Marca />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Abrir menu"
            aria-expanded={boolMenu}
            aria-controls="menu"
            onClick={() => setMenu(!boolMenu)}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div
            id="menu"
            className={`collapse navbar-collapse ${boolMenu ? "show" : ""}`}
          >
            <div className="navbar-nav mx-auto gap-lg-2">
              {arrEnlaces.map(([strHref, strTexto]) => (
                <NavLink
                  end={strHref === "/"}
                  to={strHref}
                  key={strHref}
                  className="nav-link"
                  onClick={() => setMenu(false)}
                >
                  {strTexto}
                </NavLink>
              ))}
            </div>
            <div className="sesion-bloque">
              <Link className="perfil-enlace" to="/usuario">
                {objUsuario.strNombre.split(" ")[0]}
                <small>{objUsuario.strRol}</small>
              </Link>
              <button className="btn btn-sm btn-light" onClick={cerrarSesion}>
                Salir
              </button>
            </div>
          </div>
        </nav>
      </header>
      <main id="contenido" className="container contenido" key={strRuta}>
        <Outlet />
      </main>
      <footer className="pie">
        <div className="container d-flex flex-wrap gap-3 justify-content-between">
          <Marca />
        </div>
      </footer>
    </>
  );
}
