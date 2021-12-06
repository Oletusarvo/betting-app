
exports.up = function(knex) {
    return knex.schema.createTable('data_table', tbl => {
        tbl.increments('id');
        tbl.text('game_data').notNullable();
        tbl.text('bank_data').notNullable();
    })
    .createTable('account_table', tbl => {
        tbl.increments('id');
        tbl.string('username').notNullable();
        tbl.string('password').notNullable();
        tbl.float('balance').notNullable();
        tbl.float('debt').notNullable();
        tbl.float('profit').notNullable();
        tbl.float('init_balance').notNullable();
        tbl.timestamps(true, true);
    })
    .createTable('game_table', tbl => {
        tbl.increments('id');
        tbl.json('bets');
        tbl.string('game_name').notNullable();
        tbl.float('pool').notNullable();
        tbl.float('min_bet').notNullable();
        tbl.timestamps(true, true);
    })
    .createTable('bank_table', tbl => {
        tbl.increments('id');
        tbl.string('bank_name').notNullable();
        tbl.string('currency_symbol').notNullable();
        tbl.float('circulation').notNullable();
        tbl.float('default_issue_amount').notNullable();
        tbl.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('data_table')
    .dropTableIfExists('account_table')
    .dropTableIfExists('game_table')
    .dropTableIfExists('bank_table');
};
