import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, UserPlus, CheckCircle, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '0',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, 'signups'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Error submitting sign up:", err);
      setError("Failed to submit your sign up. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {/* Neon Blue Glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#00f3ff]/10 mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
        {/* Gold Glow */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#d4af37]/10 mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }} />
        {/* Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col items-center pt-8 px-6 sm:px-8 md:px-12">
        <Link to="/" className="btn-primary mb-12 text-xs font-mono tracking-widest uppercase self-start inline-flex items-center absolute top-12 left-6 md:left-12">
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Back to Home
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-2xl mt-24 md:mt-16 flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#00f3ff]/20 to-[#d4af37]/20 rounded-full flex items-center justify-center mb-6 border border-[#00f3ff]/30 shadow-[0_0_50px_rgba(0,243,255,0.3)]">
            <UserPlus className="w-10 h-10 text-[#00f3ff] drop-shadow-[0_0_15px_rgba(0,243,255,0.8)]" />
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wide uppercase drop-shadow-lg text-white mb-4 text-center leading-tight">
            Sign Up
          </h1>
          
          <p className="text-base md:text-xl text-neutral-300 font-light mb-10 text-center max-w-xl leading-relaxed">
            Secure your spot for the next listening pleasure event through our official sign-up portal. Completely private and secure.
          </p>

          {isSuccess ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-3xl p-8 md:p-12 text-center w-full shadow-[0_0_40px_rgba(212,175,55,0.2)]"
            >
              <CheckCircle className="w-16 h-16 text-[#d4af37] mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-display uppercase tracking-widest mb-4">You're on the list!</h2>
              <p className="text-neutral-300">We've received your registration securely. We look forward to seeing you there.</p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="mt-8 text-neutral-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors"
              >
                Sign up someone else
              </button>
            </motion.div>
          ) : (
            <div className="w-full bg-neutral-900/50 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f3ff]/10 rounded-full blur-[60px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-[60px] pointer-events-none" />
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10 w-full">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-xs font-mono text-neutral-400 uppercase tracking-widest ml-1">Full Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f3ff]/50 focus:ring-1 focus:ring-[#00f3ff]/50 transition-all font-sans w-full"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs font-mono text-neutral-400 uppercase tracking-widest ml-1">Email Address *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f3ff]/50 focus:ring-1 focus:ring-[#00f3ff]/50 transition-all font-sans w-full"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-xs font-mono text-neutral-400 uppercase tracking-widest ml-1">Phone Number (Optional)</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f3ff]/50 focus:ring-1 focus:ring-[#00f3ff]/50 transition-all font-sans w-full"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="guests" className="text-xs font-mono text-neutral-400 uppercase tracking-widest ml-1">Additional Guests</label>
                    <select 
                      id="guests" 
                      name="guests" 
                      value={formData.guests}
                      onChange={handleChange}
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f3ff]/50 focus:ring-1 focus:ring-[#00f3ff]/50 transition-all font-sans w-full appearance-none"
                    >
                      <option value="0">Just me (+0)</option>
                      <option value="1">+ 1 Guest</option>
                      <option value="2">+ 2 Guests</option>
                      <option value="3">+ 3 Guests</option>
                      <option value="4">+ 4 Guests</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="notes" className="text-xs font-mono text-neutral-400 uppercase tracking-widest ml-1">Event Note / Dietary Restrictions (Optional)</label>
                  <textarea 
                    id="notes" 
                    name="notes" 
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f3ff]/50 focus:ring-1 focus:ring-[#00f3ff]/50 transition-all font-sans resize-none w-full"
                    placeholder="Anything we should know?"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="mt-4 relative overflow-hidden group bg-white text-black font-mono text-sm uppercase tracking-[0.2em] py-4 rounded-xl transition-all hover:bg-neutral-200 disabled:opacity-70 flex items-center justify-center w-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00f3ff]/20 to-[#d4af37]/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                  {isSubmitting ? (
                    <span className="flex items-center relative z-10"><Loader2 className="w-5 h-5 animate-spin mr-3" /> Processing...</span>
                  ) : (
                    <span className="relative z-10 font-bold">Complete Registration</span>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </motion.main>
  );
}
