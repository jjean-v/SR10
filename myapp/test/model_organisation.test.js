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
            siren: "54877652",
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

    test("read Organisation", async () => {
        const resultat = await model.read("orgaTest");
        const siren = resultat[0].siren;
        expect(siren).toBe(54877652);
    });

    test("Read all Organisation",async () => {
        const resultat = await model.readall();
        expect(resultat).toBeInstanceOf(Array);
        expect(resultat.length).toBeGreaterThan(0);
    });
    

    test("delete() supprime la pièce jointe créée", async () => {
        const { affectedRows } = await model.deleteOrga("orgaTest");
        expect(affectedRows).toBe(1);
    });

});