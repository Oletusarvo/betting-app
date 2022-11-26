/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('games', tbl => {
    tbl.string('id')
    .notNullable()
    .unique()
    .primary();

    tbl.string('title', 50).unique().notNullable();
    tbl.float('pool').defaultTo(0);
    tbl.float('minimum_bet').defaultTo(0.01);
    tbl.string('expiry_date').defaultTo('When Closed');
    tbl.string('created_by');
    tbl.float('increment').defaultTo(0);
    tbl.string('available_to');
    tbl.string('type');
    tbl.string('options');
    tbl.float('pool_reserve').defaultTo(0);
    tbl.float('tax').defaultTo(0);
    
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('games');
};
