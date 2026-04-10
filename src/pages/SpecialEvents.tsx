import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, Flame, BookOpen, MapPin, Calendar, Clock } from 'lucide-react';

export default function SpecialEvents() {
  return (
    <motion.main 
      id="main-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-black text-white font-sans selection:bg-white selection:text-black min-h-screen relative overflow-x-hidden flex flex-col items-center pb-24"
    >
      {/* Hyper Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-900/40 mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/30 mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-rose-900/30 mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 p-6 sm:p-8 md:p-12 w-full max-w-[1200px] mx-auto flex flex-col items-center pt-12 md:pt-24">
        <Link to="/" className="btn-primary mb-8 text-xs font-mono tracking-widest uppercase self-start inline-flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Back to Home
        </Link>
        
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl tracking-wide uppercase drop-shadow-lg text-white mb-16 text-center">
          Special Events
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12 w-full mb-32">
          
          {/* Speed Dating Card - Chat Bubble Shape */}
          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            className="relative group cursor-pointer"
          >
            <div className="w-full aspect-square bg-gradient-to-br from-rose-500/90 to-purple-600/90 backdrop-blur-sm rounded-[4rem] rounded-bl-none p-8 flex flex-col items-center justify-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(244,63,94,0.4)] border border-white/20">
              <Heart className="w-16 h-16 mb-6 text-white drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
              <h2 className="font-display text-3xl lg:text-4xl uppercase tracking-wider mb-3">Speed Dating</h2>
              <p className="font-mono text-xs lg:text-sm text-white/90 tracking-widest uppercase">Find your match</p>
            </div>
          </motion.div>

          {/* Cookout Card - Grill Dome Shape */}
          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            className="relative group cursor-pointer"
          >
            <div className="w-full aspect-square bg-gradient-to-br from-orange-500/90 to-red-600/90 backdrop-blur-sm rounded-t-[10rem] rounded-b-2xl p-8 flex flex-col items-center justify-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(249,115,22,0.4)] border border-white/20 relative">
              <Flame className="w-16 h-16 mb-6 text-white drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
              <h2 className="font-display text-3xl lg:text-4xl uppercase tracking-wider mb-3">Cookout</h2>
              <p className="font-mono text-xs lg:text-sm text-white/90 tracking-widest uppercase">Food & Good Vibes</p>
            </div>
          </motion.div>

          {/* Book Club Card - Open Book Shape */}
          <motion.div
            whileHover={{ scale: 1.05, y: -10, filter: 'drop-shadow(0 20px 40px rgba(59,130,246,0.4))' }}
            style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}
            className="relative group cursor-pointer"
          >
            <div 
              className="w-full aspect-square bg-gradient-to-br from-blue-600/90 to-cyan-600/90 backdrop-blur-sm p-8 flex flex-col items-center justify-center text-center transition-all duration-500"
              style={{ clipPath: 'polygon(0 12%, 50% 0%, 100% 12%, 100% 100%, 50% 88%, 0 100%)' }}
            >
              <BookOpen className="w-16 h-16 mb-6 text-white drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
              <h2 className="font-display text-3xl lg:text-4xl uppercase tracking-wider mb-3">Book Club</h2>
              <p className="font-mono text-xs lg:text-sm text-white/90 tracking-widest uppercase">Read & Discuss</p>
            </div>
          </motion.div>

        </div>

        {/* Cookout Details Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden mb-12"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mb-8 border border-orange-500/20">
              <Flame className="w-10 h-10 text-orange-500" />
            </div>
            
            <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tight mb-12">Cookout Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left">
              <div className="flex items-start gap-6 p-6 bg-white/5 rounded-2xl border border-white/5">
                <Calendar className="w-8 h-8 text-orange-500 shrink-0" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Date</p>
                  <p className="text-xl font-medium">July 25th</p>
                </div>
              </div>
              
              <div className="flex items-start gap-6 p-6 bg-white/5 rounded-2xl border border-white/5">
                <Clock className="w-8 h-8 text-orange-500 shrink-0" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Time</p>
                  <p className="text-xl font-medium">12 p.m. to 6 p.m.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-6 p-6 bg-white/5 rounded-2xl border border-white/5 md:col-span-2">
                <MapPin className="w-8 h-8 text-orange-500 shrink-0" />
                <div className="flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Location</p>
                  <p className="text-xl font-medium mb-4">Gosnold Hope Park</p>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                    901 Little back River Road<br />
                    Hampton, Va 23669
                  </p>
                  
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=Gosnold+Hope+Park+901+Little+back+River+Road+Hampton+Va+23669" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs uppercase tracking-widest py-3 px-6 rounded-full transition-all hover:scale-105 active:scale-95"
                  >
                    Get Directions
                    <MapPin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Speed Dating Details Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden mb-12"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mb-8 border border-rose-500/20">
              <Heart className="w-10 h-10 text-rose-500" />
            </div>
            
            <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tight mb-8">Speed Dating</h2>
            <p className="text-xl text-neutral-300 font-medium mb-4">Coming soon.</p>
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-[0.2em]">More information is on the way.</p>
          </div>
        </motion.div>

        {/* Book Club Details Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-8 border border-blue-500/20">
              <BookOpen className="w-10 h-10 text-blue-500" />
            </div>
            
            <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tight mb-8">Book Club</h2>
            <p className="text-xl text-neutral-300 font-medium mb-4">Coming soon.</p>
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-[0.2em]">More information is on the way.</p>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}

