'use strict';

const { randomUUID } = require('crypto');
const { jwt } = require('jsonwebtoken');
const express = require('express');
const fs = require('fs');
const { json } = require('express/lib/response');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();
const port = process.env.PORT || 8088;
const context_dir = process.env.CONTEXT_IDR || "/contexts";
const app = express();

// Route to Home Page
router.get("/", function(req, res) {
    res.json({"message": "Welcome to the SMART Context API"});
});

// Swagger setup
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Swagger API Example',
      version: '1.0.0',
      description: 'An example API with Swagger documentation',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server',
      },
    ],
  };
  

const options = {
  swaggerDefinition,
  apis: ['server.js'], // Path to API routes
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

// This will need to be protected with a Bearer token
app.get('/context/:id', function (req, res) {
    fs.readFile( __dirname + context_dir + "/" + req.params.id + "_context.json", 'utf8', function (err, data) {
        console.log( data );
        res.contentType("application/json");
        res.end(data);
    });
}) 

// Leave anonymous for now
app.post('/context', function (req, res) {
    req.accepts('application/json');
    var contextRequestJson = JSON.stringify(req.body);
    var contextId = randomUUID();
    console.log(contextRequestJson);
    console.log("contextId = " + contextId);
    
    fs.mkdir( __dirname + context_dir, function (err) {});

    fs.writeFile( __dirname + context_dir + "/" + contextId + "_context.json", contextRequestJson, function (err) {
        if (err) throw err;
        console.log('Context Saved!');
    });

    const contextResponse = {
        "contextId": contextId
    }

    res.contentType("application/json");
    res.end( JSON.stringify(contextResponse));
})


var server = app.listen(port, function () {
    var p = server.address().port;
    console.log( "SMART Context API listening at %s", p )
});
