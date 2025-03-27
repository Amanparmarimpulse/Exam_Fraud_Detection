import React, { useState, useEffect, useRef } from 'react';
import { getTranscriptApi } from '../api/api';
import CircularProgress from '@mui/material/CircularProgress';

function VideoAnalysis({ file, videoUrl }) {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    getAnalysis();
  }, [file]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        videoRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [videoRef.current]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      drawAnnotations();
    }
  };

  const getAnalysis = async () => {
    setLoading(true);
    try {
      const data = await getTranscriptApi(file);
      setAnalysisData(data);
    } catch (error) {
      console.error('Error getting video analysis:', error);
    }
    setLoading(false);
  };

  const drawAnnotations = () => {
    if (!canvasRef.current || !videoRef.current || !analysisData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    // Match canvas size to video
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw object tracking boxes
    if (analysisData.objects) {
      analysisData.objects.forEach(obj => {
        obj.frames.forEach(frame => {
          const timeOffset = parseFloat(frame.timeOffset);
          if (Math.abs(timeOffset - currentTime) < 0.1) {
            const box = frame.box;
            ctx.strokeStyle = '#00FF00';
            ctx.lineWidth = 2;
            ctx.strokeRect(
              box.left * canvas.width,
              box.top * canvas.height,
              box.width * canvas.width,
              box.height * canvas.height
            );
            
            // Draw label
            ctx.fillStyle = '#00FF00';
            ctx.font = '16px Arial';
            ctx.fillText(
              `${obj.entity} (${Math.round(obj.confidence * 100)}%)`,
              box.left * canvas.width,
              box.top * canvas.height - 5
            );
          }
        });
      });
    }

    // Draw face detection boxes
    if (analysisData.faces) {
      analysisData.faces.forEach(face => {
        face.tracks.forEach(track => {
          track.timestamps.forEach(timestamp => {
            const timeOffset = parseFloat(timestamp.timeOffset);
            if (Math.abs(timeOffset - currentTime) < 0.1) {
              const box = timestamp.box;
              ctx.strokeStyle = '#FF0000';
              ctx.lineWidth = 2;
              ctx.strokeRect(
                box.left * canvas.width,
                box.top * canvas.height,
                box.width * canvas.width,
                box.height * canvas.height
              );

              // Draw confidence
              ctx.fillStyle = '#FF0000';
              ctx.font = '16px Arial';
              ctx.fillText(
                `Face (${Math.round(track.confidence * 100)}%)`,
                box.left * canvas.width,
                box.top * canvas.height - 5
              );
            }
          });
        });
      });
    }
  };

  return (
    <div className="relative">
      {loading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <CircularProgress />
        </div>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full"
            controls
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              width: '100%',
              height: '100%'
            }}
          />
          
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Video Analysis Results</h3>
            
            {/* Objects Section */}
            <div className="mb-4">
              <h4 className="font-bold">Detected Objects:</h4>
              <ul className="list-disc pl-5">
                {analysisData?.objects?.map((obj, i) => (
                  <li key={i}>
                    {obj.entity} - Confidence: {Math.round(obj.confidence * 100)}%
                  </li>
                ))}
              </ul>
            </div>

            {/* Tab and window switching Section */}
            <div className="mb-4">
              <h4 className="font-bold">Detected Objects:</h4>
              <ul className="list-disc pl-5">
                {analysisData?.objects?.map((obj, i) => (
                  <li key={i}>
                    {obj.entity} - Confidence: {Math.round(obj.confidence * 100)}%
                  </li>
                ))}
              </ul>
            </div>

            {/* Faces Section */}
            <div className="mb-4">
              <h4 className="font-bold">Detected Faces:</h4>
              <ul className="list-disc pl-5">
                {analysisData?.faces?.map((face, i) => (
                  <li key={i}>
                    Face {i + 1} - Confidence: {Math.round(face.tracks[0]?.confidence * 100)}%
                  </li>
                ))}
              </ul>
            </div>

            {/* Labels Section */}
            <div className="mb-4">
              <h4 className="font-bold">Labels:</h4>
              <ul className="list-disc pl-5">
                {analysisData?.labels?.map((label, i) => (
                  <li key={i}>
                    {label.description} - Confidence: {Math.round(label.confidence * 100)}%
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoAnalysis; 