const express = require('express');
const recruteur = require('../../model/utilisateur');
const fiche_de_poste = require('../../model/fiche_de_poste');
var router = express.Router();

router.get('/', async (req, res) => {
    try {
      const responsables = await recruteur.readRecruteur();
      const fichesPoste = await fiche_de_poste.readAll();
  
      res.render('new_offre',{ title : 'test', responsables :responsables, fichesPoste : fichesPoste});
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors du chargement des données.");
    }
  });

module.exports = router;
