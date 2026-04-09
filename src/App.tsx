import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Home from './pages/Home';
import Episodes from './pages/Episodes';
import MeetTheHost from './pages/MeetTheHost';
import Pitch from './pages/Pitch';
import VoiceNote from './pages/VoiceNote';
import About from './pages/About';
import Inbox from './pages/Inbox';
import SpaceGame from './pages/SpaceGame';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col" style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.5s ease-out" }}>
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} className="flex-1 flex flex-col">
            <Routes location={location}>
              <Route path="/" element={<Home isLoading={isLoading} />} />
              <Route path="/episodes" element={<Episodes />} />
              <Route path="/meet-the-host" element={<MeetTheHost />} />
              <Route path="/pitch" element={<Pitch />} />
              <Route path="/voicemail" element={<VoiceNote />} />
              <Route path="/about" element={<About />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/play" element={<SpaceGame />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
