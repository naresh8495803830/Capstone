const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const fs = require('fs');

const healthControllerPath = path.resolve(__dirname, '../controllers/health.controller.js')
const healthControllerContent = fs.readFileSync(healthControllerPath, 'utf-8');


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Batch API',
      version: '1.0.0',
      description: 'API documentation for the Batch controller',
    },
  },
  apis: [healthControllerPath],
  content: healthControllerContent,
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
