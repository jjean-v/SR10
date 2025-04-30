const DB = require("../model/db.js");
const model = require("../model/organisation.js");

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

    test("Create Organisation", (done) => {
        const newOrga = {
            siren: "54879652",
            nom: "orgaTest",type_orga: "PME",
            adresse: "2 rue des Canons, Lyon",
            etat_orga: "attente"
            
        };

        model.create(newOrga, (err, result) => {
            if (err) {
                // Jest affiche l’erreur et marque le test en échec
                return done(err);
            }
            try {
                expect(result.statusCode).toBe(200);
                // Fin normale du test
                done();
            } catch (assertionError) {
                // Si l’assertion échoue, Jest le remonte
                done(assertionError);
            }
        });
    });
});