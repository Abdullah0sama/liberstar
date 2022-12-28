import { beforeEach, describe, it } from 'mocha'
import { expect } from 'chai'
import knex from 'knex'
import supertest from 'supertest'
import { createApp } from '../src/app'
import { adminDataSet, booksDataSet, reviewsDataSet, usersDataSet } from './dataset'
import { hashedUser } from './utils'
import { verifiyToken } from '../src/common/services/auth/auth'
import { AuthController } from '../src/components/auth/auth.controller'
import { UserController } from '../src/components/users/userControllers'
import { BookController } from '../src/components/books/bookController'
import { ReviewController } from '../src/components/reviews/reviewController'
import { AuthService } from '../src/components/auth/auth.service'

const { app, logger } = createApp({
    controllers: [
        AuthController,
        UserController,
        BookController,
        ReviewController
    ],
    loggerOptions: {
        enabled: false
    }
})
const authService = new AuthService(logger)

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
    await knexInstance.delete('*').from('users');
    await knexInstance.delete('*').from('books');
}


async function getToken(user: any) {
    const token = await authService.passwordAuthentication({
        username: user.username,
        password: user.password
    })
    // const res = await supertest(app)
    //         .post('/auth')
    //         .send ({
    //             username: user.username,
    //             password: user.password
    //         })
    //         .expect(200)
    return { accessToken: token }
}

describe('POST /auth', () => {
    let hashedUsers: any[];
    before(async() => {
        hashedUsers = await hashedUser(usersDataSet)
    })
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(hashedUsers).into('users')
    })
    it('Should get access token when credentials are correct', async () => {
        const user = usersDataSet[0]
        const res = await supertest(app)
            .post('/auth')
            .send({
                username: user.username,
                password: user.password
            })
            .expect(200)

        const payload = verifiyToken(res.body.accessToken)
        expect(user).to.include(payload)
    })
})


describe('User role authorization', () => {
    let hashedUsers: any[];
    before(async() => {
        hashedUsers = await hashedUser(usersDataSet)
    })
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(hashedUsers).into('users')
        await knexInstance.insert(booksDataSet).into('books')
        await knexInstance.insert(reviewsDataSet).into('reviews')

    });

    it('User allowed to update their information', async () => {
        let user = usersDataSet[0];
        const changedValues = {
            name: 'somethingNew'
        }
        const { accessToken: token } = await getToken(user)
        const res2 = await supertest(app)
            .patch(`/users/${user.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(changedValues)
            .expect(204)

        const [ founduser ] = await knexInstance.from('users').where('id', '=', user.id);
        expect(founduser).include(changedValues);
    })

    it('Should fail when user updates another user\'s information', async () => {
        let user = usersDataSet[0];
        const changedValues = {
            name: 'somethingNew'
        }
        const { accessToken: token } = await getToken(user)

        const res2 = await supertest(app)
            .patch(`/users/${10000}`)
            .set('Authorization', `Bearer ${token}`)
            .send(changedValues)
            .expect(403)
    })

    it('User allowed to delete their profile', async () => {
        let user = usersDataSet[0]
        const { accessToken: token } = await getToken(user)

        const res = await supertest(app)
            .delete(`/users/${user.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const userFound = await knexInstance.select('*').from('users').where('id', '=', user.id);
        expect(userFound.length).to.equal(0)
    })

    it('Should fail when user deletes another user\'s information', async () => {
        let user = usersDataSet[0]
        let anotherUser = usersDataSet[1]

        const { accessToken: token } = await getToken(user)

        const res = await supertest(app)
        .delete(`/users/${anotherUser.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)

        const userFound = await knexInstance.select('*').from('users').where('id', '=', anotherUser.id);
        expect(userFound.length).to.equal(1)
    })

    it('User allowed to update their review', async () => {

        const user = usersDataSet[0]
        const review = reviewsDataSet[0];
        const changedValues = {
            title: 'A very new title'
        }
        const { accessToken: token } = await getToken(user)

        const res = await supertest(app)
            .patch(`/reviews/${review.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(changedValues)
            .expect(204)
        
        const [ foundReview ] = await knexInstance.from('reviews').where('id', '=', review.id);
        expect(foundReview).include(changedValues);
    })

    it('User not allowed to update review created by other users', async () => {

        const user = usersDataSet[0]
        const anotherUser = usersDataSet[1]
        const review = reviewsDataSet[1];
        const changedValues = {
            title: 'A very new title'
        }
        const { accessToken: token } = await getToken(user)

        const res = await supertest(app)
            .patch(`/reviews/${review.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(changedValues)
            .expect(403)
        
        const [ foundReview ] = await knexInstance.from('reviews').where('id', '=', review.id);
        expect(foundReview).include(review);
    })
})



describe('Admin role authorization', () => {
    let hashedUsers: any[];
    before(async () =>  {
        hashedUsers = await hashedUser(adminDataSet)
    })
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(booksDataSet).into('books')
        await knexInstance.insert(hashedUsers).into('users')
    });

    it('Admin not allowed to update users', async () => {
        let user = adminDataSet[1];
        let admin = adminDataSet[0]
        const changedValues = {
            name: 'somethingNew'
        }
        const { accessToken: token } = await getToken(admin)


        const res2 = await supertest(app)
            .patch(`/users/${user.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(changedValues)
            .expect(403)
    })

    it('Admin not allowed to delete users', async () => {
        let user = adminDataSet[0]
        let admin = adminDataSet[1]

        const { accessToken: token } = await getToken(admin)


        const res = await supertest(app)
        .delete(`/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)

        const userFound = await knexInstance.select('*').from('users').where('id', '=', user.id);
        expect(userFound.length).to.equal(1)
    })

    it('Admin allowed to post books', async () => {
        const book = {
            title: 'Hunger Games',
            description: 'Something about unfair distribution of wealth and justice',
            release_date: '2005-05-05',
            author: 'someAuthor'
        }
        
        let admin = adminDataSet[0]
        const { accessToken: token } = await getToken(admin)


        const res = await supertest(app)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send(book)
            .expect(201)

        const { data: { id } } = res.body;
        const [insertedBook] = await knexInstance.from('books').where('id', '=', id);
        expect(insertedBook).include(book);
    })

    it('Admin allowed to delete books', async () => {
        let admin = adminDataSet[0]
        const { accessToken: token } = await getToken(admin)

        const id = 1;

        const res = await supertest(app)
            .delete(`/books/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
        const book = await knexInstance.select('*').from('books').where('id', '=', id);
        expect(book.length).to.equal(0)
    })
})