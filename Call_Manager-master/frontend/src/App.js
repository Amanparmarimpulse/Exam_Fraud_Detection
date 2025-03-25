import { BrowserRouter, Route, Routes } from "react-router-dom";
import CallList from "./pages/CallList";
import Home from "./pages/Home";
import Meeting from "./pages/Meeting2";
import Recording from "./pages/Recording";
import SignIn from "./pages/signIn";
import SignUp from "./pages/SignUp";
import VideoSummary from "./pages/Videosummary";


function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/calllist' element={<CallList />} />
        <Route path='/meeting' element={<Meeting />} /> 
        <Route path="/recording/:file" element={<Recording />} />
        <Route path='/video-summary' element={<VideoSummary />} />
        {/* auth */}
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
