import { useState } from 'react'
import { createProduct } from '../api/products'
import { useProducts } from '../hooks/useProducts'
import { useToast } from '../hooks/useToast'

const GENRES = ['Survival Horror', 'Psychological Horror', 'Cosmic Horror', 'Action Horror']
const PLATFORMS = ['PS5', 'PC', 'Xbox Series', 'Nintendo Switch']

const RULES = {
  name: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9][A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s:'"-]{2,59}$/,
  price: /^(?:0|[1-9]\d{0,4})(?:[.,]\d{1,2})?$/,
  image: /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i,
}

function validate(fields) {
  const errors = {}

  if (!fields.name.trim()) {
    errors.name = 'El nombre es obligatorio.'
  } else if (!RULES.name.test(fields.name.trim())) {
    errors.name = 'Usa 3–60 caracteres. Solo letras, numeros y :\'"- '
  }

  if (!fields.price.trim()) {
    errors.price = 'El precio es obligatorio.'
  } else if (!RULES.price.test(fields.price.trim())) {
    errors.price = 'Formato: 79 o 79.90'
  } else if (Number(fields.price.replace(',', '.')) <= 0) {
    errors.price = 'Debe ser mayor a 0.'
  }

  if (fields.stock === '') {
    errors.stock = 'El stock es obligatorio.'
  } else if (!Number.isInteger(Number(fields.stock)) || Number(fields.stock) < 0) {
    errors.stock = 'Usa un entero (0 o mas).'
  }

  if (!fields.genre) {
    errors.genre = 'Selecciona un genero.'
  }

  if (!fields.platform) {
    errors.platform = 'Selecciona una plataforma.'
  }

  if (!fields.description.trim()) {
    errors.description = 'La descripcion es obligatoria.'
  } else if (fields.description.trim().length < 20) {
    errors.description = 'Minimo 20 caracteres.'
  }

  if (fields.image.trim() && !RULES.image.test(fields.image.trim())) {
    errors.image = 'La URL debe terminar en .jpg, .jpeg, .png, .gif o .webp'
  }

  return errors
}

const EMPTY = { name: '', price: '', stock: '', genre: '', platform: '', description: '', fear: '3', image: '' }

function Alta() {
  const { addProduct } = useProducts()
  const { showToast } = useToast()

  const [fields, setFields] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const newErrors = validate({ ...fields, [name]: value })
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

    setSubmitting(true)
    try {
      const payload = {
        name: fields.name.trim(),
        price: Number(fields.price.replace(',', '.')),
        stock: Number(fields.stock),
        genre: fields.genre,
        platform: fields.platform,
        description: fields.description.trim(),
        fear: Number(fields.fear),
        image: fields.image.trim(),
      }
      const created = await createProduct(payload)
      addProduct(created)
      showToast(`"${created.name}" dado de alta correctamente.`, 'success')
      setFields(EMPTY)
      setErrors({})
      setTouched({})
    } catch {
      showToast('Error al guardar. Intenta de nuevo.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  function inputClass(name) {
    if (!touched[name]) return 'form__input'
    return `form__input ${errors[name] ? 'is-invalid' : 'is-valid'}`
  }

  function selectClass(name) {
    if (!touched[name]) return 'form__select'
    return `form__select ${errors[name] ? 'is-invalid' : 'is-valid'}`
  }

  return (
    <section className="section section--form" aria-labelledby="alta-title">
      <div className="container">
        <header className="section__header">
          <h1 className="section__title" id="alta-title">Alta de producto</h1>
          <p className="section__subtitle">
            Registra un videojuego dentro de la curaduria de terror.
          </p>
        </header>

        <form className="form form--product" onSubmit={handleSubmit} noValidate>
          <div className="form__grid">

            <div className="form__field">
              <label className="form__label" htmlFor="name">
                Nombre del producto
              </label>
              <input
                className={inputClass('name')}
                type="text"
                id="name"
                name="name"
                value={fields.name}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby="err-name"
                aria-invalid={!!errors.name}
              />
              <p className="form__hint">3–60 caracteres. Letras, numeros y :\'"- </p>
              <p className="form__error" id="err-name">{errors.name}</p>
            </div>

            <div className="form__field">
              <label className="form__label" htmlFor="price">
                Precio (S/)
              </label>
              <input
                className={inputClass('price')}
                type="text"
                id="price"
                name="price"
                value={fields.price}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: 79.90"
                aria-describedby="err-price"
                aria-invalid={!!errors.price}
              />
              <p className="form__hint">Numero positivo. Ej: 79 o 79.90</p>
              <p className="form__error" id="err-price">{errors.price}</p>
            </div>

            <div className="form__field">
              <label className="form__label" htmlFor="stock">
                Stock
              </label>
              <input
                className={inputClass('stock')}
                type="number"
                id="stock"
                name="stock"
                value={fields.stock}
                onChange={handleChange}
                onBlur={handleBlur}
                min="0"
                aria-describedby="err-stock"
                aria-invalid={!!errors.stock}
              />
              <p className="form__hint">Entero mayor o igual a 0.</p>
              <p className="form__error" id="err-stock">{errors.stock}</p>
            </div>

            <div className="form__field">
              <label className="form__label" htmlFor="genre">
                Genero
              </label>
              <select
                className={selectClass('genre')}
                id="genre"
                name="genre"
                value={fields.genre}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby="err-genre"
                aria-invalid={!!errors.genre}
              >
                <option value="">Seleccionar…</option>
                {GENRES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <p className="form__error" id="err-genre">{errors.genre}</p>
            </div>

            <div className="form__field">
              <label className="form__label" htmlFor="platform">
                Plataforma
              </label>
              <select
                className={selectClass('platform')}
                id="platform"
                name="platform"
                value={fields.platform}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby="err-platform"
                aria-invalid={!!errors.platform}
              >
                <option value="">Seleccionar…</option>
                {PLATFORMS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <p className="form__error" id="err-platform">{errors.platform}</p>
            </div>

            <fieldset className="form__fieldset">
              <legend className="form__legend">Fear Rating</legend>
              <div className="form__radios">
                {[1, 2, 3, 4, 5].map(n => (
                  <label key={n} className="form__radio">
                    <input
                      type="radio"
                      name="fear"
                      value={String(n)}
                      checked={fields.fear === String(n)}
                      onChange={handleChange}
                    />
                    <span>{n}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="form__field form__field--full">
              <label className="form__label" htmlFor="description">
                Descripcion
              </label>
              <textarea
                className={`form__textarea${touched.description ? (errors.description ? ' is-invalid' : ' is-valid') : ''}`}
                id="description"
                name="description"
                value={fields.description}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={5}
                aria-describedby="err-description"
                aria-invalid={!!errors.description}
              />
              <p className="form__hint">Minimo 20 caracteres.</p>
              <p className="form__error" id="err-description">{errors.description}</p>
            </div>

            <div className="form__field form__field--full">
              <label className="form__label" htmlFor="image">
                Imagen (opcional)
              </label>
              <input
                className={inputClass('image')}
                type="url"
                id="image"
                name="image"
                value={fields.image}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://ejemplo.com/imagen.jpg"
                aria-describedby="err-image"
                aria-invalid={!!errors.image}
              />
              <p className="form__hint">URL que termine en .jpg, .jpeg, .png, .gif o .webp</p>
              <p className="form__error" id="err-image">{errors.image}</p>
            </div>

          </div>

          <div className="form__actions">
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Guardando…' : 'Guardar producto'}
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
      </div>
    </section>
  )
}

export default Alta
