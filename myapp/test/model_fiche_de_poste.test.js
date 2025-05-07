const DB = require("../model/db.js");
const model = require("../model/fiche_de_poste.js");

describe("Model CRUD Tests", () => {
    beforeAll(() => {
        // Par exemple : initialiser une connexion, nettoyer la table, etc.
        //model.deleteOrga("orgaTest") // on supprime la ligne de test
    });

    afterAll((done) => {
        // Terminer proprement la connexion à la base
        DB.end((err) => {
            done(err);
        });
    });

   

    test("read one fiche de poste", async () => {
        const resultat = await model.readname("Technicien réseaux");
        const id = resultat[0].id_fiche;
        expect(id).toBe(2);
    });

    test("read status fiche de poste", async () => {
        const resultat = await model.readStatus("Cadre");
        const id = resultat[0].id_fiche;
        expect(id).toBe(1);
    });

    test("read job from fiche de poste", async () => {
        const resultat = await model.readJob("Manager");
        const id = resultat[0].id_fiche;
        expect(id).toBe(1);
    });

    test("read places fiche de poste", async () => {
        const resultat = await model.readPlace("Marseille");
        const id = resultat[0].id_fiche;
        expect(id).toBe(2);
    });

    test("read wages fiche de poste", async () => {
        const resultat = await model.readWages(4000);
        const id = resultat[0].id_fiche;
        expect(id).toBe(1);
    });

    test("Read all Organisation",async () => {
        const resultat = await model.readAll();
        expect(resultat).toBeInstanceOf(Array);
        expect(resultat.length).toBeGreaterThan(0);
    });
    
});