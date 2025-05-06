// test/model_pieceJointe.test.js
const db = require("../model/db.js");
const modelPJ = require("../model/pieceJointe.js");

describe("PieceJointe Model CRUD (as implemented)", () => {
  let createdId;

  afterAll((done) => {
    // Ferme la connexion
    db.end(done);
  });

  test("readAllDetailed() renvoie un tableau", async () => {
    const all = await modelPJ.readAllDetailed();
    expect(Array.isArray(all)).toBe(true);
  });

  test("create() insère une pièce jointe", async () => {
    const payload = {
      nom: "doc_test.pdf",
      type: "application/pdf",
      taille: 1234,
      candidature_id: 1  // assure-toi qu'il existe une candidature id=1
    };
    const result = await modelPJ.create(payload);
    expect(result.affectedRows).toBe(1);
    expect(typeof result.insertId).toBe("number");
    createdId = result.insertId;
  });

  test("delete() supprime la pièce jointe créée", async () => {
    const { affectedRows } = await modelPJ.delete(createdId);
    expect(affectedRows).toBe(1);
  });
});
