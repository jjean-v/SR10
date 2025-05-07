// test/model_offre.test.js
const db = require("../model/db.js");
const modelOffre = require("../model/offre.js");

describe("Offre Model CRUD (selon ce qui existe)", () => {
  let createdId;

  afterAll((done) => {
    if (createdId) {
      // nettoyage manuel si createOffre a créé quelque chose
      db.query("DELETE FROM Offre WHERE id_offre = ?", [createdId], () => {
        db.end(done);
      });
    } else {
      db.end(done);
    }
  });

  test("readall() renvoie un tableau d'offres", async () => {
    const all = await modelOffre.readall();
    expect(Array.isArray(all)).toBe(true);
  });

  test("areExpired() renvoie un tableau (peut être vide) d'offres expirées", async () => {
    const expired = await modelOffre.areExpired();
    expect(Array.isArray(expired)).toBe(true);
  });

  test("createOffre() insère une nouvelle offre", async () => {
    const payload = {
      etat: "publiée", // Utilisez une valeur valide pour la colonne `etat`
      date_validite: "2025-12-31",
      liste_piece_demande: "CV, lettre",
      nb_piece_demande: 2,
      resp_hierarchique: 2, // Assurez-vous que cet ID existe dans la table `Utilisateur`
      id_fiche_poste: 1     // Assurez-vous que cet ID existe dans la table `Fiche_de_Poste`
    };
    const { insertId, statusCode } = await modelOffre.createOffre(payload);
    expect(statusCode).toBe(200);
    expect(typeof insertId).toBe("number");
    createdId = insertId;
  });
});
