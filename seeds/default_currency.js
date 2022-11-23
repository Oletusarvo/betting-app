/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Update or create the default currency.
  const dice = await knex('currencies').where({short_name: 'DCE'});
  if(dice){
    const balances = await knex.select('balance').from('accounts');
    const circulation = balances.reduce((acc, cur) => acc += cur.balance, 0);
    await knex.select('circulation').from('currencies').where('short_name', 'DCE').update('circulation', circulation);
  }
  else{
    await knex('currencies').insert([
      {name: 'Dice', precision: 2, created_by: '', short_name: 'DCE', symbol: '⚄'}
    ]);
  }

  console.log('Database updated/seeded with default currency.');
 
};
