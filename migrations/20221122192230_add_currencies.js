/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('currencies', tbl => {
    tbl.string('symbol').notNullable().defaultTo('$');
    tbl.string('name').unique().notNullable();
    tbl.string('short_name').unique().primary('pk_currency');
    tbl.string('created_by');
    tbl.integer('precision');
    tbl.integer('circulation').defaultTo(0);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('currencies');
};
