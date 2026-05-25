const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Только JPEG, PNG или WEBP"), false);
  }
};


const maxSize = (process.env.MAX_FILE_SIZE_MB || 5) * 1024 * 1024;

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSize },
});
