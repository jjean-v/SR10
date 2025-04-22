// model/utilisateur.js
const db = require('./db.js');
const { promisify } = require('util');

// promesse pour db.query
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
  create({ nom, prenom, email, motDePasse, role, role_recruteur, etat_compte, siren }) {
    const sql = `
      INSERT INTO Utilisateur
        (nom, prenom, email, motDePasse, role, role_recruteur, etat_compte, siren)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return query(sql, [nom, prenom, email, motDePasse, role, role_recruteur, etat_compte, siren]);
  },

  // Mettre à jour un utilisateur
  update(id, fields) {
    const cols = Object.keys(fields).map(k => `${k} = ?`).join(', ');
    const vals = [...Object.values(fields), id];
    const sql = `UPDATE Utilisateur SET ${cols} WHERE id_user = ?`;
    return query(sql, vals);
  },

  // Supprimer un utilisateur
  delete(id) {
    return query("DELETE FROM Utilisateur WHERE id_user = ?", [id]);
  }
};
