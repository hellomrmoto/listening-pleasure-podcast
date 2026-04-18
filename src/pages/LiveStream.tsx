import React from 'react';
import { motion } from 'motion/react';
import { useLiveStream } from '../hooks/useLiveStream';
import { Play, Radio, Calendar } from 'lucide-react';

function extractYoutubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function LiveStream() {
  const { liveData, loading } = useLiveStream();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00f3ff]"></div>
      </div>
    );
  }

  const videoId = extractYoutubeId(liveData.videoUrl);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f3ff]/10 border border-[#00f3ff]/20 text-[#00f3ff] text-sm font-medium tracking-widest uppercase mb-4"
          >
            <Radio className="w-4 h-4" />
            Live Broadcast
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] via-white to-[#d4af37]"
          >
            {liveData.isLive ? (liveData.title || 'Listening Pleasure LIVE') : 'Listening Pleasure Studio'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-neutral-400 max-w-2xl mx-auto"
          >
            {liveData.isLive 
              ? (liveData.description || 'Welcome to the live show! Tune in directly below.')
              : 'Our live stream is currently offline. We only broadcast during special events like the NFL Draft.'}
          </motion.p>
        </div>

        {/* Video Player / Offline Slate */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative max-w-5xl mx-auto"
        >
          {liveData.isLive && videoId ? (
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black ring-1 ring-white/10 shadow-[0_0_50px_rgba(0,243,255,0.15)] group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00f3ff]/20 via-transparent to-[#d4af37]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0 relative z-10"
              ></iframe>
            </div>
          ) : (
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black/40 ring-1 ring-white/5 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-neutral-500" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Next Event</h3>
                  <p className="text-neutral-400 text-lg">NFL Draft • Thursday</p>
                </div>

                <div className="pt-8">
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-neutral-500"></span>
                    </div>
                    <span className="text-sm font-medium text-neutral-400 uppercase tracking-widest">Standing By</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
