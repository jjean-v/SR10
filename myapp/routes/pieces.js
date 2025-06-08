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

// Suppression d'une pièce jointe
router.post('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await pieceJointe.delete(id);
    res.redirect('/pieces');
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la suppression de la pièce jointe");
  }
});

module.exports = router;
