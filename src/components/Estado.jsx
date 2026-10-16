function Estado({ strEstado }) {
  return (
    <span className={`estado estado-${strEstado.toLowerCase()}`}>
      {strEstado}
    </span>
  );
}

export default Estado;
