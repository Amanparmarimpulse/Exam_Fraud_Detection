// const debug = require('debug')('firestore-snippets-node');
// const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
// const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');



// // [START firestore_setup_client_create]
// const admin = require('firebase-admin');

// initializeApp({
//     // The `projectId` parameter is optional and represents which project the
//     // client will act on behalf of. If not supplied, it falls back to the default
//     // project inferred from the environment.
//     projectId: 'demo1212-606bb',
// });
// const db = getFirestore();
// // [END firestore_setup_client_create]

// module.exports = {db}

const Firestore = require('@google-cloud/firestore');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '../../serviceAccount.json');

const db = new Firestore({
  projectId: 'exam-fraud-detection',
  keyFilename: serviceAccountPath,
});

module.exports = {db}
