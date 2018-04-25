const supertest   = require('supertest')
const app         = require('../')
const server      = supertest(app)
module.exports  = server
