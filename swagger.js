const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/context.js'];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./server.js')
})