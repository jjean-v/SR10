// model/pieceJointe.js

const db = require('./db.js');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

module.exports = {
  /**
   * Récupère toutes les pièces jointes avec :
   *  - nom & type & taille,
   *  - nom & prénom du candidat,
   *  - intitulé de la fiche de poste liée via la candidature → offre.
   * @returns {Promise<Array>}
   */
  readAllDetailed() {
    const sql = `
      SELECT
        p.id_piece_jointe,
        p.nom,
        p.type,
        p.taille,
        u.nom            AS nom_utilisateur,
        u.prenom         AS prenom_utilisateur,
        f.intitule       AS intitule_fiche_poste
      FROM Piece_Jointe p
      JOIN Candidature    c ON p.candidature_id = c.id_candidature
      JOIN Utilisateur    u ON c.utilisateur_id = u.id_user
      JOIN Offre          o ON c.id_offre        = o.id_offre
      JOIN Fiche_de_Poste f ON o.id_fiche_poste   = f.id_fiche
      ORDER BY p.id_piece_jointe DESC
    `;
    return query(sql);
  },

  /** (le brut, si besoin) */
  readAll() {
    return query("SELECT * FROM Piece_Jointe");
  },

  /** Récupère une pièce par son ID */
  readById(id) {
    return query(
      "SELECT * FROM Piece_Jointe WHERE id_piece_jointe = ?",
      [id]
    );
  },

  /** Insère une nouvelle pièce jointe */
  create({ nom, type, taille, candidature_id }) {
    const sql = `
      INSERT INTO Piece_Jointe (nom, type, taille, candidature_id)
      VALUES (?, ?, ?, ?)
    `;
    return query(sql, [nom, type, taille, candidature_id]);
  },

  /** Supprime une pièce jointe */
  delete(id) {
    return query(
      "DELETE FROM Piece_Jointe WHERE id_piece_jointe = ?",
      [id]
    );
  },

  /** Récupère les pièces jointes d'une candidature */
  readByCandidature(id_candidature) {
    return query("SELECT * FROM Piece_Jointe WHERE candidature_id = ?", [id_candidature]);
  }
};
