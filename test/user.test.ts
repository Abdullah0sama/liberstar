import { before, beforeEach, describe, it } from 'mocha'
import { expect, assert } from 'chai'
import knex from 'knex'
import supertest from 'supertest'
import { createApp } from '../src/app'
import { usersDataSet } from './dataset'
import { getRootAccessToken } from './utils'

import { AuthController } from '../src/components/auth/auth.controller'
import { UserController } from '../src/components/users/userControllers'

const { app } = createApp({
    controllers: [
        AuthController,
        UserController,
    ],
    loggerOptions: {
        enabled: true
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
    await knexInstance.delete('*').from('users');
}

describe('GET /users/', () => {
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(usersDataSet).into('users')
    })

    it('Should get users with specified options', async () => {

        const res = await supertest(app)
            .get('/users?select=id&select=username&limit=2&sort_by=username&order_by=desc')
            .expect(200)
        let data = [...usersDataSet].sort((left, right) => (right.username < left.username)? -1 : 1 ).slice(0, 2)
        .map((user) => ({username: user.username, id: user.id}))
        expect(res.body.data).to.eql(data)
    })
});

describe('GET /users/:id', () => {
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(usersDataSet).into('users')
    })

    it('Should get user with id', async () => {

        const res = await supertest(app)    
            .get('/users/1')
            .expect(200)
        const { password, ...rest } = usersDataSet[0]
        expect(res.body.data).include(rest)
    })

    it('Should get user with specified fields', async () => {
        const res = await supertest(app)    
        .get('/users/1?select=username&select=id')
        .expect(200)

    expect(res.body.data).include((({username, id}) => ({username, id}))(usersDataSet[0]))
    });

    it('Should fail when user is not found', async () => {
        const id = 1000;
        const res = await supertest(app)
            .get(`/users/${id}`)
            .expect(404)
        expect(res.body.error).equal(`User with id: ${id} is not found!`)   
    });
});

describe('DELETE /users/:id', () => {
    let token: string;
    before(async() => {
        token = await getRootAccessToken();
    })
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(usersDataSet).into('users')
    })

    it('Delete existing user', async () => {
        const id = 1;
        const res = await supertest(app)
            .delete(`/users/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
        const user = await knexInstance.select('*').from('users').where('id', '=', id);
        expect(user.length).to.equal(0)
    })

    it('Delete non-existing user', async () => {
        const id = 1000;
        await supertest(app)    
            .delete(`/users/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
    })
})

describe('POST /users/', () => {
    let token: string;
    before(async() => {
        token = await getRootAccessToken();
    })
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(usersDataSet).into('users')
        await knexInstance.raw(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users)+1);`)
    });

    it('Should add new user', async () => {
        const user = {
            name: 'somethingsomehting',
            username: 'someuser',
            bio: 'nothing here',
            dob: '2005-05-05',
            email: 'something@something.com',
            password: '12345678910',
        }

        const res = await supertest(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(user)
            .expect(201)
        const { data: { id } } = res.body;
        const { password, ...rest } = user;
        const [inserteduser] = await knexInstance.from('users').where('id', '=', id);
        expect(inserteduser).include(rest);
    });

    it('Should fail when adding two users with same username', async () => {
        const {id, ...firstUser} = usersDataSet[0]

        const user = {
            name: 'somethingsomehting',
            username: firstUser.username,
            bio: 'nothing here',
            dob: '2005-05-05',
            email: 'something@something.com',
            password: '12345678910'
        }

        const res = await supertest(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(user)
            .expect(422)
        expect(res.body.error).equal('`username` is already used!');
    })


    it('Should fail when adding two users with same email', async () => {
        const {id, ...firstUser} = usersDataSet[0]

        const user = {
            name: 'somethingsomehting',
            username: 'someuser',
            bio: 'nothing here',
            dob: '2005-05-05',
            email: firstUser.email,
            password: '12345678910'
        }

        const res = await supertest(app)
            .post('/users')
            .send(user)
            .set('Authorization', `Bearer ${token}`)
            .expect(422)

        expect(res.body.error).equal('`email` is already used!');
    })
});

describe('PATCH /users/:id', () => {
    let token: string;
    before(async() => {
        token = await getRootAccessToken();
    })
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(usersDataSet).into('users')
    });

    it('Should update user', async () => {
        const user = usersDataSet[0];
        const changedValues = {
            name: 'not a name'
        }

        const res = await supertest(app)
            .patch(`/users/${user.id}`)
            .send(changedValues)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
        
        const [ founduser ] = await knexInstance.from('users').where('id', '=', user.id);
        expect(founduser).include(changedValues);
    });

    it('Should return error if user is not found', async () => {

        const res = await supertest(app)
            .patch('/users/10000')
            .send({name: 'fakeName'})
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
    });
});
