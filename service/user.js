const mongoose = require('mongoose')
const { Schema } = mongoose
const { hash, verifyHash, PasswordError } = require('scrypt-for-humans')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = rfr('config')

const UserSchema = new Schema({
    'email': {
        'type': String,
        'required': true,
        'lowercase': true,
        'index': { 'unique': true }
    },
    'password': {
        'type': String,
        'required': true,
        'select': false
    }
})

// Hash the password if it's new or has changed
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            this['password'] = await hash(this['password'])
        } catch (e) {
            return next(e)
        }
    }
    return next()
})

// Model methods
Object.assign(UserSchema.methods, {
    'comparePassword': async function (candidatePassword) {
        try {
            return await verifyHash(candidatePassword, this['password'])
        } catch (e) {
            if (!(e instanceof PasswordError)) throw e
        }
        return false
    },
    'genToken': function () {
        return jwt.sign({
            'email': this['email']
        }, JWT_SECRET)
    }
})

module.exports = mongoose.model('users', UserSchema)
