const express = require("express");
const router = express.Router();
const usersController = require("../controller/usersController"); // Contrôleur pour les utilisateurs

// Routes définies et liées aux contrôleurs
router.post("/", usersController.login);

module.exports = router;
