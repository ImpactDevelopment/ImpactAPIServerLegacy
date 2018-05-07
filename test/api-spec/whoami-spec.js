import { expect } from 'chai'
import { initDb, drop } from 'mongo-unit'
import { MONGODB_URI as URL } from 'config'
import apiserver from 'test/server'
import User from 'service/user'
import data from '../testData.json'

describe('ROUTE: /api/whoami', function (){
    // Ensure a predicable database for each test
    beforeEach(() => initDb(URL, data))
    afterEach(() => drop())

    it('should return correct email', async () => {
        const user = await User.findOne()
        const token = await user.genToken()

        const res = await apiserver
        .get('/api/whoami')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-type', /json/)
        .expect(200)

        expect(res.body.error).to.undefined
        expect(res.body.email).to.equal(user.email)
    })
})
