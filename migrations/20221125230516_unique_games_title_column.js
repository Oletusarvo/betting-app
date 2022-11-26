/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const gameData = await knex('games');
  await knex.schema.table('games', tbl => {
    tbl.dropColumn('title');
  });

  await knex.schema.table('games', tbl => {
    tbl.string('title').unique();
  });

  for(const game of gameData){
    await knex('games').where({id: game.id}).update('title', game.title);
  }

  return knex.schema.table('games', tbl => {});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return knex.schema.table('games', tbl => {
      tbl.dropUnique('title');
    });
};
