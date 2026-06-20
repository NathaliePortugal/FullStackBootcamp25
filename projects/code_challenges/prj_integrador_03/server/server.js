const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs')
const connectDB = require('./config/db')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')

dotenv.config()

connectDB()

const app = express()

const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadsDir))

app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Jugueteria Cosmica API corriendo correctamente' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})
