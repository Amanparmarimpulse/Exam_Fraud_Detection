import React, { useState, useEffect } from 'react';
import BaseVisualization from './BaseVisualization';

/**
 * Component to visualize label detection results from Video Intelligence API
 */
const LabelDetectionViz = ({ jsonData, videoInfo, onSegmentClicked }) => {
  const [labelAnnotations, setLabelAnnotations] = useState([]);
  const [shotLabelAnnotations, setShotLabelAnnotations] = useState([]);
  
  useEffect(() => {
    // Extract label detection annotations from the API response
    if (jsonData && jsonData.annotation_results) {
      const labels = [];
      const shotLabels = [];
      
      jsonData.annotation_results.forEach(result => {
        // Get regular video-level labels
        if (result.label_annotations) {
          labels.push(...result.label_annotations);
        }
        
        // Get shot-level labels
        if (result.shot_label_annotations) {
          shotLabels.push(...result.shot_label_annotations);
        }
      });
      
      setLabelAnnotations(labels);
      setShotLabelAnnotations(shotLabels);
    }
  }, [jsonData]);

  const handleSegmentClick = (seconds) => {
    onSegmentClicked({ seconds });
  };

  // Calculate confidence color (green for high, red for low)
  const getConfidenceColor = (confidence) => {
    // Convert confidence to a color from red to green
    const red = Math.floor(255 * (1 - confidence));
    const green = Math.floor(255 * confidence);
    return `rgb(${red}, ${green}, 0)`;
  };

  // Group labels by category
  const renderLabels = () => {
    if (labelAnnotations.length === 0 && shotLabelAnnotations.length === 0) {
      return <p>No label detection data available in this video.</p>;
    }
    
    return (
      <div>
        {renderVideoLabels()}
        {renderShotLabels()}
      </div>
    );
  };
  
  // Render video-level labels
  const renderVideoLabels = () => {
    if (labelAnnotations.length === 0) {
      return null;
    }
    
    return (
      <div className="label-section">
        <h4>Video Labels</h4>
        <p className="label-description">These labels apply to the entire video</p>
        <div className="label-grid">
          {labelAnnotations.map((label, index) => (
            <div key={`label-${index}`} className="label-item">
              <div className="label-header">
                <span className="label-name">{label.entity?.description || 'Unknown'}</span>
                <span className="label-confidence">
                  {(label.frames?.[0]?.confidence * 100 || label.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div 
                className="confidence-bar" 
                style={{ 
                  width: `${(label.frames?.[0]?.confidence || label.confidence) * 100}%`,
                  backgroundColor: getConfidenceColor(label.frames?.[0]?.confidence || label.confidence)
                }}
              />
              {label.categories && label.categories.length > 0 && (
                <div className="label-categories">
                  <small>
                    Categories: {label.categories.map(cat => cat.name || cat.description).join(', ')}
                  </small>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render shot-level labels
  const renderShotLabels = () => {
    if (shotLabelAnnotations.length === 0) {
      return null;
    }
    
    return (
      <div className="label-section">
        <h4>Shot Labels</h4>
        <p className="label-description">
          These labels apply to specific segments of the video. 
          Click on a segment to jump to that point.
        </p>
        
        {shotLabelAnnotations.map((label, labelIndex) => (
          <div key={`shot-label-${labelIndex}`} className="detection-item">
            <h5>{label.entity?.description || 'Unknown'}</h5>
            {label.segments && label.segments.map((segment, segmentIndex) => (
              <div 
                key={`segment-${labelIndex}-${segmentIndex}`}
                className="clickable-segment"
                onClick={() => handleSegmentClick(segment.segment?.start_time_offset?.seconds || 0)}
              >
                <span className="timestamp">
                  {segment.segment?.start_time_offset?.seconds || 0}s
                </span> to <span className="timestamp">
                  {segment.segment?.end_time_offset?.seconds || 0}s
                </span>
                {' '}- Confidence: {(segment.confidence * 100).toFixed(1)}%
                <div 
                  className="confidence-bar" 
                  style={{ 
                    width: `${segment.confidence * 100}%`,
                    backgroundColor: getConfidenceColor(segment.confidence)
                  }}
                />
              </div>
            ))}
            
            {label.frames && label.frames.length > 0 && (
              <div className="label-frames">
                <small>
                  Appears in {label.frames.length} frames
                  {label.frames.length > 0 && (
                    <span className="clickable-timestamp" onClick={() => handleSegmentClick(label.frames[0].time_offset?.seconds || 0)}>
                      {' '}(first at {label.frames[0].time_offset?.seconds || 0}s)
                    </span>
                  )}
                </small>
              </div>
            )}
            
            {label.categories && label.categories.length > 0 && (
              <div className="label-categories">
                <small>
                  Categories: {label.categories.map(cat => cat.name || cat.description).join(', ')}
                </small>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <BaseVisualization title="Label Detection">
      <div className="label-detection-container">
        <p>
          This visualization shows objects, scenes, and activities detected in the video.
          Click on any segment to jump to that point in the video.
        </p>
        {renderLabels()}
      </div>
    </BaseVisualization>
  );
};

export default LabelDetectionViz; 