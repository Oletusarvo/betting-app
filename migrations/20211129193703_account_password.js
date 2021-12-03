
exports.up = function(knex) {
  return knex.schema.table('account_table', tbl => {
    tbl.string('password');
  });
};

exports.down = function(knex) {
    return knex.schema.table('account_table', tbl => {
        tbl.dropColumn('password');
    });
};
