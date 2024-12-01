const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questions.controller');

// Create a new question
router.post('/', questionController.addQuestion);

// Get all questions
router.get('/', questionController.getQuestions);

// Get a question by ID
router.get('/:id', questionController.getQuestionById);

// Update a question by ID
router.put('/:id', questionController.updateQuestion);

// Delete a question by ID
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
