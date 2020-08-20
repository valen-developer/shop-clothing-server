const enviroment = require('./server/secret/env');
const express = require('express');
const app = express();

// Serve public folder
app.use(express.static(__dirname + '/public'));

// Routing
app.use(require('./server/routes/index.routing'));


app.listen(enviroment.port, ()=>{
    console.log('Escuchando en el puerto ' + enviroment.port);
});

module.exports = app;