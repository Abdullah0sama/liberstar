import { beforeEach, describe, it } from 'mocha'
import { expect } from 'chai'
import knex from 'knex'
import supertest from 'supertest'
import { createApp } from '../src/app'
import { booksDataSet, reviewsDataSet, usersDataSet } from './dataset'
import { getRootAccessToken } from './utils'

import { AuthController } from '../src/components/auth/auth.controller'
import { ReviewController } from '../src/components/reviews/reviewController'

const { app } = createApp({
    controllers: [
        AuthController,
        ReviewController
    ],
    loggerOptions: {
        enabled: false
    }
})

const knexInstance = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_Host,
        password: process.env.DB_Password,
        user: process.env.DB_User,
        database: process.env.DB_DEBUG_Database,
        port: Number(process.env.DB_Port),
        timezone: '0'
    }
})

async function emptyTable () {
    await knexInstance.delete('*').from('reviews');
    await knexInstance.delete('*').from('books');
    await knexInstance.delete('*').from('users');
}


describe('GET /reviews/', () => {
    after(emptyTable)
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(booksDataSet).into('books');
        await knexInstance.insert(usersDataSet).into('users');
        await knexInstance.insert(reviewsDataSet).into('reviews')
    })
    it('Should get reviews with specified options', async () => {

        const res = await supertest(app)
            .get('/reviews?select=id&select=title&limit=2&sort_by=title&order_by=desc')
            .expect(200)
        let data = [...reviewsDataSet].sort((left, right) => (right.title < left.title)? -1 : 1 ).slice(0, 2)
        .map((review) => ({title: review.title, id: review.id}))
        expect(res.body.data).to.eql(data)
    })
})

describe('GET /reviews/:id', () => {
    after(emptyTable)
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(booksDataSet).into('books');
        await knexInstance.insert(usersDataSet).into('users');
        await knexInstance.insert(reviewsDataSet).into('reviews')
    })

    it('Should get review with specified fields', async () => {
        const res = await supertest(app)
        .get('/reviews/1?select=title&select=body')
        .expect(200)

        expect(res.body.data).include((({body, title}) => ({title, body}))(reviewsDataSet[0]))
    });

    it('Should get review with id', async () => {

        const res = await supertest(app)
            .get('/reviews/1')
            .expect(200)

        expect(res.body.data).include(reviewsDataSet[0])
    })

    it('Should fail when reviews is not found', async () => {
        const id = 1000;
        const res = await supertest(app)
            .get(`/reviews/${id}`)
            .expect(404)
        expect(res.body.error).equal(`Review with id: ${id} is not found!`)   
    });
});

describe('DELETE /reviews/:id', () => {
    let token: string;
    after(emptyTable);
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(booksDataSet).into('books');
        await knexInstance.insert(usersDataSet).into('users');
        await knexInstance.insert(reviewsDataSet).into('reviews')
        token = await getRootAccessToken();

    })

    it('Delete existing review', async () => {
        const id = 1;
        const res = await supertest(app)
            .delete(`/reviews/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
        const review = await knexInstance.select('*').from('reviews').where('id', '=', id);
        expect(review.length).to.equal(0)
    })

    it('Delete non-existing review', async () => {
        const id = 1000;
        await supertest(app)    
            .delete(`/reviews/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
    })
})

describe('POST /reviews/', () => {
    let token: string;
    after(emptyTable);
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(booksDataSet).into('books');
        await knexInstance.insert(usersDataSet).into('users');
        token = await getRootAccessToken();
    });

    it('Should add new book', async () => {
        const review = {
            title: 'Hunger Games Review',
            body: 'Something about unfair distribution of wealth and justice',
            book_ref: 1,
            user_ref: 2
        }

        const res = await supertest(app)
            .post('/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send(review)
            .expect(201)

        const { data: { id } } = res.body;
        const [insertedReview] = await knexInstance.from('reviews').where('id', '=', id);
        expect(insertedReview).include(review);
    });

    it('Should fail when adding reference to non existing book', async () => {
        const review = {
            title: 'Hunger Games Review',
            body: 'Something about unfair distribution of wealth and justice',
            book_ref: 10000,
            user_ref: 2
        }

        const res = await supertest(app)
            .post('/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send(review)
            .expect(404)
        expect(res.body.error).be.equal(`Book with id: ${review.book_ref} is not found`)
    });

});

describe('PATCH /reviews/:id', () => {
    let token: string;
    after(emptyTable);
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(booksDataSet).into('books');
        await knexInstance.insert(usersDataSet).into('users');
        await knexInstance.insert(reviewsDataSet).into('reviews')
        token = await getRootAccessToken();
    });

    it('Should update review', async () => {
        const review = reviewsDataSet[0];
        const changedValues = {
            title: 'A very new title'
        }

        const res = await supertest(app)
            .patch(`/reviews/${review.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(changedValues)
            .expect(204)
        
        const [ foundReview ] = await knexInstance.from('reviews').where('id', '=', review.id);
        expect(foundReview).include(changedValues);
    });

    it('Should return error if review is not found', async () => {

        const res = await supertest(app)
            .patch('/reviews/10000')
            .set('Authorization', `Bearer ${token}`)
            .send({title: 'fake title'})
            .expect(404)
    });

    it('Should not be able to update book reference or user reference', async () => {
        const review = reviewsDataSet[0];
        const res = await supertest(app)
            .patch(`/reviews/${review.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ book_ref: 2 })
            .expect(422);
        
        expect(res.body.error).equal('ValidationError: "book_ref" is not allowed');
    });
});
