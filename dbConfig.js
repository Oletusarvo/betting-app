const dbEngine = process.env.DB_ENVIRONMENT || "development";
const config = require("./knexfile")[dbEngine];

const db = require('knex')(config);
const enableForeignKeys = async () => await db.raw('PRAGMA foreign_keys=ON');
if(dbEngine === 'development') enableForeignKeys();

module.exports = db;