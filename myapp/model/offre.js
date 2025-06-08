var db = require('./db.js');
const { promisify } = require('util');

// Promisify pour les méthodes génériques
const query = promisify(db.query).bind(db);

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

     read_recruteur: function (id_siren) {
        return new Promise(function (resolve, reject) {
            db.query(`select * 
                from Offre 
                INNER JOIN Fiche_de_Poste On Offre.id_fiche_poste = Fiche_de_Poste.id_fiche 
                WHERE Offre.resp_hierarchique IN ( SELECT  id_user FROM Utilisateur WHERE siren = ?)`,
                [id_siren], function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });

        });
    },

    read_pas_postuler: function (userid) {
        return new Promise(function (resolve, reject) {
            db.query("SELECT DISTINCT Offre.id_offre, Offre.etat, Offre.date_validite, Offre.liste_piece_demande, Fiche_de_Poste.intitule FROM Offre INNER JOIN Fiche_de_Poste ON Offre.id_fiche_poste = Fiche_de_Poste.id_fiche WHERE Offre.id_offre NOT IN ( SELECT id_offre FROM Candidature WHERE utilisateur_id = ? ) AND Offre.etat = 'publiée';", 
                [userid],function (err, results) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });

        });
    },

    
    readsingle: function (id_offre) {
        return new Promise(function (resolve, reject) {
            db.query(`SELECT  
                Offre.id_offre,
                Fiche_de_Poste.intitule AS intitule_fiche,
                Fiche_de_Poste.statut_poste,
                Fiche_de_Poste.salaire,
                Fiche_de_Poste.rythme,
                Fiche_de_Poste.lieu,
                Fiche_de_Poste.description,
                Offre.liste_piece_demande,
                Organisation.nom AS nom_orga
                from Offre INNER JOIN Fiche_de_Poste On Offre.id_fiche_poste = Fiche_de_Poste.id_fiche 
                INNER JOIN Utilisateur on Offre.resp_hierarchique = Utilisateur.id_user 
                INNER JOIN Organisation on Organisation.siren = Utilisateur.siren
                WHERE Offre.id_offre = ?;`, 
                [id_offre],function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });

        });
    },

    createOffre(offre, cb) {
        const {
        etat,
        date_validite,
        liste_piece_demande,
        nb_piece_demande,
        resp_hierarchique,
        id_fiche_poste
        } = offre;

        const sql = `
        INSERT INTO Offre (etat, date_validite, liste_piece_demande, nb_piece_demande, resp_hierarchique, id_fiche_poste)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [etat, date_validite, liste_piece_demande, nb_piece_demande, resp_hierarchique, id_fiche_poste];

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

    // Suppression d'une offre
    delete: function(id) {
        return query("DELETE FROM Offre WHERE id_offre = ?", [id]);
    },
    // Mise à jour d'une offre
    update: function(id, fields) {
        const cols = Object.keys(fields).map(k => `${k} = ?`).join(', ');
        const vals = [...Object.values(fields), id];
        const sql = `UPDATE Offre SET ${cols} WHERE id_offre = ?`;
        return query(sql, vals);
    }

    }
