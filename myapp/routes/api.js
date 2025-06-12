var express = require('express');
var router = express.Router();
const utilisateur = require('../model/utilisateur');


router.get('/utilisateurs', async function (req, res, next) {
    try {
        const users = await utilisateur.readAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;


