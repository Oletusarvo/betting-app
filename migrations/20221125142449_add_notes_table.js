/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('notes', tbl => {
    tbl.increments('id');
    tbl.string('username').references('username').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.string('title').notNullable();
    tbl.string('message');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExist('notes');
};
