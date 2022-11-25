/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.string('username').notNullable().primary('pk_users').unique();
    tbl.string('password').notNullable();
    tbl.float('balance').defaultTo(0);
  })
  .createTable('games', tbl => {
    tbl.string('id')
    .notNullable()
    .unique()
    .primary('pk_games');

    tbl.string('title', 50).notNullable();
    tbl.string('created_by').references('username').inTable('users').onUpdate('CASCADE');
    tbl.string('options');
    tbl.string('type');
    tbl.float('pool').defaultTo(0);
    tbl.float('pool_reserve').defaultTo(0);
    tbl.float('increment').defaultTo(0);
    tbl.float('minimum_bet').defaultTo(0.01);
    tbl.string('expiry_date').defaultTo('When Closed');
  })
  .createTable('bets', tbl => {
    tbl.increments('id');
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
  })
  .createTable('notes', tbl => {
    tbl.string('username').references('username').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.string('title').notNullable();
    tbl.string('message').notNullable();
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
  .dropTableIfExists('users')
  .dropTableIfExists('notes');
};
