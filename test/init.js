// Initialise mocha testing
global.rfr = require('rfr')
const prepare = require('mocha-prepare')
const mongo = require('mongo-unit')

// Start a mongo-unit database in RAM and point
// the URI variable to it
prepare((done) => mongo.start().then((url) => {
    process.env.MONGODB_URI = url
    done()
}))
