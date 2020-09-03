const express = require('express');
const app = express();

app.use(require('./products.route'));
app.use(require('./sizes.route'));
app.use(require('./images.route'));


app.use(require('./users.route'));


app.use(require('./buys.route'));
app.use(require('./payments.route'));




module.exports = app;