const db = require('../utils/conn')
const mongoose = require("../utils/conn").mongoose;


const domainSchema = mongoose.Schema({
    domainName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 200
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


const Domain = mongoose.model('domain', domainSchema)
module.exports = { Domain }