/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('accounts', tbl => {
    tbl.increments('id');
    tbl.string('username').references('username').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.string('currency').references('short_name').inTable('currencies').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.float('balance').defaultTo(0);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('accounts');
};
