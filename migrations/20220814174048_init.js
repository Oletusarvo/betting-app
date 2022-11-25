/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.string('username').notNullable().unique().primary('pk_username');
    tbl.string('password').notNullable();
    tbl.timestamps(true, true);
  })
  .createTable('accounts', tbl => {
    tbl.increments('id');
    tbl.string('username').references('username').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
    tbl.string('currency').notNullable().defaultTo('DCE').references('short_name').inTable('currencies').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.float('balance').notNullable().defaultTo(0);
    tbl.timestamps(true, true);
    tbl.comment('Contains accounts for holding singular currency.');
  })
  .createTable('currencies', tbl => {
    tbl.string('symbol', 1);
    tbl.string('name', 25).notNullable().unique();
    tbl.string('short_name', 3).notNullable().unique().primary('pk_currencies');
    tbl.string('created_by').references('username').inTable('users').onUpdate('CASCADE');
    tbl.float('circulation').defaultTo(0);
    tbl.integer('precision').defaultTo(2);
    tbl.timestamps(true, true);
  })
  .createTable('orderbooks', tbl => {
    tbl.string('symbol', 7).notNullable().unique().primary('pk_orderbooks');
    tbl.string('traded').notNullable().unique().references('short_name').inTable('currencies').onUpdate('CASCADE').onDelete('CASCADE');
    tbl.string('traded_against').notNullable().unique().references('short_name').inTable('currencies').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.float('open_price');
    tbl.float('low_price');
    tbl.float('high_price');
    tbl.float('last_price');
    tbl.timestamps(true, true);
    tbl.comment('Contains valuation data for exchanges of two different currencies');
  })
  .createTable('orders', tbl => {
    tbl.increments('id');
    tbl.string('symbol').notNullable().references('symbol').inTable('orderbooks').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.string('username').notNullable().references('username').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.string('type').notNullable();
    tbl.string('side').notNullable()
    tbl.float('price').notNullable();
    tbl.float('size').notNullable();
    tbl.timestamps(true, true);
  })
  .createTable('transaction_history', tbl => {
    tbl.increments('id');
    tbl.string('symbol').notNullable().references('symbol').inTable('orderbooks').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.string('buyer').notNullable();
    tbl.string('seller').notNullable();
    tbl.float('price').notNullable();
    tbl.float('size').notNullable();
    tbl.timestamps(true, true);
  })
  .createTable('games', tbl => {
    tbl.string('id')
    .notNullable()
    .unique()
    .primary();

    tbl.string('currency').defaultTo('DCE').references('short_name').inTable('currencies').onUpdate('CASCADE');
    tbl.string('title', 50).notNullable();
    tbl.float('pool').defaultTo(0);
    tbl.float('pool_reserve').defaultTo(0);
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
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('bets')
  .dropTableIfExists('games')
  .dropTableIfExists('accounts')
  .dropTableIfExists('users')
  .dropTableIfExists('orderbooks')
  .dropTableIfExists('currencies')
  .dropTableIfExists('transaction_history');

};
