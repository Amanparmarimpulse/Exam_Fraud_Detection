import React, { useState, useEffect } from 'react';
import './VideoAnalyticsViz.css';

/**
 * Component to visualize text detection results from Video Intelligence API
 */
const TextDetectionViz = ({ jsonData, videoInfo, onSegmentClicked }) => {
  const [textAnnotations, setTextAnnotations] = useState([]);
  const [filteredTexts, setFilteredTexts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Extract text annotations from the jsonData
    if (jsonData && jsonData.annotation_results) {
      const allTextAnnotations = [];
      
      jsonData.annotation_results.forEach(result => {
        if (result.text_annotations) {
          result.text_annotations.forEach(textAnnotation => {
            // Process each text annotation
            if (textAnnotation.segments && textAnnotation.segments.length > 0) {
              textAnnotation.segments.forEach(segment => {
                if (segment.frames && segment.frames.length > 0) {
                  segment.frames.forEach(frame => {
                    allTextAnnotations.push({
                      text: textAnnotation.text || 'Unknown Text',
                      confidence: textAnnotation.confidence || 0,
                      timeOffset: frame.time_offset,
                      boundingBox: frame.rotated_bounding_box || 
                                  { vertices: frame.normalized_bounding_box ? 
                                    [
                                      { x: frame.normalized_bounding_box.left || 0, y: frame.normalized_bounding_box.top || 0 },
                                      { x: (frame.normalized_bounding_box.left || 0) + (frame.normalized_bounding_box.width || 0), y: frame.normalized_bounding_box.top || 0 },
                                      { x: (frame.normalized_bounding_box.left || 0) + (frame.normalized_bounding_box.width || 0), y: (frame.normalized_bounding_box.top || 0) + (frame.normalized_bounding_box.height || 0) },
                                      { x: frame.normalized_bounding_box.left || 0, y: (frame.normalized_bounding_box.top || 0) + (frame.normalized_bounding_box.height || 0) }
                                    ] : []
                                  }
                    });
                  });
                }
              });
            }
          });
        }
      });
      
      // Sort by time
      allTextAnnotations.sort((a, b) => {
        const timeA = timeOffsetToSeconds(a.timeOffset);
        const timeB = timeOffsetToSeconds(b.timeOffset);
        return timeA - timeB;
      });
      
      setTextAnnotations(allTextAnnotations);
      setFilteredTexts(allTextAnnotations);
    }
    
    setIsLoading(false);
  }, [jsonData]);

  // Filter text annotations when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTexts(textAnnotations);
    } else {
      const filtered = textAnnotations.filter(textAnnotation => 
        textAnnotation.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTexts(filtered);
    }
  }, [searchQuery, textAnnotations]);

  // Helper function to convert time_offset to seconds
  const timeOffsetToSeconds = (timeOffset) => {
    if (!timeOffset) return 0;
    
    const seconds = timeOffset.seconds || 0;
    const nanos = timeOffset.nanos ? timeOffset.nanos / 1e9 : 0;
    return seconds + nanos;
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  // Jump to the time when a text item is clicked
  const handleTextClick = (timeOffset) => {
    onSegmentClicked({ seconds: timeOffsetToSeconds(timeOffset) });
  };

  // Calculate confidence color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return '#4CAF50'; // Green for high confidence
    if (confidence >= 0.5) return '#FFC107'; // Yellow for medium confidence
    return '#F44336'; // Red for low confidence
  };

  // Render confidence badge
  const renderConfidenceBadge = (confidence) => {
    return (
      <div 
        className="confidence-badge" 
        style={{ backgroundColor: getConfidenceColor(confidence) }}
      >
        {Math.round(confidence * 100)}%
      </div>
    );
  };

  // Render bounding box preview
  const renderBoundingBoxPreview = (boundingBox) => {
    if (!boundingBox.vertices || boundingBox.vertices.length < 4) return null;
    
    // Create a mini canvas representation of the bounding box
    const width = 40;
    const height = 30;
    
    return (
      <div className="bounding-box-preview">
        <svg width={width} height={height} viewBox="0 0 1 1">
          <polygon 
            points={boundingBox.vertices.map(v => `${v.x},${v.y}`).join(' ')}
            fill="rgba(66, 133, 244, 0.3)"
            stroke="#4285F4"
            strokeWidth="0.01"
          />
        </svg>
      </div>
    );
  };

  if (isLoading) {
    return <div className="loading">Loading text annotations...</div>;
  }

  if (textAnnotations.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <span className="material-icons">text_format</span>
        </div>
        <h3>No Text Detected</h3>
        <p>No text was detected in this video or text detection was not included in the analysis.</p>
      </div>
    );
  }

  return (
    <div className="text-detection-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search detected text..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <span className="material-icons search-icon">search</span>
        {searchQuery && (
          <span 
            className="material-icons clear-icon" 
            onClick={() => setSearchQuery('')}
          >
            clear
          </span>
        )}
      </div>
      
      <div className="text-count">
        {filteredTexts.length} text {filteredTexts.length === 1 ? 'instance' : 'instances'} detected
        {searchQuery && ` matching "${searchQuery}"`}
      </div>
      
      <div className="text-list">
        {filteredTexts.map((textItem, index) => (
          <div 
            key={`${textItem.text}-${index}`}
            className="text-item"
            onClick={() => handleTextClick(textItem.timeOffset)}
          >
            <div className="text-item-header">
              <div className="text-timestamp">
                {formatTime(timeOffsetToSeconds(textItem.timeOffset))}
              </div>
              {renderConfidenceBadge(textItem.confidence)}
            </div>
            
            <div className="text-content">
              <div className="text-preview">
                {renderBoundingBoxPreview(textItem.boundingBox)}
              </div>
              <div className="text-value">{textItem.text}</div>
            </div>
          </div>
        ))}
      </div>
      
      {textAnnotations.length > 0 && filteredTexts.length === 0 && (
        <div className="no-results">
          <span className="material-icons">search_off</span>
          <p>No text matches your search query.</p>
        </div>
      )}
    </div>
  );
};

export default TextDetectionViz; 