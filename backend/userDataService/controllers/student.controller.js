const csv = require("csv-parser");
const fs = require("fs");
const { Student } = require("../models/student.model");
const { Studentacademic } = require("../models/studentacademicdata.model");
const AWS = require("aws-sdk");

const {
  Upload,
} = require("@aws-sdk/lib-storage");

const {
  S3,
} = require("@aws-sdk/client-s3");

// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
AWS.config.update({
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },

  region: process.env.AWS_REGION,
});
BUCKET = process.env.AWS_BUCKET

const uploadStudentData = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  try {
    const fileContent = fs.readFileSync(req.file.path);
    const params = {
      Bucket: BUCKET,
      Key: `csv-uploads/${req.file.originalname}`,
      Body: fileContent,
    };

    // S3 ManagedUpload with callbacks are not supported in AWS SDK for JavaScript (v3).
    // Please convert to 'await client.upload(params, options).promise()', and re-run aws-sdk-js-codemod.
    let data = await new Upload({
      client: s3,
      params,
    }).done()
    processCSV(data.Key, res)
  } catch (error) {
    return res.status(500).send(`Error uploading file: ${error.message}`);
  }
};

const processCSV = async (fileKey, res) => {
  const students = [];
  const academicData = [];

  try {
    const s3Response = await s3.getObject({
      Bucket: BUCKET,
      Key: fileKey,
    });
    const stream = s3Response.Body;

    stream
      .pipe(csv())
      .on("data", (row) => {
        const student = {
          name: row["Learner Name"],
          email: row["Email"],
          phoneNo: row["Phone Number"],
          whatsappNo: row["whatsapp no."],
          city: row["City"],
          state: row["State"],
          country: row["Country"],
          batchid: row["BatchId"],
          currentIndustry: row["Current Industry"],
          totalWorkExperience: row["Total Work Experience"],
          highestDegree: row["Highest Degree"],
          currentDegree: row["Current Degree"],
          currentCTC: row["Current/Last CTC(per annum)"],
          currentCompany: row["Current/Last Company Name"],
        };
        students.push(student);

        const academic = {
          attendancePercentage: row["Attendance"],
          assignmentSubmission: row["Assignment Submission"],
          enrollmentDate: new Date(row["Enrollment Date"]),
        };
        academicData.push(academic);
      })
      .on("end", async () => {
        try {
          for (let i = 0; i < students.length; i++) {
            const existingStudent = await Student.findOne({ email: students[i].email });
            if (existingStudent) {
              console.log(`Student with email ${students[i].email} already exists, skipping.`);
              continue; // Skip adding this student and move to the next one
            }
            const student = await Student.create(students[i]);
            academicData[i].studentid = student._id;
            await Studentacademic.create(academicData[i]);
          }
          res.status(201).send({msg: "Data uploaded and processed successfully"});
        } catch (error) {
          res.status(500).send(`Error processing data: ${error.message}`);
        }
      });
  } catch (error) {
    res.status(500).send(`Error reading from S3: ${error.message}`);
  }
};

const getStudentData = async(req,res) =>{
    try{
        const data  = await Student.find()
        res.json(data)
    }catch(error){
        res.status(500).send('Something went wrong')
    }
}

const getStudentDataByBatch = async(req,res) =>{
    try{
        console.log('Batch id: ', req.params.batchid)
        const batchId = req.params.batchid
        const data = await Student.find({batchid: batchId})
        if (!data || data.length === 0) {
            return res.status(404).send({msg: 'No data found for the specified batch ID'});
        }
        const result = data.map(doc => doc.toObject());
        res.json(result);
    }catch(error){
        console.error('Error fetching student data: ', error);
        res.status(500).send('Something went wrong')
    }
}

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user
    const user = await Student.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user and related academic data
    const deletedUser = await Student.findOneAndDelete({ _id: userId });

    // Delete academic data associated with the deleted user
    await Studentacademic.deleteMany({ studentid: userId });

    res.status(200).json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { uploadStudentData, getStudentData, getStudentDataByBatch, deleteUser };
