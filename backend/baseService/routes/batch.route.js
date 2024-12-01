const routes = require("express").Router();

const batchController = require("../controllers/batch.controller");

routes.post("/", batchController.addBatchName);
routes.get("/", batchController.getAllBatch);
routes.get("/:id", batchController.getBatchById);
routes.delete("/:id", batchController.deleteBatch);
routes.put("/:id", batchController.updateBatch);
routes.get("/byProgram/:programId", batchController.getAllBatchesByProgram);
routes.get(
  "/byDomain/:domainId",
  batchController.getAllProgramsAndBatchesByDomain
);
routes.get(
  "/batches/withprograms/all",
  batchController.getAllBatchWithProgramName
);
routes.post(
  "/batches/withprograms/forType",
  batchController.getAllBatchForTypeWithProgramName
);
module.exports = routes;
