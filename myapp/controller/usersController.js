const session = require("../session");
const UserModel = require("../model/utilisateur");

// Connexion utilisateur
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.authenticateUser(email, password);
        if (user) {
            // Correction : stocker l'id numérique de l'utilisateur dans la session
            session.creatSession(req.session, user[0].id_user, user[0].nom, user[0].prenom, user[0].role);
            // On attend la sauvegarde de la session avant de rediriger
            req.session.save(function(err) {
                if (err) {
                    console.error('Erreur lors de la sauvegarde de la session :', err);
                    return res.status(500).json({ message: "Erreur serveur." });
                }
                if (user[0].role === "candidat") {
                    return res.redirect("/offre");
                } else if (user[0].role === "recruteur") {
                    return res.redirect("/offre/espace_recruteur");
                } else {
                    return res.redirect("/");
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