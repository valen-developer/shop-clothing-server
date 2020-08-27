const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const filesUpload = require("../middlewares/filesUpload.middleware");

const fileUpload = require("express-fileupload");
app.use(fileUpload({ useTempFiles: false }));

const { deleteFiles } = require("../utils/utils");

const {
  getSizesByID,
  postSizes,
  deleteSizesById,
} = require("../database/db.sizes");

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
const { json } = require("body-parser");

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
    const sizes = await getSizesByID(id);
    resp.json({
      ok: true,
      data,
      sizes,
    });
  } catch (e) {
    resp.json({
      ok: false,
      error: e,
    });
  }
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

  console.log(body);

  const newProduct = {
    name: body.name,
    type: body.type,
    price: body.price,
    ofert_price: body.ofert_price !== null ? body.ofert_price : 0,
    stock: body.stock ? body.stock : true,
    ofert: body.ofert !== null ? body.ofert : false,
    sizes: JSON.parse(body.sizes),
    urlimage: `uploads/${body.name}flag1.${body.type}.jpg`,
  };
  let data = await postProduct(newProduct);

  const productID = data.data.insertId;
  newProduct.sizes.forEach((size) => {
    postSizes(size.size, size.quantity, productID);
  });

  // save on images DB
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
    stock: body.stock ? body.stock : true,
    ofert: body.ofert ? body.ofert : false,
    sizes: JSON.parse(body.sizes),
    urlimage: `uploads/${body.name}flag1.${body.type}.jpg`,
  };
  //delete sizes
  deleteSizesById(product.id);

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
    for (let index = 0; index < countImg; index++) {
      fs.rename(
        `${uploadsPath}/${oldName}flag${index + 1}.${body.type}.jpg`,
        `${uploadsPath}/${body.name}flag${index + 1}.${body.type}.jpg`,
        (err) => {}
      );
      const dataImages = await saveImages(
        product.name,
        product.id,
        product.type,
        index + 1
      );
    }
  });

  // save new sizes
  product.sizes.forEach((size) => {
    postSizes(size.size, size.quantity, product.id);
  });

  resp.json({
    data,
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

  const dataSizes = await deleteSizesById(id);
  const dataImages = await deleteAllById(id);
  const data = await deleteProduct(id);

  if (
    data.data.affectedRows === 0 &&
    dataImages.data.affectedRows === 0 &&
    dataSizes.data.affectedRows === 0
  ) {
    return resp.json({
      ok: false,
      error: "No hay ningun registro con ese id",
    });
  }

  resp.json(data);
});

module.exports = app;
