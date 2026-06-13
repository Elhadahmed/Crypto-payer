const express = require('express');
const { cardPayment, cryptoPayment, getPaymentMethods } = require('../controllers/paymentController');
const auth = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.post('/card', auth, cardPayment);
router.post('/crypto', auth, cryptoPayment);
router.get('/methods', auth, getPaymentMethods);

module.exports = router;
