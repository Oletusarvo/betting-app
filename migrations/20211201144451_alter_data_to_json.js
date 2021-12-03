
exports.up = function(knex) {
  return knex.schema.dropTableIfExists('data_table')
    .createTable('data_table', tbl => {
        tbl.increments('id');
        tbl.json('game_data').notNullable();
        tbl.json('bank_data').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('data_table')
        .createTable('data_table', tbl => {
            tbl.increments('id');
            tbl.string('game_data', 5000).notNullable();
            tbl.string('bank_data', 5000).notNullable();
        });
};
