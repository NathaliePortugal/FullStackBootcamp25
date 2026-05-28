import { useState } from 'react'
import { useToast } from '../hooks/useToast'

const REASONS = ['Quiero comprar', 'Recomendacion para mi', 'Soporte / consulta', 'Otro']

const RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+\d][\d\s\-()+]{5,18}$/,
}

function validate(fields) {
  const errors = {}

  if (!fields.fullName.trim()) {
    errors.fullName = 'El nombre es obligatorio.'
  } else if (fields.fullName.trim().length < 2) {
    errors.fullName = 'Minimo 2 caracteres.'
  }

  if (!fields.email.trim()) {
    errors.email = 'El email es obligatorio.'
  } else if (!RULES.email.test(fields.email.trim())) {
    errors.email = 'Ingresa un email valido. Ej: tu@email.com'
  }

  if (fields.phone.trim() && !RULES.phone.test(fields.phone.trim())) {
    errors.phone = 'Solo numeros, espacios y + - ( )'
  }

  if (!fields.reason) {
    errors.reason = 'Selecciona un motivo.'
  }

  if (!fields.message.trim()) {
    errors.message = 'El mensaje es obligatorio.'
  } else if (fields.message.trim().length < 10) {
    errors.message = 'Minimo 10 caracteres.'
  }

  if (!fields.consent) {
    errors.consent = 'Debes aceptar ser contactado.'
  }

  return errors
}

const EMPTY = { fullName: '', email: '', phone: '', reason: '', message: '', consent: false }

function Contacto() {
  const { showToast } = useToast()
  const [fields, setFields] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [sending, setSending] = useState(false)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setFields(prev => ({ ...prev, [name]: val }))
    if (touched[name]) {
      const newErrors = validate({ ...fields, [name]: val })
      setErrors(prev => ({ ...prev, [name]: newErrors[name] || '' }))
    }
  }

  function handleBlur(e) {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const newErrors = validate(fields)
    setErrors(prev => ({ ...prev, [name]: newErrors[name] || '' }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const allTouched = Object.fromEntries(Object.keys(EMPTY).map(k => [k, true]))
    setTouched(allTouched)
    const newErrors = validate(fields)
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      showToast('Revisa los campos marcados.', 'error')
      return
    }

    setSending(true)
    await new Promise(r => setTimeout(r, 800))
    setSending(false)
    showToast('Mensaje enviado. Te responderemos pronto.', 'success')
    setFields(EMPTY)
    setErrors({})
    setTouched({})
  }

  function inputClass(name) {
    if (!touched[name]) return 'form__input'
    return `form__input ${errors[name] ? 'is-invalid' : 'is-valid'}`
  }

  return (
    <section className="section" aria-labelledby="contact-title">
      <div className="container">
        <header className="section__header">
          <h1 className="section__title" id="contact-title">Contacto</h1>
          <p className="section__subtitle">
            Escribenos y te respondemos con una propuesta (sin spam, sin sustos baratos).
          </p>
        </header>

        <div className="contact-layout">
          <form className="form form--contact" onSubmit={handleSubmit} noValidate>
            <div className="form__grid">

              <div className="form__field">
                <label className="form__label" htmlFor="fullName">Nombre</label>
                <input
                  className={inputClass('fullName')}
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={fields.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="name"
                  aria-describedby="err-fullName"
                  aria-invalid={!!errors.fullName}
                />
                <p className="form__hint">Tu nombre completo.</p>
                <p className="form__error" id="err-fullName">{errors.fullName}</p>
              </div>

              <div className="form__field">
                <label className="form__label" htmlFor="email">Email</label>
                <input
                  className={inputClass('email')}
                  type="email"
                  id="email"
                  name="email"
                  value={fields.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                  placeholder="tu@email.com"
                  aria-describedby="err-email"
                  aria-invalid={!!errors.email}
                />
                <p className="form__hint">Formato: tu@dominio.com</p>
                <p className="form__error" id="err-email">{errors.email}</p>
              </div>

              <div className="form__field">
                <label className="form__label" htmlFor="phone">Telefono (opcional)</label>
                <input
                  className={inputClass('phone')}
                  type="tel"
                  id="phone"
                  name="phone"
                  value={fields.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="tel"
                  placeholder="+51 999 999 999"
                  aria-describedby="err-phone"
                  aria-invalid={!!errors.phone}
                />
                <p className="form__error" id="err-phone">{errors.phone}</p>
              </div>

              <div className="form__field">
                <label className="form__label" htmlFor="reason">Motivo</label>
                <select
                  className={`form__select${touched.reason ? (errors.reason ? ' is-invalid' : ' is-valid') : ''}`}
                  id="reason"
                  name="reason"
                  value={fields.reason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-describedby="err-reason"
                  aria-invalid={!!errors.reason}
                >
                  <option value="">Seleccionar…</option>
                  {REASONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <p className="form__error" id="err-reason">{errors.reason}</p>
              </div>

              <div className="form__field form__field--full">
                <label className="form__label" htmlFor="message">Mensaje</label>
                <textarea
                  className={`form__textarea${touched.message ? (errors.message ? ' is-invalid' : ' is-valid') : ''}`}
                  id="message"
                  name="message"
                  value={fields.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={6}
                  placeholder="Cuentanos que estas buscando…"
                  aria-describedby="err-message"
                  aria-invalid={!!errors.message}
                />
                <p className="form__hint">Minimo 10 caracteres.</p>
                <p className="form__error" id="err-message">{errors.message}</p>
              </div>

              <div className="form__field form__field--full">
                <label className="form__check">
                  <input
                    className="form__checkbox"
                    type="checkbox"
                    name="consent"
                    checked={fields.consent}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-describedby="err-consent"
                  />
                  <span>Acepto ser contactado/a para responder mi solicitud.</span>
                </label>
                <p className="form__error" id="err-consent">{errors.consent}</p>
              </div>

            </div>

            <div className="form__actions">
              <button type="submit" className="btn btn--primary" disabled={sending}>
                {sending ? 'Enviando…' : 'Enviar'}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => { setFields(EMPTY); setErrors({}); setTouched({}) }}
              >
                Limpiar
              </button>
            </div>
          </form>

          <aside className="contact-aside" aria-label="Información de contacto">
            <div className="card card--product">
              <div className="card__body">
                <h2 className="card__title">Canales</h2>
                <p className="card__text">
                  Respuesta en 24–48h (dias habiles). Si es urgente, indica "URGENTE" en el mensaje.
                </p>
                <ul className="contact-list">
                  <li className="contact-list__item">
                    <span className="badge">Email</span>
                    <span className="contact-list__value">contacto@jugueteriacosmica.test</span>
                  </li>
                  <li className="contact-list__item">
                    <span className="badge">Horario</span>
                    <span className="contact-list__value">10:00 – 18:00</span>
                  </li>
                  <li className="contact-list__item">
                    <span className="badge">Ubicacion</span>
                    <span className="contact-list__value">Arequipa, PE</span>
                  </li>
                </ul>
                <p className="form__hint">*Datos ficticios.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default Contacto
