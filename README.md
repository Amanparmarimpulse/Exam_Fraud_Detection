# Autonomous Online Exam Fraud Detection

## Description

This project presents a **secure and intelligent online examination system** powered by **Artificial Intelligence (AI)** and **Machine Learning (ML)**.

With the rapid rise of online education, maintaining **fairness, credibility, and integrity** in assessments has become critical. This system addresses these challenges by detecting **suspicious activities in real time** using **biometric verification**, **behavioral analysis**, and **video monitoring**.

It is specifically designed for **educational institutions** conducting **large-scale online examinations**, ensuring a **reliable and scalable solution** for modern digital assessments.

---


## Demo

🌐 **Live Project**
Explore the deployed application here:
**https://exam-fraud-detection-6i7f.vercel.app/**

---

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/repo-name.git
   ```

2. Navigate to the project directory

   ```bash
   cd repo-name
   ```

3. Install dependencies

   ```bash
   npm install
   ```

4. Run the application

   ```bash
   npm start
   ```

---

## Usage

* **User Authentication**
  Register/Login using Firebase authentication.

* **System Compatibility Check**
  Ensures the user’s system (camera, browser, permissions) is ready for monitoring.

* **Video Recording & Processing**
  Captures exam session video and sends it to **Google Cloud Video Intelligence API** for analysis.

* **AI-Based Analysis**
  The system processes recorded video to:

  * Detect **faces and multiple persons**
  * Identify **objects and labels** (unauthorized items)
  * Convert **speech to text** for audio monitoring

* **Browser Activity Monitoring**
  Tracks **tab and window switching** during the session.

* **Fraud Indicators**
  Flags suspicious activities based on:

  * Presence of multiple faces
  * Unauthorized objects
  * Tab switching behavior
  * Unusual audio patterns

⚠️⚠️ **Note:** This is a **modular implementation**, where each feature (video analysis, tab detection, etc.) is developed as **separate functional components**, rather than a fully integrated production system.

---


---

## Features

* Real-time fraud detection using AI/ML
* Face recognition and identity verification
* Keystroke dynamics analysis
* Object and person tracking via video
* Speech transcription for anomaly detection
* Tab switching detection
* Scalable for large exam environments

---

## Tech Stack / Built With

* Frontend: React, HTML, CSS
* Backend: Node.js
* Database: Firebase Firestore
* Authentication: Firebase Auth
* AI/ML Models:

  * CNN (Face Recognition)
  * LSTM (Movement Detection)
  * Keystroke Dynamics
* Cloud Services:

  * Google Cloud Video Intelligence API
  * Zoom SDK (Recording)

---

## Contributing

Contributions are welcome.

Steps:

1. Fork the repository
2. Create a new branch
3. Submit a pull request

---

## License

This project is licensed under the MIT License.

---

## Credits / Acknowledgments

This project was developed through the collaborative efforts of:

* **Devika Verma (UI22EC19)**
* **Aman Parmar (UI22EC07)**

### 🎓 Guidance & Mentorship

This work was carried out under the supervision of:

**Dr. Sudeep Sharma**
*Associate Professor, IIIT Surat*

---

We sincerely thank our mentor for their continuous guidance, support, and valuable insights throughout the development of this project.
