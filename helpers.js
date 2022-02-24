const imageFilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    req.fileValidationError = 'Only image files are allowed';
    return cb(new Error('Only image files are allowed'), false);
  }
  cb(null, true);
};
exports.imageFilter = imageFilter;
