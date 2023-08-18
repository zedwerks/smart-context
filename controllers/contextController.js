const { randomUUID } = require('crypto');
const asyncHandler = require("express-async-handler");
const ContextModel = require('../models/contextModel');

exports.createContext = asyncHandler(async (req, res, next) => {
    req.accepts('application/json');
    var contextRequestJson = JSON.stringify(req.body);
    var contextId = randomUUID();
    console.debug(contextRequestJson);
    console.log("POST contextId = " + contextId);

    ContextModel.newContext(contextRequestJson, contextId)

    const contextResponse = {
        "contextId": contextId
    }

    res.contentType("application/json");
    return res.status(201).send(JSON.stringify(contextResponse));
});

exports.getContext = asyncHandler(async (req, res, next) => {
    var contextId = req.params.id;
    console.log("GET contextId = " + contextId);

    var data = ContextModel.getContext(contextId);
    res.contentType("application/json");
    if (data == null) {
        return res.status(404).send();
    } else {
        return res.status(200).send(data);
    }
});

exports.deleteContext = asyncHandler(async (req, res, next) => {
    var contextId = req.params.id;
    console.log("DELETE contextId = " + contextId);
    try {
        ContextModel.deleteContext(contextId);
    } catch (err) {
        if (err.code == 'ENOENT') {
            console.warn(err);
            return res.status(404).send();
        } else {
            return res.status(500).send();
        }
    }
    return res.status(200).send();
});
