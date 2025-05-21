var express = require('express');
const ficheDePoste = require('../model/fiche_de_poste');

var router = express.Router();

/* GET new fiche de poste page. */
router.get('/', function(req, res, next) {
    res.render('new_fiche_de_poste');
});

router.post('/', function(req, res, next) {
    const { titre, description, salaire, localisation, typeContrat } = req.body;
    const promise = ficheDePoste.create({
        titre,
        description,
        salaire,
        localisation,
        typeContrat,
        dateCreation: new Date()
    });

    promise.then((data) => {
        res.render('fiche_de_poste_cree', { title: 'Fiche de poste créée', fiche: data });
    });

    promise.catch((err) => {
        console.log(err);
        res.status(500).send('Erreur lors de la création de la fiche de poste');
    });
});

module.exports = router;