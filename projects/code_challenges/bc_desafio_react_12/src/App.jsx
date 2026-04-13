import { useState } from "react";
import BuscadorCiudad from "./components/BuscadorCiudad";
import ClimaCiudad from "./components/ClimaCiudad";
import "./App.css";

function App() {
  const [ciudad, setCiudad] = useState("");

  return (
    <main className="app-container">
      <h1 className="app-titulo">Clima Actual</h1>
      <BuscadorCiudad onBuscar={setCiudad} />
      {ciudad && <ClimaCiudad ciudad={ciudad} />}
    </main>
  );
}

export default App;
