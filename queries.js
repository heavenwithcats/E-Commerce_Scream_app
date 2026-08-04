import 'dotenv/config'
import pg from 'pg'
import bcrypt from  'bcrypt'
import { request, response } from 'express'
const { Pool } = pg
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
})

pool.on('error', (err, client) => {
  console.error('Sorry!! Wrong answer, unexpected error on idle client', err)

})

const getAuthors = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM authors ORDER BY id ASC')
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}

const getAuthorById = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    const results = await pool.query('SELECT * FROM authors WHERE id = $1', [id])
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}

const createAuthor = async (request, response) => {
  const {name, email } = request.body

  try {
    const results = await pool.query(
      'INSERT INTO authors (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    )
    response.status(201).send(`Author added with ID: ${results.rows[0].id}`)
  } catch (error) {
    throw error
  }
}

const updateAuthor = async (request, response) => {
  const id = parseInt(request.params.id, 10)
  const { name, email } = request.body

  try {
    await pool.query('UPDATE authors SET name = $1, email = $2 WHERE id = $3', [
      name,
      email,
      id,
    ])
    response.status(200).send(`Author modified with ID: ${id}`)
  } catch (error) {
    throw error
  }
}

const deleteAuthor = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    await pool.query('DELETE FROM authors WHERE id = $1', [id])
    response.status(200).send(`Author deleted with ID: ${id}`)
  } catch (error) {
    throw error
  }
}
const getOrders = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM orders ORDER BY id ASC')
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}

const getOrderById = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    const results = await pool.query('SELECT * FROM orders WHERE id = $1', [id])
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}

const createOrder = async (request, response) => {
  const {user_id, book_id} = request.body

  try {
    const results = await pool.query(
      'INSERT INTO orders (user_id, book_id) VALUES ($1, $2) RETURNING *',
      [user_id, book_id]
    )
    response.status(201).send(`Order added with ID: ${results.rows[0].id}`)
  } catch (error) {
    throw error
  }
}

const updateOrder = async (request, response) => {
  const id = parseInt(request.params.id, 10)
  const { user_id, book_id } = request.body

  try {
    await pool.query('UPDATE orders SET user_id = $1, book_id = $2 WHERE id = $3', [
      user_id, book_id,
      id
    ])
    response.status(200).send(`Order modified with ID: ${id}`)
  } catch (error) {
   console.error(error);
  response.status(500).json({ error: "Internal Server Error" });
  }
}

const deleteOrder = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    await pool.query('DELETE FROM orders WHERE id = $1', [id])
    response.status(200).send(`Order deleted with ID: ${id}`)
  } catch (error) {
    throw error
  }
}




const getBooks = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM books ORDER BY id ASC')
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}

const getBookById = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    const results = await pool.query('SELECT * FROM books WHERE id = $1', [id])
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}

const createBook = async (request, response) => {
  const {name, inventory, author_id, year_published, price} = request.body

  try {
    const results = await pool.query(
      'INSERT INTO books (name,inventory, author_id, year_published, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, inventory, author_id, year_published, price]
    )
    response.status(201).send(`Book added with ID: ${results.rows[0].id}`)
  } catch (error) {
    throw error
  }
}

const updateBook = async (request, response) => {
  const id = parseInt(request.params.id, 10)
  const { name, inventory, author_id, year_published } = request.body

  try {
    await pool.query('UPDATE books SET name = $1, inventory = $2, author_id = $3, author_name = $4, year_published = $5 WHERE id = $6', [
      name,
      inventory, author_id, year_published,
      id,
    ])
    response.status(200).send(`Book modified with ID: ${id}`)
  } catch (error) {
    throw error
  }
}

const deleteBook = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    await pool.query('DELETE FROM books WHERE id = $1', [id])
    response.status(200).send(`Book deleted with ID: ${id}`)
  } catch (error) {
    throw error
  }
}


const getUsers = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM users ORDER BY id ASC')
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}

const getUserById = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    const results = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}



const updateUser = async (request, response) => {
  const id = parseInt(request.params.id, 10)
  const { name, email, password } = request.body

  try {
    await pool.query('UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4', [
      name,
      email,
      password,
      id,
    ]) 
    response.status(200).send(`User modified with ID: ${id}`)
  } catch (error) {
    throw error
  }
}

const createUser = async (request, response) => {
  console.log("--- DEBUG: createUser function started ---");
  const { name, email, password } = request.body;
  console.log("Data received:", { name, email, password });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully.");

    const results = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );
    console.log("Database insert successful:", results.rows[0]);
    
    response.status(201).send(`User added with ID: ${results.rows[0].id}`);
  } catch (error) {
    console.error("--- DEBUG: CRITICAL ERROR ---", error);
    response.status(500).send("Server error occurred.");
  }
}

const deleteUser = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id])
    response.status(200).send(`User deleted with ID: ${id}`)
  } catch (error) {
    throw error
  }
}

const loginUser = async (request, response) => {
 const { email, password } = request.body;

 try {
const results = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

if (results.rows.length === 0) {
return response.status(401).send('Wrong answer! You will have to create a new account, or DIE trying!!!')
}

const user = results.rows[0];

const isMatch = await bcrypt.compare(password, user.password);

if (isMatch) {
 response.status(500).send('Login successful!! Welcome to our stab inspired bookstore brought to you by Gail Weathers and Sidney Prescott');
} else {
 response.status(401).send('Invalid password');
}

 } catch (error) {
 response.status(500).send('Server error');
 }
};

const getCartById = async (request, response) => {
  console.log("DEBUG: The raw ID from URL is:", request.params.id); // Add this
  const id = parseInt(request.params.user_id, 10);
  console.log("DEBUG: The parsed ID is:", id);

  if (isNaN(id)) {
    return response.status(400).send("Invalid Cart ID!");
  }
  try {
    const results = await pool.query('SELECT * FROM carts WHERE id = $1', [id])
    response.status(200).json(results.rows)
  } catch (error) {
    throw error
  }
}

const createCart = async (request, response) => {
  const {user_id, book_id, quantity} = request.body

  try {
    const results = await pool.query(
      'INSERT INTO carts (user_id, book_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [user_id, book_id, quantity]
    )
    response.status(201).send(`Cart added with ID: ${results.rows[0].id}`)
  } catch (error) {
    throw error
  }
}



const deleteCart = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    await pool.query('DELETE FROM carts WHERE id = $1', [id])
    response.status(200).send(`Cart deleted with ID: ${id}`)
  } catch (error) {
    throw error
  }
}

const checkout = async (request, response) => {
    const userId = parseInt(request.params.user_id, 10);

    try {
await pool.query(
    'INSERT INTO orders (user_id, book_id, quantity) SELECT user_id, book_id, quantity FROM cart WHERE user_id = $1',
    [userId]
);

await pool.query(
    'DELETE FROM carts WHERE user_id = $1',
    [userId]
);

response.status(200).send('Thank you for visiting our shrine of horror!! You all be careful now...')
    } catch(error) {
   console.error("Checkout failed:", error);
    response.status(500).json({ error: "Checkout process failed" });
    }}

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  loginUser,
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
  checkout
}