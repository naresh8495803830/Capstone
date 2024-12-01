const express = require('express');
const routes = express.Router();
const calculateController = require('../controllers/calculate.controller')

routes.get('/allstat', calculateController.getAllNPSStat)
routes.get('/npsresponses', calculateController.getAllNPSResponseStatus)
routes.get('/npsreport', calculateController.getCurrentNpsReport)
routes.get('/allreport', calculateController.getAllNpsReport)
routes.get('/batchwise/:id', calculateController.getNpsReportByBatchId)
routes.get('/batchprogram', calculateController.getBatchLevelNpsReports)
routes.get('/syncbatchprogram', calculateController.syncgetAllNpsBatchProgramLevel)
module.exports = routes