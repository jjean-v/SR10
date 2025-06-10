var express = require('express');
const organisation = require('../../model/organisation');
var router = express.Router();

/* GET Organisation listing. */

router.get('/', async function(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;
    try {
        const allOrga = await organisation.readall();
        const total = allOrga.length;
        const organisations = allOrga.slice(offset, offset + limit);
        const totalPages = Math.ceil(total / limit);
        res.render('organisation', { title: 'Organisation', organisation: organisations, page, totalPages });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error retrieving organisation data');
    }
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
