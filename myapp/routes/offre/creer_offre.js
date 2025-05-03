const express = require('express');
const recruteur = require('../../model/utilisateur');
const fiche_de_poste = require('../../model/fiche_de_poste');
var router = express.Router();

router.get('/', async (req, res) => {
    try {
      const [responsables] = await recruteur.readAll();
      const [fichesPoste] = await fiche_de_poste.readAll();
  
      res.render('creerOrganisation', {
        responsables,
        fichesPoste
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors du chargement des données.");
    }
  });

module.exports = router;
