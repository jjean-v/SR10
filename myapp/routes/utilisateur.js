const express = require('express');
const router = express.Router();
const utilisateur = require('../model/utilisateur');


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







module.exports = router;

