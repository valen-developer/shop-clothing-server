const express = require("express");
const app = express();

const fileUpload = require("express-fileupload");
app.use(fileUpload({ useTempFiles: false }));

const {
  selectProduct,
  selectProductPriceMax,
  postProduct,
  getAll,
} = require("../database/db");

app.get("/api/products/all", async (req, resp) => {
  const data = await getAll();

  resp.json({
    ok: true,
    data,
  });
});

app.get("/api/products", async (req, resp) => {
  const queries = req.query;
  const type = queries.type;
  let data;
  if (queries.price) {
    data = await selectProductPriceMax(
      ["type", "price"],
      [type, queries.price]
    );
  } else {
    console.log("Entra por tipo");
    data = await selectProduct("type", type);
    console.log(data);
  }

  resp.json({
    ok: true,
    data: data.data,
    type,
  });
});

app.post("/api/products", async (req, resp) => {
  const body = req.body;
  console.log(body);

  const newProduct = {
    name: body.name,
    type: body.type,
    price: body.price,
    ofert_price: body.ofert_price ? body.ofert_price : 0,
    stock: body.stock,
    quantity: body.quantity,
    ofert: body.ofert ? body.ofert : false,
    size: body.size,
    size_cm: body.size_cm,
    urlimage: `uploads/${body.name}.${body.type}.jpg`,
  };

  try {
    // const file = req.files.file;
    // if (!file) {
    //   file.mv(`public/uploads/${newProduct.name}.${newProduct.type}.jpg`);
    // }
  } catch (e) {
    console.log(e);
    return resp.status(500).json({
      ok: false,
      err: {
        message: "file not upload",
        e,
      },
    });
  }

  const data = await postProduct(newProduct);

  if (data.ok) {
    return resp.json({
      ok: true,
      newProduct,
      data,
    });
  }

  console.log(data.e);
  return resp.json({
    ok: false,
    error: data.e,
  });
});

module.exports = app;
