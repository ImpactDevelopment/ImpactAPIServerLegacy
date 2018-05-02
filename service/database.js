const mongoose = require('mongoose')
const Schema = mongoose.Schema
const url = rfr('config').MONGODB_URI

mongoose.connect(url)

const UserSchema = new Schema({
    'email': String,
    'password': String
})

const User = mongoose.model('users', UserSchema)

module.exports = {
    'getUsers': (conditions) => User.find(conditions),
    'getUser': (conditions) => User.findOne(conditions),
    'addUser': (data) => new User(data).save(),
    'deleteUser': (id) => User.findByIdAndRemove(id)
}
