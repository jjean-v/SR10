// model/utilisateur.js
const db = require('./db.js');
const { promisify } = require('util');
const offreModel = require('./offre.js');

// Promisify pour les méthodes génériques
const query = promisify(db.query).bind(db);

module.exports = {
  // Lire tous les utilisateurs
  readAll() {
    return query("SELECT * FROM Utilisateur");
  },

  // Lire un utilisateur par son ID
  readById(id) {
    return query("SELECT * FROM Utilisateur WHERE id_user = ?", [id]);
  },

  // Créer un utilisateur
  // Si on passe un callback (error-first), on l'utilise ;
  // sinon on retourne une Promise.
  create(user, cb) {
    const {
      nom,
      prenom,
      email,
      motDePasse,
      role,
      role_recruteur = null,
      etat_compte,
      siren = null
    } = user;
    
    const sql = `
      INSERT INTO Utilisateur
        (nom, prenom, email, motDePasse, role, role_recruteur, etat_compte, siren)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [nom, prenom, email, motDePasse, role, role_recruteur, etat_compte, siren];

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

  // Mettre à jour un utilisateur
  update(id, fields) {
    if (!fields || Object.keys(fields).length === 0) {
      return Promise.reject(new Error("Fields object cannot be empty"));
    }
    const cols = Object.keys(fields).map(k => `${k} = ?`).join(', ');
    const vals = [...Object.values(fields), id];
    const sql = `UPDATE Utilisateur SET ${cols} WHERE id_user = ?`;
    return query(sql, vals);
  },

  // Suppression complète d'un utilisateur et de ses dépendances (sans transaction explicite)
  delete(id) {
    return new Promise(async (resolve, reject) => {
      try {
        // 1. Supprimer les pièces jointes liées à ses candidatures
        await new Promise((res, rej) => {
          db.query(
            `DELETE pj FROM Piece_Jointe pj JOIN Candidature c ON pj.candidature_id = c.id_candidature WHERE c.utilisateur_id = ?`,
            [id],
            (err) => (err ? rej(err) : res())
          );
        });
        // 2. Supprimer ses candidatures
        await new Promise((res, rej) => {
          db.query(
            'DELETE FROM Candidature WHERE utilisateur_id = ?',
            [id],
            (err) => (err ? rej(err) : res())
          );
        });
        // 3. Supprimer les offres dont il est responsable et leurs candidatures associées
        const offres = await query('SELECT id_offre FROM Offre WHERE resp_hierarchique = ?', [id]);
        for (const offre of offres) {
          await new Promise((res, rej) => {
            db.query(
              'CALL delete_by_user_offre(?, ?)',
              [id, offre.id_offre],
              (err) => (err ? rej(err) : res())
            );
          });
        }
        // 4. Supprimer l'utilisateur
        await new Promise((res, rej) => {
          db.query(
            'DELETE FROM Utilisateur WHERE id_user = ?',
            [id],
            (err) => (err ? rej(err) : res())
          );
        });
        resolve({ statusCode: 200 });
      } catch (err) {
        reject(err);
      }
    });
  },

  // Supprimer un recruteur : le passer en candidat, supprimer le siren et toutes ses offres
  async delete_recruteur(id) {
    try {
      // 1. Récupérer toutes les offres dont il est responsable
      const offres = await query('SELECT id_offre FROM Offre WHERE resp_hierarchique = ?', [id]);
      for (const offre of offres) {
        // 2. Supprimer les pièces jointes liées aux candidatures de cette offre
        await query(`DELETE pj FROM Piece_Jointe pj 
          JOIN Candidature c ON pj.candidature_id = c.id_candidature 
          WHERE c.id_offre = ?`, [offre.id_offre]);
        // 3. Supprimer les candidatures de cette offre
        await query('DELETE FROM Candidature WHERE id_offre = ?', [offre.id_offre]);
        // 4. Supprimer l'offre
        await offreModel.delete(offre.id_offre);
      }
      // 5. Mettre à jour l'utilisateur : role -> 'candidat', siren -> NULL, role_recruteur -> NULL
      await query(
        'UPDATE Utilisateur SET role = ?, siren = NULL, role_recruteur = NULL WHERE id_user = ?',
        ['candidat', id]
      );
      return { statusCode: 200 };
    } catch (err) {
      throw err;
    }
  },

  // Lire un utilisateur par un champ spécifique
  read(field, value) {
    const sql = `SELECT * FROM Utilisateur WHERE ${field} = ?`;
    return query(sql, [value]);
  },

  readRecruteur() {
    const sql = 'SELECT * FROM Utilisateur WHERE role_recruteur IN ("validé", "attente")';
    return query(sql);
  },

  // Fonction pour vérifier l'authentification (email et mot de passe)
  authenticateUser(email, password) {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM Utilisateur WHERE email = ? AND motDePasse = ?`,[email, password],
        (err, row) => {
          if (err) {
            console.error("Erreur lors de l'authentification :", err);
            reject(err);
          } else {
            resolve(row); // Renvoie l'utilisateur authentifié ou null
          }
        }
      );
    })
  },

  // Fonction pour récupérer le mot de passe Haché
  getPasswdHach(email) {
    return new Promise((resolve, reject) => {
      db.query(`SELECT motDePasse FROM Utilisateur WHERE email = ? `,[email],
        (err, row) => {
          if (err) {
            console.error("Erreur lors de la récupération :", err);
            reject(err);
          } else {
            resolve(row); // Renvoie le mdp haché ou null
          }
        }
      );
    })
  },

  // Compter tous les utilisateurs
  countAll() {
    return query('SELECT COUNT(*) AS nbUtilisateurs FROM Utilisateur');
  },
};
