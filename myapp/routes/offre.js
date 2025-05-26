var express = require('express');
const offre = require('../model/offre.js');
const recruteur = require('../model/utilisateur');
const fiche_de_poste = require('../model/fiche_de_poste');
var router = express.Router();

/* GET Organisation listing. */

router.get('/', function(req, res, next) {

    promiseO=offre.readall();
    promiseO.then( (data) =>{

        res.render('offre_candidat', { title: 'Offre', offre: data });
    });
    promiseO.catch( (err) => {
        console.log(err);
        res.status(500).send('Error retrieving Offre data');
    }); 
});


router.get('/new_offre', async (req, res) => {
    try {
      const responsables = await recruteur.readRecruteur();
      const fichesPoste = await fiche_de_poste.readAll();
  
      res.render('new_offre',{ title : 'test', responsables :responsables, fichesPoste : fichesPoste});
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors du chargement des données.");
    }
  });


router.post('/creation_X', function(req, res, next) {
  const {date_validite, liste_piece_demande, nb_piece_demande, resp_hierarchique, id_fiche_poste} = req.body;


  promise = offre.createOffre({etat : 'publiée', date_validite, liste_piece_demande, nb_piece_demande, resp_hierarchique, id_fiche_poste})
  promise.then( (data) =>{

    res.render('creation_offre', { title: 'creation de l offre', user: data , objet : "offre", url : "/offre"});

  });

  promise.catch( (err) => {
      console.log(err);
      res.status(500).send('Error retrieving new user data');
  }); 

});

// Ajout d'une route pour l'espace recruteur
router.get('/espace_recruteur', function(req, res) {
    if (req.session && req.session.role === 'recruteur') {
        // Affiche la vue recruteur
        promiseO = offre.readall();
        promiseO.then((data) => {
            res.render('offre_recruteur', { title: 'Espace Recruteur', offre: data });
        });
        promiseO.catch((err) => {
            console.log(err);
            res.status(500).send('Erreur lors de la récupération des offres');
        });
    } else {
        res.status(403).render('error', { message: "Vous n'êtes pas recruteur.", error: {} });
    }
});

module.exports = router;
