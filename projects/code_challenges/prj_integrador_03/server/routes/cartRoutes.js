const express = require('express')
const router = express.Router()
const { saveCart } = require('../controllers/cartController')

router.post('/', saveCart)

module.exports = router
