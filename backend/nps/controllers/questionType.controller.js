const Questiontype = require("../models/questionType.model").Questiontype;

/**
 * @swagger
 * /questiontypes:
 *   post:
 *     description: Create a new question type
 *     parameters:
 *       - name: body
 *         description: Question type data
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Questiontype'
 *     responses:
 *       201:
 *         description: Successfully created
 */

const addQuestiontype = async (req, res) => {
  try {
    const questionType = new Questiontype(req.body);
    const savedQuestionType = await questionType.save();
    res.status(201).json({msg: "Successfully Added QuestionType"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /questiontypes:
 *   get:
 *     description: Get all question types
 *     responses:
 *       200:
 *         description: Successful response
 */

const getQuestiontype = async (req, res) => {
  try {
    const questionTypes = await Questiontype.find();
    res.json(questionTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /questiontypes/{id}:
 *   get:
 *     description: Get a question type by ID
 *     parameters:
 *       - name: id
 *         description: Question type ID
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Successful response
 */

const getQuestionById = async (req, res) => {
  try {
    const questionType = await Questiontype.findById(req.params.id);
    if (!questionType) {
      res.status(404).json({ error: "Question type not found" });
      return;
    }
    res.json(questionType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /questiontypes/{id}:
 *   put:
 *     description: Update a question type by ID
 *     parameters:
 *       - name: id
 *         description: Question type ID
 *         in: path
 *         required: true
 *       - name: body
 *         description: Updated question type data
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Questiontype'
 *     responses:
 *       200:
 *         description: Successfully updated
 */

const updateQuestionType = async (req, res) => {
  try {
    const questionType = await Questiontype.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!questionType) {
      res.status(404).json({ error: "Question type not found" });
      return;
    }
    res.json(questionType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /questiontypes/{id}:
 *   delete:
 *     description: Delete a question type by ID
 *     parameters:
 *       - name: id
 *         description: Question type ID
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully deleted
 */

const deleteQuestiontype = async (req, res) => {
  try {
    const questionType = await Questiontype.findByIdAndDelete(req.params.id);
    if (!questionType) {
      res.status(404).json({ error: "Question type not found" });
      return;
    }
    res.json({ message: "Question type deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addQuestiontype, getQuestiontype, getQuestionById, updateQuestionType, deleteQuestiontype };
