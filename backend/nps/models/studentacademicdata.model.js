const db = require('../utils/conn')
const mongoose = require("../utils/conn").mongoose;


const studentAcademicSchema = mongoose.Schema({
    studentid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'students'
    },
    attendancePercentage:{
        type: String        
    },
    assignmentSubmission:{
        type: String
    },
    enrollmentDate:{
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


const Studentacademic = mongoose.model('studentacademic', studentAcademicSchema)
module.exports = { Studentacademic }