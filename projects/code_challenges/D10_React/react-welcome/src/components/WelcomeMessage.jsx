function WelcomeMessage({ message, name, age }) {
  if (!message) {
    return null;
  }

  return (
    <section className="message-box">
      <h2 className="message-title">Resultado</h2>
      <p className="message-text">{message}</p>

      <div className="message-meta">
        <span>
          <strong>Nombre:</strong> {name}
        </span>
        <span>
          <strong>Edad:</strong> {age}
        </span>
      </div>
    </section>
  );
}

export default WelcomeMessage;