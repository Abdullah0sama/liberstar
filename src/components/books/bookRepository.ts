import pino from 'pino';
import { NotFound } from '../../common/Errors';
import { RepositoryInterface } from '../../common/RepositoryInterface';
import { BaseBookInterface, GetInterface, ListInterface } from './bookInterface';
import { bookFields } from './bookValidation';

export class BookRepository extends RepositoryInterface {
    tableName = 'books'
    constructor(logger: pino.Logger) {
        super(logger);
    }

    async getBooks (options: ListInterface) {
        const query =  this.knexInstance.select(options.select || bookFields).from(this.tableName)
        
        if (options.sort_by) query.orderBy(options.sort_by, options.order_by);
        if (options.limit) query.limit(options.limit)
        if (options.offset) query.offset(options.offset)

        return query;
    }

    async getBookById(id: string, options: GetInterface) {
        try {
            const book = await this.knexInstance.select(options.select || bookFields).from(this.tableName).where('id', '=', id);
            if (!book.length) {
                throw new NotFound(`User with id: ${id} is not found!`);
            }
            return book[0];
        } catch (err: unknown) {
            this.logger.error(err, `Failed to get book id: ${id}`)
            throw err;
        }
    }

    async insertBook(bookData: BaseBookInterface) {
        try {
            const ret = await this.knexInstance.insert(bookData).into(this.tableName).returning('id');
            const { id } = ret[0];
            return id;
        } catch (err: unknown) {
            this.logger.error(err, 'Failed to insert book')
            throw err
        }
    }

    async updateBook(id: string, bookDate: Partial<BaseBookInterface>) {
        try {
            const rowsAffected = await this.knexInstance.update(bookDate).from(this.tableName).where('id', '=', id);
            if(rowsAffected == 0) 
                throw new NotFound('User not found!');
        } catch(err: unknown) {
            this.logger.error(err, `Failed to update book id: ${id}`)
            throw err;
        }
    }

    async deleteBookById(id: string) {
        try {
            await this.knexInstance.delete().from(this.tableName).where('id', '=', id);
        } catch (err: unknown) {
            this.logger.error(err, `Failed to delete book id: ${id}`)
            throw err;
        }
    }
}