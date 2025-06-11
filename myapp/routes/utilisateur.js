const express = require('express');
const router = express.Router();
const utilisateur = require('../model/utilisateur');
const session = require("../session");
const organisation = require('../model/organisation');



// GET /utilisateurs (pagination + recherche)
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;
    const q = req.query.q ? req.query.q.trim() : '';
    let allUsers = await utilisateur.readAll();
    if (q) {
      const qLower = q.toLowerCase();
      allUsers = allUsers.filter(u =>
        (u.nom && u.nom.toLowerCase().includes(qLower)) ||
        (u.prenom && u.prenom.toLowerCase().includes(qLower)) ||
        (u.email && u.email.toLowerCase().includes(qLower))
      );
    }
    const total = allUsers.length;
    const utilisateurs = allUsers.slice(offset, offset + limit);
    const totalPages = Math.ceil(total / limit);
    res.render('utilisateurs', {
      title: 'Utilisateurs',
      utilisateurs,
      page,
      totalPages,
      recherche: q
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la récupération des utilisateurs');
  }
});

router.get('/recruteur', async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 6;
      const offset = (page - 1) * limit;
      const q = req.query.q ? req.query.q.trim() : '';
      let allRecruteurs = await utilisateur.readRecruteur();
      if (q) {
        const qLower = q.toLowerCase();
        allRecruteurs = allRecruteurs.filter(u =>
          (u.nom && u.nom.toLowerCase().includes(qLower)) ||
          (u.prenom && u.prenom.toLowerCase().includes(qLower)) ||
          (u.email && u.email.toLowerCase().includes(qLower))
        );
      }
      const total = allRecruteurs.length;
      const utilisateurs = allRecruteurs.slice(offset, offset + limit);
      const totalPages = Math.ceil(total / limit);
      res.render('recruteur', {
        title: 'Recruteurs',
        utilisateurs,
        page,
        totalPages,
        recherche: q
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la récupération des recruteur");
    }
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
    session.creatSession(req.session, data.insertId, nom, prenom, 'candidat', null); 
    res.render('creation_compte', { title: 'creation du compte', user: data });

  });

  promise.catch( (err) => {
      console.log(err);
      res.status(500).send('Error retrieving new user data');
  }); 

});

// Espace recruteur (affichage des offres pour le recruteur) avec pagination
router.get('/espace_recruteur', async function(req, res) {
    if (req.session && req.session.role === 'recruteur') {
        try {
            const idsiren = req.session.siren;

            const offreModel = require('../model/offre');
            const page = parseInt(req.query.page) || 1;
            const limit = 6;
            const offset = (page - 1) * limit;
            const allOffres = await offreModel.read_recruteur(idsiren);
            const total = allOffres.length;
            const offres = allOffres.slice(offset, offset + limit);
            const totalPages = Math.ceil(total / limit);
            res.render('offre_recruteur', { offre: offres, page, totalPages });
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
        const users = await utilisateur.read('id_user', userId);
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
        await utilisateur.update(userId, { role_recruteur: 'attente', siren });
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

// Validation d'une demande de recruteur par un administrateur
router.post('/valider_recruteur', async function(req, res) {
    if (!req.session || req.session.role !== 'admin') {
        return res.status(403).render('error', { message: "Accès refusé.", error: {} });
    }
    const userId = req.body.id_user;
    try {
        await utilisateur.update(userId, { role_recruteur: 'validé', role: 'recruteur' });
        res.redirect('/utilisateurs/recruteur');
    } catch (err) {
        console.log('Erreur validation recruteur:', err);
        res.status(500).render('error', { message: "Erreur lors de la validation.", error: err });
    }
});

// Supprimer un utilisateur (admin)
router.post('/delete', async function(req, res) {
    if (!req.session || req.session.role !== 'admin') {
        return res.status(403).render('error', { message: "Accès refusé.", error: {} });
    }
    const userId = req.body.id_user;
    try {
        await utilisateur.delete(userId);
        res.redirect('/utilisateurs');
    } catch (err) {
        console.log('Erreur suppression utilisateur:', err);
        res.status(500).render('error', { message: "Erreur lors de la suppression.", error: err });
    }
});

// Attribuer le rôle admin à un utilisateur
router.post('/set_admin', async function(req, res) {
    if (!req.session || req.session.role !== 'admin') {
        return res.status(403).render('error', { message: "Accès refusé.", error: {} });
    }
    const userId = req.body.id_user;
    try {
        const user = await utilisateur.readById(userId);
        if (user && user[0] && user[0].role === 'admin') {
            // Récupérer la liste des utilisateurs pour réafficher la vue avec un message
            const users = await utilisateur.readAll();
            return res.render('utilisateurs', { title: 'Utilisateurs', utilisateurs: users, message: "Cet utilisateur est déjà administrateur." });
        }
        await utilisateur.update(userId, { role: 'admin' });
        res.redirect('/utilisateurs');
    } catch (err) {
        console.log('Erreur attribution admin:', err);
        res.status(500).render('error', { message: "Erreur lors de l'attribution du rôle admin.", error: err });
    }
});

// Déconnexion
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Mon espace : informations du compte connecté
router.get('/mon_espace', async function(req, res) {
    if (!req.session || !req.session.userid) {
        return res.redirect('/');
    }
    const userId = req.session.userid;
    try {
        const utilisateurModel = require('../model/utilisateur');
        const organisationModel = require('../model/organisation');
        const offreModel = require('../model/offre');
        // Récupérer infos utilisateur
        const userArr = await utilisateurModel.readById(userId);
        const user = userArr && userArr[0];
        // Organisation (si rattaché)
        let organisation = null;
        if (user && user.siren) {
            const orgaArr = await organisationModel.readBySiren(user.siren);
            organisation = orgaArr && orgaArr[0];
        }
        // Offres dont il est responsable
        let offres = [];
        if (user && user.role === 'recruteur') {
            offres = await offreModel.read_recruteur(user.siren);
        }
        res.render('mon_espace', {
            user,
            organisation,
            offres
        });
    } catch (err) {
        console.log(err);
        res.status(500).render('error', { message: "Erreur lors de la récupération des infos du compte.", error: err });
    }
});


module.exports = router;

