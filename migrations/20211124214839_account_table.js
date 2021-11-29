
exports.up = function(knex) {
  return knex.schema.createTable('account_table', tbl => {
    tbl.increments('id');
    //tbl.string('participations');
    tbl.string('username').notNullable();
    tbl.float('balance').notNullable();
    tbl.float('debt').notNullable();
    tbl.float('init_balance').notNullable();
    tbl.float('profit').notNullable();
    tbl.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('account_table')
};
