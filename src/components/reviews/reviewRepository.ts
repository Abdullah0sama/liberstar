import { Knex } from "knex";
import { NotFound } from "../../common/Errors";
import { RepositoryInterface } from "../../common/RepositoryInterface"
import { ReviewInterface, ReviewUpdateInterface } from "./reviewInterface";
import { DatabaseError } from "pg";

export class ReviewRepositroy extends RepositoryInterface {
    protected tableName: string = 'reviews'; 
    constructor () {
        super();
    }

    async getReviews() {
        return this.knexInstance.select('*').from(this.tableName)
    }

    async getReviewById(id: string) {
        try {
            const review = await this.knexInstance.select('*').from(this.tableName).where('id', '=', id);
            if (!review.length) {
                throw new NotFound(`Review with id: ${id} is not found!`);
            }
            return review[0];
        } catch(err: any) {
            throw err;
        }
    }

    async insertReview(reviewData: ReviewInterface) {
        try {
            const data = await this.knexInstance.insert(reviewData).into(this.tableName).returning('id');
            const { id } = data[0];
            return id;
        } catch (err: any) {
            if (err.detail.includes('book_ref')) throw new NotFound(`Book with id: ${reviewData.book_ref} is not found`)
            else if (err.detail.includes('user_ref')) throw new NotFound(`User with id: ${reviewData.user_ref} is not found`)
            throw err;
        }
    }

    async updateReview(id: string, reviewDate: ReviewUpdateInterface) {
        try {
            const rowsAffected = await this.knexInstance.update(reviewDate).from(this.tableName).where('id', '=', id);
            if(rowsAffected == 0) 
                throw new NotFound('Review not found!');
        } catch(err: any) {
            throw err;
        }
    }

    async deleteReview(id: string) {
        try {
            await this.knexInstance.delete().from(this.tableName).where('id', '=', id);
        } catch(err: any) {
            console.log(err);
        }
    }
}