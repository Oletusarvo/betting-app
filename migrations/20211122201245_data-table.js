
exports.up = function(knex) {
  return knex.schema.createTable('data_table', tbl => {
    tbl.increments('id');
    tbl.string('bank_data', 5000).notNullable();
    tbl.string('game_data', 5000).notNullable();
  })
};

exports.down = function(knex) {
  return (
    knex.schema.dropTableIfExists('data_table')
  );
};
