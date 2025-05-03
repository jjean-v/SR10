const express = require('express');
const recruteur = require('../../model/recruteur');
const offre = require('../../model/offre');
var router = express.Router();



router.get('/', function(req, res, next) {

    promiseO=recruteur.readall();
    promiseO.then( (data) =>{

        res.render('organisation', { title: 'Organisation', organisation: data });
    });
    promiseO.catch( (err) => {
        console.log(err);
        res.status(500).send('Error retrieving organisation data');
    }); 
});

router.get('/creer-organisation', async (req, res) => {
  try {
    const [responsables] = await db.query('SELECT id, nom FROM responsables');
    const [fichesPoste] = await db.query('SELECT id, titre FROM fiches_poste');

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
