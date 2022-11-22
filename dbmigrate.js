const knex = require('dbconfig');
knex.migrate.latest()
.then(() => {
    console.log('Migration complete.');
})