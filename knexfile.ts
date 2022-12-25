import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      database: "liberstar",
      user: "postgres",
      password: "postgres",
      port: 8080
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: __dirname + "/knex/migrations"
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    }
  },

};

module.exports = config;
