import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Mic, Square, Play, Pause, Send, CheckCircle2, Trash2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function VoiceNote() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const MAX_RECORDING_TIME = 60; // 60 seconds max

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setErrorMsg(null);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME - 1) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setErrorMsg("Could not access microphone. Please allow microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setPlaybackTime(audioRef.current.currentTime);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPlaybackTime(0);
  };

  const discardRecording = () => {
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingTime(0);
    setPlaybackTime(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioBlob) return;
    
    setIsSubmitting(true);
    setErrorMsg(null);
    
    try {
      const base64Audio = await blobToBase64(audioBlob);
      
      // Check size limit (800,000 chars is approx 600KB)
      if (base64Audio.length > 800000) {
        throw new Error("Audio file is too large. Please record a shorter message.");
      }

      const noteData: any = {
        email: formData.email,
        audioData: base64Audio,
        createdAt: serverTimestamp()
      };
      
      if (formData.name.trim()) {
        noteData.name = formData.name.trim();
      }

      await addDoc(collection(db, 'voice_notes'), noteData);
      
      setIsSuccess(true);
      setFormData({ name: '', email: '' });
      discardRecording();
    } catch (error: any) {
      console.error("Error adding document: ", error);
      setErrorMsg(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white selection:text-black overflow-hidden relative flex flex-col"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="flex-1 relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 md:px-12 lg:px-16 py-12 flex flex-col md:flex-row gap-16 items-center justify-center">
        
        {/* Left Column: Copy */}
        <div className="w-full md:w-1/2 flex flex-col">
          <Link to="/" className="btn-primary mb-12 text-xs font-mono tracking-widest uppercase self-start inline-flex">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight uppercase mb-6">
            Leave a <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Voicemail.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-400 max-w-md leading-relaxed mb-10">
            Got something to say? Leave us a voice note. We might play it on the next episode. Keep it under 60 seconds.
          </p>
        </div>

        {/* Right Column: Recorder & Form */}
        <div className="w-full md:w-1/2 max-w-md">
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6 relative z-10"
                >
                  
                  {/* Recorder Section */}
                  <div className="flex flex-col items-center justify-center py-8 border-b border-white/10">
                    {!audioUrl ? (
                      <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                          {isRecording && (
                            <motion.div 
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="absolute inset-0 bg-red-500/30 rounded-full blur-xl"
                            />
                          )}
                          <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`w-24 h-24 rounded-full flex items-center justify-center relative z-10 transition-all duration-300 ${
                              isRecording 
                                ? 'bg-red-500 hover:bg-red-600 text-white' 
                                : 'bg-white hover:bg-neutral-200 text-black'
                            }`}
                          >
                            {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-10 h-10" />}
                          </button>
                        </div>
                        <div className="font-mono text-xl tracking-widest">
                          {formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}
                        </div>
                        {isRecording && (
                          <div className="text-red-400 text-xs font-mono uppercase tracking-widest animate-pulse">
                            Recording...
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center w-full gap-6">
                        <audio 
                          ref={audioRef} 
                          src={audioUrl} 
                          onTimeUpdate={handleTimeUpdate}
                          onEnded={handleAudioEnded}
                          className="hidden"
                        />
                        
                        <div className="w-full bg-black/40 rounded-2xl p-6 border border-white/10 flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <button 
                              onClick={togglePlayback}
                              className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black flex items-center justify-center transition-colors"
                            >
                              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                            </button>
                            <div className="font-mono text-sm tracking-widest text-emerald-400">
                              {formatTime(playbackTime)}
                            </div>
                          </div>
                          
                          {/* Progress Bar (Visual only) */}
                          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-100 ease-linear"
                              style={{ width: audioRef.current && audioRef.current.duration ? `${(playbackTime / audioRef.current.duration) * 100}%` : '0%' }}
                            />
                          </div>
                        </div>

                        <button 
                          onClick={discardRecording}
                          className="text-neutral-400 hover:text-red-400 text-xs font-mono uppercase tracking-widest flex items-center gap-2 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Discard & Rerecord
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Form Section */}
                  <form onSubmit={handleSubmit} className={`flex flex-col gap-6 transition-opacity duration-300 ${!audioUrl ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="font-mono text-xs tracking-widest text-neutral-400 uppercase">Your Name (Optional)</label>
                      <input 
                        type="text" 
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-700"
                        placeholder="What do we call you?"
                        disabled={!audioUrl}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="font-mono text-xs tracking-widest text-neutral-400 uppercase">Email Address *</label>
                      <input 
                        type="email" 
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-700"
                        placeholder="Where do we reach you?"
                        disabled={!audioUrl}
                      />
                    </div>

                    {errorMsg && (
                      <div className="text-red-400 text-sm font-mono bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                        {errorMsg}
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={isSubmitting || !audioUrl}
                      className="mt-4 w-full bg-white text-black font-display uppercase tracking-widest py-4 rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Voicemail
                          <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12 relative z-10"
                >
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 text-emerald-400">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-display text-3xl uppercase mb-4">Voicemail Sent.</h3>
                  <p className="text-neutral-400 mb-8">
                    We got your message loud and clear. If we play it on the show, we'll let you know.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="font-mono text-xs tracking-widest uppercase border border-white/20 py-3 px-6 rounded-full hover:bg-white hover:text-black transition-colors"
                  >
                    Leave Another
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
