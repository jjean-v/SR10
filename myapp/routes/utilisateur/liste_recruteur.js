const express = require('express');
const router = express.Router();
const utilisateur = require('../../model/utilisateur');

 // fonction pour afficher la liste des recruteurs
 // sera ensuite afficher dans un menu déroulant
 // pour la création d'une offre
router.get('/',(req,res, next) => {
    promiseO=utilisateur.readRecruteur()
    
      promiseO.then(data =>{
        res.render('recruteur', {title:'Recruteurs', utilisateurs:data });
      });
      promiseO.catch( (err) => {
        console.log(err);
        res.status(500).send("Erreur lors de la récupération des recruteur");
      });
  });

  module.exports = router;
