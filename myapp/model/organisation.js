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

    deleteOrga: function (nom) {
        return new Promise(function (resolve,reject) {
            db.query("Delete FROM Organisation WHERE nom = ? ",[nom], function(err,results){
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },


    }
