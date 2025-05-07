const DB = require("../model/db.js");
const model = require("../model/candidature.js");

describe("Model CRUD Tests", () => {
    beforeAll(() => {
        // Par exemple : initialiser une connexion, nettoyer la table, etc.
        model.delete_by_user_offre(4,3) // on supprime la ligne de test
    });

    afterAll((done) => {
        // Terminer proprement la connexion à la base
        
        DB.end((err) => {
            done(err);
        });
    });

   
    test("read id Candidature", async () => {
        const resultat = await model.readById(1);
        const user_id = resultat[0].utilisateur_id;
        expect(user_id).toBe(1);
    });

    test("read id Candidature", async () => {
        const resultat = await model.readById(1);
        const user_id = resultat[0].utilisateur_id;
        expect(user_id).toBe(1);
    });

    test("Read all Candidature",async () => {
        const resultat = await model.readAll();
        expect(resultat).toBeInstanceOf(Array);
        expect(resultat.length).toBeGreaterThan(0);
    });

      test("Create Candidature", (done) => {
            const newcandidature = {
                date_candidature: "2025-04-20",
                utilisateur_id: "4",
                id_offre: "3"
                
            };
    
            model.createCandidature(newcandidature, (err, result) => {
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