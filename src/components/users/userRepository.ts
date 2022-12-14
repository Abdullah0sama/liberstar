import { NotFound } from "../../common/Errors";
import { RepositoryInterface } from "../../common/RepositoryInterface";
import { BaseUserInterface } from "./userInterface";


export class UserRepository extends RepositoryInterface {
    tableName = "users";
    constructor () {
        super();
    }

    getUsers() {
        return this.knexInstance.select('*').from(this.tableName);
    }
    
    async getUserById (id: string) {
        try {
            const user = await this.knexInstance.select('*').from(this.tableName).where('id', '=', id);
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