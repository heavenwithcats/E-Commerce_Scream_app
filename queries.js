import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// --- AUTHORS ---

const getAuthors = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM authors ORDER BY id ASC');
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

const getAuthorById = async (request, response) => {
  const id = parseInt(request.params.id, 10);
  try {
    const results = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

const createAuthor = async (request, response) => {
  const { name, email } = request.body;
  try {
    const results = await pool.query(
      'INSERT INTO authors (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    response.status(201).send(`Author added with ID: ${results.rows[0].id}`);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

const updateAuthor = async (request, response) => {
  const id = parseInt(request.params.id, 10);
  const { name, email } = request.body;
  try {
    await pool.query('UPDATE authors SET name = $1, email = $2 WHERE id = $3', [name, email, id]);
    response.status(200).send(`Author modified with ID: ${id}`);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

const deleteAuthor = async (request, response) => {
  const id = parseInt(request.params.id, 10);
  try {
    await pool.query('DELETE FROM authors WHERE id = $1', [id]);
    response.status(200).send(`Author deleted with ID: ${id}`);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

// --- BOOKS ---

const getBooks = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM books ORDER BY id ASC');
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

const getBookById = async (request, response) => {
  const id = parseInt(request.params.id, 10);
  try {
    const results = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

const createBook = async (request, response) => {
  const { name, inventory, author_id, year_published, price } = request.body;
  try {
    const results = await pool.query(
      'INSERT INTO books (name, inventory, author_id, year_published, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, inventory, author_id, year_published, price]
    );
    response.status(201).send(`Book added with ID: ${results.rows[0].id}`);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

const updateBook = async (request, response) => {
  const id = parseInt(request.params.id, 10);
  const { name, inventory, author_id, year_published, price } = request.body;
  try {
    await pool.query(
      'UPDATE books SET name = $1, inventory = $2, author_id = $3, year_published = $4, price = $5 WHERE id = $6',
      [name, inventory, author_id, year_published, price, id]
    );
    response.status(200).send(`Book modified with ID: ${id}`);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

const deleteBook = async (request, response) => {
  const id = parseInt(request.params.id, 10);
  try {
    await pool.query('DELETE FROM books WHERE id = $1', [id]);
    response.status(200).send(`Book deleted with ID: ${id}`);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

// --- USERS ---

const getUsers = async (request, response) => {
  try {
    const results = await pool.query('SELECT id, name, email FROM users ORDER BY id ASC');
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

const getUserById = async (request, response) => {
  const id = request.params.id;
  try {
    const results = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [id]);
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

const createUser = async (request, response) => {
  const { id, name, email } = request.body;
  try {
    const results = await pool.query(
      'INSERT INTO users (id, name, email) VALUES ($1, $2, $3) RETURNING id, name, email',
      [id, name, email]
    );
    response.status(201).send(`User profile created with ID: ${results.rows[0].id}`);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error occurred.');
  }
};

const updateUser = async (request, response) => {
  const id = request.params.id;
  const { name, email } = request.body;
  try {
    await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [
      name,
      email,
      id,
    ]);
    response.status(200).send(`User modified with ID: ${id}`);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

const deleteUser = async (request, response) => {
  const id = request.params.id;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    response.status(200).send(`User deleted with ID: ${id}`);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

// --- ORDERS ---

const getOrders = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM orders ORDER BY id ASC');
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

const getOrderById = async (request, response) => {
  const id = parseInt(request.params.id, 10);
  try {
    const results = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

const createOrder = async (request, response) => {
  const { user_id, book_id, quantity } = request.body;
  try {
    const results = await pool.query(
      'INSERT INTO orders (user_id, book_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [user_id, book_id, quantity || 1]
    );
    response.status(201).send(`Order added with ID: ${results.rows[0].id}`);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

const updateOrder = async (request, response) => {
  const id = parseInt(request.params.id, 10);
  const { user_id, book_id, quantity } = request.body;
  try {
    await pool.query('UPDATE orders SET user_id = $1, book_id = $2, quantity = $3 WHERE id = $4', [
      user_id,
      book_id,
      quantity,
      id,
    ]);
    response.status(200).send(`Order modified with ID: ${id}`);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteOrder = async (request, response) => {
  const id = parseInt(request.params.id, 10);
  try {
    await pool.query('DELETE FROM orders WHERE id = $1', [id]);
    response.status(200).send(`Order deleted with ID: ${id}`);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

// --- CARTS & CHECKOUT ---

const getCartById = async (request, response) => {
  const userId = request.params.user_id;
  try {
    const results = await pool.query('SELECT * FROM carts WHERE user_id = $1', [userId]);
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

const createCart = async (request, response) => {
  const { user_id, book_id, quantity } = request.body;
  try {
    const results = await pool.query(
      'INSERT INTO carts (user_id, book_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [user_id, book_id, quantity]
    );
    response.status(201).send(`Cart added with ID: ${results.rows[0].id}`);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

const deleteCart = async (request, response) => {
  const id = parseInt(request.params.id, 10);
  try {
    await pool.query('DELETE FROM carts WHERE id = $1', [id]);
    response.status(200).send(`Cart item deleted with ID: ${id}`);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
};

const checkout = async (request, response) => {
  const userId = request.params.user_id;

  try {
    await pool.query(
      'INSERT INTO orders (user_id, book_id, quantity) SELECT user_id, book_id, quantity FROM carts WHERE user_id = $1',
      [userId]
    );

    await pool.query('DELETE FROM carts WHERE user_id = $1', [userId]);

    response.status(200).send('Thank you for visiting our shrine of horror!! You all be careful now...');
  } catch (error) {
    console.error('Checkout failed:', error);
    response.status(500).json({ error: 'Checkout process failed' });
  }
};

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  deleteCart,
  createCart,
  getCartById,
  checkout,
};