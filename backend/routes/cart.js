const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protect } = require('../middleware/authMiddleware'); 

router.post('/add', protect, async (req, res) => {
  const { name, price, img } = req.body;
  const userId = req.user.id; 

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ name, price, img, quantity: 1 }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.name === name);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ name, price, img, quantity: 1 });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(200).json({ items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/update/:itemId', protect, async (req, res) => {
  const { quantity } = req.body;
  const userId = req.user.id;
  const itemId = req.params.itemId;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    item.quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/remove/:itemId', protect, async (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.itemId;

  console.log(`Attempting to remove item ${itemId} for user ${userId}`);

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => 
      item._id.toString() !== itemId && item.id !== itemId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("Error removing item from cart backend:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});



router.delete('/clear', protect, async (req, res) => {
  const userId = req.user.id; 

  console.log("Attempting to clear cart for Backend User ID:", userId);

  try {
    const cart = await Cart.findOneAndDelete({ userId });
    
    if (!cart) {
      console.log(`No active cart found to delete for user: ${userId}`);
      return res.status(200).json({ message: 'Cart already empty or not found' });
    }

    console.log(`Database: Cart successfully cleared for user ${userId} ✅`);
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    console.error("Backend Error while clearing cart:", err);
    res.status(500).json({ message: 'Server Error while clearing cart' });
  }
});

module.exports = router;
