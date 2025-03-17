const { db } = require('../middleware/gcp/firestore')
const { collection, getDocs } = require("firebase/firestore");

async function getFS( req , res) {
    try {
        console.log(db)
    } catch (error) {
        console.log(error)
    }
}

async function addUser(req , res){
    try {
        const id = req.body.username
        const docRef = db.collection('user')
            .doc(id);

        const x = await docRef.set(req.body);

        res.status(201).json(x)
    } catch (error) {
        console.log(error)
    }
}

async function getUserList(req , res){
    try {
        const citiesRef = db.collection('user');
        const snapshot = await citiesRef.get();
        let arr = []
        snapshot.forEach(doc => {
        // console.log(doc.id, '=>', doc.data());
        arr.push(doc.data())
        });
        res.status(201).json(arr);
    } catch (error) {
        console.log(error)
    }
}


module.exports = {addUser , getUserList}