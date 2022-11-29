/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('orderbooks', tbl => {
    tbl.string('symbol', 7).notNullable().unique().primary();
    tbl.string('trades').notNullable().references('short_name').inTable('currencies').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.string('trades_against').notNullable().references('short_name').inTable('currencies').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.string('created_by');
    tbl.float('open_price').defaultTo(0);
    tbl.float('low_price').defaultTo(0);
    tbl.float('high_price').defaultTo(0);
    tbl.float('last_price').defaultTo(0);
    tbl.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('orderbooks');
};
