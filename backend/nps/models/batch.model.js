const db = require("../utils/conn");
const mongoose = require("../utils/conn").mongoose;

const batchSchema = mongoose.Schema({
  batchName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 200,
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "program",
    required: true,
  },
  npsType: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Batch = mongoose.model("batch", batchSchema);
module.exports = { Batch };
