import express from 'express';
import { ProductManager } from './ProductManager.js';

const app = express();
const productManager = new ProductManager('./products.json');

app.get('/products', async (req, res) => {
  try {
    let products = await productManager.getProducts();
    if (req.query.limit) {
      const limit = parseInt(req.query.limit, 10);
      products = products.slice(0, limit);
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error getting the products' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(Number(req.params.pid));
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error getting the product' });
  }
});

export default router;