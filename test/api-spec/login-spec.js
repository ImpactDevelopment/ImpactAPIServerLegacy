import { expect } from 'chai'
import mongo from 'mongo-unit'
import { MONGODB_URI as URL } from 'config'
import apiserver from 'test/server'
import User from 'service/user'
import data from '../testData.json'

describe('ROUTE: /api/login', () => {
    // Ensure a predicable database for each test
    beforeEach(async () => {
        mongo.initDb(URL, data)
        await new User({
            'email': 'foo@bar.com',
            'password': 'correct'
        }).save()
    })
    afterEach(() => mongo.drop())

    it('should be a bad request without email', async () => {
        const res = await apiserver
        .post('/api/login')
        .send({ 'password': 'passwd' })
        .expect(400)

        .expect('Content-type', /json/)
        expect(res.body.code).to.equal('BadRequest')
        expect(res.body.message).to.equal('Incomplete login information.')
    })
    it('should be a bad request without password', async () => {
        const res = await apiserver
        .post('/api/login')
        .send({ 'email': 'foo@bar.com' })
        .expect('Content-type', /json/)
        .expect(400)

        expect(res.body.code).to.equal('BadRequest')
        expect(res.body.message).to.equal('Incomplete login information.')
    })
    it('should be invalid credentials with incorrect password', async () => {
        const res = await apiserver
        .post('/api/login')
        .send({
            'email': 'foo@bar.com',
            'password': 'incorrect'
        })
        .expect('Content-type', /json/)
        .expect(401)

        expect(res.body.code).to.equal('InvalidCredentials')
        expect(res.body.message).to.equal('Password incorrect.')
    })
    it('should return token', async () => {
        const res = await apiserver
        .post('/api/login')
        .send({
            'email': 'foo@bar.com',
            'password': 'correct'
        })
        .expect('Content-type', /json/)
        .expect(200)

        expect(res.body.error).to.be.undefined
        expect(res.body.token).to.not.be.undefined
        expect(res.body.token).to.be.a('string').that.is.not.empty
    })
})
