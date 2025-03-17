const videoIntelligence = require('@google-cloud/video-intelligence');
const client = new videoIntelligence.VideoIntelligenceServiceClient({
    projectId: 'demo1212-606bb',
    keyFilename: '/Users/sparshjhariya/Desktop/TECHY/Internship/Tasks/Salesine/call-transcript/serviceAccount.json',
  });


  async function analyzeVideoTranscript(fileName) {
    const videoContext = {
      speechTranscriptionConfig: {
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
      },
      // Add face detection config
      faceDetectionConfig: {
        includeAttributes: true,
        includeBoundingBoxes: true,
      },
      // Add object tracking config
      objectTrackingConfig: {
        stationaryCamera: false
      }
    };
    console.log(fileName)
    const request = {
      inputUri: fileName,
      features: [
        'SPEECH_TRANSCRIPTION',
        'EXPLICIT_CONTENT_DETECTION',
        'LABEL_DETECTION',
        'SHOT_CHANGE_DETECTION',
        'LOGO_RECOGNITION',
        'TEXT_DETECTION',
        'OBJECT_TRACKING',
        'FACE_DETECTION'  // Add face detection
      ],
      videoContext: videoContext,
    };
  
    const [operation] = await client.annotateVideo(request);
    console.log('Waiting for operation to complete...');
    const [operationResult] = await operation.promise();

    // Process and structure the results
    const results = {
      speech: [],
      objects: [],
      faces: [],
      labels: [],
      text: [],
      logos: []
    };

    const annotations = operationResult.annotationResults[0];

    // Process speech transcriptions
    if (annotations.speechTranscriptions) {
      results.speech = annotations.speechTranscriptions.map(transcription => ({
        transcript: transcription.alternatives[0]?.transcript || '',
        confidence: transcription.alternatives[0]?.confidence || 0
      }));
    }

    // Process object tracking
    if (annotations.objectAnnotations) {
      results.objects = annotations.objectAnnotations.map(obj => ({
        entity: obj.entity.description,
        confidence: obj.confidence,
        frames: obj.frames.map(frame => ({
          timeOffset: `${frame.timeOffset.seconds || 0}.${frame.timeOffset.nanos || 0}`,
          box: frame.normalizedBoundingBox,
        }))
      }));
    }

    // Process face detection
    if (annotations.faceDetectionAnnotations) {
      results.faces = annotations.faceDetectionAnnotations.map(face => ({
        tracks: face.tracks.map(track => ({
          confidence: track.confidence,
          timestamps: track.timestampedObjects.map(obj => ({
            timeOffset: `${obj.timeOffset.seconds || 0}.${obj.timeOffset.nanos || 0}`,
            box: obj.normalizedBoundingBox,
            attributes: obj.attributes
          }))
        }))
      }));
    }

    // Process labels
    if (annotations.labelAnnotations) {
      results.labels = annotations.labelAnnotations.map(label => ({
        description: label.entity.description,
        confidence: label.confidence
      }));
    }

    // Process text detection
    if (annotations.textAnnotations) {
      results.text = annotations.textAnnotations.map(text => ({
        text: text.text,
        confidence: text.confidence,
        segments: text.segments
      }));
    }

    // Process logo detection
    if (annotations.logoRecognitionAnnotations) {
      results.logos = annotations.logoRecognitionAnnotations.map(logo => ({
        entity: logo.entity.description,
        confidence: logo.confidence,
        segments: logo.segments
      }));
    }

    return results;
  }
  
 module.exports  = { analyzeVideoTranscript}