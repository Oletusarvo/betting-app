
exports.up = function(knex) {
  return knex.schema.createTable('games', tbl => {
      tbl.increments('id');
      tbl.string('name');
      tbl.string('bets'); //Json rep of all bets.
      tbl.string('game_name');
      tbl.float('pool');
      tbl.float('min_bet');
      tbl.timestamps(true, true);
  })
  .createTable('accounts', tbl => {
    tbl.increments('id');
    tbl.string('username');
    tbl.float('balance');
    tbl.float('debt');
    tbl.float('init_balance');
    tbl.float('profit');
    tbl.timestamps(true, true);
  })
  .createTable('banks', tbl =>{
    tbl.increments('id');
    tbl.float('circulation');
    tbl.float('default_issue_amount');
    tbl.string('currency_symbol');
    tbl.string('accounts'); //JSON rep of accounts.
    tbl.string('bank_name');
    tbl.timestamps(true, true);
  })
  .createTable('data_table', tbl => {
    tbl.increments('id');
    tbl.string('bank_data', 5000);
    tbl.string('game_data', 5000);
  })
};

exports.down = function(knex) {
  return (
    knex.schema.dropTableIfExists('data_table'),
    knex.schema.dropTableIfExists('games'),
    knex.schema.dropTableIfExists('accounts'),
    knex.schema.dropTableIfExists('banks')
  );
};
