// model/candidature.js

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
  readAllDetailed() {
    const sql = `
      SELECT
        c.id_candidature,
        c.date_candidature,
        u.nom            AS nom_utilisateur,
        u.prenom         AS prenom_utilisateur,
        f.intitule       AS intitule_fiche_poste
      FROM Candidature c
      JOIN Utilisateur    u ON c.utilisateur_id   = u.id_user
      JOIN Offre          o ON c.id_offre          = o.id_offre
      JOIN Fiche_de_Poste f ON o.id_fiche_poste     = f.id_fiche
      ORDER BY c.date_candidature DESC
    `;
    return query(sql);
  },

  /** (conserve si besoin) Lit les candidatures « brutes » sans jointures */
  readAll() {
    return query("SELECT * FROM Candidature");
  },

  /** Lit une candidature par son ID */
  readById(id) {
    return query(
      "SELECT * FROM Candidature WHERE id_candidature = ?",
      [id]
    );
  },

  /** Crée une nouvelle candidature */
  create({ date_candidature, utilisateur_id, id_offre }) {
    const sql = `
      INSERT INTO Candidature
        (date_candidature, utilisateur_id, id_offre)
      VALUES (?, ?, ?)
    `;
    return query(sql, [date_candidature, utilisateur_id, id_offre]);
  },

  /** Supprime une candidature par son ID */
  delete(id) {
    return query(
      "DELETE FROM Candidature WHERE id_candidature = ?",
      [id]
    );
  }
};
