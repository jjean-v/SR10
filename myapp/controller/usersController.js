const session = require("../session");
const UserModel = require("../model/utilisateur");

// Connexion utilisateur
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.authenticateUser(email, password);
        if (user) {

            session.creatSession(req.session,user[0].email,user[0].role);
            console.log("maintenant j'ai une session");

            //return res.status(200).json({ message: "Connexion réussie !" });
            res.redirect("/offre");
        } else {
            return res.status(401).json({ message: "Identifiants incorrects." });
        }
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
}