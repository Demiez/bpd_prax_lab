const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/register', (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
