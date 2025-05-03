var express = require('express');
const fiche_de_poste = require('../model/fiche_de_poste');
var router = express.Router();

/* GET Organisation listing. */

router.get('/', function(req, res, next) {

    promiseO=fiche_de_poste.readAll();
    promiseO.then( (data) =>{

        res.render('fiche_de_poste', { title: 'Fiche_de_Poste', fiche_de_poste: data });
    });
    promiseO.catch( (err) => {
        console.log(err);
        res.status(500).send('Error retrieving fiche de poste data');
    }); 
});

module.exports = router;
