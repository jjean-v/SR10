const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost", // ou localhost
  user: "root",
  password: "Jean2004,",
  database: "sr10"
});

// Vérification de la connexion
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err.message);
  } else {
    console.log("Connexion à la base de données réussie !");
    connection.release(); // Libère la connexion après vérification
  }
});

module.exports = pool;