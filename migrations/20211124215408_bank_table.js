
exports.up = function(knex) {
  return knex.schema.createTable('bank_table', tbl => {
    tbl.increments('id');
    tbl.string('bank_name').notNullable();
    tbl.float('circulation').notNullable();
    tbl.float('default_issue_amount').notNullable();
    tbl.string('currency_symbol').notNullable();
    tbl.timestamps(true, true);
  });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('bank_table');
};
