import express from 'express';
const router = express.Router();
import { CartManager } from '../controllers/cartManager.js';

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.addCart();
    res.json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error creating cart' });
  }
});

router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
    } else {
      res.json(cart);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error getting cart' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    await cartManager.updateCart(cartId, productId, quantity);
    res.json({ message: 'Product added to cart' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding product to cart' });
  }
});

export default router;