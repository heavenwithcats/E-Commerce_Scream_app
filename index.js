import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import * as db from './queries.js';

// Initialize Stripe with your Secret Key (sk_test_...)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = 7777;

import session from 'express-session'; 
app.set('trust proxy', 1);

// 2. Automatically check if running in production
const isProduction = process.env.NODE_ENV === 'production';

app.use(session({
  secret: 'I-am-the-only-real-ghostface',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction, // Automatically sets to 'true' on Render, 'false' on localhost
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: isProduction ? 'none' : 'lax', // Required if your frontend and backend have different URLs on Render
  }
}));

// Middleware
app.use(cors()); // Enables cross-origin requests from React (port 3000)[cite: 2]
app.use(express.json());

// Root
app.get('/', (req, res) => {
    res.send('Hello Sidney!');
});

// Users
app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/create', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);

// Authors
app.get('/authors', db.getAuthors);
app.get('/authors/:id', db.getAuthorById);
app.post('/authors', db.createAuthor);
app.put('/authors/:id', db.updateAuthor);
app.delete('/authors/:id', db.deleteAuthor);

// Books
app.get('/books', db.getBooks);
app.get('/books/:id', db.getBookById);
app.post('/books', db.createBook);
app.put('/books/:id', db.updateBook);
app.delete('/books/:id', db.deleteBook);

// Orders
app.get('/orders', db.getOrders);
app.get('/orders/:id', db.getOrderById);
app.post('/orders', db.createOrder);
app.put('/orders/:id', db.updateOrder);
app.delete('/orders/:id', db.deleteOrder);

// Cart & Checkout
app.get('/cart/:user_id', db.getCartById);
app.post('/cart', db.createCart);
app.delete('/cart/:id', db.deleteCart);
app.post('/checkout/:user_id', db.checkout);

// Stripe Checkout Session Endpoint
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const line_items = items.map((item) => {
      const numericPrice = parseFloat(item.price.replace('$', ''));
      const unitAmount = Math.round(numericPrice * 100);

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:3000/orders?success=true',
      cancel_url: 'http://localhost:3000/cart',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe Session Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
    console.log(`Ghostface listening on port ${port}`);
});