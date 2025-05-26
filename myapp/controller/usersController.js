const session = require("../session");
const UserModel = require("../model/utilisateur");

// Connexion utilisateur
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.authenticateUser(email, password);
        if (user) {
            session.creatSession(req.session, user[0].email, user[0].nom, user[0].prenom, user[0].role);
            // On attend la sauvegarde de la session avant de rediriger
            req.session.save(function(err) {
                if (err) {
                    console.error('Erreur lors de la sauvegarde de la session :', err);
                    return res.status(500).json({ message: "Erreur serveur." });
                }
                res.redirect("/offre");
            });
        } else {
            return res.status(401).json({ message: "Identifiants incorrects." });
        }
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
}