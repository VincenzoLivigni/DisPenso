const express = require("express")
const router = express.Router()

const productsController = require("../controllers/productsController")

//create
router.post('/products', productsController.create);
//index
router.get("/products", productsController.getAll);
//delete
router.delete('/products/:id', productsController.delete)

module.exports = router