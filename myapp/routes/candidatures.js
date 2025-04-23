// routes/candidatures.js

const express    = require('express');
const router     = express.Router();
const candidature = require('../model/candidature');

router.get('/', async (req, res) => {
  try {
    const candidatures = await candidature.readAllDetailed();
    res.render('candidatures', {
      title: 'Gestion des Candidatures',
      candidatures
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(`Erreur récupération candidatures : ${err.message}`);
  }
});

module.exports = router;
