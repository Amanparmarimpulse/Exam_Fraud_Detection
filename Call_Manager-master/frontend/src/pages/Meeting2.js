import React, { useState, useEffect , useRef } from 'react';
import uuid from 'react-uuid';
import '../App.css';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';

import { useReactMediaRecorder } from "react-media-recorder";
import { uploadfileusingurl } from '../api/api';
function App() {
    
    const { status, startRecording, stopRecording, mediaBlobUrl } =
        useReactMediaRecorder({ screen: true, audio: true });

    // console.log(mediaBlobUrl, status)
    const client = ZoomMtgEmbedded.createClient();

   

    // useEffect(() => {
    //     if (status == 'stopped') {

    //     }
    // }, [status])


    var authEndpoint = 'http://localhost:5050/api/zoom/signature'
    var sdkKey = 'rEQzQoyoTiWNtTfZgaJUOA'
    //   var meetingNumber = '89708934194'
    //   var passWord = 'UGhht5'
    //   var role = 0
    //   var userName = 'React'
    var userEmail = ''
    var registrantToken = ''
    var zakToken = ''
    const [meetingNumber, setMeetingNumber] = useState('')
    const [passWord, setPassWord] = useState('')
    const [role, setRole] = useState(0)
    const [userName, setUserName] = useState('User')
    const [error, setError] = useState('')

    // Format meeting number to remove spaces
    const formatMeetingNumber = (number) => {
        return number.replace(/\s+/g, '');
    };

    function getSignature(e) {
        e.preventDefault();
        setError(''); // Clear any previous errors
        
        if (!meetingNumber || !passWord || !userName) {
            setError('Please fill in all fields');
            return;
        }

        const formattedMeetingNumber = formatMeetingNumber(meetingNumber);
        console.log('Joining meeting:', { meetingNumber: formattedMeetingNumber, passWord, userName });

        fetch(authEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                meetingNumber: formattedMeetingNumber,
                role: role
            })
        }).then(res => res.json())
            .then(response => {
                if (response.error) {
                    throw new Error(response.error);
                }
                console.log('Got signature:', response);
                startMeeting(response.signature)
            }).catch(error => {
                console.error('Error getting signature:', error);
                setError('Failed to get meeting signature. Please check your meeting details.');
            })
    }

    const videoRef = useRef(null);
  const [downloadUrl, setDownloadUrl] = useState("");

  async function uploadVideo(path){
    await uploadfileusingurl(path)
  }
  const handleDownload = async () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    
    let name = uuid()

    let path = "/Users/sparshjhariya/Downloads/" + name + '.webm'
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    await uploadVideo(path)

  };

  const handleStop = (blobUrl) => {
    setDownloadUrl(blobUrl);
  };

  useEffect(() => {
    if(status==="stopped"){
        handleStop(mediaBlobUrl)
    }
   
  }, [status])
  
//   console.log("downloadurl:" ,downloadUrl)

    function startMeeting(signature) {
        let meetingSDKElement = document.getElementById('meetingSDKElement');

        client.init({
            debug: true,
            zoomAppRoot: meetingSDKElement,
            language: 'en-US',
            customize: {
                meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
                toolbar: {
                    buttons: [
                        {
                            text: 'Custom Button',
                            className: 'CustomButton',
                            onClick: () => {
                                console.log('custom button');
                            }
                        }
                    ]
                }
            }
        });

        const formattedMeetingNumber = formatMeetingNumber(meetingNumber);
        console.log('Initializing meeting with:', {
            signature,
            sdkKey,
            meetingNumber: formattedMeetingNumber,
            password: passWord,
            userName
        });

        client.join({
            signature: signature,
            sdkKey: sdkKey,
            meetingNumber: formattedMeetingNumber,
            password: passWord,
            userName: userName,
            userEmail: userEmail,
            tk: registrantToken,
            zak: zakToken
        }).catch(error => {
            console.error('Failed to join meeting:', error);
            let errorMessage = 'Failed to join meeting. ';
            if (error.errorCode === 200) {
                errorMessage += 'Please verify your meeting number and password are correct.';
            } else if (error.errorCode === 201) {
                errorMessage += 'The meeting has not started yet. Please wait for the host to start the meeting.';
            } else {
                errorMessage += error.reason || 'Please check your meeting details.';
            }
            setError(errorMessage);
        });

        // start recording the Zoom meeting
        // client.startRecord({
        //     success: function (res) {
        //         console.log("Successfully started recording.");
        //     },
        //     error: function (err) {
        //         console.log(err);
        //     },
        // });

        // stop recording the Zoom meeting
        // client.stopRecord({
        //     success: function (res) {
        //         console.log("Successfully stopped recording.");
        //     },
        //     error: function (err) {
        //         console.log(err);
        //     },
        // });
        // client.record()
    }

    return (
        <div className="App">
            <main>
                <h1 className='text-2xl font-bold mb-4 mt-4'>Meeting Page</h1>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                <div className='flex flex-col justify-between gap-y-5'>
                    <div className='flex justify-between content-between items-center'>
                        <label className='font-bold'>UserName</label>
                        <input 
                            className='rounded-md border-2 border-black p-2' 
                            type='text' 
                            value={userName} 
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className='flex justify-between content-between items-center'>
                        <label className='font-bold'>Meeting Number</label>
                        <input 
                            className='rounded-md border-2 border-black p-2' 
                            type='text' 
                            value={meetingNumber} 
                            onChange={(e) => setMeetingNumber(e.target.value)}
                            placeholder="Enter meeting ID (numbers only)"
                        />
                    </div>
                    <div className='flex justify-between content-between items-center'>
                        <label className='font-bold'>Password</label>
                        <input 
                            className='rounded-md border-2 border-black p-2' 
                            type='text' 
                            value={passWord} 
                            onChange={(e) => setPassWord(e.target.value)}
                            placeholder="Enter meeting password"
                        />
                    </div>
                    {/* <div className='flex justify-between content-between items-center'>
                        <label className='font-bold'>Role</label>
                        <input className='rounded-md border-2 border-black p-2' type='text' value={role} onChange={(e) => setRole(e.target.value)} />
                    </div> */}

                </div>
                <button 
                    onClick={getSignature}
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={!meetingNumber || !passWord || !userName}
                >
                    Join Meeting
                </button>
                <div id="meetingSDKElement">
                    {/* Zoom Meeting SDK Component View Rendered Here */}
                </div>
                <div>
                    <h1 className='text-xl font-bold mb-4 mt-4'>Recording Menu</h1>
                    {mediaBlobUrl ? <video ref={videoRef} src={mediaBlobUrl} controls /> :''}
                    {status === "recording" ? (
                        <button onClick={stopRecording}>Stop Recording</button>
                    ) : (
                        <button onClick={startRecording}>Start Recording</button>
                    )}
                    {downloadUrl && <button onClick={handleDownload}>Download Video</button>}
                </div>
                {/* <div>
                    <h1 className='text-xl font-bold mb-4 mt-4'>Recording Menu</h1>
                    <button  className='mr-5' onClick={}>Start Recording</button>
                    <button onClick={stopRecording}>Stop Recording</button>
                </div> */}
            </main>
        </div>
    );
}

export default App;
