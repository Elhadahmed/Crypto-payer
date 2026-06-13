const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_example');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { ethers } = require('ethers');

// Card Payment
exports.cardPayment = async (req, res) => {
  try {
    const { amount, currency, cardToken, description } = req.body;
    const userId = req.userId;

    if (!amount || !currency || !cardToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      payment_method: cardToken,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });

    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: 'card_payment',
      paymentMethod: 'card',
      amount,
      currency,
      status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
      stripePaymentIntentId: paymentIntent.id,
      description,
      totalAmount: amount,
      metadata: { paymentIntentId: paymentIntent.id }
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      transaction: {
        id: transaction._id,
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Card payment failed',
      error: error.message 
    });
  }
};

// Crypto Payment
exports.cryptoPayment = async (req, res) => {
  try {
    const { amount, cryptoType, recipientAddress, description } = req.body;
    const userId = req.userId;

    if (!amount || !cryptoType || !recipientAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (!user.walletAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'User wallet not configured' 
      });
    }

    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: 'crypto_payment',
      paymentMethod: cryptoType.toLowerCase(),
      amount,
      currency: cryptoType.toUpperCase(),
      status: 'pending',
      recipientAddress,
      description,
      totalAmount: amount
    });

    await transaction.save();

    // In production, integrate with actual blockchain
    // For now, just create the transaction record

    res.json({
      success: true,
      message: 'Crypto payment initiated',
      transaction: {
        id: transaction._id,
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        recipientAddress
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Crypto payment failed',
      error: error.message 
    });
  }
};

// Get Payment Methods
exports.getPaymentMethods = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      cards: user.cards,
      wallet: user.walletAddress
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching payment methods',
      error: error.message 
    });
  }
};
