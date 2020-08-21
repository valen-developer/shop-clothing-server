const express = require("express");
const app = express();

const fileUpload = require("express-fileupload");
app.use(fileUpload({ useTempFiles: false }));

const {
  selectProduct,
  selectProductPriceMax,
  postProduct,
  getAll,
  deleteProduct,
  updateProduct,
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
    data = await selectProduct("type", type);
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
    stock: body.stock ? body.stock : true,
    quantity: body.quantity,
    ofert: body.ofert ? body.ofert : false,
    size: body.size,
    size_cm: body.size_cm,
    urlimage: `uploads/${body.name}.${body.type}.jpg`,
  };

  try {
    const file = req.files.file;
    if (file) {
      file.mv(`public/uploads/${newProduct.name}.${newProduct.type}.jpg`);
    }
  } catch (e) {
    console.log(e);
    return resp.status(400).json({
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

app.delete("/api/products", async (req, resp) => {
  const id = req.query.id;

  console.log(req.query);

  const data = await deleteProduct(id);

  if (data.data.affectedRows === 0) {
    return resp.json({
      ok: false,
      error: "No hay ningun registro con ese id",
    });
  }

  resp.json(data);
});

app.put("/api/products", async (req, resp) => {
  const body = req.body;
  console.log("============= Buscamos file ============");
  console.log(req.files);

  console.log(body);

  if (req.files) {
    console.log("Entra en files");
    const file = req.files.file;
    file.mv(`public/uploads/${newProduct.name}.${newProduct.type}.jpg`);
  }

  const product = {
    id: body.id,
    name: body.name,
    type: body.type,
    price: body.price,
    ofert_price:
      body.ofert_price === null || body.ofert_price === undefined
        ? 0
        : body.ofert_price,
    stock: body.stok ? body.stock : true,
    ofert: body.ofert ? body.ofert : false,
    size: body.size,
    size_cm: body.size_cm,
    urlimage:
      req.files === null || req.files === undefined
        ? `uploads/${body.name}.${body.type}.jpg`
        : body.urlimage,
  };

  const data = await updateProduct(product);
  resp.json({
    data,
  });
});

module.exports = app;
