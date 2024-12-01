const express = require('express')
const routes = express.Router()
const questionTypeController = require('../controllers/questionType.controller')

routes.post('/', questionTypeController.addQuestiontype)
routes.get('/', questionTypeController.getQuestiontype)
routes.get('/:id', questionTypeController.getQuestionById)
routes.put('/:id', questionTypeController.updateQuestionType)
routes.delete('/:id', questionTypeController.deleteQuestiontype)

module.exports = routes 