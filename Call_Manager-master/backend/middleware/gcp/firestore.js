
const Firestore = require('@google-cloud/firestore');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '../../serviceAccount.json');

const db = new Firestore({
  projectId: 'exam-fraud-detection',
  keyFilename: serviceAccountPath,
});

module.exports = {db}
