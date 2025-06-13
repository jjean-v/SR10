// routes/candidatures.js

const express    = require('express');
const router     = express.Router();
const candidature = require('../model/candidature');
const offre = require('../model/offre');
const utilisateur = require('../model/utilisateur');
const pieceJointe = require('../model/pieceJointe');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;
    const siren = req.session.siren;
    const allCandidatures = await candidature.readAllDetailed(siren);
    const total = allCandidatures.length;
    const candidatures = allCandidatures.slice(offset, offset + limit);
    const totalPages = Math.ceil(total / limit);
    res.render('candidatures', {
      title: 'Gestion des Candidatures',
      candidatures,
      page,
      totalPages
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(`Erreur récupération candidatures : ${err.message}`);
  }
});

router.get('/candidat', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;
    const allCandidatures = await candidature.readById(req.session.userid);
    const total = allCandidatures.length;
    const candidatures = allCandidatures.slice(offset, offset + limit);
    const totalPages = Math.ceil(total / limit);
    res.render('candidatures_candidat', {
      title: 'Gestion des Candidatures',
      candidatures,
      page,
      totalPages
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(`Erreur récupération candidatures : ${err.message}`);
  }
});


router.post('/visualiser_offre', function(req, res, next) {
  const id_offre = req.body.id_offre;
  console.log("ID de l'offre à visualiser :", id_offre);


  promise = offre.readsingle(id_offre)
  promise.then( (data) =>{
    console.log(data[0]);
    res.render('visualiser_offre', { title: 'Visualisation de l offre', data: data[0]});
  });

  promise.catch( (err) => {
      console.log(err);
      res.status(500).send('Error retrieving  offre data');
  }); 

});


router.post('/accepter', function(req, res, next) {
  const {id_offre, id_user} = req.body;

  promise = candidature.admis(id_user, id_offre)
  promise.then( (data) =>{
    console.log(data[0]);
    res.render('accepter_candidature', { title: 'Candidature accepté'});
  });

  promise.catch( (err) => {
      console.log(err);
      res.status(500).send('Error retrieving  offre data');
  }); 

});


router.post('/valider_offre', function(req, res, next) {
  const {id_offre, id_user} = req.body;


  promise = candidature.accepter(id_user, id_offre)
  promise.then( (data) =>{
    promise2 = candidature.refuse(id_user, id_offre)
    promise2.then( (data) =>{
        res.render('accepter_offre', { title: 'Offre accepté'});

    });
    promise2.catch( (err) => {
        console.log(err);
        res.status(500).send('Error retrieving  candidature data');
    });
  });

  promise.catch( (err) => {
      console.log(err);
      res.status(500).send('Error retrieving  candidature data');
  }); 

});

router.get("/accepter_offre", function(req, res, next){
  res.render("accepter_offre", {title:"offre acceptée"});
});

// Visualisation d'une candidature (détail)
router.get('/:id_candidature/visualiser', async function(req, res) {
  const id_candidature = req.params.id_candidature;
  try {
    // Récupérer la candidature avec les infos du poste
    const candidatureResult = await candidature.readByCandidatureId(id_candidature);
    const candidatureData = candidatureResult && candidatureResult[0];
    if (!candidatureData) return res.status(404).render('error', { message: "Candidature non trouvée", error: {} });
    // Récupérer les infos du candidat
    const candidatResult = await utilisateur.readById(candidatureData.utilisateur_id);
    const candidat = candidatResult && candidatResult[0];
    // Récupérer les pièces jointes
    const pieces = await pieceJointe.readByCandidature(id_candidature);
    res.render('visualiser_candidature', { candidature: candidatureData, candidat, pieces });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: "Erreur lors de la récupération des détails de la candidature", error: err });
  }
});

module.exports = router;
