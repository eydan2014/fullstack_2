function Campo({
  strId,
  strEtiqueta,
  strError,
  strTipo = "text",
  ...objProps
}) {
  return (
    <div className="mb-3">
      <label htmlFor={strId} className="form-label">
        {strEtiqueta}
      </label>
      <input
        id={strId}
        type={strTipo}
        className={`form-control ${strError ? "is-invalid" : ""}`}
        aria-invalid={!!strError}
        aria-describedby={strError ? `${strId}-error` : undefined}
        {...objProps}
      />
      {strError && (
        <div id={`${strId}-error`} className="invalid-feedback">
          {strError}
        </div>
      )}
    </div>
  );
}

export default Campo;
