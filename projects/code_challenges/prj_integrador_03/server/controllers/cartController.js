const Cart = require('../models/Cart')
const Product = require('../models/Product')

async function saveCart(req, res) {
  try {
    const { items, total } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'El carrito esta vacio' })
    }

    const cartData = {
      items: items.map((item) => ({
        productId: String(item._id || item.id),
        name: item.name,
        price: Number(item.price),
        platform: item.selectedPlatform,
        qty: Number(item.qty),
        subtotal: Number(item.price) * Number(item.qty)
      })),
      total: Number(total)
    }

    console.log('\n========== NUEVO PEDIDO ==========')
    console.log(JSON.stringify(cartData, null, 2))
    console.log('==================================\n')

    const cart = new Cart(cartData)
    const saved = await cart.save()

    await Promise.all(
      items.map((item) =>
        Product.updateOne(
          { _id: item._id || item.id, 'platforms.name': item.selectedPlatform },
          { $inc: { 'platforms.$.stock': -Number(item.qty) } }
        )
      )
    )

    res.status(201).json({ message: 'Pedido guardado correctamente', order: saved })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { saveCart }
