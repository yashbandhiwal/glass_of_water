const express = require('express');

const {
    countup,
    listOfGlassDay
} = require('../../controllers/user/glass');

const router = express.Router();

const {
    protect
} = require('../../middleware/auth');

router.get('/countup', protect, countup);
router.get('/list', protect, listOfGlassDay)

module.exports = router;