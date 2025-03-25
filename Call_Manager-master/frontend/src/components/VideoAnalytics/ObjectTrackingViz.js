import React, { useState, useEffect } from 'react';
import BaseVisualization from './BaseVisualization';

/**
 * Component to visualize object tracking results from Video Intelligence API
 */
const ObjectTrackingViz = ({ jsonData, videoInfo, onSegmentClicked }) => {
  const [objectAnnotations, setObjectAnnotations] = useState([]);
  
  useEffect(() => {
    // Extract object tracking annotations from the API response
    if (jsonData && jsonData.annotation_results) {
      const annotations = [];
      
      jsonData.annotation_results.forEach(result => {
        if (result.object_annotations) {
          annotations.push(...result.object_annotations);
        }
      });
      
      setObjectAnnotations(annotations);
    }
  }, [jsonData]);

  const handleSegmentClick = (seconds) => {
    onSegmentClicked({ seconds });
  };

  // Group objects by entity
  const getGroupedObjects = () => {
    const groupedObjects = {};
    
    objectAnnotations.forEach(obj => {
      const entity = obj.entity.description || 'Unknown';
      if (!groupedObjects[entity]) {
        groupedObjects[entity] = [];
      }
      groupedObjects[entity].push(obj);
    });
    
    return groupedObjects;
  };

  // Render the detected objects grouped by entity
  const renderObjectGroups = () => {
    if (objectAnnotations.length === 0) {
      return <p>No object tracking data available.</p>;
    }
    
    const groupedObjects = getGroupedObjects();
    
    return Object.entries(groupedObjects).map(([entity, objects]) => (
      <div key={`entity-${entity}`} className="detection-item">
        <h4>{entity} ({objects.length})</h4>
        {objects.map((obj, index) => (
          <div key={`obj-${entity}-${index}`}>
            <div 
              className="clickable-segment"
              onClick={() => handleSegmentClick(obj.segment.start_time_offset.seconds || 0)}
            >
              <span className="timestamp">
                {obj.segment.start_time_offset.seconds || 0}s
              </span> to <span className="timestamp">
                {obj.segment.end_time_offset.seconds || 0}s
              </span>
              {' '}- Confidence: {(obj.confidence * 100).toFixed(1)}%
              <div 
                className="confidence-bar" 
                style={{ 
                  width: `${obj.confidence * 100}%` 
                }}
              />
            </div>
            {obj.frames && (
              <small>
                Tracked across {obj.frames.length} frames
              </small>
            )}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <BaseVisualization title="Object Tracking">
      {renderObjectGroups()}
    </BaseVisualization>
  );
};

export default ObjectTrackingViz; 