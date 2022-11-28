/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('currencies', tbl => {
    tbl.string('symbol', 1);
    tbl.string('name', 25).notNullable().unique();
    tbl.string('short_name', 3).notNullable().primary().unique();
    tbl.string('created_by');
    tbl.float('circulation').defaultTo(0);
    tbl.integer('precision').defaultTo(0);
    tbl.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('currencies');
};
