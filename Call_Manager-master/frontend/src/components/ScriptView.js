import React,{useState , useEffect} from 'react'
import { getTranscriptApi } from '../api/api'
import CircularProgress from '@mui/material/CircularProgress';
function ScriptView({file}) {
    const [speech , setSpeech] = useState(null)
    const [loading , setLoading] = useState(true)
    async function getTranscript(){
        setLoading(true)
        let x = await getTranscriptApi(file)
        x = x[1].speechTranscriptions
        var arr = []
        for(var i=0 ; i<x.length ; i++){
            var paragraph = []
            for(var j=0 ; j<x[i].alternatives.length ; j++){
                paragraph.push(x[i].alternatives[j].transcript)
            }
            arr.push(paragraph)
        }
        console.log(arr)
        setSpeech(arr)
        setLoading(false)
    }
    useEffect(() => {
      getTranscript()
    }, [file])
    
  return (
    <div className='w-[100vw] min-h-[80vh]'>
        <p className='text-2xl font-bold'>Transcripted Conversation</p>
        {
            loading || speech===undefined  ? <CircularProgress /> : <div className='flex flex-col gap-y-4'>
                {
                    speech && speech.length>0 ? speech.map(paragraph => <div>
                        {paragraph.map(sentence => <p>{sentence}</p>)}
                    </div>) : ""
                }
            </div>
        }
    </div>
  )
}

export default ScriptView