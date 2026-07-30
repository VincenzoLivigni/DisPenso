const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const pantryController = require("../controllers/pantryController");

// Crea una nuova dispensa
router.post("/pantries", authMiddleware, pantryController.createPantry);

// Recupera tutte le dispense a cui l'utente ha accesso
router.get("/pantries", authMiddleware, pantryController.getUserPantries);

// Richiedi di unirti a una dispensa tramite codice
router.post("/pantries/join", authMiddleware, pantryController.joinPantryRequest);

// Recupera i membri di una dispensa specifica
router.get("/pantries/:pantryId/members", authMiddleware, pantryController.getPantryMembers);

// Accetta un membro nella dispensa 
router.patch("/pantries/:pantryId/members/:targetUserId/accept", authMiddleware, pantryController.acceptMember);

// Rimuovi un membro 
router.delete("/pantries/:pantryId/members/:targetUserId", authMiddleware, pantryController.removeOrLeavePantry);

// Abbandona la dispensa 
router.delete("/pantries/:pantryId/leave", authMiddleware, pantryController.removeOrLeavePantry);

module.exports = router;