const express = require("express");
const app = express();

const { getSizesByID } = require('../database/db.sizes')


app.get('/api/sizes', async (req, resp)=>{

    const params = req.query;
    const id = params.id;


    const data = await getSizesByID(id);
    console.log(data);
     resp.json({
        ok: true, 
        data
     });


});


module.exports = app;