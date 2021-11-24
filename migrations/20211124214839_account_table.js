
exports.up = function(knex) {
  return knex.schema.createTable('account_table', tbl => {
    tbl.increments('id');
    tbl.string('username');
    tbl.float('balance');
    tbl.float('debt');
    tbl.float('init_balance');
    tbl.float('profit');
    tbl.timestamps(true, true);
  });
};

exports.down = function(knex) {
  knex.schema.dropTableIfExists('account_table')
};
