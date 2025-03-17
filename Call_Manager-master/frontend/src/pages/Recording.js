import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import { useParams } from 'react-router-dom';
import { getSignedUrlApi } from '../api/api';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ScriptView from '../components/ScriptView';
import VideoAnalysis from '../components/VideoAnalysis';

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

function Recording() {
  const [url, setUrl] = useState('')
  const { file } = useParams()
  const [mode, setMode] = useState(0) // 0: video, 1: transcript, 2: analysis
  
  async function getVideoUrl() {
    const x = await getSignedUrlApi(file)
    console.log(x)
    setUrl(x)
  }

  useEffect(() => {
    getVideoUrl()
  }, [file])

  const renderContent = () => {
    switch (mode) {
      case 0:
        return <video src={url} className='h-[80vh]' controls />;
      case 1:
        return <ScriptView file={file} />;
      case 2:
        return <VideoAnalysis file={file} videoUrl={url} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className='p-4'>
        {renderContent()}
        <div className="flex items-center gap-4 mt-4">
          <FormControlLabel
            control={<IOSSwitch sx={{ m: 1 }} checked={mode === 1} />}
            label="Transcript"
            onChange={() => setMode(mode === 1 ? 0 : 1)}
          />
          <FormControlLabel
            control={<IOSSwitch sx={{ m: 1 }} checked={mode === 2} />}
            label="Analysis"
            onChange={() => setMode(mode === 2 ? 0 : 2)}
          />
        </div>
      </div>
    </>
  )
}

export default Recording