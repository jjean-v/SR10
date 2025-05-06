// test/model_utilisateur.test.js
const db = require("../model/db.js");
const modelUser = require("../model/utilisateur.js");

describe("Utilisateur Model CRUD", () => {
  let createdId;

  afterAll((done) => {
    // Cleanup et fermeture de la connexion
    modelUser.delete(createdId)
      .catch(() => {})
      .finally(() => db.end(done));
  });

  test("create() crée un nouvel utilisateur", async () => {
    const payload = {
      nom: "Test",
      prenom: "User",
      email: `testuser+${Date.now()}@test.fr`,
      motDePasse: "azerty123",
      role: "candidat",
      etat_compte: "alive"
    };
    const { statusCode, insertId } = await modelUser.create(payload);
    expect(statusCode).toBe(200);
    expect(typeof insertId).toBe("number");
    createdId = insertId;
  });

  test("readAll() renvoie bien un tableau", async () => {
    const rows = await modelUser.readAll();
    expect(Array.isArray(rows)).toBe(true);
  });

  test("readById() trouve l'utilisateur créé", async () => {
    const rows = await modelUser.readById(createdId);
    expect(rows.length).toBe(1);
    expect(rows[0].id_user).toBe(createdId);
  });

  test("update() modifie le nom de l'utilisateur", async () => {
    const newNom = "UserMod";
    const { affectedRows } = await modelUser.update(createdId, { nom: newNom });
    expect(affectedRows).toBe(1);

    const [user] = await modelUser.readById(createdId);
    expect(user.nom).toBe(newNom);
  });

  test("delete() supprime l'utilisateur", async () => {
    const { affectedRows } = await modelUser.delete(createdId);
    expect(affectedRows).toBe(1);

    const rows = await modelUser.readById(createdId);
    expect(rows.length).toBe(0);
  });
});
