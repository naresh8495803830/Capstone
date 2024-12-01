const express = require("express");
const routes = express.Router();
const { updateBatches } = require("../crons/updateBatches");

routes.post("/updateBatchTypes", updateBatches);

module.exports = routes;
