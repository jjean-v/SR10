var express = require('express');
var router = express.Router();
const organisation = require('../../model/organisation');

router.get('/', function(req, res, next) {
    res.render('new_organisation');
}
);
router.post('/', function(req, res, next) {
    const { nom_organisation, siren, adresse, code_postal, ville } = req.body;
    const promise = organisation.create({ nom_organisation, siren, adresse, code_postal, ville });

    promise.then((data) => {
        res.render('creation_organisation', { title: 'Création de l\'organisation', organisation: data });
    });

    promise.catch((err) => {
        console.log(err);
        res.status(500).send('Error creating new organisation');
    });
});
module.exports = router;