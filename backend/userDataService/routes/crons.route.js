const express = require("express");
const { convertBatchToArrays } = require("../crons/convertBatchToArrays");
const routes = express.Router();

routes.get("/convertBatchToArray", convertBatchToArrays);

module.exports = routes;
