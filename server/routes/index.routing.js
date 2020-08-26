const express = require('express');
const app = express();

app.use(require('./products.route'));
app.use(require('./sizes.route'));
app.use(require('./images.route'));




module.exports = app;