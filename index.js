import express from 'express';
import * as db from './queries.js';
const app = express();
app.use(express.json());
const port = 7777;

app.get('/', (req, res) => {
    res.send('Hello Sidney!');
});

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/create', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.get('/authors', db.getAuthors)
app.get('/authors/:id', db.getAuthorById)
app.post('/authors', db.createAuthor)
app.put('/authors/:id', db.updateAuthor)
app.delete('/authors/:id', db.deleteAuthor)

app.get('/books', db.getBooks)
app.get('/books/:id', db.getBookById)
app.post('/books', db.createBook)
app.put('/books/:id', db.updateBook)
app.delete('/books/:id', db.deleteBook)

app.get('/orders', db.getOrders)
app.get('/orders/:id', db.getOrderById)
app.post('/orders', db.createOrder)
app.put('/orders/:id', db.updateOrder)
app.delete('/orders/:id', db.deleteOrder)

app.get('/cart/:user_id', db.getCartById)
app.post('/cart', db.createCart)
app.delete('/cart/:id', db.deleteCart)

app.post('/checkout/:user_id', db.checkout)

app.post('/login', db.loginUser)



app.listen(port, () => {
    console.log(`Ghostface listening on port ${port}`);
});