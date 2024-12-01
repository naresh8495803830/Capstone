/**
 * @swagger
 * tags:
 *   name: Batches
 *   description: Batch operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Batch:
 *       $ref: '../models/batch.model.js'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Batch:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the batch
 *         batchName:
 *           type: string
 *           description: The name of the batch
 *         programId:
 *           type: string
 *           description: The ID of the associated program
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp of when the batch was created
 */

const Batch = require("../models/batch.model").Batch;
const Program = require("../models/program.model").Program;

/**
 * @swagger
 * /batch:
 *   post:
 *     summary: Create a new batch
 *     tags: [Batches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               batchName:
 *                 type: string
 *               programId:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Batch Added Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Batch Added Successfully
 *                 batch:
 *                   $ref: '../models/batch.model'
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Program not found
 *       '500':
 *         description: Internal Server Error
 */

const addBatchName = async (req, res) => {
  try {
    const { batchName, programId } = req.body;
    if (!batchName || !programId) {
      return res
        .status(400)
        .json({ error: "Both batchName and programId are required." });
    }
    const existingProgram = await Program.findById(programId);
    if (!existingProgram) {
      return res.status(404).json({ error: "Program not found." });
    }
    const newbatch = new Batch({
      batchName,
      programId,
      npsType: "start",
    });
    const savedBatch = await newbatch.save();
    res.status(201).json({ msg: "Batch Added Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /batch:
 *   get:
 *     summary: Get all batches
 *     tags: [Batches]
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  allOf:
 *                      - $ref: '#/components/schemas/Batch'
 *       '500':
 *         description: Internal Server Error
 */

const getAllBatch = async (req, res) => {
  try {
    console.log(req.body);
    let batch = await Batch.find({});
    console.log(batch);
    if (batch) {
      res.send(batch);
    } else {
      res.send({ msg: "Batch doesn't exist" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Something went wrong" });
  }
};

/**
 * @swagger
 * /batch/{id}:
 *   get:
 *     summary: Get a batch by ID
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the batch
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Batch fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../models/batch.model#/components/schemas/Batch'
 *       '404':
 *         description: Batch not found
 *       '500':
 *         description: Internal Server Error
 */
const getBatchById = async (req, res) => {
  try {
    const batchId = req.params.id;

    const batch = await Batch.findById(batchId);

    if (batch) {
      res.send(batch);
    } else {
      res.status(404).send({ msg: "Batch not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /batch/{id}:
 *   put:
 *     summary: Update a batch
 *     tags: [Batches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Batch'
 *     responses:
 *       '200':
 *         description: Batch updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../models/batch.model#/components/schemas/Batch'
 *       '404':
 *         description: Batch not found
 *       '500':
 *         description: Internal Server Error
 */

const updateBatch = async (req, res) => {
  try {
    const batchId = req.params.id;
    const { batchName, programId } = req.body;

    if (!batchName || !programId) {
      return res
        .status(400)
        .json({ error: "Both batchName and programId are required." });
    }

    const existingProgram = await Program.findById(programId);

    if (!existingProgram) {
      return res.status(404).json({ error: "Program not found." });
    }

    const updatedBatch = await Batch.findByIdAndUpdate(
      batchId,
      { batchName, programId },
      { new: true }
    );

    if (updatedBatch) {
      res.send({ msg: "Batch updated successfully", batch: updatedBatch });
    } else {
      res.status(404).send({ msg: "Batch not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /batch/{id}:
 *   delete:
 *     summary: Delete a batch by ID
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the batch
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Batch deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../models/batch.model#/components/schemas/Batch'
 *       '404':
 *         description: Batch not found
 *       '500':
 *         description: Internal Server Error
 */

const deleteBatch = async (req, res) => {
  try {
    const batchId = req.params.id;

    const deletedBatch = await Batch.findByIdAndDelete(batchId);

    if (deletedBatch) {
      res.send({ msg: "Batch deleted successfully", batch: deletedBatch });
    } else {
      res.status(404).send({ msg: "Batch not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /batch/byProgram/{programId}:
 *   get:
 *     summary: Get all batches under a program
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: programId
 *         required: true
 *         description: ID of the program
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Batch'
 *       '404':
 *         description: Program not found
 *       '500':
 *         description: Internal Server Error
 */
const getAllBatchesByProgram = async (req, res) => {
  try {
    const userType = req.userType;
    console.log("userType:", userType);
    const programId = req.params.programId;
    const batches = await Batch.find({ programId });

    if (batches.length > 0) {
      res.send(batches);
    } else {
      res
        .status(404)
        .send({ msg: "No batches found for the specified program" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /batch/byDomain/{domainId}:
 *   get:
 *     summary: Get all programs and their batches under one domain
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: domainId
 *         required: true
 *         description: ID of the domain
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   program:
 *                     $ref: '#/components/schemas/Program'
 *                   batches:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Batch'
 *       '404':
 *         description: Domain not found
 *       '500':
 *         description: Internal Server Error
 */
const getAllProgramsAndBatchesByDomain = async (req, res) => {
  try {
    const domainId = req.params.domainId;
    const programs = await Program.find({ domainId });
    const programsWithBatches = [];

    for (const program of programs) {
      const batches = await Batch.find({ programId: program._id });
      programsWithBatches.push({
        program,
        batches,
      });
    }

    if (programsWithBatches.length > 0) {
      res.send(programsWithBatches);
    } else {
      res
        .status(404)
        .send({ msg: "No programs/batches found for the specified domain" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
};

const getAllBatchWithProgramName = async (req, res) => {
  try {
    let batches = await Batch.find({}).populate("programId", "programName");
    if (batches.length > 0) {
      const batchesWithProgramName = batches.map((batch) => ({
        _id: batch._id,
        batchName: batch.batchName,
        programName: batch.programId.programName,
        createdAt: batch.createdAt,
      }));

      res.status(200).json(batchesWithProgramName);
    } else {
      res.status(404).json({ msg: "No batches found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
};
const getAllBatchForTypeWithProgramName = async (req, res) => {
  try {
    let type = req.body.type;

    let batches = await Batch.find({ npsType: type }).populate(
      "programId",
      "programName"
    );
    if (batches.length > 0) {
      const batchesWithProgramName = batches.map((batch) => ({
        _id: batch._id,
        batchName: batch.batchName,
        type: batch.npsType,
        programName: batch.programId.programName,
        createdAt: batch.createdAt,
      }));

      res.status(200).json(batchesWithProgramName);
    } else {
      res.status(200).json([]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
};

module.exports = {
  addBatchName,
  getAllBatch,
  getBatchById,
  updateBatch,
  deleteBatch,
  getAllBatchesByProgram,
  getAllProgramsAndBatchesByDomain,
  getAllBatchWithProgramName,
  getAllBatchForTypeWithProgramName,
};
