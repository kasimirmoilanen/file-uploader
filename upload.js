const express = require('express');
const multer = require('multer');
const path = require('path');
const helpers = require('./helpers')

const app = express();
const port = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

const storage = multer.diskStorage({
  destination: 'uploads/',

  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})



app.post('/upload-image', (req, res) => {
  let upload = multer ({ storage: storage, fileFilter: helpers.imageFilter }).single('image-file');

  upload(req, res, (err) => {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    }
    else if (!req.file) {
      return res.send('Please select an image to upload.');
    }
    else if (err instanceof multer.MulterError) {
      return res.send(err);
    }
    else if (err) {
      return res.send(err);
    }

    res.send(`<link href="style.css" rel="stylesheet" type="text/css" media="all">
              <div class="row">
              <div class="main">
              You have uploaded image: <hr/><img src="/${req.file.path}" 
              width="500"> <hr/> <a href="./">Upload another image</a>
              </div></div>`)
  });
});

app.post('/upload-multiple-images', (req, res) => {
  let upload = multer ({ storage: storage, fileFilter: helpers.imageFilter }).array('multiple-images', 10);
  
  upload(req, res, (err) => {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    }
    /*else if (!req.file) {
      return res.send('Please select an image to upload.');
    }*/
    else if (err instanceof multer.MulterError) {
      return res.send(err);
    }
    else if (err) {
      return res.send(err);
    }

    let result = "You have uploaded these images: <hr/>";
    const files = req.files;
    let index, len;

    for (index = 0, len = files.length; index < len; ++index) {
      result += `<img src="${files[index].path}" width="300" style="margin-right: 20px;">`
    }
    result += '<hr/><a href="./">Upload more images</a>';
    res.send(result);
  });
});


app.listen(port, () => console.log(`Listening on ${port}. . .`))

