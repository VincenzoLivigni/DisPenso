const express = require("express")
const router = express.Router()

const authMiddleware = require("../middlewares/authMiddleware")
const productsController = require("../controllers/productsController")

//create
router.post('/products', authMiddleware, productsController.create);
//index
router.get("/products", authMiddleware, productsController.getAll);
//delete
router.delete('/products/:id', authMiddleware, productsController.delete)

module.exports = router