const multer = require('multer');
const path = require('path');
const {
  UPLOAD_DIRECTORY,
  MAX_FILE_SIZE,
  ALLAWED_FILE_TYPES,
} = require('../config/config');

const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIRECTORY);
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(
      null,
      Date.now() + '_' + file.originalname.replace(extname, '' + extname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname);
  if (!ALLAWED_FILE_TYPES.includes(extname.substring(1))) {
    return cb(new Error('File type not allowed'), false);
  }
  cb(null, true);
};

const uploadUserImage = multer({
  storage: userStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

module.exports = uploadUserImage;
