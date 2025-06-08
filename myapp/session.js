var sessions = require("express-session");
module.exports = {
        
    init: () => {
        return sessions({
            secret: "xxxzzzyyyaaabbbcc",
            saveUninitialized: true,
            cookie: { maxAge: 3600 * 1000 }, // 60 minutes, httpOnly : true
            resave: false,
        });
    },

    creatSession: function (session, id, nom, prenom, role, siren) {
        session.role = role;
        session.userid = id;
        session.nom = nom;
        session.prenom = prenom;
        session.siren = siren || null;



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