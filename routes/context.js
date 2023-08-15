const express = require('express');
const router = express.Router();
const contextController = require('../controllers/contextController');

router.get("/:id", contextController.getContext);
router.post("/", contextController.createContext);

module.exports = router;