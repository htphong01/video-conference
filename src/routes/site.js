const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');

const multer  = require('multer')
const fileStorageUpload = require('../storage/fileUploadStorage')
const upload = multer({ storage: fileStorageUpload })

router.get('/', siteController.index);

router.post('/upload-file', upload.single('file'), siteController.uploadFile);

module.exports = router;
