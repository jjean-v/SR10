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

// Ajout d'une route pour l'espace recruteur
router.get('/espace_recruteur', async function(req, res) {
    const siren = req.session.siren;
    console.log("siren :", siren);
    if (req.session && req.session.role === 'recruteur') {
        // Affiche la vue recruteur
        promiseO = offre.read_recruteur(siren);
        promiseO.then((data) => {
            res.render('offre_recruteur', { title: 'Espace Recruteur', offre: data });
        });
        promiseO.catch((err) => {
            console.log(err);
            res.status(500).send('Erreur lors de la récupération des offres');
        });
    } else if (req.session && req.session.role === 'candidat') {
        // Affiche le formulaire de demande pour devenir recruteur
        try {
            const organisations = await organisation.readall();
            res.render('demande_recruteur', { organisations });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erreur lors de la récupération des organisations');
        }
    } else {
        res.status(403).render('error', { message: "Accès refusé.", error: {} });
    }
});

// Route pour traiter la demande de passage recruteur
router.post('/demande_recruteur', async function(req, res) {
    if (!req.session || req.session.role !== 'candidat') {
        return res.status(403).render('error', { message: "Accès refusé.", error: {} });
    }
    const userId = req.session.userid;
    const siren = req.body.siren;
    try {
        // Vérifier le rôle actuel de l'utilisateur
        const users = await recruteur.read('id_user', userId);
        const user = Array.isArray(users) ? users[0] : users;
        if (!user) {
            return res.status(404).render('error', { message: "Utilisateur non trouvé.", error: {} });
        }
        console.log('DEBUG role_recruteur:', user.role_recruteur); // Ajout debug
        if ((user.role_recruteur || '').toLowerCase() === 'validé') {
            return res.render('confirmation_postulation', { message: "Vous êtes déjà recruteur." });
        }
        if ((user.role_recruteur || '').toLowerCase() === 'attente') {
            return res.render('confirmation_postulation', { message: "Votre demande pour devenir recruteur est déjà en attente de validation." });
        }
        // Si refusé ou jamais demandé (null), on autorise la demande
        await recruteur.update(userId, { role_recruteur: 'attente', siren });
        res.render('confirmation_postulation', { message: "Votre demande pour devenir recruteur a bien été envoyée. Elle sera validée par un administrateur." });
    } catch (err) {
        console.log('Erreur update recruteur:', err);
        res.status(500).render('error', { message: "Erreur lors de la demande.", error: err });
    }
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
