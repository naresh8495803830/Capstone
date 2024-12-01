// No tag for 10 rating:
const db = require('../utils/conn')
const mongoose = require("../utils/conn").mongoose;


const questionSchema = mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    questionType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'questiontype',
        // required: true,
        default: '659430892bd6bf68e93f31a8'

    },
    detractorTags: {
        type: [String]
    },
    promoterTags: {
        type: [String]
    },
    neutralTags: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


const Question = mongoose.model('question', questionSchema)
module.exports = { Question }