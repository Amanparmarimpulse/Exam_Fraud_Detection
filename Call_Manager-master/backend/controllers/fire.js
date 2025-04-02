require('dotenv').config();

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeWiflNdWpLaXrbrEBMb1jovUSR1I7RzA",
  authDomain: "exam-fraud-detection.firebaseapp.com",
  projectId: "exam-fraud-detection",
  storageBucket: "exam-fraud-detection.appspot.com",
  messagingSenderId: "1018610670162",
  appId: "1:1018610670162:web:10c6586457928d7e8f5d8b",
  measurementId: "G-H078F2YWM0"
};

// Enable Google authentication in Firebase
console.log("Firebase config loaded - make sure to enable Google authentication in Firebase console");

module.exports = { firebaseConfig };