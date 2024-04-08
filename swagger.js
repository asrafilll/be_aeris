import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation for the API',
    },
  },
  apis: ['./routes/*.js'], // Path ke file yang berisi anotasi Swagger
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;