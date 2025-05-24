var express = require('express');
const candidature = require('../model/candidature');

var router = express.Router();

/* GET new candidature page. */
router.get('/', function(req, res, next) {
    res.render('new_candidature');
});

router.post('/', function(req, res, next) {
    const { date_candidature, utilisateur_id, id_offre } = req.body;
    const promise = candidature.create({ date_candidature, utilisateur_id, id_offre });

    promise.then((data) => {
        res.render('creation_candidature', { title: 'Création de la candidature', candidature: data });
    });

    promise.catch((err) => {
        console.log(err);
        res.status(500).send('Error creating new candidature');
    });
    });
    
module.exports = router;