const expect = require('chai').expect
const mongo = require('mongo-unit')
const User = rfr('service/user')
const URL = rfr('config').MONGODB_URI

describe('UNIT: User', () => {
    // Ensure a predicable database for each test
    const data = require('../testData.json')
    beforeEach(() => mongo.initDb(URL, data))
    afterEach(() => mongo.drop())

    it('should find all users', async () => {
        const users = await User.find()
        expect(users.length).to.equal(1)
        expect(users[0].email).to.equal(data.users[0].email)
    })

    it('should find correct user', async () => {
        const user = await User.findOne({ 'email': data.users[0].email })
        expect(user).to.not.be.null
        expect(user.email).to.equal(data.users[0].email)
    })

    it('shouldn\'t find non-existent user', async () => {
        const user = await User.findOne({ 'email': 'stupid@random.email' })
        expect(user).to.be.null
    })

    it('should create new user', async () => {
        const user = await new User({
            'email': 'foo@bar.com',
            'password': 'passwd'
        }).save()

        expect(user.email).to.equal('foo@bar.com')
        expect(await user.comparePassword('passwd')).to.be.true

        const users = await User.find()
        expect(users.length).to.equal(2)
        expect(users[0].email).to.equal(data.users[0].email)
        expect(users[1].email).to.equal(user.email)
    })

    it('should remove user', async () => {
        await User.findOne({ 'email': data.users[0].email }).remove()
        const users = await User.find()
        expect(users.length).to.equal(0)
    })

    it('should store identical passwords differently', async () => {
        const user1 = await new User({
            'email': 'one@example.com',
            'password': 'identical'
        }).save()
        const user2 = await new User({
            'email': 'two@example.com',
            'password': 'identical'
        }).save()

        expect(user1.password).not.to.equal(user2.password)
    })

    it('should correctly verify passwords', async () => {
        const user = await new User({
            'email': 'fo@bar.com',
            'password': 'correct'
        }).save()

        expect(await user.comparePassword('correct')).to.be.true
        expect(await user.comparePassword('passwd')).to.be.false
    })
})
