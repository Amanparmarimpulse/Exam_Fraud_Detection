const express = require('express')
const router = express.Router()
const {getFS, sampleAdd , upload, transcript, uploadViaURL, getSignedUrlApi} = require('../controllers/testController')
const {multerMiddleware , bucket} = require('../middleware/gcp/cloudstorage')
const { analyzeVideoTranscript } = require('../middleware/gcp/cloudVideoIntelligence');

const multer = require('multer');
const loc = multer({ dest: 'uploads/' });
router.get("/" , (req , res) => {
    res.send("This api is reserved for Call Transcript Testing")
})

router.get("/firestore" , getFS  )
router.post("/firestore/sampleadd" , sampleAdd)

router.post("/storage/upload-via-url" , uploadViaURL)
router.post("/storage/upload" , multerMiddleware, (req, res) => {
    const file = req.file;

  
    if (!file) {
      res.status(400).send('No file uploaded.');
      return;
    }
  
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
  
    blobStream.on('error', (err) => {
      console.error(err);
      res.status(500).send('Error uploading file.');
    });
  
    blobStream.on('finish', () => {
      res.status(200).send('File uploaded successfully.');
    });
  
  blobStream.end(file.buffer)
})



router.post("/video/transcript" , transcript);

router.post("/storage/get-signed-url" , getSignedUrlApi)

module.exports = router