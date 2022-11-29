/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('price_history', tbl => {
    tbl.increments('id');
    tbl.string('symbol').references('symbol').inTable('orderbooks').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.string('buyer').references('username').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.string('seller').references('username').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.string('side').notNullable();
    tbl.float('price').notNullable();
    tbl.float('size').notNullable();
    tbl.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('price_history');
};
