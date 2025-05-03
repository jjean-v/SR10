const express = require('express');
const recruteur = require('../../model/recruteur');
const offre = require('../../model/offre');
var router = express.Router();

router.get('/', function(req, res, next) {

    promiseO=offre.readall();
    promiseO.then( (data) =>{

        res.render('offre', { title: 'Offre', offre: data });
    });
    promiseO.catch( (err) => {
        console.log(err);
        res.status(500).send('Error retrieving Offre data');
    }); 
});

module.exports = router;
