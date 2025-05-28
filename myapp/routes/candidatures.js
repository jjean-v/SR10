// routes/candidatures.js

const express    = require('express');
const router     = express.Router();
const candidature = require('../model/candidature');
const offre = require('../model/offre');

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

router.get('/candidat', async (req, res) => {
  try {
    const candidatures = await candidature.readById(req.session.userid);
    res.render('candidatures_candidat', {
      title: 'Gestion des Candidatures',
      candidatures
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
module.exports = router;
