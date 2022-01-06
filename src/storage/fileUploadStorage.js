const multer = require('multer');

const fileUploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '--' + file.originalname);
  }
})

module.exports = fileUploadStorage;