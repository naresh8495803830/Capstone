    // No tag for 10 rating:
    const db = require('../utils/conn')
    const mongoose = require("../utils/conn").mongoose;
    
    const npsFormSchema = mongoose.Schema({        
        npsFormName: {
            type: String
        },
        npsFormCode: {
            type: String
        },
        formStatus: {
            type: String,
            enum: ['draft', 'publish', 'discarded']
        },    
        npsStartDate: {
            type: Date
        },
        npsEndDate: {
            type: Date
        },
        npsType: {
            type: String,
            enum: ['start','mid','end','NA']
        },
        npsData: [{
            npsType: {
                type: String,
                enum: ['start', 'mid', 'end']
            },
            batchId: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'batch'
            }]
        }],
        questions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'question'
        }],
        createdAt: {
            type: Date,
            default: Date.now()
        }
    });
    
    const Npsform = mongoose.model('npsform', npsFormSchema);
    module.exports = { Npsform };