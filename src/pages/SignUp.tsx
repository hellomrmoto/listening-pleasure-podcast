import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, UserPlus, CheckCircle, Loader2, Clock, ChevronDown } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    timeSlot: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Custom dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const timeSlots = [
    "8:30 PM", "8:40 PM", "8:50 PM", "9:00 PM", "9:10 PM", 
    "9:20 PM", "9:30 PM", "9:40 PM", "9:50 PM", "10:00 PM", 
    "10:10 PM", "10:20 PM", "10:30 PM"
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTimeSelect = (timeStr: string) => {
    setFormData(prev => ({ ...prev, timeSlot: timeStr }));
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.timeSlot) {
      setError("Please select a time slot.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, 'signups'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      
      // Trigger email notification in the background
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'signup',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          timeSlot: formData.timeSlot,
          notes: formData.notes
        })
      }).catch(err => console.error("Failed to send notification email:", err));

      setIsSuccess(true);
    } catch (err: any) {
      console.error("Error submitting sign up:", err);
      setError("Failed to submit your sign up. Check your Firebase security rules.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Liquid Glass CSS Class for Inputs
  const glassInputClass = "w-full bg-white/5 backdrop-blur-3xl border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-all font-sans placeholder-white/30 shadow-[inset_0_1px_4px_rgba(255,255,255,0.1)] hover:bg-white/10";

  return (
    <motion.main 
      id="main-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#050505] text-white font-sans selection:bg-white selection:text-black min-h-screen relative overflow-x-hidden flex flex-col items-center justify-center pb-24"
    >
      {/* Neon Blue and Gold Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#00f3ff]/15 mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#d4af37]/15 mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col items-center pt-8 px-6 sm:px-8 md:px-12">
        <Link to="/" className="btn-primary mb-12 text-xs font-mono tracking-widest uppercase self-start inline-flex items-center absolute top-12 left-6 md:left-12 hover:text-[#00f3ff] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Back to Home
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-2xl mt-24 md:mt-16 flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#00f3ff]/30 to-[#d4af37]/30 backdrop-blur-2xl rounded-full flex items-center justify-center mb-6 border border-white/30 shadow-[0_0_30px_rgba(0,243,255,0.4),inset_0_2px_10px_rgba(255,255,255,0.5)]">
            <UserPlus className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wide uppercase drop-shadow-[0_0_20px_rgba(0,243,255,0.3)] text-white mb-4 text-center leading-tight">
            Sign Up
          </h1>
          
          <p className="text-base md:text-xl text-neutral-300 font-light mb-10 text-center max-w-xl leading-relaxed">
            Secure your spot for the next listening pleasure event through our official sign-up portal. Completely private and secure.
          </p>

          {isSuccess ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 md:p-12 text-center w-full shadow-[0_10px_50px_rgba(0,0,0,0.5),inset_0_1px_5px_rgba(255,255,255,0.2)]"
            >
              <CheckCircle className="w-16 h-16 text-[#00f3ff] drop-shadow-[0_0_15px_rgba(0,243,255,0.8)] mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-display text-white uppercase tracking-widest mb-4">You're on the list!</h2>
              <p className="text-neutral-300">We've received your registration safely. Your time slot is confirmed.</p>
              <button 
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({ name: '', email: '', phone: '', timeSlot: '', notes: '' });
                }}
                className="mt-8 text-[#d4af37] hover:text-[#00f3ff] font-mono text-xs uppercase tracking-widest transition-colors"
              >
                Sign up someone else
              </button>
            </motion.div>
          ) : (
            <div className="w-full bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_2px_10px_rgba(255,255,255,0.1)] relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#00f3ff]/20 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#d4af37]/20 rounded-full blur-[80px] pointer-events-none" />
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10 w-full">
                {error && (
                  <div className="p-4 bg-red-500/20 backdrop-blur-xl border border-red-500/40 rounded-xl text-white shadow-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-[10px] font-mono text-white/70 uppercase tracking-[0.2em] ml-2 transition-colors">Full Name *</label>
                    <input 
                      type="text" id="name" name="name" required 
                      value={formData.name} onChange={handleChange}
                      className={glassInputClass} placeholder="Jane Doe"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-[10px] font-mono text-white/70 uppercase tracking-[0.2em] ml-2 transition-colors">Email Address *</label>
                    <input 
                      type="email" id="email" name="email" required 
                      value={formData.email} onChange={handleChange}
                      className={glassInputClass} placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full relative z-20">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-[10px] font-mono text-white/70 uppercase tracking-[0.2em] ml-2 transition-colors">Phone Number (Optional)</label>
                    <input 
                      type="tel" id="phone" name="phone" 
                      value={formData.phone} onChange={handleChange}
                      className={glassInputClass} placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  {/* Custom Glassmorphism Dropdown */}
                  <div className="flex flex-col gap-2 relative">
                    <label className="text-[10px] font-mono text-white/70 uppercase tracking-[0.2em] ml-2 transition-colors">Select Time Slot *</label>
                    <div ref={dropdownRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`${glassInputClass} flex justify-between items-center text-left ${!formData.timeSlot ? 'text-white/50' : 'text-white'}`}
                      >
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#00f3ff]" />
                          {formData.timeSlot || "-- Select Time --"}
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-[#00f3ff]' : 'text-white/50'}`} />
                      </button>
                      
                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 w-full mt-2 bg-[#050505]/80 backdrop-blur-3xl border border-white/20 rounded-xl p-2 max-h-60 overflow-y-auto z-50 shadow-[0_15px_40px_rgba(0,0,0,0.8),inset_0_1px_4px_rgba(255,255,255,0.1)] custom-scrollbar"
                          >
                            <div className="grid grid-cols-2 gap-2">
                              {timeSlots.map((time) => (
                                <button
                                  key={time}
                                  type="button"
                                  onClick={() => handleTimeSelect(time)}
                                  className={`px-3 py-3 text-sm rounded-lg border text-center transition-all ${
                                    formData.timeSlot === time 
                                      ? 'bg-gradient-to-r from-[#00f3ff]/30 to-[#d4af37]/30 border-[#00f3ff]/50 text-white font-bold shadow-[0_0_15px_rgba(0,243,255,0.4)]' 
                                      : 'bg-white/5 border-transparent text-white/80 hover:bg-white/10 hover:text-white hover:border-white/20'
                                  }`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full mt-2 lg:mt-0 relative z-10">
                  <label htmlFor="notes" className="text-[10px] font-mono text-white/70 uppercase tracking-[0.2em] ml-2 transition-colors">Quick Message (Optional)</label>
                  <textarea 
                    id="notes" name="notes" rows={3}
                    value={formData.notes} onChange={handleChange}
                    className={`${glassInputClass} resize-none`} placeholder="Leave a quick message..."
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="mt-6 relative overflow-hidden group bg-white/20 backdrop-blur-3xl border border-white/40 text-white font-mono text-sm tracking-[0.2em] uppercase py-4 rounded-xl transition-all hover:bg-white/30 hover:border-white/60 hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] disabled:opacity-50 flex items-center justify-center w-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00f3ff]/40 to-[#d4af37]/40 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                  {isSubmitting ? (
                    <span className="flex items-center relative z-10 drop-shadow-md"><Loader2 className="w-5 h-5 animate-spin mr-3" /> Processing...</span>
                  ) : (
                    <span className="relative z-10 font-bold drop-shadow-md">Complete Registration</span>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 243, 255, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 243, 255, 0.6); }
      `}} />
    </motion.main>
  );
}
