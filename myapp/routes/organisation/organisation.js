var express = require('express');
const organisation = require('../../model/organisation');
var router = express.Router();

/* GET Organisation listing. */

router.get('/', function(req, res, next) {

    promiseO=organisation.readall();
    promiseO.then( (data) =>{

        res.render('organisation', { title: 'Organisation', organisation: data });
    });
    promiseO.catch( (err) => {
        console.log(err);
        res.status(500).send('Error retrieving organisation data');
    }); 
});

// Accepter une organisation
router.post('/accepter', async function(req, res) {
    const siren = req.body.siren;
    try {
        await organisation.updateEtat(siren, 'validé');
        res.redirect('/organisations');
    } catch (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la validation de l'organisation");
    }
});

// Supprimer une organisation
router.post('/supprimer', async function(req, res) {
    const siren = req.body.siren;
    try {
        await organisation.deleteOrga(siren);
        res.redirect('/organisations');
    } catch (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la suppression de l'organisation");
    }
});

module.exports = router;
