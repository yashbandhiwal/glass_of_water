const express = require('express');

const {
    countup,
    listOfGlassDay,
    detail,
    deleteGlass
} = require('../../controllers/user/glass');

const router = express.Router();

const {
    protect
} = require('../../middleware/auth');

router.get('/countup', protect, countup);
router.get('/list', protect, listOfGlassDay);
router.post('/detail', protect, detail);
router.delete('/delete', protect, deleteGlass);

module.exports = router;