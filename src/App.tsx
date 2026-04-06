import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Home from './pages/Home';
import Episodes from './pages/Episodes';
import MeetTheHost from './pages/MeetTheHost';
import Pitch from './pages/Pitch';
import VoiceNote from './pages/VoiceNote';
import About from './pages/About';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const path = location.pathname;
    let title = 'Listening Pleasure Podcast';
    if (path === '/episodes') title = 'Episodes | Listening Pleasure Podcast';
    else if (path === '/meet-the-host') title = 'Meet The Hosts | Listening Pleasure Podcast';
    else if (path === '/pitch') title = 'Pitch Us | Listening Pleasure Podcast';
    else if (path === '/voicemail') title = 'Leave a Voicemail | Listening Pleasure Podcast';
    else if (path === '/about') title = 'About | Listening Pleasure Podcast';
    
    document.title = title;
  }, [location]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col" style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.5s ease-out" }}>
        <main id="main-content" role="main" className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home isLoading={isLoading} />} />
              <Route path="/episodes" element={<Episodes />} />
              <Route path="/meet-the-host" element={<MeetTheHost />} />
              <Route path="/pitch" element={<Pitch />} />
              <Route path="/voicemail" element={<VoiceNote />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </AnimatePresence>
        </main>
        <footer role="contentinfo" className="bg-neutral-900 text-neutral-400 py-6 px-4 text-center text-sm border-t border-neutral-800">
          <p>
            We strive to conform to WCAG 2.1 Level AA to ensure our website is accessible to everyone. 
            If you encounter any accessibility issues, please contact us at <a href="mailto:accessibility@listeningpleasure.com" className="text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded px-1">accessibility@listeningpleasure.com</a>.
          </p>
        </footer>
      </div>
    </>
  );
}
