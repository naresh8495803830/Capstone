const routes = require('express').Router()

const domainController = require('../controllers/domain.controller')

routes.post('/', domainController.addDomain)
routes.get('/', domainController.getAllDomain)
routes.get('/:id',domainController.getDomainById)
routes.delete('/:id', domainController.deleteDomain)
routes.put('/:id',domainController.updateDomain)

module.exports = routes