const express = require('express');
const router = express.Router();
const contextController = require('../controllers/contextController');

router.get("/api/context/:id", contextController.getContext);
router.delete("/api/context/:id", contextController.deleteContext);
router.post("/api/context/", contextController.createContext);

module.exports = router;