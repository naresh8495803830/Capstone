const NpsResponse = require("../models/npsresponses.model").NpsResponse;
const Student = require("../models/student.model").Student;
const Batch = require("../models/batch.model").Batch;
const Program = require("../models/program.model").Program;
const Domain = require("../models/domain.model").Domain;
const User = require("../models/user.model").User;
const Npsform = require("../models/npsform.model").Npsform;
const Studentacademic =
  require("../models/studentacademicdata.model").Studentacademic;
const NpsReport = require("../models/npsReport.model").NpsReport;
const BatchLevelNpsReport = require("../models/batchLevelNpsReport.model").BatchLevelNpsReport;
const Question = require("../models/questions.model").Question;
const QuestionType = require("../models/questionType.model").Questiontype;
const mongoose = require("mongoose");
const AWS = require("aws-sdk");

const getAllNPSStat = async (req, res) => {
  try {
    const data = await NpsResponse.find();
    let promoter = 0;
    let detractor = 0;
    let neutral = 0;

    // Iterate over each response to calculate promoters and detractors
    data.forEach((npsResponse) => {
      npsResponse.responses.forEach((response) => {
        if (response.questionType === "nps") {
          if (response.responseVal > 8) {
            promoter++;
          } else if (response.responseVal < 7) {
            detractor++;
          } else if (response.responseVal == 7 || response.responseVal == 8) {
            neutral++;
          }
        }
      });
    });

    console.log("[+]  promoter", promoter);
    console.log("[+]  detractor", detractor);
    let promoterPercentage =
      (promoter * 100) / (promoter + neutral + detractor);
    let detractorPercentage =
      (detractor * 100) / (promoter + neutral + detractor);
    // Calculate NPS
    let nps = 0;
    nps = promoterPercentage - detractorPercentage;
    const completedResponses = data.filter(
      (response) => response.completionStatus === "completed"
    );
    const msg = {
      totalPromoter: promoter,
      totalDetractor: Math.abs(detractor),
      totalNeutral: neutral,
      totalNPSResponse: data.length,
      totalCompletedResponse: completedResponses.length,
      satisfactionRate: nps.toFixed(2),
    };
    res.status(200).json(msg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllNPSResponseStatus = async (req, res) => {
  try {
    const responses = await NpsResponse.find()
      .populate({
        path: "studentId",
        populate: {
          path: "batchid",
          select: "batchName programId",
          populate: {
            path: "programId",
            select: "programName",
            populate: {
              path: "domainId",
              model: "Domain",
              select: "domainName",
            },
          },
        },
      })
      .populate({
        path: "npsFormId",
        select: "npsFormCode",
      })
      .select("_id studentId completionStatus npsType");
    // console.log("responses: ", responses);

    const formattedResponses = await Promise.all(
      responses.map(async (response) => {
        const npsForm = await Npsform.findById(response.npsFormId);
        const npsEndDate = npsForm.npsEndDate.toISOString().substring(0, 10);
        // console.log("res:", response);
        console.log(response);
        return {
          name: response.studentId?.name,
          userId: response.studentId?._id,
          phoneNo: response.studentId?.phoneNo,
          programName: response.studentId?.batchid?.programId?.programName,
          batchName: response.studentId?.batchid?.batchName,
          domainName:
            response.studentId?.batchid?.programId?.domainId?.domainName,
          batchId: response.studentId?.batchid?._id,
          npsFormCode: response.npsFormId?.npsFormCode,
          responseId: response._id,
          completionStatus: response.completionStatus,
          npsFormId: response.npsFormId._id,
          npsType: response.npsType, // Adjusted to access npsType from npsData
          npsEndDate: npsEndDate,
          city: response.studentId?.city,
          state: response.studentId?.state,
          country: response.studentId?.country,
          currentCTC: response.studentId?.currentCTC,
          currentDegree: response.studentId?.currentDegree,
          highestDegree: response.studentId?.highestDegree,
          currentCompany: response.studentId?.currentCompany,
          currentIndustry: response.studentId?.currentIndustry,
          totalWorkExperience: response.studentId?.totalWorkExperience,
          whatsappNo: response.studentId?.whatsappNo,
        };
      })
    );

    // console.log('Formatted Response: ', formattedResponses);
    let userType = req.userType,
      user = req.user;
    let filteredResponses = formattedResponses;
    if (userType != "admin") {
      const userDetails = await User.findById(user.userId);
      let batchId = userDetails.batchId;
      filteredResponses = formattedResponses.filter((item) => {
        for (let batch of batchId) if (item.batchId.equals(batch)) return true;
        return false;
      });
    }
    res.json(filteredResponses);
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred while fetching NPS responses");
  }
};

// --> /stat/npsreport

// const getCurrentNpsReport = async (req, res) => {
//   try {
//     const activeNpsForms = await Npsform.find({
//       formStatus: "publish",
//       npsEndDate: { $gt: new Date() },
//     }).populate({
//       path: "npsData.batchId",
//       populate: {
//         path: "programId",
//         populate: {
//           path: "domainId",
//           model: "Domain",
//         },
//       },
//     });
//     if (activeNpsForms.length === 0) {
//       return res.status(200).json({ msg: "No active NPS forms found" });
//     }

//     let reports = [];
//     // Iterate over each active NPS form
//     let userType = req.userType,
//       user = req.user;
//     let userDetails = {};
//     if (userType != "admin") {
//       userDetails = await User.findById(user.userId);
//     }
//     for (const form of activeNpsForms) {
//       const batches = form.npsData.map((data) => data.batchId).flat();
//       console.log("forms:", form);
//       for (const batch of batches) {
//         if (userType != "admin" && !hasBatchId(userDetails.batchId, batch._id))
//           continue;
//         console.log("batches:", batch);
//         for (const npsType of ["start", "mid", "end"]) {
//           // Find all responses for the current batch and NPS type
//           const responsesForBatch = await NpsResponse.find({
//             npsFormId: form._id,
//             batchId: batch._id,
//             npsType,
//           });
//           console.log(responsesForBatch);
//           const completedResponses = responsesForBatch.filter(
//             (response) => response.completionStatus === "completed"
//           );
//           console.log(completedResponses);
//           const totalResponsesCreated = responsesForBatch.length;
//           const totalCompletedResponses = completedResponses.length;
//           console.log("response: ", completedResponses);

//           if (totalResponsesCreated > 0) {
//             const [npsScore, promoters, detractors] = calculateNpsScore(
//               completedResponses.map((r) => r.responses).flat()
//             );
//             // const csatScore = calculateCSATScore(completedResponses.map(r => r.responses).flat())
//             const responsePercentage = (
//               (totalCompletedResponses / totalResponsesCreated) *
//               100
//             ).toFixed(2);

//             reports.push({
//               npsFormName: form.npsFormName,
//               npsFormCode: form.npsFormCode,
//               npsEndDate: form.npsEndDate.toISOString().split("T")[0],
//               npsType,
//               programName: batch.programId.programName,
//               batchName: batch.batchName,
//               domainName: batch.programId.domainId.domainName,
//               totalCompletedResponses: totalCompletedResponses,
//               totalResponsesCreated: totalResponsesCreated,
//               responsePercentage: responsePercentage + "%",
//               npsScore: npsScore.toFixed(2) + "%",
//             });
//           }
//         }
//       }
//     }
//     console.log("Reports Number: ", reports.length);
//     let uniqueReports = removeDuplicates(reports);
//     console.log("Unique Reports Number: ", uniqueReports.length);
//     res.json(uniqueReports);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "Error occurred while generating NPS report", error });
//   }
// };

const getCurrentNpsReport = async (req, res) => {
  try {
    // Extract user information
    let userType = req.userType,
      user = req.user;
    let userDetails = {};

    if (userType != "admin") {
      userDetails = await User.findById(user.userId);
    }

    // Query the NpsReport collection
    const currentNpsReports = await NpsReport.find({
      // npsEndDate: { $gt: new Date() }, // Ensure the NPS form is still active
    });

    if (currentNpsReports.length === 0) {
      return res.status(200).json({ msg: "No active NPS reports found" });
    }

    let filteredReports = [];

    for (const report of currentNpsReports) {
      if (
        userType != "admin" &&
        !hasBatchId(userDetails.batchId, report.batchId)
      ) {
        continue;
      }

      // Filter the reports based on user type and any other criteria you need
      filteredReports.push({
        npsFormName: report.npsFormName,
        npsFormCode: report.npsFormCode,
        npsEndDate: report.npsEndDate,
        npsType: report.npsType,
        programName: report.programName,
        batchName: report.batchName,
        domainName: report.domainName,
        totalCompletedResponses: report.totalCompletedResponses,
        totalResponsesCreated: report.totalResponsesCreated,
        responsePercentage: report.responsePercentage,
        npsScore: report.npsScore,
        promoters: report.promoters,
        detractors: report.detractors,
      });
    }

    console.log("Filtered Reports Number: ", filteredReports.length);
    let uniqueFilteredReports = removeDuplicates(filteredReports);
    console.log("Unique Filtered Reports Number: ", uniqueFilteredReports.length);
    res.json(uniqueFilteredReports);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error occurred while generating current NPS report", error });
  }
};


const hasBatchId = (batches, batchToFind) => {
  for (let batch of batches) if (batchToFind.equals(batch)) return true;
  return false;
};
const getAllNpsReport = async (req, res) => {
  try {
    const activeNpsForms = await Npsform.find({
      formStatus: "publish",
    }).populate({
      path: "npsData.batchId",
      populate: { 
        path: "programId",
        populate: {
          path: "domainId",
          model: "Domain",
        },
       },
    });

    if (activeNpsForms.length === 0) {
      return res.status(200).json({ msg: "No NPS forms found" });
    }

    let reports = [];

    // Iterate over each active NPS form
    for (const form of activeNpsForms) {
      const batches = form.npsData.map((data) => data.batchId).flat();
      for (const batch of batches) {
        for (const npsType of ["start", "mid", "end"]) {
          // Find all responses for the current batch and NPS type
          const responsesForBatch = await NpsResponse.find({
            npsFormId: form._id,
            batchId: batch._id,
            npsType,
          });

          const completedResponses = responsesForBatch.filter(
            (response) => response.completionStatus === "completed"
          );

          const totalResponsesCreated = responsesForBatch.length;
          const totalCompletedResponses = completedResponses.length;
          console.log("response: ", completedResponses);

          if (totalResponsesCreated > 0) {
            const [ npsScore, promoters, detractors] = calculateNpsScore(
              completedResponses.map((r) => r.responses).flat()
            );
            // const csatScore = calculateCSATScore(completedResponses.map(r => r.responses).flat())
            const responsePercentage = (
              (totalCompletedResponses / totalResponsesCreated) *
              100
            ).toFixed(2);

            reports.push({
              npsFormName: form.npsFormName,
              npsFormCode: form.npsFormCode,
              npsEndDate: form.npsEndDate.toISOString().split("T")[0],
              npsType,
              programName: batch.programId.programName,
              batchName: batch.batchName,
              domainName: batch.programId.domainId.domainName,
              totalCompletedResponses: totalCompletedResponses,
              totalResponsesCreated: totalResponsesCreated,
              responsePercentage: responsePercentage + "%",
              npsScore: npsScore.toFixed(2) + "%",
              promoters: promoters,
              detractors: detractors
            });
          }
        }
      }
    }
    console.log("Reports Number: ", reports.length);
    let uniqueReports = removeDuplicates(reports);
    console.log("Unique Reports Number: ", uniqueReports.length);
    await NpsReport.insertMany(uniqueReports);
    res.json(uniqueReports);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error occurred while generating NPS report", error });
  }
};

function removeDuplicates(reports) {
  const uniqueReports = [];
  const seen = new Set();

  for (const report of reports) {
    // Create a unique identifier string
    const identifier = `${report.npsFormCode}-${report.npsType}-${report.batchName}-${report.programName}`;

    if (!seen.has(identifier)) {
      uniqueReports.push(report);
      seen.add(identifier);
    }
  }

  return uniqueReports;
}

const calculateNpsScore = (responses) => {
  let promoters = 0;
  let detractors = 0;
  let neutral = 0;

  responses.forEach((response) => {
    if (response.questionType == "nps") {
      console.log("[+] calculateNpsScore Responses: ", response.questionType);
      console.log(
        "[+] Calculate NPS Score, responsevalue: ",
        response.responseVal
      );
      if (response.responseVal >= 9) {
        promoters++;
      } else if (response.responseVal <= 6) {
        detractors++;
      } else {
        neutral++;
      }
    }
  });
  console.log("[+] Promoter:  ", promoters);
  console.log("[+] Dectractor:  ", detractors);
  console.log("[+] Neutral:  ", neutral);
  let totalResponses = responses.flat().length;
  if (totalResponses === 0) return 0;
  let promoterPercentage =
    (promoters * 100) / (promoters + detractors + neutral);
  let detractorPercentage =
    (detractors * 100) / (promoters + detractors + neutral);
  console.log("[+] Promoter Percentage:  ", promoterPercentage);
  console.log("[+] Dectractor Percentage:  ", detractorPercentage);
  return [promoterPercentage - detractorPercentage, promoters, detractors];
};
const calculateCSATScore = (responses) => {
  let csatVal = 0;

  responses.forEach((response) => {
    if (response.questionType == "csat") {
      csatVal = csatVal + response.responseVal;
    }
  });

  return Math.round(csatVal / responses.length, 2);
};

const syncgetAllNpsBatchProgramLevel = async (req, res) => {
  try {
    const activeNpsForms = await Npsform.find({
      formStatus: "publish",
    }).populate({
      path: "npsData.batchId",
      populate: {
        path: "programId",
        populate: {
          path: "domainId",
          model: "Domain",
        },
      },
    });

    if (activeNpsForms.length === 0) {
      return res.status(200).json({ msg: "No NPS forms found" });
    }

    let reports = [];

    for (const form of activeNpsForms) {
      const batches = form.npsData.map((data) => data.batchId).flat();

      console.log(batches);
      let userType = req.userType,
        user = req.user;
      let userDetails = {};
      if (userType != "admin") {
        userDetails = await User.findById(user.userId);
      }
      for (const batch of batches) {
        if (userType != "admin" && !hasBatchId(userDetails.batchId, batch?._id))
          continue;
        for (const npsType of ["start", "mid", "end"]) {
          const responsesForBatch = await NpsResponse.find({
            npsFormId: form._id,
            batchId: batch._id,
            npsType,
          });

          const completedResponses = responsesForBatch.filter(
            (response) => response.completionStatus === "completed"
          );

          const totalResponsesCreated = responsesForBatch.length;
          const totalCompletedResponses = completedResponses.length;

          if (totalResponsesCreated > 0) {
            const [npsScore, promoters, detractors] = calculateNpsScore(
              completedResponses.map((r) => r.responses).flat()
            );
            const responsePercentage = (
              (totalCompletedResponses / totalResponsesCreated) *
              100
            ).toFixed(2);

            reports.push({
              npsFormName: form.npsFormName,
              npsFormCode: form.npsFormCode,
              npsEndDate: form.npsEndDate.toISOString().split("T")[0],
              npsType,
              domainName: batch.programId.domainId.domainName,
              programName: batch.programId.programName,
              batchName: batch.batchName,
              totalCompletedResponses: totalCompletedResponses,
              totalResponsesCreated: totalResponsesCreated,
              responsePercentage: responsePercentage + "%",
              npsScore: npsScore.toFixed(2) + "%",
            });
          } else {
            reports.push({
              npsFormName: form.npsFormName,
              npsFormCode: form.npsFormCode,
              npsEndDate: form.npsEndDate.toISOString().split("T")[0],
              npsType,
              domainName: batch.programId.domainId.domainName,
              programName: batch.programId.programName,
              batchName: batch.batchName,
              totalCompletedResponses: 0,
              totalResponsesCreated: 0,
              responsePercentage: "NA",
              npsScore: "NA",
            });
          }
        }
      }
    }

    console.log("Reports Number: ", reports.length);
    let allNpsReports = removeDuplicates(reports);
    console.log("AllNpsReports: ", allNpsReports.length, allNpsReports);

    const aggregatedData = {};
    const npsForms = getUniqueElements(allNpsReports).map((item) => {
      return { npsFormName: item.npsFormName, npsFormCode: item.npsFormCode };
    });
    allNpsReports.forEach((report) => {
      const key = `${report.programName}-${report.batchName}`;

      if (!aggregatedData[key]) {
        aggregatedData[key] = {
          programName: report.programName,
          batchName: report.batchName,
          domainName: report.domainName,
          npsReport: {},
        };
      }
      if (!aggregatedData[key].npsReport[report.npsFormCode])
        aggregatedData[key].npsReport[report.npsFormCode] = [];
      aggregatedData[key].npsReport[report.npsFormCode].push({
        npsFormName: report.npsFormName,
        npsFormCode: report.npsFormCode,
        npsType: report.npsType,
        npsScore: report.npsScore,
      });
    });

    const formattedData = Object.values(aggregatedData).map((item) => ({
      batchName: item.batchName,
      programName: item.programName,
      npsReport: item.npsReport,
      domainName: item.domainName,
    }));

    if (formattedData.length === 0) {
      return res.status(404).json({ message: "No NPS reports found" });
    }
    let updatedData = [];
    for (let item of formattedData) {
      let modData = {
        programName: item.programName,
        batchName: item.batchName,
        domainName: item.domainName,
        start: "NA",
        mid: "NA",
        end: "NA",
      };
      for (let report of Object.values(item.npsReport)) {
        for (let val of report)
          if (val.npsScore != "NA") modData[val.npsType] = val.npsScore;
      }
      updatedData.push(modData);
    }
    const bulkOps = updatedData.map((data) => ({
      updateOne: {
        filter: {
          programName: data.programName,
          batchName: data.batchName,
          domainName: data.domainName,
        },
        update: {
          $set: {
            start: data.start,
            mid: data.mid,
            end: data.end,
          },
        },
        upsert: true, // This ensures the operation is an upsert
      },
    }));
  
    try {
      const result = await BatchLevelNpsReport.bulkWrite(bulkOps);
      console.log("Bulk write operation result:", result);
    } catch (error) {
      console.error("Error in upsert operation:", error);
      throw new Error("Failed to upsert batch-level NPS reports");
    }
    res.json({ data: updatedData, npsForms });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Error occurred while generating NPS report at batch and program level",
      error: error.message,
    });
  }
};

const getBatchLevelNpsReports = async (req, res) => {
  try {
    // Fetch all reports or filter by query parameters if provided
    const filters = {};
    if (req.query.programName) {
      filters.programName = req.query.programName;
    }
    if (req.query.batchName) {
      filters.batchName = req.query.batchName;
    }
    if (req.query.domainName) {
      filters.domainName = req.query.domainName;
    }

    const reports = await BatchLevelNpsReport.find(filters);

    if (reports.length === 0) {
      return res.status(404).json({ message: "No NPS reports found" });
    }

    res.json({ data: reports });

    // res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching batch-level NPS reports:", error);
    res.status(500).json({
      message: "Error occurred while fetching batch-level NPS reports",
      error: error.message,
    });
  }
};

getUniqueElements = (data) => {
  const uniqueMap = new Map();
  const uniqueArray = [];

  data.forEach((item) => {
    const key = `${item.npsFormName}-${item.NpsFormCode}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, true);
      uniqueArray.push(item);
    }
  });

  return uniqueArray;
};
const getNpsReportByBatchId = async (req, res) => {
  try {
    const { batchId } = req.params; // Assuming you get batchId from request params

    // Retrieve all NPS reports
    const allNpsReports = await getAllNpsReport();

    // Filter the reports for the given batchId
    const batchReports = allNpsReports.filter(
      (report) => report.batchId === batchId
    );

    let formattedReports = [];

    // Iterate over batch reports to format them as required
    batchReports.forEach((report) => {
      let npsReport = [];

      // Iterate over npsData array to construct npsReport for each npsType
      report.npsData.forEach((npsData) => {
        npsReport.push({
          npsType: npsData.npsType,
          npsScore: npsData.npsScore.toFixed(2) + "%", // Assuming you want to represent npsScore as a percentage
        });
      });

      // Push formatted report for the batch
      formattedReports.push({
        batchName: report.batchName,
        programName: report.programName,
        npsReport,
      });
    });

    // Check if there are any reports for the batch
    if (formattedReports.length === 0) {
      return res
        .status(404)
        .json({ message: "No NPS reports found for the provided batch ID" });
    }

    // Send formatted reports as JSON response
    res.json(formattedReports);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error occurred while generating NPS report by batch ID",
      error: error.message,
    });
  }
};

module.exports = {
  getAllNpsReport,
  getNpsReportByBatchId,
  getAllNPSStat,
  getAllNPSResponseStatus,
  getCurrentNpsReport,
  syncgetAllNpsBatchProgramLevel,
  getBatchLevelNpsReports
};
