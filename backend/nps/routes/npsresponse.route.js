const express = require("express");
const routes = express.Router();
const npsResponseController = require("../controllers/npsresponses.controller");
const verifyToken = require("../utils/jwt.middleware");

routes.get("/", verifyToken, npsResponseController.fetchAllResponses);
routes.get("/:id", verifyToken, npsResponseController.getResponseById);
routes.post("/limited/", verifyToken, npsResponseController.getNpsResponses);
routes.post(
  "/npsregisterstudent",
  verifyToken,
  npsResponseController.createNpsResponseForBatch
);
routes.post("/sampletry", npsResponseController.sampleTry);
routes.post("/resend", verifyToken, npsResponseController.postResendEmail);
routes.get(
  "/form/:userId",
  npsResponseController.getResponseByUserId
);
routes.put("/:id", npsResponseController.updateResponseById);
routes.get("/npsstat/all", verifyToken, npsResponseController.getAllNPSStat);
routes.get(
  "/nps/res/:responseId",
  npsResponseController.getDetailedResponseByResponseId
);
module.exports = routes;
