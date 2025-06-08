var express = require('express');
const fiche_de_poste = require('../model/fiche_de_poste');
var router = express.Router();

/* GET Organisation listing. */

router.get('/', function(req, res, next) {

    promiseO=fiche_de_poste.readAll();
    promiseO.then( (data) =>{

        res.render('fiche_de_poste', { title: 'Fiche_de_Poste', fiche_de_poste: data });
    });
    promiseO.catch( (err) => {
        console.log(err);
        res.status(500).send('Error retrieving fiche de poste data');
    }); 
});

// Suppression d'une fiche de poste
router.post('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await fiche_de_poste.delete(id);
    res.redirect('/fiche_de_poste');
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la suppression de la fiche de poste");
  }
});

// Affichage du formulaire de modification
router.get('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fiche_de_poste.readById(id);
    if (!data || !data[0]) return res.status(404).send('Fiche non trouvée');
    res.render('edit_fiche_de_poste', { fiche: data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors du chargement de la fiche de poste");
  }
});

// Traitement de la modification
router.post('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { intitule, statut_poste, type_metier, salaire, rythme, lieu, description } = req.body;
    await fiche_de_poste.update(id, { intitule, statut_poste, type_metier, salaire, rythme, lieu, description });
    res.redirect('/fiche_de_poste');
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la modification de la fiche de poste");
  }
});

module.exports = router;
