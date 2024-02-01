const express = require('express');
const router = express.Router();
const contextController = require('../controllers/contextController');
const authMiddleware = require('../middleware/authMiddleware');

const baseRoute = process.env.API_BASE_ROUTE || "/context";

router.get(baseRoute + "/:id", authMiddleware.tokenAuth, contextController.getContext);
router.delete(baseRoute + "/:id", authMiddleware.tokenAuth, contextController.deleteContext);
router.post(baseRoute , authMiddleware.apiKeyAuth, contextController.createContext);

module.exports = router;