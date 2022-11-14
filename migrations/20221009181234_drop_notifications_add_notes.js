/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.dropTableIfExists('notifications')
  .createTable('notes', tbl => {
    tbl.increments('id');

    tbl.string('username')
    .references('username')
    .inTable('accounts')
    .onDelete('CASCADE')
    .onUpdate('CASCADE');

    tbl.string('game_title')
    .notNullable()
    .defaultTo('Unknown');

    tbl.string('message').notNullable();
    tbl.boolean('seen').notNull().defaultTo(false);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('notes');
};
