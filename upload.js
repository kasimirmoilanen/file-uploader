const express = require('express');
const multer = require('multer');
const path = require('path');
const helpers = require('./helpers')

const app = express();
const port = process.env.PORT || 8000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})


app.use(express.static(__dirname + '/public'));

app.post('/upload-profile-pic', (req, res) => {
  let upload = multer ({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');

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

    res.send(`You have uploaded image: <hr/><img src="${req.file.path}" 
              width="500 <hr /><a href="./">Upload another image</a>"`)
  });
});

app.use('/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html');
});


app.listen(port, () => console.log(`Listening on ${port}. . .`))

