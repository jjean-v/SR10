var express = require('express');
const offre = require('../model/offre.js');
const recruteur = require('../model/utilisateur');
const fiche_de_poste = require('../model/fiche_de_poste');
const organisation = require('../model/organisation');
const multer = require('multer');
const path = require('path');
const pieceJointeModel = require('../model/pieceJointe');
var router = express.Router();

/* GET Organisation listing. */

router.get('/candidat', function(req, res, next) {
    const userid = req.session.userid;
    if (!userid) {
        return res.redirect('/'); 
    }


    promiseO=offre.read_pas_postuler(userid);
    promiseO.then( (data) =>{

        res.render('offre_candidat', { title: 'Offre', offre: data });
    });
    promiseO.catch( (err) => {
        console.log(err);
        res.status(500).send('Error retrieving Offre data');
    }); 
});


router.get('/new_offre', async (req, res) => {
    try {
      const responsables = await recruteur.readRecruteur();
      const fichesPoste = await fiche_de_poste.readAll();
  
      res.render('new_offre',{ title : 'test', responsables :responsables, fichesPoste : fichesPoste});
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors du chargement des données.");
    }
  });


router.post('/creation_offre', function(req, res, next) {
  const {date_validite, liste_piece_demande, nb_piece_demande, resp_hierarchique, id_fiche_poste} = req.body;


  promise = offre.createOffre({etat : 'publiée', date_validite, liste_piece_demande, nb_piece_demande, resp_hierarchique, id_fiche_poste})
  promise.then( (data) =>{

    res.render('creation_X', { title: 'creation de l offre', user: data , objet : "offre", url : "utilisateurs/espace_recruteur"});

  });

  promise.catch( (err) => {
      console.log(err);
      res.status(500).send('Error retrieving new user data');
  }); 

});

// Configuration de Multer pour l'upload de fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/assets/upload'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop();
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
    }
});
const upload = multer({ storage: storage });


// Route pour postuler à une offre
router.post('/postuler', function(req, res) {
    // Récupération des infos nécessaires
    const id_offre = req.body.id_offre;
    const id_user = req.session.userid;
    const date_postulation = new Date();

    // Vérification des champs
    if (!id_offre || !id_user) {
        return res.status(400).render('error', { message: "Erreur : informations manquantes pour la candidature.", error: {} });
    }

    // Appel au modèle pour créer la candidature
    const candidatureModel = require('../model/candidature');
    candidatureModel.create({
        date_candidature: date_postulation,
        utilisateur_id: id_user,
        id_offre: id_offre
    })
    .then(() => {
        res.render('confirmation_postulation', { id_offre });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).render('error', { message: "Erreur lors de la postulation.", error: err });
    });
});

// Route POST pour postuler à une offre avec upload de pièces jointes
router.post('/postuler/:id_offre', upload.array('pieces'), async function(req, res) {
    const id_offre = req.params.id_offre;
    const id_user = req.session.userid;
    const date_postulation = new Date();
    if (!id_offre || !id_user) {
        return res.status(400).render('error', { message: "Erreur : informations manquantes pour la candidature.", error: {} });
    }
    try {
        // Création de la candidature
        const candidatureModel = require('../model/candidature');
        const result = await candidatureModel.create({
            date_candidature: date_postulation,
            utilisateur_id: id_user,
            id_offre: id_offre
        });
        const id_candidature = result.insertId;
        // Enregistrement des pièces jointes
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                await pieceJointeModel.create({
                    nom: file.filename,
                    type: file.mimetype,
                    taille: file.size,
                    candidature_id: id_candidature
                });
            }
        }
        res.render('confirmation_postulation', { id_offre });
    } catch (err) {
        console.log(err);
        res.status(500).render('error', { message: "Erreur lors de la postulation.", error: err });
    }
});

// Affiche le formulaire de postulation avec upload de pièces jointes
router.get('/postuler/:id_offre', async function(req, res) {
    const id_offre = req.params.id_offre;
    const id_user = req.session.userid;
    if (!id_user) {
        return res.redirect('/');
    }
    try {
        const offreData = await offre.readsingle(id_offre);
        if (!offreData || !offreData[0]) {
            return res.status(404).render('error', { message: "Offre non trouvée", error: {} });
        }
        res.render('postuler_offre', {
            offre: offreData[0],
            prenom: req.session.prenom,
            nom: req.session.nom,
            role: req.session.role
        });
    } catch (err) {
        console.log(err);
        res.status(500).render('error', { message: "Erreur lors du chargement de l'offre.", error: err });
    }
});

// Route pour supprimer une offre
router.post('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await offre.delete(id);
    res.redirect('/utilisateurs/espace_recruteur');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la suppression de l\'offre');
  }
});

// Route pour afficher le formulaire de modification d'une offre
router.get('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = await offre.readsingle(id);
    if (!data || !data[0]) return res.status(404).send('Offre non trouvée');
    res.render('edit_offre', { offre: data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors du chargement de l\'offre');
  }
});

// Route pour traiter la modification d'une offre
router.post('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { date_validite, liste_piece_demande, nb_piece_demande, etat } = req.body;
    await offre.update(id, { date_validite, liste_piece_demande, nb_piece_demande, etat });
    res.redirect('/utilisateurs/espace_recruteur');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la modification de l\'offre');
  }
});

// Recherche d'offres pour le candidat
router.get('/candidat/recherche', function(req, res, next) {
    const userid = req.session.userid;
    if (!userid) {
        return res.redirect('/');
    }
    const q = req.query.q ? req.query.q.trim() : '';
    if (!q) {
        // Si pas de recherche, on renvoie la liste normale
        return res.redirect('/offre/candidat');
    }
    // Recherche sur l'intitulé, le lieu ou la description
    const sql = `SELECT DISTINCT Offre.id_offre, Offre.etat, Offre.date_validite, Offre.liste_piece_demande, Fiche_de_Poste.intitule, Fiche_de_Poste.lieu, Fiche_de_Poste.description
        FROM Offre 
        INNER JOIN Fiche_de_Poste ON Offre.id_fiche_poste = Fiche_de_Poste.id_fiche 
        WHERE Offre.id_offre NOT IN ( SELECT id_offre FROM Candidature WHERE utilisateur_id = ? ) 
        AND Offre.etat = 'publiée'
        AND (
            Fiche_de_Poste.intitule LIKE ? OR
            Fiche_de_Poste.lieu LIKE ? OR
            Fiche_de_Poste.description LIKE ?
        )`;
    const likeQ = `%${q}%`;
    db = require('../model/db');
    db.query(sql, [userid, likeQ, likeQ, likeQ], function(err, results) {
        if (err) {
            console.log(err);
            return res.status(500).send('Erreur lors de la recherche d\'offres');
        }
        res.render('offre_candidat', { title: 'Offre', offre: results, recherche: q });
    });
});

module.exports = router;
