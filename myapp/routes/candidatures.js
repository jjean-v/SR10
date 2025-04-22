const express = require('express');
const router = express.Router();
const candidature = require('../model/candidature');

// GET /candidatures
router.get('/', (req, res, next) => {
    candidature.readAll()
      .then(data => res.render('candidatures', { title: 'Candidatures', candidatures: data }))
      .catch(err => {
        console.error(err);
        res.status(500).send('Erreur récupération candidatures');
      });
  });

module.exports = router;