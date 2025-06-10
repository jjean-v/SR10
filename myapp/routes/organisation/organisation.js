var express = require('express');
const organisation = require('../../model/organisation');
var router = express.Router();

/* GET Organisation listing. */

router.get('/', async function(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;
    const q = req.query.q ? req.query.q.trim() : '';
    try {
        let allOrga = await organisation.readall();
        if (q) {
            const qLower = q.toLowerCase();
            allOrga = allOrga.filter(o =>
                (o.nom && o.nom.toLowerCase().includes(qLower)) ||
                (o.siren && o.siren.toLowerCase().includes(qLower)) ||
                (o.type && o.type.toLowerCase().includes(qLower)) ||
                (o.adresse && o.adresse.toLowerCase().includes(qLower))
            );
        }
        const total = allOrga.length;
        const organisations = allOrga.slice(offset, offset + limit);
        const totalPages = Math.ceil(total / limit);
        res.render('organisation', { title: 'Organisation', organisation: organisations, page, totalPages, recherche: q });
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
