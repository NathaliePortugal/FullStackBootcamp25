const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    platform: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true }
  },
  { _id: false }
)

const cartSchema = new mongoose.Schema(
  {
    items: {
      type: [cartItemSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'El carrito debe tener al menos un producto'
      }
    },
    total: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Cart', cartSchema)
