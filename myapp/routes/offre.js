var express = require('express');
const offre = require('../model/offre.js');
const recruteur = require('../model/utilisateur');
const fiche_de_poste = require('../model/fiche_de_poste');
const organisation = require('../model/organisation');
var router = express.Router();

/* GET Organisation listing. */

router.get('/candidat', function(req, res, next) {
    const userid = req.session.userid;
    if (!userid) {
        return res.redirect('/'); 
    }


    promiseO=offre.read_pas_postuler(userid);
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


router.post('/creation_offre', function(req, res, next) {
  const {date_validite, liste_piece_demande, nb_piece_demande, resp_hierarchique, id_fiche_poste} = req.body;


  promise = offre.createOffre({etat : 'publiée', date_validite, liste_piece_demande, nb_piece_demande, resp_hierarchique, id_fiche_poste})
  promise.then( (data) =>{

    res.render('creation_X', { title: 'creation de l offre', user: data , objet : "offre", url : "/offre"});

  });

  promise.catch( (err) => {
      console.log(err);
      res.status(500).send('Error retrieving new user data');
  }); 

});


// Route pour postuler à une offre
router.post('/postuler', function(req, res) {
    // Récupération des infos nécessaires
    const id_offre = req.body.id_offre;
    const id_user = req.session.userid;
    const date_postulation = new Date();

    // Vérification des champs
    if (!id_offre || !id_user) {
        return res.status(400).render('error', { message: "Erreur : informations manquantes pour la candidature.", error: {} });
    }

    // Appel au modèle pour créer la candidature
    const candidatureModel = require('../model/candidature');
    candidatureModel.create({
        date_candidature: date_postulation,
        utilisateur_id: id_user,
        id_offre: id_offre
    })
    .then(() => {
        res.render('confirmation_postulation', { id_offre });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).render('error', { message: "Erreur lors de la postulation.", error: err });
    });
});

module.exports = router;
