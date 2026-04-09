import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function About() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black p-6 sm:p-8 md:p-12 lg:p-16"
    >
      <div className="max-w-7xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-neutral-400 hover:text-white transition-colors mb-12 font-mono text-sm tracking-widest uppercase"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl uppercase mb-8 leading-tight">
              The Podcast for the People!
            </h2>
            <p className="text-neutral-300 mb-6 leading-relaxed text-lg">
              Unfiltered. Unapologetic. Uncomfortable (in the best way). We tackle ALL topics no sugarcoating, no taboos. From social justice, mental health to relationships, pop culture, and everything in between <strong className="text-white font-medium">we keep it 100% real</strong>.
            </p>
            <p className="text-neutral-300 mb-10 leading-relaxed text-lg">
              Open dialogue. Raw interviews. Honest conversations. We bring you diverse voices, bold perspectives, & solutions driven talk—because growth starts with listening!
            </p>
            <div className="text-xl md:text-2xl font-display uppercase tracking-widest text-white">
              🔥 Press play. Get uncomfortable. Grow. 🔥
            </div>
          </div>
          
          <div className="space-y-10">
            <div>
              <h3 className="font-mono text-sm md:text-base tracking-[0.2em] text-neutral-400 mb-6 uppercase">👇 JOIN THE CONVERSATION!</h3>
              <ul className="space-y-4 text-neutral-300 text-lg">
                <li className="flex items-start"><span className="mr-3">✅</span> <span><strong className="text-white font-medium">-Speak up</strong> –Your voice matters here.</span></li>
                <li className="flex items-start"><span className="mr-3">✅</span> <span><strong className="text-white font-medium">-Stay curious</strong>–Unlearn, relearn, grow.</span></li>
                <li className="flex items-start"><span className="mr-3">✅</span> <span><strong className="text-white font-medium">-Challenge yourself</strong>– Comfort zones are overrated.</span></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-mono text-sm md:text-base tracking-[0.2em] text-neutral-400 mb-4 uppercase">🎧 New episodes drop weekly!</h3>
              <p className="text-neutral-300 text-lg leading-relaxed">
                Hit <strong className="text-white font-medium">SUBSCRIBE</strong> and turn on notifications so you never miss the real talk.<br/>
                💬 Got a topic or guest suggestion? DM us!
              </p>
            </div>

            <div className="p-6 md:p-8 border border-white/10 bg-white/5 backdrop-blur-sm">
              <h3 className="font-mono text-sm tracking-[0.2em] text-neutral-400 mb-6 uppercase">🔗 Connect with us:</h3>
              <p className="text-neutral-300 text-lg mb-4">
                Facebook | Instagram | Twitter | TikTok<br/>
                <span className="text-white mt-1 inline-block">→ @ListeningPleasurePodast</span>
              </p>
              <p className="text-neutral-300 text-lg">
                📩 <strong className="text-white font-medium">Business/Collabs:</strong><br/>
                <a href="mailto:ListeningPleasurePodcast@gmail.com" className="text-white hover:underline mt-1 inline-block">ListeningPleasurePodcast@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
