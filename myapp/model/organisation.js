var db = require('./db.js');

module.exports = {
    read: function (nom) {
        return new Promise(function (resolve, reject) {
            db.query("select * from Organisation where nom= ?", [nom], function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    readall: function () {
        return new Promise(function (resolve, reject) {
            db.query("select * from Organisation", function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });

        });
    },

    areValid: function () {
        return new Promise(function (resolve, reject) {;
            db.query("SELECT * FROM Organisation WHERE etat_orga = 'validé' ", function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });

        });
    },

    areNotValid: function () {
        return new Promise(function (resolve, reject) {
            db.query("SELECT * FROM Organisation WHERE etat_orga = 'refusé' ", function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });

        });
    },

    areWaiting: function () {
        return new Promise(function (resolve,reject) {
            db.query("SELECT * FROM Organisation WHERE etat_orga = 'refusé' ", function(err,results){
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },


    }
