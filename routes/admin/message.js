const express = require('express');

const {
    createMessage
} = require('../../controllers/admin/message');

const router = express.Router();

const {
    protect
} = require('../../middleware/auth');

router.post('/create', createMessage);


module.exports = router;