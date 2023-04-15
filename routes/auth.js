const express = require('express');

const {
    register,
    login,
    getme,
    logout
} = require('../controllers/auth');

const router = express.Router();

const {
    protect
} = require('../middleware/auth');

router.post('/register',register);
router.post('/login',login);
router.get('/getme',protect,getme);
router.get('/logout',logout);

module.exports = router;