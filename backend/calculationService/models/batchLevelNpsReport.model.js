const db = require('../utils/conn')
const mongoose = require("../utils/conn").mongoose;

const BatchLevelNpsReportSchema = new mongoose.Schema({
  programName: { type: String, required: true },
  batchName: { type: String, required: true },
  domainName: { type: String, required: true },
  start: { type: String, default: "NA" },
  mid: { type: String, default: "NA" },
  end: { type: String, default: "NA" },
}, { timestamps: true });

const BatchLevelNpsReport = mongoose.model("BatchLevelNpsReport", BatchLevelNpsReportSchema);

module.exports = {BatchLevelNpsReport};
