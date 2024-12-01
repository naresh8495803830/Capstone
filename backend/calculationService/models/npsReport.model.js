const db = require('../utils/conn')
const mongoose = require("../utils/conn").mongoose;

const NpsReportSchema = new mongoose.Schema({
  npsFormName: { type: String, required: true },
  npsFormCode: { type: String, required: true },
  npsEndDate: { type: String, required: true },
  npsType: { type: String, required: true },
  programName: { type: String, required: true },
  batchName: { type: String, required: true },
  domainName: { type: String, required: true },
  totalCompletedResponses: { type: Number, required: true },
  totalResponsesCreated: { type: Number, required: true },
  responsePercentage: { type: String, required: true },
  npsScore: { type: String, required: true },
  promoters: { type: Number, required: true },
  detractors: { type: Number, required: true },
}, { timestamps: true });

const NpsReport = mongoose.model("NpsReport", NpsReportSchema);

module.exports = {NpsReport};
