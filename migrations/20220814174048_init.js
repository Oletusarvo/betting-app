/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('games', tbl => {
    tbl.string('game_id')
    .notNullable()
    .unique()
    .primary();

    tbl.string('game_title', 50).notNullable();
    tbl.float('pool').defaultTo(0);
    tbl.float('minimum_bet').defaultTo(0.01);
    tbl.string('expiry_date').defaultTo('When Closed');
  })
  .createTable('accounts', tbl => {
    tbl.string('username').notNullable();
    tbl.string('password').notNullable();
    tbl.float('balance').defaultTo(0);
  })
  .createTable('bets', tbl => {
    tbl.string('username')
    .notNullable()
    .unique()
    .primary()
    .references('username')
    .inTable('accounts')
    .onDelete('CASCADE')
    .onUpdate('CASCADE');

    tbl.string('game_id')
    .notNullable()
    .references('game_id')
    .inTable('games')
    .onDelete('CASCADE')
    .onUpdate('CASCADE');

    tbl.float('amount').defaultTo(0);
    tbl.boolean('folded').defaultTo(false);
    tbl.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('bets')
  .dropTableIfExists('games')
  .dropTableIfExists('accounts');
};
