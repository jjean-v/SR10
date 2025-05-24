// model/utilisateur.js
const db = require('./db.js');
const { promisify } = require('util');

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

  // Supprimer un utilisateur
  delete(id) {
    return query("DELETE FROM Utilisateur WHERE id_user = ?", [id]);
  },

  // Lire un utilisateur par un champ spécifique
  read(field, value) {
    const sql = `SELECT * FROM Utilisateur WHERE ${field} = ?`;
    return query(sql, [value]);
  },

  readRecruteur(){
    const sql = 'SELECT * FROM Utilisateur WHERE role = "recruteur"';
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
  }
};
