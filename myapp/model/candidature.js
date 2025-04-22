// model/candidature.js
const db = require('./db.js');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

module.exports = {
  // renvoie Promise<[candidature,…]>
  readAll() {
    return query("SELECT * FROM Candidature");
  },

  // renvoie Promise<[candidature]>
  readById(id) {
    return query("SELECT * FROM Candidature WHERE id_candidature = ?", [id]);
  },

  // renvoie Promise<result>
  create({ date_candidature, utilisateur_id, id_offre }) {
    const sql = `
      INSERT INTO Candidature
        (date_candidature, utilisateur_id, id_offre)
      VALUES (?, ?, ?)
    `;
    return query(sql, [date_candidature, utilisateur_id, id_offre]);
  },

  // renvoie Promise<result>
  delete(id) {
    return query("DELETE FROM Candidature WHERE id_candidature = ?", [id]);
  }
};
