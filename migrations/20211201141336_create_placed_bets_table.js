
exports.up = function(knex) {
  return knex.schema.createTable('placed_bets_table', tbl => {
    tbl.increments('id');
    tbl.float('amount').notNullable();
    tbl.boolean('side').notNullable();
    tbl.boolean('folded').notNullable();
    tbl.string('username').notNullable();
    tbl.string('game_name').notNullable() //What game is this bet placed on?
    .references('game_name')
    .inTable('game_table')
    .onDelete('CASCADE')
    .onUpdate('CASCADE');

    tbl.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('placed_bets_table');
};
