const db = require('../utils/conn')
const mongoose = require("../utils/conn").mongoose;


const proogramSchema = mongoose.Schema({
    programName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 200
    },
    domainId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'domain',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


const Program = mongoose.model('program', proogramSchema)
module.exports = { Program }