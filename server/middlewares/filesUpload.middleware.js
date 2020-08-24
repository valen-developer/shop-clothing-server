let filesUpload = (req, resp, next) => {
  const body = req.body;

  if (req.files) {
    try {
      // Check number of files and upload
      let i = 1;
      const fileArray = Array.from(req.files.file);
      if (fileArray.length >= 1) {
        fileArray.forEach((file) => {
          file.mv(
            `public/uploads/${body.name}flag${i}.${body.type}.jpg`,
            (err) => {
              console.log(err);
            }
          );
          i++;
        });
      } else {
        req.files.file.mv(
          `public/uploads/${body.name}flag1.${body.type}.jpg`,
          (err) => {
            console.log(err);
          }
        );
      }

      next();
    } catch (e) {
      console.log(e);
      resp.status(400).json({
        ok: false,
        error: "Archivo no subido",
      });
    }
  } else {
    console.log("No hay arcivos");
    next();
  }
};

module.exports = filesUpload;
