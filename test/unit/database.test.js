const expect = require('chai').expect
const mongo = require('mongo-unit')
const database = rfr('service/database')
const URL = rfr('config').MONGODB_URI

describe('UNIT: database', () => {
    // Ensure a predicable database for each test
    const data = require('../testData.json')
    beforeEach(() => mongo.initDb(URL, data))
    afterEach(() => mongo.drop())

    it('should find all users', () => database.getUsers()
    .then((users) => {
        expect(users.length).to.equal(1)
        expect(users[0].email).to.equal(data.users[0].email)
    }))

    it('should find correct user', () => database.getUser({ 'email': data.users[0].email })
    .then((user) => {
        expect(user).to.not.be.null
        expect(user.email).to.equal(data.users[0].email)
    }))

    it('shouldn\'t find non-existent user', () => database.getUser({ 'email': 'stupid@random.email' })
    .then((user) => {
        expect(user).to.be.null
    }))

    it('should create new user', () => database.addUser({
        'email': 'foo@bar.com',
        'password': 'passwd'
    })
    .then((user) => {
        expect(user.email).to.equal('foo@bar.com')
        expect(user.password).to.equal('passwd')
    })
    .then(() => database.getUsers())
    .then((users) => {
        expect(users.length).to.equal(2)
        expect(users[0].email).to.equal(data.users[0].email)
        expect(users[1].email).to.equal('foo@bar.com')
    }))

    it('should remove user', () => database.getUsers()
    .then((users) => users[0]._id)
    .then((id) => database.deleteUser(id))
    .then(() => database.getUsers())
    .then((users) => {
        expect(users.length).to.equal(0)
    }))
})
