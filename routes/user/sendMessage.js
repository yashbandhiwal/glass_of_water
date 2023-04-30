const express = require('express');

const {
    createMessage,
    seenUpdate
} = require('../../controllers/user/sendMessage');

const router = express.Router();

const {
    protect
} = require('../../middleware/auth');

router.post('/createMessage', protect, createMessage);
router.put('/seenUpdate', protect, seenUpdate);

module.exports = router;