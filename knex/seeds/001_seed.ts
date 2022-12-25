import { Knex } from "knex";
import { PasswordHash } from "../../src/common/services/auth/utils";
import { books } from './dataset/bookReview'
import { reviews } from './dataset/reviewData'
import { users } from './dataset/userData'

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('reviews').del();
    await knex('users').del();
    await knex('books').del();



    
    const userHashed = await Promise.all(users.map(async (user) => {
        user.password = await PasswordHash.hash(user.password);
        return user;
    }))
    
    // Inserts seed entries
    await knex('books').insert(books);
    await knex('users').insert(userHashed);
    await knex('reviews').insert(reviews);

};
