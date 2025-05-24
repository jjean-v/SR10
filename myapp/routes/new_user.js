var express = require('express');
var router = express.Router();
const utilisateur = require('../model/utilisateur');
const session = require("../session");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('new_user');
});

router.post('/', function(req, res, next) {
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
