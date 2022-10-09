/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('games', tbl => {
    tbl.renameColumn('game_id', 'id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('games', tbl => {
        tbl.renameColumn('id', 'game_id');
    });
};
