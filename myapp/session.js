var sessions = require("express-session");
module.exports = {
        
    init: () => {
        return sessions({
            secret: "xxxzzzyyyaaabbbcc",
            saveUninitialized: true,
            cookie: { maxAge: 3600 * 1000 }, // 60 minutes
            resave: false,
        });
    },

    creatSession: function (session, mail, nom, prenom, role) {
        session.role = role;
        session.userid = mail;
        session.nom = nom;
        session.prenom = prenom;



        session.save(function (err) {
            console.log(err);
        });
        return session;
    },


    isConnected: (session, role) => {
        if (!session.userid || session.userid === undefined) return false;
        if (role && session.role !== role) return false;
        return true;
    },

    deleteSession: function (session) {
    session.destroy();
    },
};