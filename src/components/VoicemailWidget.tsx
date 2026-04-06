import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Mic, Square, Play, Pause, Send, CheckCircle2, Trash2, ArrowLeft } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function VoicemailWidget() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingType, setRecordingType] = useState<'video' | 'audio' | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
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
  const audioRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);

  const MAX_RECORDING_TIME = 60; // 60 seconds max

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioUrl, mediaStream]);

  const requestPermissions = async () => {
    try {
      setErrorMsg(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: recordingType === 'video', 
        audio: true 
      });
      setMediaStream(stream);
      setHasPermission(true);
      
      if (recordingType === 'video' && liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Error accessing camera/microphone:", err);
      if (err.name === 'NotAllowedError' || err.message === 'Permission dismissed') {
        setErrorMsg("Camera/microphone access was denied. Please allow permissions in your browser and try again.");
      } else {
        setErrorMsg(err.message || "Could not access camera/microphone. Please allow permissions.");
      }
      setHasPermission(false);
    }
  };

  const startRecording = async () => {
    try {
      if (!mediaStream) {
        await requestPermissions();
        return;
      }

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = recordingType === 'video' ? 'video/webm' : 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(url);
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
    } catch (err: any) {
      console.error("Error starting recording:", err);
      setErrorMsg("Failed to start recording. Please try again.");
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
    
    // Re-attach the live video stream if we still have permission
    if (hasPermission && mediaStream && liveVideoRef.current && recordingType === 'video') {
      liveVideoRef.current.srcObject = mediaStream;
    }
  };

  const resetAll = () => {
    discardRecording();
    setRecordingType(null);
    setHasPermission(false);
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
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
      
      const sizeLimit = recordingType === 'video' ? 20000000 : 5000000;
      if (base64Audio.length > sizeLimit) {
        throw new Error(`${recordingType === 'video' ? 'Video' : 'Audio'} file is too large. Please record a shorter message.`);
      }

      const noteData: any = {
        email: formData.email,
        type: recordingType,
        createdAt: serverTimestamp()
      };
      
      if (recordingType === 'video') {
        noteData.videoData = base64Audio;
      } else {
        noteData.audioData = base64Audio;
      }
      
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
    <div className="w-full max-w-[320px]">
      <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-5 sm:p-6 rounded-2xl shadow-2xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4 relative z-10"
            >
              <div className="text-center mb-2 relative">
                {recordingType && !isSuccess && (
                  <button 
                    onClick={resetAll} 
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                    title="Back"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h3 className="font-display text-xl uppercase tracking-widest text-white">
                  {recordingType === 'video' ? 'Video Voicemail' : recordingType === 'audio' ? 'Voice Message' : 'Leave a Message'}
                </h3>
                <p className="text-[10px] text-neutral-400 font-mono mt-1 uppercase tracking-wider">Keep it under 60s</p>
              </div>

              {errorMsg && (
                <div className="text-red-400 text-xs font-mono bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-center">
                  {errorMsg}
                </div>
              )}
              
              {/* Recorder Section */}
              <div className="flex flex-col items-center justify-center py-4 border-y border-white/10 min-h-[200px]">
                {!recordingType ? (
                  <div className="flex gap-4 justify-center w-full py-2">
                    <button 
                      onClick={() => setRecordingType('video')} 
                      className="flex-1 flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Video className="w-6 h-6 text-emerald-400" />
                      </div>
                      <span className="text-xs font-mono uppercase tracking-wider text-neutral-300 group-hover:text-white">Video</span>
                    </button>
                    <button 
                      onClick={() => setRecordingType('audio')} 
                      className="flex-1 flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mic className="w-6 h-6 text-[#FFD700]" />
                      </div>
                      <span className="text-xs font-mono uppercase tracking-wider text-neutral-300 group-hover:text-white">Audio</span>
                    </button>
                  </div>
                ) : !hasPermission ? (
                  <div className="flex flex-col items-center gap-4 w-full py-4">
                    {recordingType === 'video' ? <Video className="w-12 h-12 text-neutral-600 mb-2" /> : <Mic className="w-12 h-12 text-neutral-600 mb-2" />}
                    <p className="text-xs text-center text-neutral-400 font-mono max-w-[220px]">
                      We need access to your {recordingType === 'video' ? 'camera and microphone' : 'microphone'} to record a message.
                    </p>
                    <button
                      onClick={requestPermissions}
                      className="mt-2 bg-white text-black font-display text-xs uppercase tracking-widest py-2 px-6 rounded-full hover:bg-neutral-200 transition-colors"
                    >
                      Allow Access
                    </button>
                  </div>
                ) : !audioUrl ? (
                  <div className="flex flex-col items-center gap-4 w-full">
                    {recordingType === 'video' ? (
                      <div className={`w-full aspect-video bg-black rounded-xl overflow-hidden relative block`}>
                        <video 
                          ref={liveVideoRef} 
                          autoPlay 
                          muted 
                          playsInline 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-24 bg-white/5 rounded-xl flex items-center justify-center relative overflow-hidden">
                        {isRecording && (
                          <motion.div 
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-[#FFD700] rounded-full blur-3xl"
                          />
                        )}
                        <Mic className={`w-8 h-8 ${isRecording ? 'text-[#FFD700]' : 'text-neutral-500'} relative z-10`} />
                      </div>
                    )}
                    
                    <div className="relative">
                      {isRecording && (
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="absolute inset-0 bg-red-500/30 rounded-full blur-md"
                        />
                      )}
                      <motion.button
                        onClick={isRecording ? stopRecording : startRecording}
                        animate={!isRecording ? { 
                          y: [0, -4, 0],
                          boxShadow: ["0px 0px 0px rgba(255,215,0,0)", "0px 5px 15px rgba(255,215,0,0.2)", "0px 0px 0px rgba(255,215,0,0)"]
                        } : {}}
                        transition={!isRecording ? { 
                          repeat: Infinity, 
                          duration: 2.5, 
                          ease: "easeInOut" 
                        } : {}}
                        whileHover={!isRecording ? { 
                          scale: 1.1, 
                          boxShadow: "0px 0px 20px rgba(255,215,0,0.5)" 
                        } : { scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-16 h-16 rounded-full flex items-center justify-center relative z-10 transition-colors duration-300 ${
                          isRecording 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : 'bg-white text-black'
                        }`}
                      >
                        {isRecording ? <Square className="w-6 h-6 fill-current" /> : (recordingType === 'video' ? <Video className="w-7 h-7 text-[#FFD700]" /> : <Mic className="w-7 h-7 text-[#FFD700]" />)}
                      </motion.button>
                    </div>
                    <div className="font-mono text-sm tracking-widest">
                      {formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}
                    </div>
                    {isRecording && (
                      <div className="text-red-400 text-[10px] font-mono uppercase tracking-widest animate-pulse">
                        Recording...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-full gap-4">
                    {recordingType === 'video' ? (
                      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative">
                        <video 
                          ref={audioRef as React.RefObject<HTMLVideoElement>} 
                          src={audioUrl} 
                          onTimeUpdate={handleTimeUpdate}
                          onEnded={handleAudioEnded}
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <audio 
                        ref={audioRef as React.RefObject<HTMLAudioElement>} 
                        src={audioUrl} 
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleAudioEnded}
                        className="hidden"
                      />
                    )}
                    
                    <div className="w-full bg-black/40 rounded-xl p-4 border border-white/10 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <button 
                          onClick={togglePlayback}
                          className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black flex items-center justify-center transition-colors"
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-1" />}
                        </button>
                        <div className="font-mono text-xs tracking-widest text-emerald-400">
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
                      className="text-neutral-400 hover:text-red-400 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Discard
                    </button>
                  </div>
                )}
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className={`flex flex-col gap-4 transition-opacity duration-300 ${(!audioUrl || !recordingType) ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">Name (Optional)</label>
                  <input 
                    type="text" 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-700"
                    placeholder="What do we call you?"
                    disabled={!audioUrl}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">Email *</label>
                  <input 
                    type="email" 
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-700"
                    placeholder="Where do we reach you?"
                    disabled={!audioUrl}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || !audioUrl}
                  className="mt-2 w-full bg-white text-black font-display text-sm uppercase tracking-widest py-3 rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      Send
                      <Send className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
              className="flex flex-col items-center justify-center text-center py-8 relative z-10"
            >
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl uppercase mb-2">Sent.</h3>
              <p className="text-neutral-400 text-sm mb-6">
                We got your message loud and clear.
              </p>
              <button 
                onClick={() => {
                  setIsSuccess(false);
                  resetAll();
                }}
                className="font-mono text-[10px] tracking-widest uppercase border border-white/20 py-2 px-4 rounded-full hover:bg-white hover:text-black transition-colors"
              >
                Leave Another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
