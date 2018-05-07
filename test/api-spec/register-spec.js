import { expect } from 'chai'
import { initDb, drop } from 'mongo-unit'
import apiserver from 'test/server'
import { MONGODB_URI as URL } from 'config'
import data from '../testData.json'

describe('ROUTE: /api/register', () => {
    // Ensure a predicable database for each test
    beforeEach(() => initDb(URL, data))
    afterEach(() => drop())

    it('should be a bad request without email', (done) => {
        apiserver
        .post('/api/register')
        .send({ 'password': 'passwd' })
        .expect(400)
        .expect('Content-type', /json/)
        .then( (res) => {
            expect(res.body.code).to.equal('BadRequest')
            expect(res.body.message).to.equal('Incomplete registration information.')

            done()
        })
        .catch((err) => {
            console.log(err.message)
            done(new Error('Supertest encountered an error'))
        })
    })
    it('should be a bad request without password', (done) => {
        apiserver
        .post('/api/register')
        .send({ 'email': 'foo@bar.com' })
        .expect('Content-type', /json/)
        .expect(400)
        .then( (res) => {
            expect(res.body.code).to.equal('BadRequest')
            expect(res.body.message).to.equal('Incomplete registration information.')

            done()
        })
        .catch((err) => {
            console.log(err.message)
            done(new Error('Supertest encountered an error'))
        })
    })
    it('should not allow duplicate accounts', async () => {
        const res = await apiserver
        .post('/api/register')
        .send({
            'email': data.users[0].email,
            'password': 'passwd'
        })
        .expect('Content-type', /json/)
        .expect(401)

        expect(res.body.code).to.equal('InvalidCredentials')
        expect(res.body.message).to.equal('User with email "' + data.users[0].email + '" already exists.')
    })
    it('should return token', (done) => {
        apiserver
        .post('/api/register')
        .send({
            'email': 'foo@bar.com',
            'password': 'passwd'
        })
        .expect('Content-type', /json/)
        .expect(200)
        .then((res) => {
            expect(res.body.error).to.be.undefined
            expect(res.body.token).to.not.be.undefined
            expect(res.body.token).to.be.a('string').that.is.not.empty

            done()
        })
        .catch((err) => {
            console.log(err.message)
            done(new Error('Supertest encountered an error'))
        })
    })
})
