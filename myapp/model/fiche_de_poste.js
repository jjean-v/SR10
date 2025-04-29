var db = require('./db.js');

module.exports = {
    readname: function (intitule) {
        return new Promise(function (resolve, reject) {
            db.query("select * from Fiche_de_Poste where intitule LIKE ?", [`%${intitule}%`], function (err, results) {
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

    readStatus: function (statut) {
        return new Promise(function (resolve, reject) {
            db.query("select * from Fiche_de_Poste where statut_poste LIKE ?", [`%${statut}%`], function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },


    readJob: function (job) {
        return new Promise(function (resolve, reject) {
            db.query("select * from Fiche_de_Poste where type_metier LIKE %?%", [`%${job}%`], function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },


    readPlace: function (lieu) {
        return new Promise(function (resolve, reject) {
            db.query("select * from Fiche_de_Poste where lieu LIKE %?%", [`%${lieu}%`], function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    readWages: function (salaire) {
        return new Promise(function (resolve, reject) {
            db.query("select * from Fiche_de_Poste where salaire >= ? ", [salaire], function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }


    }
