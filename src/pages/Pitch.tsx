import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, Share2, Facebook, Twitter, Instagram, Mail, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function Pitch() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', topic: '' });
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (marqueeRef.current) {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 15,
        repeat: -1,
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    
    try {
      const pitchData: any = {
        email: formData.email,
        topic: formData.topic,
        createdAt: serverTimestamp()
      };
      
      if (formData.name.trim()) {
        pitchData.name = formData.name.trim();
      }

      await addDoc(collection(db, 'pitches'), pitchData);
      
      // Send email copy via backend API
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            type: 'pitch',
            topic: formData.topic
          }),
        });
      } catch (emailError) {
        console.error("Error calling send-email API:", emailError);
      }
      
      setIsSuccess(true);
      setFormData({ name: '', email: '', topic: '' });
    } catch (error) {
      console.error("Error adding document: ", error);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareUrl = window.location.href;
  const shareTitle = "I just pitched a topic for the podcast! What should they talk about next?";

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pitch The Next Episode',
          text: shareTitle,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
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
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-900/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Marquee Header */}
      <div className="w-full overflow-hidden bg-white text-black py-3 border-b border-white/10 z-10 relative flex whitespace-nowrap">
        <div ref={marqueeRef} className="flex gap-8 items-center font-display text-2xl uppercase tracking-widest">
          {[...Array(10)].map((_, i) => (
            <React.Fragment key={i}>
              <span>Pitch Us</span>
              <span className="text-neutral-400">•</span>
              <span>Go Viral</span>
              <span className="text-neutral-400">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex-1 relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 md:px-12 lg:px-16 py-12 flex flex-col md:flex-row gap-16 items-center justify-center">
        
        {/* Left Column: Copy & Socials */}
        <div className="w-full md:w-1/2 flex flex-col">
          <Link to="/" className="btn-primary mb-12 text-xs font-mono tracking-widest uppercase self-start inline-flex">
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Back to Home
          </Link>
          
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight uppercase mb-6">
            Drop The <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Mic.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-400 max-w-md leading-relaxed mb-10">
            Got a burning topic? A controversial take? An untold story? Pitch it to us. If it's fire, we'll make it an episode and shout you out.
          </p>

          <div className="mt-auto">
            <p className="font-mono text-xs tracking-[0.2em] text-neutral-500 uppercase mb-4">Share to get upvotes</p>
            <div className="flex gap-4">
              <button onClick={handleNativeShare} aria-label="Share via device" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none">
                <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
              </button>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#1DA1F2] hover:border-[#1DA1F2] transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none">
                <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#4267B2] hover:border-[#4267B2] transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none">
                <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
              </a>
              <a href={`mailto:?subject=${encodeURIComponent("Pitch The Next Episode")}&body=${encodeURIComponent(shareTitle + " " + shareUrl)}`} aria-label="Share via Email" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none">
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="w-full md:w-1/2 max-w-md">
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6 relative z-10"
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-mono text-xs tracking-widest text-neutral-400 uppercase">Your Name (Optional)</label>
                    <input 
                      type="text" 
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-700"
                      placeholder="What do we call you?"
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
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="topic" className="font-mono text-xs tracking-widest text-neutral-400 uppercase">The Pitch *</label>
                    <textarea 
                      id="topic"
                      required
                      value={formData.topic}
                      onChange={(e) => setFormData({...formData, topic: e.target.value})}
                      rows={4}
                      className="bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-700 resize-none"
                      placeholder="Tell us what we should talk about and why it matters..."
                    />
                  </div>

                  {errorMsg && (
                    <div className="text-red-400 text-sm font-mono bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                      {errorMsg}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="mt-4 w-full bg-white text-black font-display uppercase tracking-widest py-4 rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" aria-hidden="true" />
                    ) : (
                      <>
                        Submit Pitch
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12 relative z-10"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-400">
                    <CheckCircle2 className="w-10 h-10" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-3xl uppercase mb-4" aria-live="polite">Pitch Received.</h3>
                  <p className="text-neutral-400 mb-8">
                    If your topic gets picked, we'll hit you up at <span className="text-white">{formData.email}</span>. Keep an eye on your inbox.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="font-mono text-xs tracking-widest uppercase border border-white/20 py-3 px-6 rounded-full hover:bg-white hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  >
                    Pitch Another
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
