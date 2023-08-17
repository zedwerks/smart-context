const express = require('express');
const router = express.Router();
const contextController = require('../controllers/contextController');
const authMiddleware = require('../middleware/authMiddleware');

router.get("/api/context/:id", authMiddleware.tokenAuth, contextController.getContext);
router.delete("/api/context/:id", authMiddleware.tokenAuth, contextController.deleteContext);
router.post("/api/context/" , authMiddleware.apiKeyAuth, contextController.createContext);

module.exports = router;