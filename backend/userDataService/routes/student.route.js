const express = require('express');
const routes = express.Router();
const multer = require('multer');

const studentController = require('../controllers/student.controller')
const upload = multer({ dest: 'uploads/' });
routes.post('/upload', upload.single('file'), studentController.uploadStudentData);
routes.get('/',studentController.getStudentData)
routes.get('/:batchid', studentController.getStudentDataByBatch)
routes.delete('/:id', studentController.deleteUser)

module.exports = routes 