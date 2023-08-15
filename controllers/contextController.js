const fs = require('fs');
const express = require('express');
const { jwt } = require('jsonwebtoken');
const { json } = require('express/lib/response');
const { randomUUID } = require('crypto');
const asyncHandler = require("express-async-handler");

const context_dir = process.env.CONTEXT_IDR || "/contexts";

exports.createContext = asyncHandler(async (req, res, next) => {
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
});

exports.getContext = asyncHandler(async (req, res, next) => {
    var path = __dirname  + context_dir + "/" + req.params.id + "_context.json";
    console.log("path = " + path);
    fs.readFile( path, 'utf8', function (err, data) {
        console.log("In getContext");

        if (err) {
            console.log("Error reading file: " + err);
        }
        console.log( data );
        res.contentType("application/json");
        res.end(data);
    });
});

exports.deleteContext = asyncHandler(async (req, res, next) => {
    var path = __dirname  + context_dir + "/" + req.params.id + "_context.json";
    console.log("path = " + path);
    fs.unlink( path, function (err) {
        console.log("In deleteContext");

        if (err) {
            console.log("Error deleting file: " + err);
        }
        res.contentType("application/json");
        res.end();
    });
});
