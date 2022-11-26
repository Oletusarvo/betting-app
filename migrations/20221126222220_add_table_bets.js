/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('bets', tbl => {
    tbl.string('username')
    .notNullable()
    .references('username')
    .inTable('users')
    .onDelete('CASCADE')
    .onUpdate('CASCADE');

    tbl.string('game_id')
    .notNullable()
    .references('id')
    .inTable('games')
    .onDelete('CASCADE')
    .onUpdate('CASCADE');

    tbl.float('amount').defaultTo(0);
    tbl.boolean('folded').defaultTo(false);
    tbl.timestamps(true, true);
    tbl.string('side');
    tbl.string('type');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('bets');
};
