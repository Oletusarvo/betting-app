/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('games', tbl => {
    tbl.renameColumn('row_size', 'lotto_row_size');
    tbl.renameColumn('draw_size', 'lotto_draw_size');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('games', tbl => {
    tbl.renameColumn('lotto_row_size', 'row_size');
    tbl.renameColumn('lotto_draw_size', 'draw_size');
  });
};
