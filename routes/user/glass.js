const express = require('express');

const {
    countup
} = require('../../controllers/user/glass');

const router = express.Router();

const {
    protect
} = require('../../middleware/auth');

router.get('/countup', protect, countup);

module.exports = router;