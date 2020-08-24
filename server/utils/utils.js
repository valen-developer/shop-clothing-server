const fs = require("fs");
const path = require("path");

let deleteFiles = (productName, productType, count) => {
  let uploadsPath = path.resolve("public/uploads/");
  for (let index = 0; index < count; index++) {
    fs.unlink(
      `${uploadsPath}/${productName}flag${index + 1}.${productType}.jpg`,
      (err) => {
        console.log(err);
      }
    );
  }
};

module.exports = { deleteFiles };
