const express = require('express');
const pieceJointe = require('../model/pieceJointe');
const router = express.Router();

// GET /pieces
router.get('/', (req, res, next) => {
  pieceJointe.readAll()
    .then(data => {
      res.render('pieces', { title: 'Pièces Jointes', pieces: data });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Erreur récupération pièces jointes');
    });
});

module.exports = router;
