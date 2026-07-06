const express = require('express');
const app = express();
const port = 7777;

app.get('/', (req, res) => {
    res.send('Hello Sidney!');
});

app.listen(port, () => {
    console.log(`Ghostface listening on port ${port}`);
});