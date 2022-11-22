/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('games', tbl => {
   tbl.dropColumn('lotto_draw_size');
   tbl.dropColumn('lotto_row_size');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table("games", tbl => {
    tbl.integer('lotto_row_size').notNullable().defaultTo(1);
    tbl.integer('lotto_draw_size').notNullable().defaultTo(1);
  })
};
