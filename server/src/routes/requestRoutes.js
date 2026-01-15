const express = require('express');
const router = express.Router();
const { createRequest, getRequests, toggleRequestStatus } = require('../controllers/requestController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', createRequest);
router.get('/', getRequests);
router.put('/:id/toggle', toggleRequestStatus);

module.exports = router;
