const mongoose = require('mongoose')
const URL = process.env.MONGO_URI
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // 5 seconds timeout for initial connection
    socketTimeoutMS: 45000, // 45 seconds timeout for operations
  };
console.log('MONGO_URI:',URL)
mongoose.connect(URL, options)
mongoose.Promise = global.Promise

const db = mongoose.connection
db.on('error', console.error.bind(console, 'DB ERROR: '))

module.exports = {db, mongoose}