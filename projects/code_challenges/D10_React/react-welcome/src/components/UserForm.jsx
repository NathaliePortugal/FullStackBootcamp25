import { useState } from "react";

function UserForm({ onSubmitUser }) {
  const [inputName, setInputName] = useState("");
  const [inputAge, setInputAge] = useState("");
  const [error, setError] = useState("");

  const validateName = (name) => {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return nameRegex.test(name.trim());
  };

  const validateAge = (age) => {
    const parsedAge = Number(age);

    if (age === "") return false;
    if (!Number.isInteger(parsedAge)) return false;
    if (parsedAge < 0) return false;
    if (parsedAge > 120) return false;

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const trimmedName = inputName.trim();

    if (!trimmedName || inputAge === "") {
      alert("Por favor, completa el nombre y la edad.");
      return;
    }
    if (!validateName(trimmedName)) {
      setError("El nombre solo debe contener letras y espacios.");
      return;
    }

    if (!validateAge(inputAge)) {
      setError("La edad debe ser un número entero entre 0 y 120.");
      return;
    }
    onSubmitUser(trimmedName, inputAge);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="label" htmlFor="name">
          Nombre
        </label>
        <input
          id="name"
          type="text"
          className="input"
          placeholder="Escribe tu nombre"
          value={inputName}
          onChange={(event) => setInputName(event.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="label" htmlFor="age">
          Edad
        </label>
        <input
          id="age"
          type="number"
          className="input"
          placeholder="Escribe tu edad"
          value={inputAge}
          onChange={(event) => setInputAge(event.target.value)}
          min="0"
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      <button type="submit" className="btn-neon">
        Mostrar bienvenida
      </button>
    </form>
  );
}

export default UserForm;