'use strict';

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const port = process.env.PORT || 8088;
const app = express();

// Routes
var indexRouter = require("./routes/index");
var contextRouter = require("./routes/context");

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/', indexRouter);
app.use("/", contextRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

var server = app.listen(port, function () {
    var p = server.address().port;
    console.log( "SMART Context API listening at %s", p )
});
