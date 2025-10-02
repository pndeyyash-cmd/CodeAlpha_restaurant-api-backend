const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route to verify the password
router.post('/verify-password', authController.verifyPassword);

// Route to send the OTP
router.post('/send-otp', authController.sendOtp);

// Route to verify the OTP
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;

