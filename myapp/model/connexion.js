var mysql = require("mysql");
var pool = mysql.createPool({
host: "tuxa.sme.utc", //ou localhost
user: "sr10p010"
,
password: "GtsU8cu10zjG"
,
database: "sr10p010"
});
module.exports = pool;