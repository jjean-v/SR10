// model/candidature.js

const { rejects } = require('assert');
const db = require('./db.js');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

module.exports = {
  /**
   * Récupère toutes les candidatures avec :
   *  - nom & prénom du candidat,
   *  - intitulé de la fiche de poste (via la jointure Offre → Fiche_de_Poste).
   * @returns {Promise<Array>}
   */
  readAllDetailed(id_siren) {
    return new Promise(function (resolve, reject) {
      db.query(`
        SELECT
          c.id_candidature,
          c.date_candidature,
          c.utilisateur_id,
          o.id_offre AS id_offre,
          u.nom            AS nom_utilisateur,
          u.prenom         AS prenom_utilisateur,
          f.intitule       AS intitule_fiche_poste
        FROM Candidature c
        JOIN Utilisateur    u ON c.utilisateur_id   = u.id_user
        JOIN Offre          o ON c.id_offre          = o.id_offre
        JOIN Fiche_de_Poste f ON o.id_fiche_poste     = f.id_fiche
        WHERE o.resp_hierarchique IN ( SELECT  id_user FROM Utilisateur WHERE siren = ?) AND c.etat = 'en attente'
        ORDER BY c.date_candidature DESC` ,[id_siren], function (err, results) {
        if (err) {
            return reject(err);
        }
        resolve(results);
    });

  });
},

  /** (conserve si besoin) Lit les candidatures « brutes » sans jointures */
  readAll() {
    return query("SELECT * FROM Candidature");
  },

  /** Lit une candidature par son ID */
  readById(id) {
   const sql = `
      SELECT
        c.id_offre,
        c.id_candidature,
        c.date_candidature,
        c.etat as etat_candidature,
        f.statut_poste AS statut_poste,
        f.salaire AS salaire,
        f.lieu as lieu,
        f.intitule       AS intitule_fiche_poste,
        u.id_user AS id_user
      FROM Candidature c
      JOIN Utilisateur    u ON c.utilisateur_id   = u.id_user
      JOIN Offre          o ON c.id_offre          = o.id_offre
      JOIN Fiche_de_Poste f ON o.id_fiche_poste     = f.id_fiche
      WHERE c.utilisateur_id = ? ORDER BY c.date_candidature DESC `;
    return query(sql,id);
  },

  /** Crée une nouvelle candidature */
  create(candidature, cb) {

    console.log('Candidature reçue :', candidature);
    const {
        date_candidature,
        utilisateur_id,
        id_offre
    } = candidature;

    const sql = `
    INSERT INTO Candidature (date_candidature,utilisateur_id,id_offre)
    VALUES (?, ?, ?)
    `;
    const params = [date_candidature,utilisateur_id,id_offre];

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

admis(id_user,id_offre) {
    return new Promise(function (resolve, reject) {
        db.query("UPDATE Candidature SET etat = 'admis' WHERE utilisateur_id = ? AND id_offre = ?", [id_user,id_offre], function (err, results) {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
  },

  accepter(id_user,id_offre) {
    return new Promise(function (resolve, reject) {
        db.query("UPDATE Candidature SET etat = 'validé' WHERE utilisateur_id = ? AND id_offre = ?", [id_user,id_offre], function (err, results) {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
  },

  /** Supprime une candidature par id de l'offre,
   * on laisse en accepter seulement la candidature de id_user */

  refuse(id_user, id_offre) {
    return new Promise(function(resolve, reject) {
      db.query("UPDATE Candidature SET etat = 'refusé' WHERE id_offre = ? AND utilisateur_id != ?",
      [id_offre,id_user],function(err, results) {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  },


  delete_by_user_offre(id_user,id_offre) {
    return new Promise(function (resolve, reject) {
        db.query("DELETE FROM Candidature WHERE utilisateur_id = ? AND id_offre = ?", [id_user,id_offre], function (err, results) {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
  },

  /** Récupère une candidature par son id_candidature (pour visualisation) */
  readByCandidatureId(id_candidature) {
    const sql = `
      SELECT c.*, f.intitule AS intitule_fiche_poste
      FROM Candidature c
      JOIN Offre o ON c.id_offre = o.id_offre
      JOIN Fiche_de_Poste f ON o.id_fiche_poste = f.id_fiche
      WHERE c.id_candidature = ?`;
    return query(sql, [id_candidature]);
  }

};
