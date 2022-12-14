import { NotFound } from "../../common/Errors";
import { RepositoryInterface } from "../../common/RepositoryInterface";
import { BaseBookInterface, BookInterface } from "./bookInterface";

export class BookRepository extends RepositoryInterface {
    tableName: string;
    constructor() {
        super();
        this.tableName = "books";
    }

    async getBooks () {
        return this.knexInstance.select('*').from(this.tableName);
    }

    async getBookById(id: string) {
        try {
            const book = await this.knexInstance.select('*').from(this.tableName).where('id', '=', id);
            if (!book.length) {
                throw new NotFound(`User with id: ${id} is not found!`);
            }
            return book[0];
        } catch (err: any) {
            throw err;
        }
    }

    async insertBook(bookData: BaseBookInterface) {
        try {
            const ret = await this.knexInstance.insert(bookData).into(this.tableName).returning('id');
            const { id } = ret[0];
            return id;
        } catch (err: any) {
            console.log(err)
        }
    }

    async updateBook(id: string, bookDate: Partial<BaseBookInterface>) {
        try {
            const rowsAffected = await this.knexInstance.update(bookDate).from(this.tableName).where('id', '=', id);
            if(rowsAffected == 0) 
                throw new NotFound('User not found!');
        } catch(err: any) {
            throw err;
        }
    }

    async deleteBookById(id: string) {
        try {
            await this.knexInstance.delete().from(this.tableName).where('id', '=', id);
        } catch (err: any) {
            console.log(err)
        }
    }
}