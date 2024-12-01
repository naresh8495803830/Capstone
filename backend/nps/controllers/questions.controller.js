const Question = require("../models/questions.model").Question;

// Create a new question
const addQuestion = async (req, res) => {
  try {
    const question = new Question(req.body);
    const savedQuestion = await question.save();
    res.status(201).json({ msg: "Successfully Added Question" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all questions
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a question by ID
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      res.status(404).json({ error: "Question not found" });
      return;
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a question by ID
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!question) {
      res.status(404).json({ error: "Question not found" });
      return;
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a question by ID
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      res.status(404).json({ error: "Question not found" });
      return;
    }
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addQuestion, getQuestions, getQuestionById, updateQuestion, deleteQuestion };
