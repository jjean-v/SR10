var express = require('express');
const ficheDePoste = require('../model/fiche_de_poste');

var router = express.Router();

/* GET new fiche de poste page. */
router.get('/', function(req, res, next) {
    res.render('new_fiche_de_poste');
});

router.post('/', function(req, res, next) {
    const { intitule, statut_poste, type_metier, salaire, rythme, lieu, description } = req.body;
    const promise = ficheDePoste.create({
        intitule,
        statut_poste,
        type_metier,
        salaire,
        rythme,
        lieu,
        description
    });

    promise.then((data) => {
        res.render('creation_X', { title: 'Fiche de poste créée', fiche: data, objet:"fiche de poste", url : "/fiche_de_poste" });
    });

    promise.catch((err) => {
        console.log(err);
        res.status(500).send('Erreur lors de la création de la fiche de poste');
    });
});

module.exports = router;