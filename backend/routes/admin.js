const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/authMiddleware'); // നിങ്ങളുടെ ഫയൽ പാത്ത് അനുസരിച്ച് മാറ്റുക

router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email') 
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

router.put('/orders/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body; 

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const savedOrder = await order.save(); 

    res.status(200).json({ success: true, order: savedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Status Update Failed', error: error.message });
  }
});



module.exports = router;
