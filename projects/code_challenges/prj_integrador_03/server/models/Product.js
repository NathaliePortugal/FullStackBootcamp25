const mongoose = require('mongoose')

const platformStockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ['PS5', 'PC', 'Xbox Series', 'Nintendo Switch']
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'El stock no puede ser negativo'],
      default: 0
    }
  },
  { _id: false }
)

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo']
    },
    platforms: {
      type: [platformStockSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Debe seleccionar al menos una plataforma'
      }
    },
    genre: {
      type: String,
      required: [true, 'El genero es obligatorio'],
      enum: ['Survival Horror', 'Psychological Horror', 'Cosmic Horror', 'Action Horror']
    },
    description: {
      type: String,
      required: [true, 'La descripcion es obligatoria'],
      minlength: [20, 'La descripcion debe tener al menos 20 caracteres']
    },
    fear: {
      type: Number,
      required: [true, 'El nivel de miedo es obligatorio'],
      min: 1,
      max: 5
    },
    image: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)
