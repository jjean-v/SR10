var express = require('express');
const organisation = require('../model/organisation');
var router = express.Router();

/* GET Organisation listing. */

router.get('/', function(req, res, next) {

    promiseO=organisation.read("Mon Organisation");
    promiseO.then( (data) =>{

        res.render('organisation_nom', { title: 'Organisation', organisation: data });
    });
    promiseO.catch( (err) => {
        console.log(err);
        res.status(500).send('Error retrieving organisation data');
    });
});

module.exports = router;
