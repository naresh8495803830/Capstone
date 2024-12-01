const db = require('../utils/conn')
const mongoose = require("../utils/conn").mongoose;

const npsResponseSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },
    npsFormId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'npsform'
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'batch'
    },
    npsFormCode: {
        type: String
    },
    responseCode: {
        type: String
    },
    npsType: {
        type: String,
        enum: ['start', 'mid', 'end']
    },
    completionStatus: {
        type: String,
        enum: ['pending', 'completed']
    },
    responses: [
        {
            questionId: {
                type: String,
                required: true
            },
            questionType: {
                // type: mongoose.Schema.Types.ObjectId,
                // ref: 'questiontype',
                // required: true
                type: String,
                required: true
            },
            responseVal: {
                type: String
            },
            responseComment: {
                type: String
            },
            responseTagType: {
                type: String,
                enum: ['detractorTags', 'promoterTags', 'neutralTags','NA']
            },
            responseTag: {
                type: [String]
            }
        }
    ],
    filledAt: {
        type: Date
    },
    enrolledAt : {
        type: Date,
        default: Date.now()
    }
})

const NpsResponse = mongoose.model('npsresponse', npsResponseSchema)
module.exports = { NpsResponse }