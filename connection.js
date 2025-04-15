var mysql = require("mysql");
var util = require("util");
var conn = mysql.createConnection({
    "host":"bagqdebjs5eg55rxfjji-mysql.services.clever-cloud.com",
    "user":"uixzw15gvd4m0ymc",
    "password":"DKeYYl4ZdPD1sHSn2B6n",
    "database":"bagqdebjs5eg55rxfjji"
});

var exe = util.promisify(conn.query).bind(conn);

module.exports = exe;