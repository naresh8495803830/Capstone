const express = require('express');
const routes = express.Router();

const npsformController = require('../controllers/npsform.controller')

routes.post('/',npsformController.addNpsForm)
routes.get('/', npsformController.getNpsForm)
routes.get('/:id', npsformController.getNpsFormById)
routes.put('/:id', npsformController.updateNpsForm)
routes.delete('/:id', npsformController.deleteNpsForm)

module.exports = routes