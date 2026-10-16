function Mensaje({ strTexto, strTipo = "success" }) {
  return strTexto ? (
    <div
      role={strTipo === "danger" ? "alert" : "status"}
      className={`alert alert-${strTipo}`}
    >
      {strTexto}
    </div>
  ) : null;
}

export default Mensaje;
