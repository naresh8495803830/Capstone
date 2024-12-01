const db = require('../utils/conn')
const mongoose = require("../utils/conn").mongoose;


const studentSchema = mongoose.Schema({
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
    whatsappNo:{
        type: String,
    },
    city:{
        type: String,
    },
    state:{
        type: String,
    },
    country:{
        type: String,
    },
    batchid:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'batch'
    },
    currentIndustry:{
        type: String
    },
    totalWorkExperience:{
        type: String
    },
    highestDegree:{
        type: String,
        enum: ['Masters', 'Bachelors', 'Phd', 'Highschool', 'Diploma']
    },
    currentDegree:{
        type: String
    },
    currentCTC:{
        type: String
    },
    currentCompany:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


const Student = mongoose.model('student', studentSchema)
module.exports = { Student }