var db = require('./db.js');

module.exports = {
    

    readall: function () {
        return new Promise(function (resolve, reject) {
            db.query("select * from Offre INNER JOIN Fiche_de_Poste On Offre.id_fiche_poste = Fiche_de_Poste.id_fiche", function (err, results) {
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
    }



    }
