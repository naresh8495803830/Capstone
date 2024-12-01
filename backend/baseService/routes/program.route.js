const routes = require('express').Router()

const programController = require('../controllers/program.controller')

routes.post('/', programController.addProgramName)
routes.get('/',programController.getAllPrograms)
routes.get('/:id', programController.getProgramById)
routes.post('/:id', programController.updateProgram)
routes.delete('/:id', programController.deleteProgram)
routes.get('/byDomain/:domainId', programController.getAllProgramsByDomain);

module.exports = routes