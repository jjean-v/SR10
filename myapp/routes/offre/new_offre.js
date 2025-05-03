var express = require('express');
var router = express.Router();
const utilisateur = require('../../model/offre');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('creation_offre');
});


router.post('/', function(req, res, next) {
  const {date_validite, liste_piece_demande, nb_piece_demande, resp_hierarchique, id_fiche_poste} = req.body;


  promise = utilisateur.createOffre({etat : 'publiée', date_validite, liste_piece_demande, nb_piece_demande, resp_hierarchique, id_fiche_poste})
  promise.then( (data) =>{

    res.render('creation_offre', { title: 'creation de l offre', user: data });

  });

  promise.catch( (err) => {
      console.log(err);
      res.status(500).send('Error retrieving new user data');
  }); 

});


module.exports = router;
