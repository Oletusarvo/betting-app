/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.dropTableIfExists('notifications')
  .createTable('notes', tbl => {
    tbl.increments('id');

    tbl.string('username')
    .notNullable()
    .references('username')
    .inTable('accounts')
    .onDelete('CASCADE')
    .onUpdate('CASCADE');

    tbl.string('game_title')
    .notNullable()
    .references('title')
    .inTable('games')
    .onDelete('CASCADE')
    .onUpdate('CASCADE');

    tbl.string('game_id')
    .notNullable()
    .references('id')
    .inTable('games')
    .onDelete('CASCADE')
    .onUpdate('CASCADE');

    tbl.string('message').notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('notes');
};
