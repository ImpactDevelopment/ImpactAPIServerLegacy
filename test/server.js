import supertest from 'supertest'
import app from '../'
const server = supertest(app)

export default server
