const Npsform = require("../models/npsform.model").Npsform;
const Batch = require("../models/batch.model").Batch;
const NpsTypes = {
  start: 0,
  mid: 1,
  end: 2,
  0: "start",
  1: "mid",
  2: "end",
};
const getMaximumType = (newVal, current) => {
  let currentInd = NpsTypes[current || "start"],
    newInd = NpsTypes[newVal || "start"];
  return NpsTypes[Math.max(currentInd, newInd)];
};
const updateBatches = async (req, res) => {
  try {
    if (req.body.specialKey != "A672549mdhf;lr@jcur 999") {
      res.status(401).json({ error: "Unauthorised" });
      return;
    }
    let batches = await Batch.find();
    let npsForms = await Npsform.find();

    batchesMapping = {};
    for (let item of npsForms) {
      let data = item.npsData;
      for (let ele of data) {
        let type = ele.npsType;
        for (let batch of ele.batchId) {
          console.log(type, getMaximumType(type, batchesMapping[batch._id]));
          batchesMapping[batch._id] = getMaximumType(
            type,
            batchesMapping[batch._id]
          );
        }
      }
    }
    for (let batch of batches) {
      console.log(batch._id);
      batch.npsType = batchesMapping[batch._id];
      await batch.save();
    }
    res.status(200).json({ Message: "Successfully Update Batches" });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

module.exports = { updateBatches };
