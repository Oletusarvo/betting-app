/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('game_history', tbl => {
    tbl.increments('id');
    tbl.string('game_title').notNullable();
    tbl.string('result').notNullable();
    tbl.float('pool').notNullable();
    tbl.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('game_history');
};
