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
// post /candidatures
  router.post("/", (req, res, next) => {
    const { date_candidature, utilisateur_id, id_offre } = req.body;
    candidature.create({ date_candidature, utilisateur_id, id_offre })
      .then(() => res.redirect('/candidatures'))
      .catch(err => {
        console.error(err);
        res.status(500).send('Erreur création candidature');
      });
  
    });
module.exports = router;