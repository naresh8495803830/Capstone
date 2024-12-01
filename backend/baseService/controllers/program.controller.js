/**
 * @swagger
 * tags:
 *   name: Programs
 *   description: Program operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Program:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the program
 *         programName:
 *           type: string
 *           description: The name of the program
 *         domainId:
 *           type: string
 *           description: The ID of the associated domain
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp of when the program was created
 */


const Domain = require('../models/domain.model').Domain
const Program = require('../models/program.model').Program

/**
 * @swagger
 * /program:
 *   post:
 *     summary: Create a new program
 *     tags: [Programs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               programName:
 *                 type: string
 *               domainId:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Program Added Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Program Added Successfully
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Domain not found
 *       '500':
 *         description: Internal Server Error
 */

const addProgramName = async(req,res) => {
    try {
        const { programName, domainId } = req.body;    
        if (!programName || !domainId) {
          return res.status(400).json({ error: 'Both programName and domainId are required.' });
        }    
        const existingDomain = await Domain.findById(domainId);
        if (!existingDomain) {
          return res.status(404).json({ error: 'Domain not found.' });
        }        
        const newProgram = new Program({
          programName,
          domainId,
        });    
        const savedProgram = await newProgram.save();
        res.status(201).json({msg: 'Program Added Successfully'});
      } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Internal Server Error' });
      }
}

/**
 * @swagger
 * /program:
 *   get:
 *     summary: Get all programs
 *     tags: [Programs]
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Program'
 *       '500':
 *         description: Internal Server Error
 */

const getAllPrograms = async (req,res) => {
    try {
        console.log(req.body);
        let program = await Program.find({});
        console.log(program)
        if (program) {
            res.send(program)
        } else {
            res.send({ msg: "Program doesn't exist" });
        }
      } catch(err) {
        console.error(err);
        res.status(500).send({ msg: "Something went wrong" });
      }
}

/**
 * @swagger
 * /program/{id}:
 *   get:
 *     summary: Get a program by ID
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               $ref: '#/components/schemas/Program'
 *       '404':
 *         description: Program not found
 *       '500':
 *         description: Internal Server Error
 */

const getProgramById = async (req, res) => {
  try {
    const programId = req.params.id;

    const program = await Program.findById(programId);

    if (program) {
      res.send(program);
    } else {
      res.status(404).send({ msg: 'Program not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  }
};

/**
 * @swagger
 * /program/{id}:
 *   put:
 *     summary: Update a program by ID
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the program
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               programName:
 *                 type: string
 *               domainId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Program updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Program updated successfully
 *                 program:
 *                   $ref: '#/components/schemas/Program'
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Program not found
 *       '500':
 *         description: Internal Server Error
 */

const updateProgram = async (req, res) => {
  try {
    const programId = req.params.id;
    const { programName, domainId } = req.body;

    if (!programName || !domainId) {
      return res
        .status(400)
        .json({ error: 'Both programName and domainId are required.' });
    }

    const existingDomain = await Domain.findById(domainId);

    if (!existingDomain) {
      return res.status(404).json({ error: 'Domain not found.' });
    }

    const updatedProgram = await Program.findByIdAndUpdate(
      programId,
      { programName, domainId },
      { new: true }
    );

    if (updatedProgram) {
      res.send({
        msg: 'Program updated successfully',
        program: updatedProgram,
      });
    } else {
      res.status(404).send({ msg: 'Program not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Internal Server Error' });
  }
};

/**
 * @swagger
 * /program/{id}:
 *   delete:
 *     summary: Delete a program by ID
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the program
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Program deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Program deleted successfully
 *                 program:
 *                   $ref: '#/components/schemas/Program'
 *       '404':
 *         description: Program not found
 *       '500':
 *         description: Internal Server Error
 */

const deleteProgram = async (req, res) => {
  try {
    const programId = req.params.id;

    const deletedProgram = await Program.findByIdAndDelete(programId);

    if (deletedProgram) {
      res.send({
        msg: 'Program deleted successfully',
        program: deletedProgram,
      });
    } else {
      res.status(404).send({ msg: 'Program not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Internal Server Error' });
  }
};

/**
 * @swagger
 * /program/byDomain/{domainId}:
 *   get:
 *     summary: Get all programs under a domain
 *     tags: [Programs]
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
 *                 $ref: '#/components/schemas/Program'
 *       '404':
 *         description: Domain not found
 *       '500':
 *         description: Internal Server Error
 */
const getAllProgramsByDomain = async (req, res) => {
  try {
    const domainId = req.params.domainId;
    const programs = await Program.find({ domainId });

    if (programs.length > 0) {
      res.send(programs);
    } else {
      res.status(404).send({ msg: 'No programs found for the specified domain' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Internal Server Error' });
  }
};


module.exports = {addProgramName, getAllPrograms, getProgramById, updateProgram, deleteProgram,
  getAllProgramsByDomain}