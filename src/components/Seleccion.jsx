function Seleccion({ strId, strEtiqueta, strError, children, ...objProps }) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={strId}>
        {strEtiqueta}
      </label>
      <select
        id={strId}
        className={`form-select ${strError ? "is-invalid" : ""}`}
        aria-invalid={!!strError}
        aria-describedby={strError ? `${strId}-error` : undefined}
        {...objProps}
      >
        {children}
      </select>
      {strError && (
        <div id={`${strId}-error`} className="invalid-feedback">
          {strError}
        </div>
      )}
    </div>
  );
}

export default Seleccion;
