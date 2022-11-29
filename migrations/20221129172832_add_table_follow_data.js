/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('follow_data', tbl => {
    tbl.increments('id');
    tbl.string('followed').references('username').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.string('followed_by').references('username').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.timestamps(true ,true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('follow_data');
};
