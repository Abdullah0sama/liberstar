import { DatabaseError } from 'pg-protocol';
import { NotFound, UnporcessableEntity } from '../../common/Errors';
import { RepositoryInterface } from '../../common/RepositoryInterface';
import { BaseUserInterface, GetInterface, ListInterface, userIdentifiers } from './userInterface';
import { userFields } from './userValidation';
import pino from 'pino';


export class UserRepository extends RepositoryInterface {
    tableName = 'users';
    constructor (logger: pino.Logger) {
        super(logger);
    }

    getUsers(options: ListInterface) {
        const query =  this.knexInstance.select(options.select || userFields).from(this.tableName)
        
        if (options.sort_by) query.orderBy(options.sort_by, options.order_by);
        if (options.limit) query.limit(options.limit)
        if (options.offset) query.offset(options.offset)

        return query;
    }
    async getUserWithPassword(condition: { [k in userIdentifiers]?: string }, options: GetInterface) {
        try {
            const select = options.select || userFields
            const user = await this.knexInstance.select([...select, 'password']).from(this.tableName).where(condition);
            if (!user.length) {
                throw new NotFound(`User with ${JSON.stringify(condition)} is not found!`);
            }
            return user[0];
        } catch (err: unknown) {
            this.logger.error(err, 'Failed to get get user with password')
            throw err;
        }
    }
    async getUserById (id: string, options: GetInterface) {
        try {
            const user = await this.knexInstance.select(options.select || userFields).from(this.tableName).where('id', '=', id);
            if (!user.length) {
                throw new NotFound(`User with id: ${id} is not found!`);
            }
            return user[0];
        } catch (err: unknown) {
            this.logger.error(err, `Failed to get user by id: ${id}`)
            throw err;
        }
    }

    async insertUser(userData: BaseUserInterface) {
        try {
            const ret = await this.knexInstance.insert(userData).into(this.tableName).returning('id');
            const { id } = ret[0];
            return id;
        } catch (err: unknown) {
            this.logger.error(err, 'Failed to insert user')
            if (!(err instanceof DatabaseError)) throw err
            if (err.constraint == 'users_username_unique') throw new UnporcessableEntity('`username` is already used!');
            else if (err.constraint == 'users_email_unique') throw new UnporcessableEntity('`email` is already used!');
            else throw err
        }
    }

    async updateUser(id: string, userDate: Partial<BaseUserInterface>) {
        try {
            const rowsAffected = await this.knexInstance.update(userDate).from(this.tableName).where('id', '=', id);
            if(rowsAffected == 0) 
                throw new NotFound('User not found!');
        } catch(err: unknown) {
            this.logger.error(err, `Failed to update user by id: ${id}`)
            throw err;
        }
    }

    async deleteUser(id: string) {
        try {
            await this.knexInstance.delete().from(this.tableName).where('id', '=', id);
        } catch (err: unknown) {
            this.logger.error(err, `Failed to delete user by id: ${id}`)
            if (!(err instanceof DatabaseError)) throw err
            if (err.constraint == 'users_username_unique') throw new UnporcessableEntity('`username` is already used!');
            else if (err.constraint == 'users_email_unique') throw new UnporcessableEntity('`email` is already used!');
        }
    }
}