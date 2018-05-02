const supertest   = require('supertest')
const app         = rfr('')
const server      = supertest(app)
module.exports  = server
