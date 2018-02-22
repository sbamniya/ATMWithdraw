var mySQL = require('mysql');
const config = require('./config');

var pool  = mySQL.createPool(config);

module.exports = pool;