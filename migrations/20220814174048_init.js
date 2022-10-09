/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('bets', tbl => {
    tbl.string('username')
    .notNullable();

    tbl.string('game_id').notNullable().references('id').inTable('games').onDelete('CASCADE').onUpdate('CASCADE');

    tbl.float('amount').defaultTo(0);
    tbl.boolean('folded').defaultTo(false);
    tbl.timestamps(true, true);
  })
  .createTable('games', tbl => {
    tbl.string('game_id').notNullable().unique().primary();
    tbl.string('game_title', 50).notNullable();
    tbl.float('pool').defaultTo(0);
    tbl.float('minimum_bet').defaultTo(0.01);
    tbl.string('expiry_date').defaultTo('When closed by creator.');
  })
  .createTable('accounts', tbl => {
    tbl.string('username').notNullable();
    tbl.string('password').notNullable();
    tbl.float('balance').defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('bets').dropTableIfExists('games').dropTableIfExists('accounts');
};
