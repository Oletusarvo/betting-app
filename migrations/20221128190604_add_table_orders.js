/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('orders', tbl => {
    tbl.increments('id');
    tbl.string('username').references('username').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.string('symbol').notNullable().references('symbol').inTable('orderbooks').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.string('side').notNullable();
    tbl.string('type').notNullable();
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
  return knex.schema.dropTableIfExists('orders');
};
