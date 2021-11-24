// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './backend/data/database.db3'
    },

    pool: {
      afterCreate: (conn, done) => {
        conn.run("PRAGMA foreign_keys = ON", done);
      }
    },

    useNullAsDefault : true
  },

  production : {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },

    migrations: {
      tablename: 'knex_migrations',
      directory: './migrations'
    }
  }
};
