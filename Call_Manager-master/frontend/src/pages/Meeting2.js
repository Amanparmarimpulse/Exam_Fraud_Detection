import React, { useState, useEffect, useRef } from 'react';
import uuid from 'react-uuid';
import Header from '../components/Header'
import '../App.css';
import { useReactMediaRecorder } from "react-media-recorder";
import { uploadfileusingurl } from '../api/api';

function App() {
    // For screen recording functionality
    const { status, startRecording, stopRecording, mediaBlobUrl } =
        useReactMediaRecorder({ screen: true, audio: true });

    const videoRef = useRef(null);
  const [downloadUrl, setDownloadUrl] = useState("");
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // For URL navigation
    const [url, setUrl] = useState('');
    const [urlHistory, setUrlHistory] = useState([]);

    async function uploadVideo(path) {
        try {
            await uploadfileusingurl(path);
            setSuccessMessage('Video uploaded successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to upload video: ' + err.message);
            setTimeout(() => setError(''), 5000);
        }
    }
    
  const handleDownload = async () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    
        let name = uuid();
        let path = "/Users/sparshjhariya/Downloads/" + name + '.webm';
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
        
        setSuccessMessage('Video download started!');
        setTimeout(() => setSuccessMessage(''), 3000);

        await uploadVideo(path);
  };

  const handleStop = (blobUrl) => {
    setDownloadUrl(blobUrl);
  };

  useEffect(() => {
        if (status === "stopped" && mediaBlobUrl) {
            handleStop(mediaBlobUrl);
        }
    }, [status, mediaBlobUrl]);
    
    // Handle URL input change
    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };
    
    // Handle URL submission
    const handleUrlSubmit = (e) => {
        e.preventDefault();
        
        // Validate URL
        let formattedUrl = url;
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
            formattedUrl = 'https://' + url;
        }
        
        if (formattedUrl) {
            // Open URL in a new tab
            window.open(formattedUrl, '_blank');
            
            // Add to history
            setUrlHistory(prev => [...prev, formattedUrl]);
            
            // Clear input
            setUrl('');
            
            setSuccessMessage('Meeting opened in a new tab!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    // Calculate recording duration
    const [recordingTime, setRecordingTime] = useState(0);
    
    useEffect(() => {
        let interval;
        if (status === 'recording') {
            interval = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            setRecordingTime(0);
        }
        
        return () => clearInterval(interval);
    }, [status]);
    
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };
    
    const clearHistory = () => {
        setUrlHistory([]);
        setSuccessMessage('History cleared!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        
        <div className="App bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
            <Header />
            <main className="container mx-auto py-8 px-4 max-w-5xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Meeting Recorder</h1>
                    <p className="text-gray-600">Join meetings and record your screen with audio</p>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}
                
                {successMessage && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-sm" role="alert">
                        <p>{successMessage}</p>
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* URL Navigation Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <h2 className="text-xl font-bold text-gray-800">Join Meeting</h2>
                        </div>
                        
                        <form onSubmit={handleUrlSubmit} className="mb-4">
                            <div className="mb-4">
                                <label htmlFor="meetingUrl" className="block text-gray-700 text-sm font-bold mb-2">
                                    Meeting URL
                                </label>
                                <input 
                                    id="meetingUrl"
                                    type="text" 
                                    value={url} 
                                    onChange={handleUrlChange}
                                    placeholder="Paste Zoom or meeting URL here"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                                />
                                <p className="text-xs text-gray-500 mb-3">Paste a Zoom meeting URL and click Join to open it in a new tab</p>
                                <button 
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded font-medium transition-colors duration-300"
                                >
                                    Join Meeting
                                </button>
                            </div>
                        </form>
                        
                        {urlHistory.length > 0 && (
                            <div className="mt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-semibold text-gray-700">Recent Meetings:</h3>
                                    <button 
                                        onClick={clearHistory} 
                                        className="text-xs text-gray-500 hover:text-red-500"
                                    >
                                        Clear History
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {urlHistory.slice(-5).map((historyUrl, index) => (
                                        <button
                                            key={index}
                                            onClick={() => window.open(historyUrl, '_blank')}
                                            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full truncate max-w-xs border border-gray-200 transition-colors duration-200"
                                            title={historyUrl}
                                        >
                                            {new URL(historyUrl).hostname}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recording Controls Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <h2 className="text-xl font-bold text-gray-800">Recording Controls</h2>
                        </div>
                        
                        <div className="text-center mb-6">
                            {status === 'recording' ? (
                                <div className="bg-red-50 py-3 px-4 rounded-lg border border-red-100 mb-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="inline-block h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                                        <span className="font-semibold text-red-600">Recording</span>
                                        <span className="ml-2 text-gray-700 font-mono">{formatTime(recordingTime)}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 py-3 px-4 rounded-lg border border-gray-100 mb-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="inline-block h-3 w-3 bg-gray-300 rounded-full"></span>
                                        <span className="font-semibold text-gray-500">Ready to Record</span>
                </div>
                </div>
                            )}
                            
                            <div className="flex justify-center gap-3 mb-4">
                    {status === "recording" ? (
                                    <button 
                                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-full flex items-center justify-center gap-2 transition-colors duration-300 shadow-sm"
                                        onClick={stopRecording}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                                        </svg>
                                        Stop Recording
                                    </button>
                                ) : (
                                    <button 
                                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full flex items-center justify-center gap-2 transition-colors duration-300 shadow-sm"
                                        onClick={startRecording}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                        Start Recording
                                    </button>
                                )}
                            </div>
                            
                            <p className="text-xs text-gray-500 mb-2">Your screen and audio will be captured</p>
                        </div>
                        
                        {downloadUrl && (
                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-sm text-gray-700 mb-2">Recording Available</h3>
                                <button 
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full flex items-center justify-center gap-2 transition-colors duration-300 shadow-sm w-full mb-4"
                                    onClick={handleDownload}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Download Recording
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Video Playback Section */}
                {mediaBlobUrl && (
                    <div className="mt-8 bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Preview Recording
                        </h2>
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                            <video 
                                ref={videoRef} 
                                src={mediaBlobUrl} 
                                controls 
                                className="absolute inset-0 w-full h-full" 
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">You can download this recording using the button above</p>
                    </div>
                )}
                
                <footer className="mt-12 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Meeting Recorder. All rights reserved.</p>
                </footer>
            </main>
        </div>
    );
}

export default App;
