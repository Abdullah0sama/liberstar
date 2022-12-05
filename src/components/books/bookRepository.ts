import knex from "knex";
import { RepositoryInterface } from "../../common/RepositoryInterface";

export class BookRepository extends RepositoryInterface {
    tableName: string;
    constructor() {
        super();
        this.tableName = "books";
    }

    async getBooks () {
        const query = this.knexInstance.select('*').from(this.tableName);

        const result = await query;
        return result;
    }
}