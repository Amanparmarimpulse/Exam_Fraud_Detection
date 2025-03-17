const { uploadFile, uploadUsingBlob, getSignedUrlMiddleWare } = require('../middleware/gcp/cloudstorage');
const { analyzeVideoTranscript } = require('../middleware/gcp/cloudVideoIntelligence');
const { db } = require('../middleware/gcp/firestore')

async function getFS(req, res) {
    try {
        console.log('db:', db)
        res.status(201).json({ message: "sucess" })
    } catch (error) {
        console.log(error)
    }
}

async function sampleAdd(req, res) {
    try {
        const docRef = db.collection('test')
            .doc('firestore')
            .collection('users')
            .doc('me');

        const x = await docRef.set({
            first: 'Sparsh',
            last: 'Jhariya',
            born: 2002
        });

        res.status(201).json(x)

    } catch (error) {
        console.log(error)
    }
}

async function uploadViaURL(req , res){
    try {
        const url = req.body.url;
        let x = await uploadUsingBlob(url)
        // console.log(url)
        console.log('loc-url'  , x)
        res.status(201).json(x)
    } catch (error) {
        console.log(error)
    }
}

async function getSignedUrlApi(req , res){
    try {
        const fileName = req.body.file
        const x = await getSignedUrlMiddleWare(fileName)
        res.status(200).json({url:x})
    } catch (error) {
        console.log(error)
    }
}



async function transcript(req , res){
    try {
        const file = req.body.file
        // const file = req.file.path;
        // console.log(file)
        const x = await analyzeVideoTranscript(file)
        // console.log("x" ,x)
        res.status(201).json({"success":true , "response":x})
    } catch (error) {
        console.log(error)
    }
}


module.exports = { getFS, sampleAdd  , transcript , uploadViaURL , getSignedUrlApi}