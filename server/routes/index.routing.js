const express = require('express');
const app = express();

app.use(require('./products.route'));




module.exports = app;