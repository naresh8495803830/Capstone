const db = require('../utils/conn')
const mongoose = require("../utils/conn").mongoose;

const triggerSchema = mongoose.Schema({
    triggerName : {
        type: String,
        required: true
    },
    npsFormId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'npsform'
    },
    triggerDate: [
        {
            date: {
                type: Date
            },
            status: {
                type: String,
                enum: ['triggered', 'scheduled', 'draft']
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Trigger = mongoose.model('trigger', triggerSchema)
module.exports = { Trigger }