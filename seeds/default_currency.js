/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('currencies').del()
  await knex('currencies').insert([
    {symbol: 'DICE', precision: 2, created_by: ''}
  ]);
};
