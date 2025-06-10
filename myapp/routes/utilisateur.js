const express = require('express');
const router = express.Router();
const utilisateur = require('../model/utilisateur');
const session = require("../session");
const organisation = require('../model/organisation');


// GET /utilisateurs
router.get('/', (req, res, next) => {
  utilisateur.readAll()
    .then(data => res.render('utilisateurs', { title: 'Utilisateurs', utilisateurs: data }))
    .catch(err => {
      console.error(err);
      res.status(500).send('Erreur lors de la récupération des utilisateurs');
    });
});

router.get('/recruteur',(req,res, next) => {
    promiseO=utilisateur.readRecruteur()
    
      promiseO.then(data =>{
        res.render('recruteur', {title:'Recruteurs', utilisateurs:data });
      });
      promiseO.catch( (err) => {
        console.log(err);
        res.status(500).send("Erreur lors de la récupération des recruteur");
      });
  });

router.get('/new_user', function(req, res, next) {
    res.render('new_user');
});

router.post('/creation_compte', function(req, res, next) {
  const { nom, prenom, password, email, zip } = req.body;

  // Validation du mot de passe
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).render('new_user', {
      error: "Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      nom,
      prenom,
      email,
      zip
    });
  }

  promise = utilisateur.create({nom ,prenom, email , motDePasse:password, role:'candidat',role_recruteur: null,etat_compte:'alive',siren:null})
  promise.then( (data) =>{

    session.creatSession(req.session, email, 'candidat'); 
    res.render('creation_compte', { title: 'creation du compte', user: data });

  });

  promise.catch( (err) => {
      console.log(err);
      res.status(500).send('Error retrieving new user data');
  }); 

});

// Espace recruteur (affichage des offres pour le recruteur)
router.get('/espace_recruteur', async function(req, res) {
    if (req.session && req.session.role === 'recruteur') {
        try {
            const offreModel = require('../model/offre');
            const offres = await offreModel.readall();
            res.render('offre_recruteur', { offre: offres });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erreur lors de la récupération des offres');
        }
    } else {
        res.status(403).render('error', { message: "Accès refusé.", error: {} });
    }
});

// Route pour traiter la demande de passage recruteur
router.post('/demande_recruteur', async function(req, res) {
    if (!req.session || req.session.role !== 'candidat') {
        return res.status(403).render('error', { message: "Accès refusé.", error: {} });
    }
    const userId = req.session.userid;
    const siren = req.body.siren;
    try {
        // Vérifier le rôle actuel de l'utilisateur
        const users = await recruteur.read('id_user', userId);
        const user = Array.isArray(users) ? users[0] : users;
        if (!user) {
            return res.status(404).render('error', { message: "Utilisateur non trouvé.", error: {} });
        }
        console.log('DEBUG role_recruteur:', user.role_recruteur); // Ajout debug
        if ((user.role_recruteur || '').toLowerCase() === 'validé') {
            return res.render('confirmation_postulation', { message: "Vous êtes déjà recruteur." });
        }
        if ((user.role_recruteur || '').toLowerCase() === 'attente') {
            return res.render('confirmation_postulation', { message: "Votre demande pour devenir recruteur est déjà en attente de validation." });
        }
        // Si refusé ou jamais demandé (null), on autorise la demande
        await recruteur.update(userId, { role_recruteur: 'attente', siren });
        res.render('confirmation_postulation', { message: "Votre demande pour devenir recruteur a bien été envoyée. Elle sera validée par un administrateur." });
    } catch (err) {
        console.log('Erreur update recruteur:', err);
        res.status(500).render('error', { message: "Erreur lors de la demande.", error: err });
    }
});

// Route pour afficher le formulaire de demande pour devenir recruteur
router.get('/devenir_recruteur', async function(req, res) {
    console.log('Session:', req.session);
    if (req.session && req.session.role === 'candidat') {
        try {
            const organisations = await organisation.readall();
            res.render('demande_recruteur', { organisations });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erreur lors de la récupération des organisations');
        }
    } else {
        res.status(403).render('error', { message: "Accès refusé.", error: {} });
    }
});

// Déconnexion
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});


module.exports = router;

