
exports.up = function(knex) {
  return knex.schema.createTable('data_table', tbl => {
    tbl.increments('id');
    tbl.json('bank_data').notNullable();
    tbl.json('game_data').notNullable();
  })
};

exports.down = function(knex) {
  return (
    knex.schema.dropTableIfExists('data_table')
  );
};
