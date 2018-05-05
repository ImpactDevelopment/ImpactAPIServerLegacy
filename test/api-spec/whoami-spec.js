const expect = require('chai').expect
const mongo = require('mongo-unit')
const URL = rfr('config').MONGODB_URI
const apiserver = rfr('test/server')
const User = rfr('service/user')

describe('ROUTE: /api/whoami', function (){
    // Ensure a predicable database for each test
    const data = require('../testData.json')
    beforeEach(() => mongo.initDb(URL, data))
    afterEach(() => mongo.drop())

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
