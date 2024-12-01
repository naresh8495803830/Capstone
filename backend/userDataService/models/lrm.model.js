const db = require('../utils/conn')
const mongoose = require("../utils/conn").mongoose;


const lrmSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 200
    },
    email:{
        type: String,
        required: true
    },
    phoneNo:{
        type: String,
        required: true
    },
    batchId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'batch',
        // required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


const Lrm = mongoose.model('lrm', lrmSchema)
module.exports = { Lrm }