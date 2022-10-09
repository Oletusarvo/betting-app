/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('games', tbl => {
    tbl.renameColumn('game_title', 'title');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('games', tbl => {
        tbl.renameColumn('title', 'game_title');
    })
};
