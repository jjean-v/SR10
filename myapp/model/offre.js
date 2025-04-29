var db = require('./db.js');

module.exports = {
    read: function (intitule) {
        return new Promise(function (resolve, reject) {
            db.query("select * from Offre where intitule LIKE %?%", [intitule], function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    readall: function () {
        return new Promise(function (resolve, reject) {
            db.query("select * from Offre", function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });

        });
    },



    arePublish: function () {
        return new Promise(function (resolve, reject) {;
            db.query("SELECT * FROM Offre WHERE etat = 'publiée' ", function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });

        });
    },

    
    areNotPublish: function () {
        return new Promise(function (resolve, reject) {;
            db.query("SELECT * FROM Offre WHERE etat = 'non publiée' ", function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });

        });
    },

    areExpired: function () {
        return new Promise(function (resolve, reject) {
            db.query("SELECT * FROM Offre WHERE etat = 'expirée' ", function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });

        });
    },



    }
