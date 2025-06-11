const session = require("../session");
const UserModel = require("../model/utilisateur");
const bcrypt = require('bcrypt');


// Connexion utilisateur
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Hachage du mot de passe
        const passwd = await UserModel.getPasswdHach(email);
        if (!passwd || passwd.length === 0) {
            return res.status(401).json({ message: "Identifiants incorrects." });
        }

        const isMatch = await bcrypt.compare(password, passwd[0].motDePasse);
        if (!isMatch) {
            userAttempts.attempts +=1;
            // Vérouiller le compte si 5 tentatives échouées
            if (userAttempts.attempts >= 5) {
                userAttempts.locked = Date.now() + 5 * 60 * 1000; // verrouillage pour 5 minutes
                userAttempts.attempts = 0; // Rénitialiser les tentatives
                return res.status(403).json({ message: "Compte verrouillé après 5 tentatives échouées." });
            }
            throw new Error("Mot de passe incorrect");
        }
        const user = await UserModel.authenticateUser(email, passwd[0].motDePasse);
        if (user) {
            // Correction : stocker l'id numérique de l'utilisateur dans la session
            session.creatSession(req.session, user[0].id_user, user[0].nom, user[0].prenom, user[0].role,user[0].siren);
            // On attend la sauvegarde de la session avant de rediriger
            req.session.save(function(err) {
                if (err) {
                    console.error('Erreur lors de la sauvegarde de la session :', err);
                    return res.status(500).json({ message: "Erreur serveur." });
                }
                if (user[0].role === "candidat") {
                    return res.redirect("/offre/candidat");
                } else if (user[0].role === "recruteur") {
                    return res.redirect("/utilisateurs/espace_recruteur");
                } else if (user[0].role === "admin") {
                    return res.redirect("/organisations");
                }
                else {
                    return res.status(403).json({ message: "Rôle non reconnu." });
                }
            });
        } else {
            return res.status(401).json({ message: "Identifiants incorrects." });
        }
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
}