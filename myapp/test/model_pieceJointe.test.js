// model_pieceJointe.test.js
const DB = require("../model/db.js");
const modelPJ = require("../model/pieceJointe.js");

describe("PieceJointe Model Tests", () => {
    beforeAll(() => {
        // Par exemple : initialiser une connexion, nettoyer la table, etc.
    });

    afterAll((done) => {
        // Terminer proprement la connexion à la base
        DB.end((err) => {
            done(err);
        });
    });

    test("readAllDetailed should return an array of detailed attachments", (done) => {
        modelPJ.readAllDetailed()
            .then((results) => {
                expect(Array.isArray(results)).toBe(true);
                done();
            })
            .catch((err) => done(err));
    });

    test("create should insert a new piece jointe", (done) => {
        const data = { nom: "test.pdf", type: "application/pdf", taille: 1024, candidature_id: 1 };
        modelPJ.create(data)
            .then((result) => {
                expect(result.affectedRows).toBe(1);
                done();
            })
            .catch((err) => done(err));
    });

    test("delete should remove a piece jointe by id", (done) => {
        const id = 1;
        modelPJ.delete(id)
            .then((result) => {
                expect(result.affectedRows).toBe(1);
                done();
            })
            .catch((err) => done(err));
    });
});