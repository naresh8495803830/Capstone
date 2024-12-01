const express = require('express');
const routes = express.Router();

const lrmController = require('../controllers/lrm.controller')

routes.post('/', lrmController.addLrm);
routes.get('/',lrmController.getAllLrms)
routes.get('/:id', lrmController.getLrmById)
routes.put('/', lrmController.updateLrm)
routes.delete('/', lrmController.deleteLrm)

module.exports = routes 