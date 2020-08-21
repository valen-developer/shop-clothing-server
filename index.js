const enviroment = require("./server/secret/env");
const cors = require("cors");
const express = require("express");
const app = express();

// call from localhost
app.use(cors());

const bodyParse = require("body-parser");
app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());

// Serve public folder
app.use(express.static(__dirname + "/public"));

// Routing
app.use(require("./server/routes/index.routing"));

app.listen(enviroment.port, () => {
  console.log("Escuchando en el puerto " + enviroment.port);
});

module.exports = app;
