//////////////////////////////////////////////////////////////////////////////////////
//    Author - Talib Hussain
//    Version - 1.0
//    Date - 12 November 2022
//    Revision - 1
//    Project - File uploader and downloader
//    File  - server.js
//    DESCRIPTION - This is server file to hold all routes which handles file showing, file uplaoding and file downloading
//////////////////////////////////////////////////////////////////////////////////////
const path = require("path");
const express = require("express");
var cors = require('cors')
const app = express(); // create express app
const { readdirSync } = require('fs')
const bodyParser = require("body-parser");
const multer  = require('multer')

// asdd middleware
app.use(express.static("build"));
app.use(cors())

// Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Home route to render html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Route to get all files from files folder
app.get("/download-files", (req, res) => {
  console.log('inside download files...')
  let files = []
  const testFolder = './build/files';
  readdirSync(testFolder).forEach(file => {
    files = [...files, file]
  });
  res.send({ 'files': files })
});
// Route to get all files from upload folder
app.get("/uploaded-files", (req, res) => {
  let files = []
  const testFolder = './build/upload';
  readdirSync(testFolder).forEach(file => {
    files = [...files, file]
  });
  res.send({ 'files': files })
});
// Route to get all files from files folder
app.get("/all-files", (req, res) => {
  let files = []
  const testFolder1 = './build/files';
  const testFolder2 = './build/upload';
  readdirSync(testFolder1).forEach(file => {
    files = [...files, file]
  });
  readdirSync(testFolder2).forEach(file => {
    files = [...files, file]
  });
  res.send({ 'files': files })
});

// Route to download specific file wich is sent in get url
app.get('/download', function (req, res) {
  let path = `./build/files/${req?.query?.fileName}`
  res.download(path)
});


// function to upload files in specific folder
const upload = multer({
  storage: multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,'./build/upload')
    },
    filename: function(req,file,cb){
      // const ext = file.mimetype.split("/")[1];
      cb(null,file.originalname)
      // cb(null,file.originalname+'.'+ext)
    }
  })
}).single('uploaded_file')

//route to upload file in upload folder
app.post('/upload',upload, function (req, res) {
  console.log('file uploaded')
res.redirect('/')
});

// Start express server on port 82
app.listen(82, () => {
  console.log("server started on port 82");
});