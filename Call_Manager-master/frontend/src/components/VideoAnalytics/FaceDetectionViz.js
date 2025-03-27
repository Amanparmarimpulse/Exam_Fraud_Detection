import React, { useState, useMemo } from 'react';
import BaseVisualization from './BaseVisualization';

// Helper functions
const nullable_time_offset_to_seconds = (time_offset) => {
  if (!time_offset) return 0;
  const seconds = time_offset.seconds || 0;
  const nanos = time_offset.nanos ? time_offset.nanos / 1e9 : 0;
  return seconds + nanos;
};

// Face data processing classes
class FaceFrame {
  constructor(json_data, video_height, video_width) {
    this.time_offset = nullable_time_offset_to_seconds(json_data.time_offset);
    this.box = {
      'x': (json_data.normalized_bounding_box.left || 0) * video_width,
      'y': (json_data.normalized_bounding_box.top || 0) * video_height,
      'width': ((json_data.normalized_bounding_box.right || 0) - (json_data.normalized_bounding_box.left || 0)) * video_width,
      'height': ((json_data.normalized_bounding_box.bottom || 0) - (json_data.normalized_bounding_box.top || 0)) * video_height
    };
  }
}

class FaceTrack {
  constructor(json_data, video_height, video_width) {
    const track = json_data.tracks[0];
    this.start_time = nullable_time_offset_to_seconds(track.segment.start_time_offset);
    this.end_time = nullable_time_offset_to_seconds(track.segment.end_time_offset);
    this.confidence = track.confidence;
    this.thumbnail = json_data.thumbnail;
    this.attributes = {};

    if (track.attributes) {
      track.attributes.forEach(attribute => {
        this.attributes[attribute.name] = attribute.confidence;
      });
    }

    this.frames = [];
    track.timestamped_objects.forEach(frame => {
      const new_frame = new FaceFrame(frame, video_height, video_width);
      this.frames.push(new_frame);
    });
  }

  has_frames_for_time(seconds) {
    return ((this.start_time <= seconds) && (this.end_time >= seconds));
  }

  most_recent_real_bounding_box(seconds) {
    for (let index = 0; index < this.frames.length; index++) {
      if (this.frames[index].time_offset > seconds) {
        if (index > 0)
          return this.frames[index - 1].box;
        else
          return null;
      }
    }
    return null;
  }

  most_recent_interpolated_bounding_box(seconds) {
    for (let index = 0; index < this.frames.length; index++) {
      if (this.frames[index].time_offset > seconds) {
        if (index > 0) {
          if ((index === 1) || (index === this.frames.length - 1))
            return this.frames[index - 1].box;

          // create a new interpolated box 
          const start_box = this.frames[index - 1];
          const end_box = this.frames[index];
          const time_delt_ratio = (seconds - start_box.time_offset) / (end_box.time_offset - start_box.time_offset);

          const interpolated_box = {
            'x': start_box.box.x + (end_box.box.x - start_box.box.x) * time_delt_ratio,
            'y': start_box.box.y + (end_box.box.y - start_box.box.y) * time_delt_ratio,
            'width': start_box.box.width + (end_box.box.width - start_box.box.width) * time_delt_ratio,
            'height': start_box.box.height + (end_box.box.height - start_box.box.height) * time_delt_ratio
          };
          return interpolated_box;
        } else
          return null;
      }
    }
    return null;
  }

  current_bounding_box(seconds, interpolate = true) {
    if (interpolate)
      return this.most_recent_interpolated_bounding_box(seconds);
    else
      return this.most_recent_real_bounding_box(seconds);
  }
}

// React component for bar chart
const BarChart = ({ label, percent }) => {
  const barStyle = {
    width: `${percent}%`,
    backgroundColor: 'var(--danger-color)',
    height: '8px',
    borderRadius: '4px'
  };

  return (
    <div className="bar-chart">
      <div className="bar-label">{label} - {parseInt(percent)}%</div>
      <div className="bar-container">
        <div className="bar" style={barStyle}></div>
      </div>
    </div>
  );
};

// Main face detection component
const FaceDetectionViz = ({ jsonData, videoInfo, onSegmentClicked, renderItem }) => {
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);

  // Extract face detection data
  const faceTracks = useMemo(() => {
    if (!jsonData.annotation_results) 
      return [];

    for (let index = 0; index < jsonData.annotation_results.length; index++) {
      if ('face_detection_annotations' in jsonData.annotation_results[index])
        return jsonData.annotation_results[index].face_detection_annotations;
    }
    return [];
  }, [jsonData]);

  // Process face tracks with confidence threshold
  const indexedFaceTracks = useMemo(() => {
    const indexed_tracks = [];

    if (!faceTracks)
      return [];

    faceTracks.forEach(element => {
      if (element.tracks[0].confidence > confidenceThreshold)
        indexed_tracks.push(new FaceTrack(element, videoInfo.height, videoInfo.width));
    });

    return indexed_tracks;
  }, [faceTracks, confidenceThreshold, videoInfo.height, videoInfo.width]);

  // Create timeline segments for faces
  const objectTrackSegments = useMemo(() => {
    const segments = { 'face': { 'segments': [], 'count': 0 } };

    indexedFaceTracks.forEach(object_tracks => {
      segments['face'].count++;

      let added = false;
      for (let index = 0; index < segments['face'].segments.length; index++) {
        const segment = segments['face'].segments[index];
        if (object_tracks.start_time < segment[1]) {
          segments['face'].segments[index][1] = Math.max(segments['face'].segments[index][1], object_tracks.end_time);
          added = true;
          break;
        }
      }

      if (!added)
        segments['face'].segments.push([object_tracks.start_time, object_tracks.end_time]);
    });

    return segments;
  }, [indexedFaceTracks]);

  // Style for timeline segments
  const getSegmentStyle = (segment) => {
    return {
      left: `${(segment[0] / videoInfo.length) * 100}%`,
      width: `${((segment[1] - segment[0]) / videoInfo.length) * 100}%`
    };
  };

  // Handle segment click
  const handleSegmentClick = (seconds) => {
    onSegmentClicked({ seconds });
  };

  // Render face items
  const renderFaceItems = () => {
    const items = indexedFaceTracks.map((face, index) => (
      <div key={index} className="face-item" onClick={() => handleSegmentClick(face.start_time)}>
        <div className="face-header">
          <div className="face-id">
            <span className="material-icons">face</span>
            Face {index + 1}
          </div>
          <div className="confidence-badge">
            {Math.round(face.confidence * 100)}%
          </div>
        </div>
        
        <div className="face-thumbnail">
          {face.thumbnail ? (
            <img alt="Face thumbnail" src={`data:image/png;base64, ${face.thumbnail}`} />
          ) : (
            <span className="material-icons">face</span>
          )}
        </div>
        
        <div className="face-attributes">
          {Object.entries(face.attributes).map(([key, value], attrIndex) => (
            <BarChart key={attrIndex} label={key.replace('_', ' ')} percent={value * 100} />
          ))}
        </div>
      </div>
    ));

    return renderItem ? renderItem(items) : items;
  };

  return (
    <BaseVisualization title="Face Detection">
      <div className="face-detection-container">
        <div className="confidence">
          <span>Confidence threshold</span>
          <input 
            type="range" 
            min="0.0" 
            max="1" 
            step="0.01" 
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
          />
          <span className="confidence-value">{confidenceThreshold}</span>
        </div>

        {faceTracks.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <span className="material-icons">sentiment_dissatisfied</span>
            </div>
            <h3>No Face Detection Data</h3>
            <p>There are no faces detected in this video, or the JSON data doesn't contain face detection results.</p>
          </div>
        )}

        {faceTracks.length > 0 && (
          <>
            <div className="face-count">
              <span className="material-icons">face</span>
              {indexedFaceTracks.length} faces detected
            </div>

            {Object.entries(objectTrackSegments).map(([key, segmentData]) => (
              <div className="segment-container" key={key}>
                <div className="label">{key} ({segmentData.count})</div>
                <div className="segment-timeline">
                  {segmentData.segments.map((segment, index) => (
                    <div 
                      className="segment" 
                      key={index}
                      style={getSegmentStyle(segment)} 
                      onClick={() => handleSegmentClick(segment[0])}
                    ></div>
                  ))}
                </div>
              </div>
            ))}

            <div className="face-detection-viz">
              <div className="face-list">
                {renderFaceItems()}
              </div>
            </div>
          </>
        )}
      </div>
    </BaseVisualization>
  );
};

export default FaceDetectionViz;