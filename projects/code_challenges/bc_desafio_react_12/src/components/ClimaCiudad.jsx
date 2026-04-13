import { useState, useEffect } from "react";
import "./ClimaCiudad.css";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
console.log("API KEY:", API_KEY);

function ClimaCiudad({ ciudad }) {
  const [temperatura, setTemperatura] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function obtenerTemperatura() {
    setCargando(true);
    setError("");
    try {
      const respuesta = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&appid=${API_KEY}`
      );
      if (!respuesta.ok) throw new Error("Ciudad no encontrada");
      const datos = await respuesta.json();
      const temp = datos.main.temp;
      setTemperatura(temp);
      if (temp > 30) {
        setMensaje("Hace mucho calor");
      } else if (temp < 10) {
        setMensaje("Hace mucho frío");
      } else {
        setMensaje("");
      }
    } catch (err) {
      setError(err.message);
      setTemperatura(null);
      setMensaje("");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    if (ciudad) obtenerTemperatura();
  }, [ciudad]);

  return (
    <div className="clima-card">
      <h2 className="clima-ciudad">{ciudad}</h2>

      {cargando && <p className="clima-estado">Cargando...</p>}

      {error && <p className="clima-error">{error}</p>}

      {temperatura !== null && !cargando && (
        <>
          <p className="clima-temperatura">{temperatura.toFixed(1)} °C</p>
          {mensaje && <p className="clima-mensaje">{mensaje}</p>}
        </>
      )}
    </div>
  );
}

export default ClimaCiudad;
