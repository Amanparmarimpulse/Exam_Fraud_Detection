// import React, { useState, useEffect } from 'react';
// import BaseVisualization from './BaseVisualization';

// /**
//  * Component to visualize face detection results from Video Intelligence API
//  */
// const FaceDetectionViz = ({ jsonData, videoInfo, onSegmentClicked }) => {
//   const [faceAnnotations, setFaceAnnotations] = useState([]);
  
//   useEffect(() => {
//     // Extract face detection annotations from the API response
//     if (jsonData && jsonData.annotation_results) {
//       const annotations = [];
      
//       jsonData.annotation_results.forEach(result => {
//         if (result.face_detection_annotations) {
//           annotations.push(...result.face_detection_annotations);
//         }
//       });
      
//       setFaceAnnotations(annotations);
//     }
//   }, [jsonData]);

//   const handleSegmentClick = (seconds) => {
//     onSegmentClicked({ seconds });
//   };

//   // Calculate confidence color (green for high, red for low)
//   const getConfidenceColor = (confidence) => {
//     // Convert confidence to a color from red to green
//     const red = Math.floor(255 * (1 - confidence));
//     const green = Math.floor(255 * confidence);
//     return `rgb(${red}, ${green}, 0)`;
//   };

//   // Render tracks for each face
//   const renderFaceTracks = () => {
//     if (faceAnnotations.length === 0) {
//       return <p>No face detection data available.</p>;
//     }
    
//     return faceAnnotations.map((face, faceIndex) => (
//       <div key={`face-${faceIndex}`} className="detection-item">
//         <h4>Face #{faceIndex + 1}</h4>
//         {face.tracks.map((track, trackIndex) => (
//           <div key={`track-${faceIndex}-${trackIndex}`}>
//             <div 
//               className="clickable-segment"
//               onClick={() => handleSegmentClick(track.segment.start_time_offset.seconds || 0)}
//             >
//               <span className="timestamp">
//                 {track.segment.start_time_offset.seconds || 0}s
//               </span> to <span className="timestamp">
//                 {track.segment.end_time_offset.seconds || 0}s
//               </span>
//               {' '}- Confidence: {(track.confidence * 100).toFixed(1)}%
//               <div 
//                 className="confidence-bar" 
//                 style={{ 
//                   width: `${track.confidence * 100}%`,
//                   backgroundColor: getConfidenceColor(track.confidence)
//                 }}
//               />
//             </div>
//             <div>
//               {track.timestamped_objects && track.timestamped_objects.length > 0 && (
//                 <div>
//                   <small>
//                     Detected in {track.timestamped_objects.length} frames
//                     {track.timestamped_objects[0].attributes && (
//                       <span> with attributes: {
//                         track.timestamped_objects[0].attributes
//                           .map(attr => `${attr.name} (${(attr.confidence * 100).toFixed(0)}%)`)
//                           .join(', ')
//                       }</span>
//                     )}
//                   </small>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     ));
//   };

//   return (
//     <BaseVisualization title="Face Detection">
//       {renderFaceTracks()}
//     </BaseVisualization>
//   );
// };

// export default FaceDetectionViz; 