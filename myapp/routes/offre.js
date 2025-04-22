var express = require('express');
const offre = require('../model/offre.js');
var router = express.Router();

/* GET Organisation listing. */

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
