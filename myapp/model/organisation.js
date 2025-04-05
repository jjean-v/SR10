var db = require('./db.js');

module.exports = {
    read: function (nom) {
        return new Promise(function (resolve, reject) {
            db.query("select * from Organisation where nom= ?", [nom], function (err, results) {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },
    readall: function (callback) {
        db.query("select * from Utilisateur", function (err, results) {
            if (err) throw err;
            callback(results);

        });

    },
    areValid: function (email, password, callback) {
        sql = "SELECT pwd FROM USERS WHERE email = ?";
        rows = db.query(sql, email, function (err, results) {
            if (err) throw err;
            if (rows.length == 1 && rows[0].pwd === password) {
                callback(true)
            } else {
                callback(false);
            }
        });


        },
        creat: function (email, nom, prenom, pwd, type, callback) {
            //todo
            return false;
    }
}
