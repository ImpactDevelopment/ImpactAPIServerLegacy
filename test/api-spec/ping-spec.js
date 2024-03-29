import { expect } from 'chai'
import apiserver from '~/test/server'

describe('ROUTE: /api/ping', () => {
    it('should say OK', (done) => {
        apiserver
        .get('/api/ping')
        .expect('Content-type', /json/)
        .expect(200)
        .end( (err, res) => {
            if (err) {
                console.log(err.message)
                return done(new Error('Supertest encountered an error'))
            }

            expect(res.body.error).to.be.undefined
            expect(res.body.ping).to.equal('OK')

            done()
        })
    })
})
