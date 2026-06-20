import { useState } from 'react'
import { createProduct } from '../api/products'
import { useProducts } from '../hooks/useProducts'
import { useToast } from '../hooks/useToast'

const GENRES = ['Survival Horror', 'Psychological Horror', 'Cosmic Horror', 'Action Horror']
const PLATFORMS = ['PS5', 'PC', 'Xbox Series', 'Nintendo Switch']

const RULES = {
  name: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9][A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s:'"-]{2,59}$/,
  price: /^(?:0|[1-9]\d{0,4})(?:[.,]\d{1,2})?$/,
}

const EMPTY_STOCKS = Object.fromEntries(PLATFORMS.map(p => [p, '']))

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

  if (fields.platforms.length === 0) {
    errors.platforms = 'Selecciona al menos una plataforma.'
  } else {
    const invalid = fields.platforms.filter(p => {
      const s = fields.platformStocks[p]
      return s === '' || !Number.isInteger(Number(s)) || Number(s) < 0
    })
    if (invalid.length > 0) {
      errors.platforms = `Stock invalido en: ${invalid.join(', ')}. Usa un entero (0 o mas).`
    }
  }

  if (!fields.genre) {
    errors.genre = 'Selecciona un genero.'
  }

  if (!fields.description.trim()) {
    errors.description = 'La descripcion es obligatoria.'
  } else if (fields.description.trim().length < 20) {
    errors.description = 'Minimo 20 caracteres.'
  }

  return errors
}

const EMPTY = {
  name: '',
  price: '',
  platforms: [],
  platformStocks: { ...EMPTY_STOCKS },
  genre: '',
  description: '',
  fear: '3',
  imageFile: null,
}

function Alta() {
  const { addProduct } = useProducts()
  const { showToast } = useToast()

  const [fields, setFields] = useState(EMPTY)
  const [imagePreview, setImagePreview] = useState(null)
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

  function togglePlatform(name) {
    setFields(prev => {
      const included = prev.platforms.includes(name)
      const updated = {
        ...prev,
        platforms: included
          ? prev.platforms.filter(p => p !== name)
          : [...prev.platforms, name]
      }
      if (touched.platforms) {
        const newErrors = validate(updated)
        setErrors(e => ({ ...e, platforms: newErrors.platforms || '' }))
      }
      return updated
    })
  }

  function handlePlatformStock(platformName, value) {
    setFields(prev => {
      const updated = {
        ...prev,
        platformStocks: { ...prev.platformStocks, [platformName]: value }
      }
      if (touched.platforms) {
        const newErrors = validate(updated)
        setErrors(e => ({ ...e, platforms: newErrors.platforms || '' }))
      }
      return updated
    })
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setFields(prev => ({ ...prev, imageFile: file }))
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const allTouched = { name: true, price: true, platforms: true, genre: true, description: true }
    setTouched(allTouched)
    const newErrors = validate(fields)
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      showToast('Revisa los campos marcados.', 'error')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('name', fields.name.trim())
      formData.append('price', Number(fields.price.replace(',', '.')))
      formData.append('platforms', JSON.stringify(
        fields.platforms.map(name => ({
          name,
          stock: Number(fields.platformStocks[name])
        }))
      ))
      formData.append('genre', fields.genre)
      formData.append('description', fields.description.trim())
      formData.append('fear', Number(fields.fear))
      if (fields.imageFile) formData.append('image', fields.imageFile)

      const created = await createProduct(formData)
      addProduct(created)
      showToast(`"${created.name}" dado de alta correctamente.`, 'success')
      setFields(EMPTY)
      setImagePreview(null)
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

  function stockClass(platformName) {
    if (!touched.platforms) return 'form__input'
    const s = fields.platformStocks[platformName]
    const isInvalid = s === '' || !Number.isInteger(Number(s)) || Number(s) < 0
    return `form__input ${isInvalid ? 'is-invalid' : 'is-valid'}`
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

            <fieldset
              className="form__fieldset form__field--full"
              aria-describedby="err-platforms"
            >
              <legend className="form__legend">
                Plataformas y stock <span className="form__hint">(al menos 1)</span>
              </legend>
              <div className="form__platform-list">
                {PLATFORMS.map(p => (
                  <div key={p} className="form__platform-row">
                    <label className="form__radio">
                      <input
                        type="checkbox"
                        checked={fields.platforms.includes(p)}
                        onChange={() => togglePlatform(p)}
                        onBlur={() => setTouched(prev => ({ ...prev, platforms: true }))}
                      />
                      <span>{p}</span>
                    </label>
                    {fields.platforms.includes(p) && (
                      <div className="form__platform-stock">
                        <label className="form__label" htmlFor={`stock-${p}`}>Stock</label>
                        <input
                          className={stockClass(p)}
                          type="number"
                          id={`stock-${p}`}
                          min="0"
                          value={fields.platformStocks[p]}
                          onChange={e => handlePlatformStock(p, e.target.value)}
                          onBlur={() => setTouched(prev => ({ ...prev, platforms: true }))}
                          placeholder="0"
                          style={{ width: '80px' }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="form__error" id="err-platforms">{errors.platforms}</p>
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
                className="form__input"
                type="file"
                id="image"
                name="image"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
              />
              <p className="form__hint">JPG, PNG, GIF o WEBP — máximo 5 MB</p>
              {imagePreview && (
                <div className="form__image-preview">
                  <img src={imagePreview} alt="Vista previa" />
                </div>
              )}
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
