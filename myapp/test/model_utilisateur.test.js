const DB = require("../model/db.js");
const model = require("../model/utilisateur.js");

describe("Model CRUD Tests", () => {
    beforeAll(() => {
        // Par exemple : initialiser une connexion, nettoyer la table, etc.
    });

    afterAll((done) => {
        // Terminer proprement la connexion à la base
        DB.end((err) => {
            done(err);
        });
    });

    test("Create user", (done) => {
        const newUser = {
            email: "create@test.fr",
            nom: "UpdatedTest",
            prenom: "UpdatedPrenom",
            role: "candidat",
            etat_compte: "alive",
            motDePasse: "password"
        };

        model.create(newUser, (err, result) => {
            if (err) {
                // Jest affiche l’erreur et marque le test en échec
                return done(err);
            }
            try {
                expect(result.statusCode).toBe(201);
                // Fin normale du test
                done();
            } catch (assertionError) {
                // Si l’assertion échoue, Jest le remonte
                done(assertionError);
            }
        });
    });
});