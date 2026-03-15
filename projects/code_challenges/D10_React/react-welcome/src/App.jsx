import { useState } from "react";
import UserForm from "./components/UserForm";
import WelcomeMessage from "./components/WelcomeMessage";
import "./styles/neon.css";

function App() {

  // estados (todavía no usamos lógica)
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");

  const handleUserSubmit = (userName, userAge) => {
    setName(userName);
    setAge(userAge);

    if (Number(userAge) < 18) {
      setMessage(`Hola ${userName}, eres muy joven para usar esta aplicación`);
    } else {
      setMessage(`Bienvenido ${userName}, gracias por usar nuestra aplicación`);
    }
  };

  return (
    <main className="app-shell">
      <section className="card">
        <h1 className="title">Welcome App</h1>
        <p className="subtitle">
          Ingresa tus datos para recibir un mensaje personalizado
        </p>

        <UserForm onSubmitUser={handleUserSubmit} />

        <WelcomeMessage message={message} name={name} age={age} />
      </section>
    </main>
  );
}

export default App;