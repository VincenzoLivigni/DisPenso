const express = require("express")
const router = express.Router()

const authMiddleware = require("../middlewares/authMiddleware")
const pantryItemsController = require("../controllers/pantryItemsController")

//create
router.post("/pantries/:pantryId/items", authMiddleware, pantryItemsController.createPantryItem);
//index
router.get("/pantries/:pantryId/items", authMiddleware, pantryItemsController.getAllPantryItems);
//delete
router.delete("/pantries/:pantryId/items/:itemId", authMiddleware, pantryItemsController.deletePantryItem)

module.exports = router