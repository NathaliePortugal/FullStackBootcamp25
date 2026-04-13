import { useState } from "react";

function BuscadorCiudad({ onBuscar }) {
  const [inputCiudad, setInputCiudad] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (inputCiudad.trim()) onBuscar(inputCiudad.trim());
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      <input
        className="app-input"
        type="text"
        placeholder="Ingresa una ciudad..."
        value={inputCiudad}
        onChange={(e) => setInputCiudad(e.target.value)}
      />
      <button className="app-boton" type="submit">
        Buscar
      </button>
    </form>
  );
}

export default BuscadorCiudad;
