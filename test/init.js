// Initialise mocha testing
import 'module-alias/register'
import prepare from 'mocha-prepare'
import mongo from 'mongo-unit'

process.env.TEST = 'true'

// Start a mongo-unit database in RAM and point
// the URI variable to it
prepare((done) => mongo.start().then((url) => {
    process.env.MONGODB_URI = url
    done()
}))
