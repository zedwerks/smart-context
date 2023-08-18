const fs = require('fs');
const path = require('path');

const context_dir = process.env.CONTEXT_DIR || path.join(__dirname, "../contexts");

const newContext = (contextJson, id) => {
    uuid = "";
    const contextPath = path.join(context_dir + "/" + id + "_context.json");
    fs.writeFileSync(contextPath, contextJson);
    return uuid;
}

const deleteContext = (id) => {
    fs.unlinkSync(path.join(context_dir + "/" + id + "_context.json"), function (err) { 
        if (err) throw err;
        console.debug('File deleted!');
    });
}

const readContext = (id) => {
    try {
        var filePath = path.join(context_dir + "/" + id + "_context.json");
        console.debug("filePath=  " + filePath);
        const data = fs.readFileSync(filePath);
        return data;
    }
    catch (error) {
        return null;
    }
}

class ContextModel {
    constructor() {
        fs.mkdir(context_dir, function (err) { });
    }
    getContext(id) {
        return readContext(id);
    }
    newContext(contextJson, id) {
        return newContext(contextJson, id);
    }
    deleteContext(id) {
        return deleteContext(id);
    }
}

module.exports = new ContextModel();