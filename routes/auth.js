const express = require('express');

const {
    register,
    login,
    getme,
    logout,
    updateDetail,
    updatePassword,
    forgetPassword
} = require('../controllers/auth');

const router = express.Router();

const {
    protect
} = require('../middleware/auth');

router.post('/register',register);
router.post('/login',login);
router.get('/getme',protect,getme);
router.get('/logout',logout);
router.put('/updateDetail',protect,updateDetail);
router.put('/updatePassword',protect,updatePassword);
router.post('/forgetPassword',forgetPassword);

module.exports = router;