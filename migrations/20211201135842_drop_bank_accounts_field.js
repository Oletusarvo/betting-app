
exports.up = function(knex) {
  return knex.schema.table('bank_table', tbl => {
      tbl.dropColumn('accounts');
  });
};

exports.down = function(knex) {
  return knex.schema.table('bank_table', tbl => {
      tbl.string('accounts');
  });
};
