var db = require('./db.js');

module.exports = {
  readname: function (intitule) {
    return new Promise(function (resolve, reject) {
      db.query(
        "SELECT * FROM Fiche_de_Poste WHERE intitule LIKE ?",
        [`%${intitule}%`],
        function (err, results) {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  readAll: function () {
    return new Promise(function (resolve, reject) {
      db.query("SELECT * FROM Fiche_de_Poste", function (err, results) {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  readStatus: function (statut) {
    return new Promise(function (resolve, reject) {
      db.query(
        "SELECT * FROM Fiche_de_Poste WHERE statut_poste LIKE ?",
        [`%${statut}%`],
        function (err, results) {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  readJob: function (job) {
    return new Promise(function (resolve, reject) {
      db.query(
        "SELECT * FROM Fiche_de_Poste WHERE type_metier LIKE ?",
        [`%${job}%`],
        function (err, results) {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  readPlace: function (lieu) {
    return new Promise(function (resolve, reject) {
      db.query(
        "SELECT * FROM Fiche_de_Poste WHERE lieu LIKE ?",
        [`%${lieu}%`],
        function (err, results) {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  readWages: function (salaire) {
    return new Promise(function (resolve, reject) {
      db.query(
        "SELECT * FROM Fiche_de_Poste WHERE salaire >= ?",
        [salaire],
        function (err, results) {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  create: function (ficheData) {
    return new Promise(function (resolve, reject) {
      const sql = `
        INSERT INTO Fiche_de_Poste
          (intitule, statut_poste, type_metier, salaire, rythme, lieu, description)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        ficheData.intitule,
        ficheData.statut_poste,
        ficheData.type_metier,
        ficheData.salaire,
        ficheData.rythme,
        ficheData.lieu,
        ficheData.description
      ];
      db.query(sql, params, function (err, result) {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  },

  // Suppression d'une fiche de poste
  delete: function(id) {
    return new Promise(function (resolve, reject) {
      db.query("DELETE FROM Fiche_de_Poste WHERE id_fiche = ?", [id], function (err, result) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  // Lecture par ID
  readById: function(id) {
    return new Promise(function (resolve, reject) {
      db.query("SELECT * FROM Fiche_de_Poste WHERE id_fiche = ?", [id], function (err, results) {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },
  // Mise à jour d'une fiche de poste
  update: function(id, fields) {
    return new Promise(function (resolve, reject) {
      const cols = Object.keys(fields).map(k => `${k} = ?`).join(', ');
      const vals = [...Object.values(fields), id];
      const sql = `UPDATE Fiche_de_Poste SET ${cols} WHERE id_fiche = ?`;
      db.query(sql, vals, function (err, result) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
};
