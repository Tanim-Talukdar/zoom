import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import Animation from './pages/Animation';
import Auth from './pages/Auth';
import { AuthProvider } from './contexts/AuthContext'; 
import VideoMeet from './pages/videoMeet';

function App() {
  return (
 
      <Router>
        <AuthProvider>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/:url' element={<VideoMeet />} />
          <Route path='/try' element={<Animation />} />
        </Routes>
        </AuthProvider>
      </Router>
    
  );
}

export default App;