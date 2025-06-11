//const express    = require('express');
const router     = express.Router();
const userModel  = require('../model/utilisateur');

router.get('/users', function (req, res, next) {
    result=userModel.readAll(function(result){

        res.status(200).json(result);
    });
});