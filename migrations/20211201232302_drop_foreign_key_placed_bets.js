
exports.up = function(knex) {
  return knex.schema.table('placed_bets_table', tbl => {
      tbl.dropColumn('game_name');
  });
};

exports.down = function(knex) {
  return knex.schema.table('placed_bets_table', tbl => {
      tbl.string('game_name').notNullable()
      .references('game_name')
      .inTable('game_table')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};
