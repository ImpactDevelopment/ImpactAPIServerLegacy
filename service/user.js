import mongoose from 'mongoose'
import { hash, verifyHash, PasswordError } from 'scrypt-for-humans'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '~/config'

const UserSchema = new mongoose.Schema({
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
        return new Promise((resolve, reject) => jwt.sign({
            'email': this['email']
        },
        JWT_SECRET, (error, payload) => error ? reject(error) : resolve(payload)))
    }
})

export default mongoose.model('users', UserSchema)
