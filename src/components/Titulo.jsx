function Titulo({ strEtiqueta, strTitulo, strDescripcion, children }) {
  return (
    <div className="titulo-vista">
      <div>
        <p className="etiqueta">{strEtiqueta}</p>
        <h1>{strTitulo}</h1>
        {strDescripcion && (
          <p className="text-secondary mb-0">{strDescripcion}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default Titulo;
