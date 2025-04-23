// routes/pieces.js

const express     = require('express');
const router      = express.Router();
const pieceJointe = require('../model/pieceJointe');

// GET /pieces
router.get('/', async (req, res) => {
  try {
    const pieces = await pieceJointe.readAllDetailed();
    res.render('pieces', {
      title: 'Gestion des Pièces Jointes',
      pieces
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(`Erreur récupération pièces jointes : ${err.message}`);
  }
});

module.exports = router;
