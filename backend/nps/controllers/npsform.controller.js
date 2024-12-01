const Npsform = require("../models/npsform.model").Npsform;
const NpsResponse = require("../models/npsresponses.model").NpsResponse;
const Batch = require("../models/batch.model").Batch;
const Student = require("../models/student.model").Student;
const Question = require("../models/questions.model").Question;
const QuestionType = require("../models/questionType.model").Questiontype;
const Studentacademic =
  require("../models/studentacademicdata.model").Studentacademic;
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ region: process.env.AWS_REGION });

const sendEmail = async (lastDate, name, to, link) => {
  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Text: {
          Data: `
          Dear ${name},
              It's been a while since you started your program journey with us, and we want to ensure we are meeting your expectations. The Net Promoter Score (NPS) survey is a quick and easy way for you to share your thoughts. Your feedback is crucial in helping us enhance our programs.
              Please fill out the survey by ${lastDate} using the link below:   
              ${link}
              Thank you for your time and valuable feedback!

          Best regards,
          HeroVired Support
          `,
        },
      },
      Subject: {
        Data: "Help Us Improve Your Learning Experience",
      },
    },
    Source: process.env.SENDING_EMAIL_THROUGH,
  };

  try {
    await ses.sendEmail(params).promise();
    console.log(`Link Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Error sending Link email:", error);
    throw error;
  }
};

const createQuestion = async (questionData) => {
  try {
    const question = await Question.create(questionData);
    return question._id;
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
};

function generateRandomString(length) {
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const addNpsForm = async (req, res) => {
  try {
    const formData = req.body;
    console.log("[+] Creating form with data: ", formData);

    // Create questions
    const questionIds = [];
    for (const questionData of formData.questions) {
      const questionId = await createQuestion(questionData);
      console.log("[+] Added question. QuestionId: ", questionId);
      questionIds.push(questionId);
    }
    // Update form data with question IDs
    formData.questions = questionIds;

    // Validate batches exist
    const npsType = formData?.npsData?.npsType;
    const batchIds = formData.npsData.map((data) => data.batchId).flat();
    const batchExistsPromises = batchIds.map((batchId) =>
      Batch.exists({ _id: batchId })
    );

    for (let batch of batchIds) {
      newNps = npsType == "start" ? "mid" : "end";
      await Batch.findOneAndUpdate(
        {
          _id: batch,
        },
        { $set: { npsType: newNps } }
      );
    }
    const batchExistsResults = await Promise.all(batchExistsPromises);
    if (batchExistsResults.some((exists) => !exists)) {
      return res.status(400).json({ error: "One or more batches not found" });
    }

    // Create form
    const newForm = await Npsform.create(formData);

    if (formData.formStatus === "publish") {
      // Fetch students and questions for all batches
      const studentsInBatch = await Student.find({
        batchid: { $in: batchIds },
      });
      const questions = await Question.find({ _id: { $in: questionIds } });

      // Iterate over each npsData item to handle multiple batches
      const npsResponsePromises = formData.npsData.flatMap((npsData) => {
        // Filter students for the current batch
        const studentsForCurrentBatch = studentsInBatch.filter((student) =>
          npsData.batchId.includes(student.batchid.toString())
        );

        return studentsForCurrentBatch.map(async (student) => {
          // Academic check
          const academicInfo = await Studentacademic.findOne({
            studentid: student._id,
          });
          if (
            academicInfo &&
            parseFloat(academicInfo.attendancePercentage) >=
              req.body.attendancePercentage &&
            academicInfo.assignmentSubmission >= req.body.attendancePercentage
          ) {
            const responses = questions.map((question) => ({
              questionId: question._id,
              questionType: question.questionType,
              responseVal: null,
              responseComment: "",
              responseTagType: "NA",
              responseTag: [],
            }));

            let responseCode = student._id+newForm.npsFormCode;
            const surveyLink = `${process.env.SURVEY_LINK}/${responseCode}`;

            console.log("Survey Link: ", surveyLink);
            await sendEmail(formData.npsEndDate, student.name, student.email, surveyLink);

            // Create response for each student, including batchId
            return NpsResponse.create({
              studentId: student._id,
              batchId: student.batchid, // Assign the student's batchId
              npsFormId: newForm._id,
              npsFormCode: newForm.npsFormCode,
              npsType: npsData.npsType,
              completionStatus: "pending",
              responses,
              responseCode,
              filledAt: null,
              enrolledAt: student.createdAt,
            });
          } else {
            return null;
          }
        });
      });
      await Promise.all(npsResponsePromises.flat());
    }

    res.status(201).json({ msg: "Successfully added NPS Form" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getNpsForm = async (req, res) => {
  try {
    const forms = await Npsform.find().populate({
      path: "npsData.batchId", // Path within the document to populate,
      select: "batchName _id",
      model: "batch", // Optional if the ref is already correctly specified
    });
    res.status(200).json(forms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getNpsFormById = async (req, res) => {
  try {
    const formId = req.params.id;
    const form = await Npsform.findById(formId);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    const questions = await Question.find({
      _id: { $in: form.questions },
    }).populate("questionType");

    const formWithPopulatedQuestions = {
      ...form.toObject(),
      questions,
    };

    res.status(200).json(formWithPopulatedQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateNpsForm = async (req, res) => {
  const session = await Npsform.startSession();
  session.startTransaction();
  try {
    const formId = req.params.id;
    const checkUpdate = await Npsform.findById(formId);
    if (checkUpdate.formStatus === "draft") {
      const updatedForm = await Npsform.findByIdAndUpdate(formId, req.body, {
        new: true,
      });
      if (!updatedForm) {
        return res.status(404).json({ error: "Form not found" });
      }
      if (req.body.formStatus === "publish") {
        // Create questions
        const questionIds = [];
        for (const questionData of updatedForm.questions) {
          const questionId = await createQuestion(questionData);
          questionIds.push(questionId);
        }

        // Update form data with question IDs
        updatedForm.questions = questionIds;

        const studentsInBatch = await Student.find({
          batchid: { $in: updatedForm.npsData.batchId },
        });
        const questions = await Question.find();

        const npsResponsePromises = studentsInBatch.map((student) => {
          const responses = questions.map((question) => ({
            questionId: question._id,
            questionType: question.questionType,
            responseVal: null,
            responseComment: "",
            responseTagType: "NA",
            responseTag: [],
          }));

          return NpsResponse.create({
            studentId: student._id,
            npsFormId: updatedForm._id,
            npsFormCode: updatedForm.npsFormCode,
            npsType: updatedForm.npsData.npsType,
            completionStatus: "pending",
            responses,
            filledAt: null,
            enrolledAt: student.createdAt,
          });
        });

        await Promise.all(npsResponsePromises);
      }
      await session.commitTransaction();
      session.endSession();
      res.status(200).json({ msg: "Form Updated Successfully" });
    } else {
      res.json({ msg: "Form is published. It cannot be updated." });
    }
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteNpsForm = async (req, res) => {
  try {
    const formId = req.params.id;
    const deletedForm = await Npsform.findByIdAndDelete(formId);
    if (!deletedForm) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addNpsForm,
  getNpsForm,
  getNpsFormById,
  updateNpsForm,
  deleteNpsForm,
};

// const getCompleteNpsFormById = async (req,res)=>{
//     try{
//         const formId = req.params.id;
//         const form = await Npsform.findById(formId);
//         if (!form) {
//             return res.status(404).json({ error: 'Form not found' });
//         }
//         res.status(200).json(form);
//     }catch(error){
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }
