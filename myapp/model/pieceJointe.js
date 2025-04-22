// model/pieceJointe.js
const db = require('./db.js');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

module.exports = {
  readAll() {
    return query("SELECT * FROM Piece_Jointe");
  },

  readById(id) {
    return query("SELECT * FROM Piece_Jointe WHERE id_piece_jointe = ?", [id]);
  },

  create({ nom, type, taille, candidature_id }) {
    const sql = `
      INSERT INTO Piece_Jointe
        (nom, type, taille, candidature_id)
      VALUES (?, ?, ?, ?)
    `;
    return query(sql, [nom, type, taille, candidature_id]);
  },

  delete(id) {
    return query("DELETE FROM Piece_Jointe WHERE id_piece_jointe = ?", [id]);
  }
};
