const express = require('express');

const {
    createMessage
} = require('../../controllers/user/sendMessage');

const router = express.Router();

const {
    protect
} = require('../../middleware/auth');

router.get('/createMessage', protect, createMessage);

module.exports = router;