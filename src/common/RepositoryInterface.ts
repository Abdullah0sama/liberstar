import {knex, Knex } from 'knex';

export abstract class RepositoryInterface {
    protected knexInstance: Knex;
    
    constructor () {
        this.knexInstance = knex({
            client: 'pg',
            connection: {
                host: process.env.DB_Host,
                password: process.env.DB_Password,
                user: process.env.DB_User,
                database: process.env.DB_Database,
                port: Number(process.env.DB_Port),
            }
        })
    }
}