const express = require('express');
const router = express.Router();

// Route to Home Page
router.get("/", function(req, res) {
    res.redirect("/api/docs");
    //res.json({"message": "Welcome to the SMART Context API"});
});

module.exports = router;