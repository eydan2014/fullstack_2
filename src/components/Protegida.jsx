import { Navigate, Outlet, Link } from "react-router-dom";
function Protegida({ objUsuario, arrRoles }) {
  if (!objUsuario) return <Navigate to="/sesion" replace />;
  if (arrRoles && !arrRoles.includes(objUsuario.strRol))
    return (
      <div className="container py-5">
        <h1>Acceso restringido</h1>
        <p>Tu rol no tiene acceso a esta vista.</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  return <Outlet />;
}

export default Protegida;
