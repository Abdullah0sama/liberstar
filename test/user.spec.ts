import { before, beforeEach, describe, it } from 'mocha'
import { expect, assert } from 'chai'
import knex from 'knex'
import supertest from 'supertest'
import { app } from '../src/app'
import { UserInterfaceFull } from '../src/components/users/userInterface';
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

const userDataSet: UserInterfaceFull[] = [
    {
        id: 1,
        name: 'User 1',
        username: 'username1',
        bio: 'Some description',
        dob: '2021-12-11',
    },
    {
        id:2,
        name: 'User 2',
        username: 'username2',
        bio: 'Some description',
        dob: '2012-12-12',
    }
]

describe('GET /users/:id', () => {
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(userDataSet).into('users')
    })

    it('Should get user with id', async () => {

        const res = await supertest(app)
            .get('/users/1')
            .expect(200)

        expect(res.body.data).include(userDataSet[0])
    })

    it('Should fail when user is not found', async () => {
        const id = 1000;
        const res = await supertest(app)
            .get(`/users/${id}`)
            .expect(404)
        expect(res.body.error).equal(`User with id: ${id} is not found!`)   
    });
});

describe('DELETE /users/:id', () => {
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(userDataSet).into('users')
    })

    it('Delete existing user', async () => {
        const id = 1;
        const res = await supertest(app)
            .delete(`/users/${id}`)
            .expect(204)
        const user = await knexInstance.select('*').from('users').where('id', '=', id);
        expect(user.length).to.equal(0)
    })

    it('Delete non-existing user', async () => {
        const id = 1000;
        await supertest(app)    
            .delete(`/users/${id}`)
            .expect(204)
    })
})

describe('POST /users/', () => {
    beforeEach(async () => {
        await emptyTable();
    });

    it('Should add new user', async () => {
        const user = {
            name: 'somethingsomehting',
            username: 'someuser',
            bio: 'nothing here',
            dob: '2005-05-05',
        }

        const res = await supertest(app)
            .post('/users')
            .send(user)
            .expect(201)

        const { data: { id } } = res.body;
        console.log()
        const [inserteduser] = await knexInstance.from('users').where('id', '=', id);
        expect(inserteduser).include(user);
    });
});

describe('PATCH /users/:id', () => {
    beforeEach(async () => {
        await emptyTable();
        await knexInstance.insert(userDataSet).into('users')
    });

    it('Should update user', async () => {
        const user = userDataSet[0];
        const changedValues = {
            name: 'not a name'
        }

        const res = await supertest(app)
            .patch(`/users/${user.id}`)
            .send(changedValues)
            .expect(204)
        
        const [ founduser ] = await knexInstance.from('users').where('id', '=', user.id);
        expect(founduser).include(changedValues);
    });

    it('Should return error if user is not found', async () => {

        const res = await supertest(app)
            .patch('/users/10000')
            .send({name: 'fakeName'})
            .expect(404)
    });
});
