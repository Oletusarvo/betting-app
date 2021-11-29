
exports.up = function(knex) {
  return knex.schema.createTable('game_table', tbl => {
      tbl.increments('id');
      tbl.string('bets');
      tbl.string('game_name').notNullable();
      tbl.float('pool').notNullable();
      tbl.float('min_bet').notNullable();
      tbl.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('game_table');
};
