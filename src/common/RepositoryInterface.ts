import { knex, Knex } from 'knex';
import { types } from 'pg';

export abstract class RepositoryInterface {
    protected knexInstance: Knex;
    protected abstract tableName: string;

    constructor () {
        // Parse date to date object without changing timezone
        types.setTypeParser(1082, (val: unknown) => val);
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