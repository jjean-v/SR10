const express = require('express');
const router = express.Router();
const utilisateur = require('../model/utilisateur');
const session = require("../session");


// GET /utilisateurs
router.get('/', (req, res, next) => {
  utilisateur.readAll()
    .then(data => res.render('utilisateurs', { title: 'Utilisateurs', utilisateurs: data }))
    .catch(err => {
      console.error(err);
      res.status(500).send('Erreur lors de la récupération des utilisateurs');
    });
});

router.get('/recruteur',(req,res, next) => {
    promiseO=utilisateur.readRecruteur()
    
      promiseO.then(data =>{
        res.render('recruteur', {title:'Recruteurs', utilisateurs:data });
      });
      promiseO.catch( (err) => {
        console.log(err);
        res.status(500).send("Erreur lors de la récupération des recruteur");
      });
  });

router.get('/new_user', function(req, res, next) {
    res.render('new_user');
});

router.post('/creation_compte', function(req, res, next) {
  const { nom, prenom, password, email, zip } = req.body;
  promise = utilisateur.create({nom ,prenom, email , motDePasse:password, role:'candidat',role_recruteur: null,etat_compte:'alive',siren:null})
  promise.then( (data) =>{

    session.creatSession(req.session, email, 'candidat'); 
    res.render('creation_compte', { title: 'creation du compte', user: data });

  });

  promise.catch( (err) => {
      console.log(err);
      res.status(500).send('Error retrieving new user data');
  }); 

});





module.exports = router;

