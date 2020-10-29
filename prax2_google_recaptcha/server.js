const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index', {
    site_key: process.env.SITE_KEY,
  });
});

app.post('/register', (req, res) => {
  if (!req.body.captcha) {
    return res
      .status(400)
      .json({ success: false, message: 'Будь-ласка оберіть каптчу' });
  }

  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${res.body.captcha}&remoteip=${req.connection.remoteAddress}`;

  request(verifyUrl, (err, res, body) => {
    body = JSON.parse(body);

    if (!body.success) {
      return res.status(403).json({
        success: false,
        message: 'Вибачте, каптча не буда верифікована',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Каптча пройшла',
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
