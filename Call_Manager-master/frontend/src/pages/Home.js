import React from 'react'
import Header from '../components/Header'
function Home() {
  return (
    <>
    <Header />
    <div className='flex flex-col justify-center content-center items-center mt-5 gap-y-3'>
        <p className='text-2xl' >HomePage</p>
        <p>A tool that allows users to record and transcribe Zoom calls, and view their
recordings and transcriptions on a call page.</p>
        <img src='https://www.freepnglogos.com/uploads/zoom-logo-png/zoom-png-logo-download-transparent-20.png'  alt='hero'/>
    </div>
    </>
  )
}

export default Home