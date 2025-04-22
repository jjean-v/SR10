var db = require('./db.js');

module.exports = {
    read: function (nom) {
        return new Promise(function (resolve, reject) {
            db.query("select * from Fiche_de_Poste where nom= ?", [nom], function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    readall: function () {
        return new Promise(function (resolve, reject) {
            db.query("select * from Fiche_de_Poste", function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });

        });
    },

    readtype: function (type) {
        return new Promise(function (resolve, reject) {;
            db.query("SELECT * FROM Fiche_de_Poste WHERE type = ? ",[type], function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });

        });
    },


    }
