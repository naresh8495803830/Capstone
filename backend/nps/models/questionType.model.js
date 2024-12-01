const db = require('../utils/conn')
const mongoose = require("../utils/conn").mongoose;


const questionTypeSchema = mongoose.Schema({
    questionTypeName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 200
    },
    isScale: {
        type: Boolean,
        required: true  
    },
    isComment: {
        type: Boolean,
        required: true
    },
    npsOrCsat:{
        type: String,
        required: true,
        enum: ['nps', 'csat','na']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


const Questiontype = mongoose.model('questiontype', questionTypeSchema)
module.exports = { Questiontype }

/*
questionTypeName
isScale
isComment
isNPS -- (if yes) then {rating of 10}
isCSAT -- (if yes) then {rating of 5}
*/