const express = require("express")
const router = express.Router()

const authMiddleware = require("../middlewares/authMiddleware")
const pantryItemsController = require("../controllers/pantryItemsController")

//create
router.post("/pantries/:pantryId/items", authMiddleware, pantryItemsController.createPantryItem);
//index
router.get("/pantries/:pantryId/items", authMiddleware, pantryItemsController.getAllPantryItems);
//expiring
router.get("/pantries/:pantryId/expiring", authMiddleware, pantryItemsController.expiringItems);
//expiring tutte cose
router.get("/products/expiring", authMiddleware, pantryItemsController.expiringItemsGetAll);
//reduceQuantityItem
router.patch("/pantries/:pantryId/items/:itemId/consume", authMiddleware, pantryItemsController.reduceQuantityItem);
//update item
router.patch("/pantries/:pantryId/items/:itemId", authMiddleware, pantryItemsController.updateItem);
//delete
router.delete("/pantries/:pantryId/items/:itemId", authMiddleware, pantryItemsController.deletePantryItem)

module.exports = router