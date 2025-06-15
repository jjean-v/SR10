var db = require('./db.js');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

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

    create(orga, cb) {
        const {
        siren,
        nom,
        type_orga,
        adresse,
        etat_orga = 'attente'
        } = orga;
    
        const sql = `
          INSERT INTO Organisation
            ( siren,nom,type_orga,adresse,etat_orga)
          VALUES (?, ?, ?, ?, ?)
        `;
        const params = [siren,nom, type_orga, adresse, etat_orga];
    
        if (typeof cb === 'function') {
          // version callback
          db.query(sql, params, (err, result) => {
            if (err) return cb(err);
            cb(null, { statusCode: 200, insertId: result.insertId });
          });
        } else {
          // version Promise
          return query(sql, params)
            .then(result => ({ statusCode: 200, insertId: result.insertId }));
        }
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

    // Suppression complète d'une organisation et de ses dépendances (par siren)
    deleteOrga: async function (siren) {
        // 1. Récupérer les utilisateurs liés à l'organisation
        const users = await query("SELECT id_user FROM Utilisateur WHERE siren = ?", [siren]);
        for (const user of users) {
            // Suppression complète de chaque utilisateur (candidatures, offres, etc.)
            await require('./utilisateur.js').delete(user.id_user);
        }
        // 2. Supprimer l'organisation
        await query("DELETE FROM Organisation WHERE siren = ?", [siren]);
        return { statusCode: 200 };
    },

    updateEtat: function (siren, etat) {
        return new Promise(function (resolve, reject) {
            db.query("UPDATE Organisation SET etat_orga = ? WHERE siren = ?", [etat, siren], function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    readBySiren(siren) {
        return new Promise(function (resolve, reject) {
            db.query("SELECT * FROM Organisation WHERE siren = ?", [siren], function (err, results) {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    }
