
module.exports = {



    createOffre(offre, cb) {
        const {
        etat,
        date_validité,
        liste_piece_demande,
        nb_piece_demande,
        resp_hierarchique = 'attente'
        } = orga;

        const sql = `
        INSERT INTO Organisation
            ( siren,nom,type_orga,adresse,etat_orga)
        VALUES (?, ?, ?, ?, ?)
        `;
        const params = [siren,nom, type_orga, adresse, etat_orga];

        if (typeof cb === 'function') {
        // version callback
        db.query(sql, params, (err, result) => {
            if (err) return cb(err);
            cb(null, { statusCode: 200, insertId: result.insertId });
        });
        } else {
        // version Promise
        return query(sql, params)
            .then(result => ({ statusCode: 200, insertId: result.insertId }));
        }
    }
}