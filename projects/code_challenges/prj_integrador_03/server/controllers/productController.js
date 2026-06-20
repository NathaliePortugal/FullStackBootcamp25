const Product = require('../models/Product')

async function getAllProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function createProduct(req, res) {
  try {
    const imageUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : ''

    const product = new Product({
      name: req.body.name,
      price: Number(req.body.price),
      platforms: JSON.parse(req.body.platforms),
      genre: req.body.genre,
      description: req.body.description,
      fear: Number(req.body.fear),
      image: imageUrl,
    })
    const saved = await product.save()
    res.status(201).json(saved)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

async function updateProduct(req, res) {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' })
    res.json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' })
    res.json({ message: 'Producto eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct }
