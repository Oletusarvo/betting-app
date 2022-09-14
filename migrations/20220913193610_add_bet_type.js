/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('games', tbl => {
    tbl.string('type').notNullable().defaultTo('boolean');
    tbl.string('options').defaultTo('Kyllä;Ei');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('games', tbl => {
    tbl.dropColumn('type');
    tbl.dropColumn('options');
  })
};
