const express = require("express");
const app = express();

const { getAllImages } = require('../database/db.images')


app.get("/api/images", async (req, resp) => {
    const id = req.query.id;
  
    const data = await getAllImages(id);
    console.log(data);
  
    resp.json({
      ok: true,
      images: data.data,
    });
  });



module.exports = app;