import { NotFound } from "../../common/Errors";
import { RepositoryInterface } from "../../common/RepositoryInterface";
import { BaseUserInterface, GetInterface, ListInterface } from "./userInterface";
import { userFields } from "./userValidation";


export class UserRepository extends RepositoryInterface {
    tableName = "users";
    constructor () {
        super();
    }

    getUsers(options: ListInterface) {
        const query =  this.knexInstance.select(options.select || userFields).from(this.tableName)
        
        if (options.sort_by) query.orderBy(options.sort_by, options.order_by);
        if (options.limit) query.limit(options.limit)
        if (options.offset) query.offset(options.offset)

        return query;
    }
    
    async getUserById (id: string, options: GetInterface) {
        try {
            const user = await this.knexInstance.select(options.select || userFields).from(this.tableName).where('id', '=', id);
            if (!user.length) {
                throw new NotFound(`User with id: ${id} is not found!`);
            }
            return user[0];
        } catch (err: any) {
            throw err;
        }
    }

    async insertUser(userDate: BaseUserInterface) {
        try {
            const ret = await this.knexInstance.insert(userDate).into(this.tableName).returning('id');
            const { id } = ret[0];
            return id;
        } catch (err: any) {
            console.log(err)
        }
    }

    async updateUser(id: string, userDate: Partial<BaseUserInterface>) {
        try {
            const rowsAffected = await this.knexInstance.update(userDate).from(this.tableName).where('id', '=', id);
            if(rowsAffected == 0) 
                throw new NotFound('User not found!');
        } catch(err: any) {
            throw err;
        }
    }

    async deleteUser(id: string) {
        try {
            await this.knexInstance.delete().from(this.tableName).where('id', '=', id);
        } catch (err: any) {
            console.log(err)
        }
    }
}