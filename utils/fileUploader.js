const multer = require("multer");
const fs = require("fs");
const path = require("path");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderName = req.query.dir || "banner";

    const uploadDir = path.join(
      __dirname,
      `../public/uploads/${folderName}`
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

module.exports = {
  upload,
  uploadMultiple: upload.array("images", 10),
};
