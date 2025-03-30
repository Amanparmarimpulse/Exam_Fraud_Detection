
const videoIntelligence = require('@google-cloud/video-intelligence');

// Initialize the client with your project ID and credentials
const client = new videoIntelligence.VideoIntelligenceServiceClient({
  projectId: 'safe-online-exam',
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || 
    'C:/Users/amanp/Downloads/Call_Manager-master/Call_Manager-master/backend/serviceAccount.json',
});


const gcsUri = 'gs://recorded_video_analysis/Analysing_videos/1st.mp4';


