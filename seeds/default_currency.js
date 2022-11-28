/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Update or create the default currency.
  await knex('currencies').del();
  await knex('currencies').insert({
    symbol: 'D',
    name: 'Dice',
    short_name: 'DCE',
    created_by: 'sepi'
  });
 
};
