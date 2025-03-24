/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// const gcsUri = 'GCS URI of the video to analyze, e.g. gs://my-bucket/my-video.mp4';

// Google Cloud Video Intelligence - Face Detection Module
const videoIntelligence = require('@google-cloud/video-intelligence');

// Initialize the client with your project ID and credentials
const client = new videoIntelligence.VideoIntelligenceServiceClient({
  projectId: 'safe-online-exam',
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || 
    'https://storage.cloud.google.com/recorded_video_analysis/Analysing_videos/safe-online-exam-4ce1b922b274.json',
});

// Define the GCS URI for your video
// Convert from HTTPS URL format to GCS URI format
const gcsUri = 'gs://recorded_video_analysis/Analysing_videos/1st.mp4';

/**
 * Detects faces in a video stored in Google Cloud Storage
 * @param {string} gcsUri - The GCS URI of the video (gs://bucket-name/file-name)
 * @returns {Promise<Object>} - Processed face detection results
 */
async function detectFacesGCS(gcsUri) {
  try {
    console.log(`Starting face detection for video: ${gcsUri}`);
    
    // Configure the request for face detection
    const request = {
      inputUri: gcsUri,
      features: ['FACE_DETECTION'],
      videoContext: {
        faceDetectionConfig: {
          includeBoundingBoxes: true,
          includeAttributes: true,
        },
      },
    };
    
    // Send the request to Google Cloud
    console.log('Sending face detection request to Google Cloud');
    const [operation] = await client.annotateVideo(request);
    
    // Wait for operation to complete
    console.log('Waiting for face detection to complete...');
    const [operationResult] = await operation.promise();
    
    // Extract and process face detection results
    const annotationResults = operationResult.annotationResults[0];
    const faceDetectionResults = annotationResults.faceDetectionAnnotations || [];
    
    // Process the results into a more usable format
    return processFaceResults(faceDetectionResults);
  } catch (error) {
    console.error('Error detecting faces:', error);
    throw new Error(`Face detection failed: ${error.message}`);
  }
}

/**
 * Process raw face detection results into a more usable format
 * @param {Array} faceAnnotations - Raw face annotation results from Google API
 * @returns {Object} - Processed face detection results
 */
function processFaceResults(faceAnnotations) {
  try {
    // If no faces detected, return early
    if (!faceAnnotations || faceAnnotations.length === 0) {
      return { faceCount: 0, faces: [], summary: [] };
    }
    
    // Process each face detected in the video
    const faces = faceAnnotations.map((annotation, faceIndex) => {
      const tracks = annotation.tracks.map(track => {
        // Process each timestamp when the face appears
        const timestamps = track.timestampedObjects.map(obj => {
          // Extract facial attributes if available
          const attributes = {};
          if (obj.attributes) {
            obj.attributes.forEach(attr => {
              attributes[attr.name] = attr.confidence;
            });
          }
          
          // Return formatted timestamp data with bounding box
          return {
            timeOffset: `${obj.timeOffset.seconds || 0}.${(obj.timeOffset.nanos || 0) / 1000000}`,
            box: {
              top: obj.normalizedBoundingBox.top || 0,
              left: obj.normalizedBoundingBox.left || 0,
              width: obj.normalizedBoundingBox.width || 0,
              height: obj.normalizedBoundingBox.height || 0
            },
            attributes
          };
        });
        
        // Return track data with segment info
        return {
          segment: {
            startTime: `${track.segment.startTimeOffset.seconds || 0}.${(track.segment.startTimeOffset.nanos || 0) / 1000000}`,
            endTime: `${track.segment.endTimeOffset.seconds || 0}.${(track.segment.endTimeOffset.nanos || 0) / 1000000}`
          },
          confidence: track.confidence,
          timestamps
        };
      });
      
      return {
        faceId: faceIndex + 1,
        tracks
      };
    });
    
    // Generate summary statistics for each face
    const summary = faces.map(face => {
      // Flatten all timestamps for this face
      const allTimestamps = face.tracks.reduce((acc, track) => {
        return acc.concat(track.timestamps);
      }, []);
      
      // Calculate appearance times
      const firstTimestamp = allTimestamps.length > 0 ? 
        parseFloat(allTimestamps[0].timeOffset) : 0;
      
      const lastTimestamp = allTimestamps.length > 0 ? 
        parseFloat(allTimestamps[allTimestamps.length - 1].timeOffset) : 0;
      
      // Check for smile detection
      const hasSmileData = allTimestamps.some(ts => 
        ts.attributes && ts.attributes.hasOwnProperty('smiling')
      );
      
      // Calculate smiling percentage if available
      let smilingPercentage = 0;
      let smilingCount = 0;
      
      if (hasSmileData) {
        const smilingFrames = allTimestamps.filter(ts => 
          ts.attributes && ts.attributes.smiling > 0.7
        );
        smilingCount = smilingFrames.length;
        smilingPercentage = (smilingCount / allTimestamps.length) * 100;
      }
      
      // Calculate average confidence
      const avgConfidence = face.tracks.reduce((sum, track) => sum + track.confidence, 0) / 
        (face.tracks.length || 1);
      
      return {
        faceId: face.faceId,
        firstAppearance: firstTimestamp,
        lastAppearance: lastTimestamp,
        duration: lastTimestamp - firstTimestamp,
        avgConfidence,
        framesCount: allTimestamps.length,
        tracksCount: face.tracks.length,
        hasSmileData,
        smilingPercentage: hasSmileData ? smilingPercentage.toFixed(1) : 'N/A',
        smilingFramesCount: smilingCount
      };
    });
    
    // Return complete results
    return {
      faceCount: faces.length,
      faces,
      summary
    };
  } catch (error) {
    console.error('Error processing face results:', error);
    return { error: 'Failed to process face detection results' };
  }
}

/**
 * Example usage function that demonstrates how to call the face detection
 * @param {string} gcsUri - GCS URI of the video to analyze
 */
async function detectFacesExample(gcsUri) {
  try {
    console.log(`Analyzing video for faces: ${gcsUri}`);
    const results = await detectFacesGCS(gcsUri);
    
    console.log(`Detected ${results.faceCount} faces in the video`);
    
    // Log summary for each face
    results.summary.forEach(face => {
      console.log(`Face ${face.faceId}:`);
      console.log(`  Appears from ${face.firstAppearance}s to ${face.lastAppearance}s (duration: ${face.duration.toFixed(2)}s)`);
      console.log(`  Average confidence: ${(face.avgConfidence * 100).toFixed(1)}%`);
      console.log(`  Detected in ${face.framesCount} frames across ${face.tracksCount} tracks`);
      
      if (face.hasSmileData) {
        console.log(`  Smiling: ${face.smilingPercentage}% of the time (${face.smilingFramesCount} frames)`);
      }
    });
    
    return results;
  } catch (error) {
    console.error('Face detection example failed:', error);
    throw error;
  }
}

// Export functions for use in API routes
module.exports = {
  detectFacesGCS,
  detectFacesExample
};