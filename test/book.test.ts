import { before, beforeEach, describe, it } from 'mocha'
import { expect, assert } from 'chai'
import knex from 'knex'
import supertest from 'supertest'
import { BaseBookInterface, BookInterface, BookInterfaceFull } from '../src/components/books/bookInterface'
import { app } from '../src/app'
import { booksDataSet } from './dataset'
import exp from 'constants'

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
    await knexInstance.delete('*').from('books');
}




describe('GET /books/', () => {
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(booksDataSet).into('books')
    })

    it('Should get books with specified options', async () => {

        const res = await supertest(app)
            .get('/books?select=id&select=title&limit=2&sort_by=id&order_by=desc')
            .expect(200)
        
        let data = [...booksDataSet].sort((left, right) => (right.id < left.id)? -1 : 1 ).slice(0, 2)
        .map((book) => ({title: book.title, id: book.id}))
        expect(res.body.data).to.eql(data)
    })
});

describe('GET /books/:id', () => {
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(booksDataSet).into('books')
    })

    it('Should get book with id', async () => {

        const res = await supertest(app)
            .get('/books/1')
            .expect(200)

        expect(res.body.data).include(booksDataSet[0])
    })

    it('Should get book with select fields', async () => {

        const res = await supertest(app)
            .get('/books/1?select=title&select=id')
            .expect(200)
        expect(res.body.data).to.have.all.keys('title', 'id')
        expect(res.body.data).include( (( {title, id}) => ({title, id } ))(booksDataSet[0]) )
    })

    it('Should fail when book is not found', async () => {
        const id = 1000;
        const res = await supertest(app)
            .get(`/books/${id}`)
            .expect(404)
        expect(res.body.error).equal(`User with id: ${id} is not found!`)   
    });
});

describe('DELETE /books/:id', () => {
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(booksDataSet).into('books')
    })

    it('Delete existing book', async () => {
        const id = 1;
        const res = await supertest(app)
            .delete(`/books/${id}`)
            .expect(204)
        const book = await knexInstance.select('*').from('books').where('id', '=', id);
        expect(book.length).to.equal(0)
    })

    it('Delete non-existing book', async () => {
        const id = 1000;
        await supertest(app)    
            .delete(`/books/${id}`)
            .expect(204)
    })
})

describe('POST /books/', () => {
    beforeEach(async () => {
        await emptyTable();
    });

    it('Should add new book', async () => {
        const book = {
            title: 'Hunger Games',
            description: 'Something about unfair distribution of wealth and justice',
            release_date: '2005-05-05',
            author: 'someAuthor'
        }

        const res = await supertest(app)
            .post('/books')
            .send(book)
            .expect(201)

        const { data: { id } } = res.body;
        console.log()
        const [insertedBook] = await knexInstance.from('books').where('id', '=', id);
        expect(insertedBook).include(book);
    });
});

describe('PATCH /books/:id', () => {
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(booksDataSet).into('books')
    });

    it('Should update book', async () => {
        const book = booksDataSet[0];
        const changedValues = {
            title: 'Not a real title'
        }

        const res = await supertest(app)
            .patch(`/books/${book.id}`)
            .send(changedValues)
            .expect(204)
        
        const [ foundBook ] = await knexInstance.from('books').where('id', '=', book.id);
        expect(foundBook).include(changedValues);
    });

    it('Should return error if book is not found', async () => {

        const res = await supertest(app)
            .patch('/books/10000')
            .send({title: 'fake title'})
            .expect(404)
    });
});
