const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const filesUpload = require("../middlewares/filesUpload.middleware");

const fileUpload = require("express-fileupload");
app.use(fileUpload({ useTempFiles: false }));

const { deleteFiles } = require("../utils/utils");

const {
  saveImages,
  deleteAllById,
  countImages,
  getById,
} = require("../database/db.images");

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

app.get("/api/product", async (req, resp) => {
  const id = req.query.id;

  try {
    const data = await selectProduct("id", id);
    resp.json({
      ok: true,
      data,
    });
  } catch (e) {
    console.log(e);
    resp.json({
      ok: false,
      error: e,
    });
  }
});

app.get("/api/images", async (req, resp) => {
  const id = req.query.id;

  const data = await getById(id);
  console.log(data);

  resp.json({
    ok: true,
    images: data.data,
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

app.post("/api/products", filesUpload, async (req, resp) => {
  const body = req.body;

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
    urlimage: `uploads/${body.name}flag1.${body.type}.jpg`,
  };

  let data;
  try {
    data = await postProduct(newProduct);
    console.log(data);
  } catch (e) {
    console.log(e);
  }
  const productID = data.data.insertId;
  for (let index = 0; index < body.fileLength; index++) {
    const dataImages = await saveImages(
      newProduct.name,
      productID,
      newProduct.type,
      index + 1
    );
  }

  if (data.ok) {
    return resp.json({
      ok: true,
      newProduct,
      data,
    });
  }

  return resp.json({
    ok: false,
    error: data.e,
  });
});

app.delete("/api/products", async (req, resp) => {
  const id = req.query.id;
  const productName = req.query.name;
  const productType = req.query.type;

  // Delete images
  let countImagesData = await countImages(id);
  countImagesData = countImagesData.data[0]["COUNT(product_id)"];
  deleteFiles(productName, productType, countImagesData);

  const dataImages = await deleteAllById(id);
  const data = await deleteProduct(id);

  if (data.data.affectedRows === 0 && dataImages.data.affectedRows === 0) {
    return resp.json({
      ok: false,
      error: "No hay ningun registro con ese id",
    });
  }

  resp.json(data);
});

// Update
app.put("/api/products", filesUpload, async (req, resp) => {
  const body = req.body;

  // Get path and name file
  let arrayToList = body.urlimage.split("/");
  let oldName = arrayToList[arrayToList.length - 1].split("flag")[0];
  let uploadsPath = path.resolve("public/uploads/");

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
    urlimage: `uploads/${body.name}flag1.${body.type}.jpg`,
  };

  const data = await updateProduct(product);

  let countImg;
  if (!req.files) {
    const countImageData = await countImages(product.id);
    countImg = countImageData.data[0]["COUNT(product_id)"];
  } else {
    countImg = body.fileLength;
  }

  // delete and save on images db
  deleteAllById(product.id).then(async (data) => {
    console.log(data);
    for (let index = 0; index < countImg; index++) {
      fs.rename(
        `${uploadsPath}/${oldName}flag${index + 1}.${body.type}.jpg`,
        `${uploadsPath}/${body.name}flag${index + 1}.${body.type}.jpg`,
        (err) => {
          console.log(err);
        }
      );
      const dataImages = await saveImages(
        product.name,
        product.id,
        product.type,
        index + 1
      );
    }
  });

  resp.json({
    data,
  });
});

module.exports = app;
