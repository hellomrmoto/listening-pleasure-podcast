import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, UserPlus, ArrowRight } from 'lucide-react';

export default function SignUp() {
  const signupLink = "https://www.signupgenius.com/go/10C044BA5A928AAF5C16-63616151-listening";

  return (
    <motion.main 
      id="main-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#050505] text-white font-sans selection:bg-white selection:text-black min-h-screen relative overflow-x-hidden flex flex-col items-center justify-center pb-24"
    >
      {/* Neon Purple and Blue Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
        {/* Neon Purple Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#b026ff]/10 mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
        {/* Neon Blue Glow */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#00f3ff]/10 mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }} />
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
          className="w-full max-w-3xl mt-24 md:mt-16 flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-8 border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.4)]">
            <UserPlus className="w-12 h-12 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
          </div>
          
          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl tracking-wide uppercase drop-shadow-lg text-white mb-6 text-center leading-tight">
            Sign Up
          </h1>
          
          <p className="text-lg md:text-2xl text-neutral-300 font-light mb-12 text-center max-w-2xl leading-relaxed">
            Ready to dive in? Secure your spot for the next listening pleasure event through our official sign-up portal.
          </p>
          
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={signupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center px-10 py-5 font-mono text-sm md:text-base tracking-[0.2em] uppercase text-white overflow-hidden rounded-full transition-all duration-300"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 opacity-90 transition-all duration-300"></div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            <span className="relative z-10 flex items-center">
              Go To Sign Up Form
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </motion.a>

          <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest text-center mt-12">
            You will be redirected to SignUpGenius
          </p>
        </motion.div>
      </div>
    </motion.main>
  );
}
