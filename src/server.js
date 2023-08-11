const { randomUUID } = require('crypto');
const { jwt } = require('jsonwebtoken');
var express = require('express');
var fs = require('fs');
const { json } = require('express/lib/response');

const PORT = 8088;
const CONTEXT_DIR = "/contexts";
var app = express();
app.use(express.json());

// This will need to be protected with a Bearer token

app.get('/context/:id', function (req, res) {
    fs.readFile( __dirname + CONTEXT_DIR + "/" + req.params.id + "_context.json", 'utf8', function (err, data) {
        console.log( data );
        res.contentType("application/json");
        res.end(data);
    });
}) 

// This can be protected with an API key, leave anonymous for now
app.post('/context', function (req, res) {
    req.accepts('application/json');
    var contextRequestJson = JSON.stringify(req.body);
    var contextId = randomUUID();
    console.log(contextRequestJson);
    console.log("contextId = " + contextId);
    
    fs.mkdir( __dirname + CONTEXT_DIR, function (err) {});

    fs.writeFile( __dirname + "/contexts/" + contextId + "_context.json", contextRequestJson, function (err) {
        if (err) throw err;
        console.log('Context Saved!');
    });

    res.end( JSON.stringify(contextId));
})


var server = app.listen(PORT, function () {
    var port = server.address().port;
    console.log( "Context API listening at http://%s:%s", 'localhost', PORT )
});
