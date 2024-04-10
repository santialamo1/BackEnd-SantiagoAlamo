import express from 'express'
import dotenv from 'dotenv';
import productsRouter from './routes/products.routes.js'; 
import cartsRouter from './routes/cart.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});