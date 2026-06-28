const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-payment-intent', protect, async (req, res) => {
  const { items, totalAmount, shippingAddress } = req.body;
  
  const userId = req.user._id || req.user.id; 

  console.log("Payment Intent requested by User ID:", userId);

  if (!userId) {
    return res.status(400).json({ message: "User ID not found in token" });
  }

  try {
    const amountInPaise = Math.round(totalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency: 'inr',
      metadata: { userId: userId.toString() },
    });

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      shippingAddress,
      orderStatus: 'Pending',   
      paymentStatus: 'Pending'  
    });

    const savedOrder = await newOrder.save();

    res.status(200).json({
      success: true, 
      clientSecret: paymentIntent.client_secret,
      orderId: savedOrder._id
    });

  } catch (error) {
    console.error("Stripe Error Inside Backend:", error);
    res.status(500).json({ message: "Payment initialization failed", error: error.message });
  }
});

module.exports = router;
