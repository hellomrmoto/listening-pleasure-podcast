import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface HostCardProps {
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  socials?: {
    instagram?: string;
    facebook?: string;
  };
}

function HostCard({ name, role, bio, imageUrl, socials }: HostCardProps) {
  return (
    <div className="bg-neutral-900 border border-white/10 flex flex-col h-full group">
      {/* Image Slot */}
      <div className="relative w-full aspect-square sm:aspect-[4/3] bg-neutral-800 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            referrerPolicy="no-referrer" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-600 font-mono text-sm uppercase tracking-widest">
            Image Slot
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent opacity-90" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <h2 className="font-display text-3xl md:text-4xl uppercase text-white mb-2">{name}</h2>
          <p className="font-mono text-xs md:text-sm tracking-[0.2em] text-neutral-400 uppercase">{role}</p>
        </div>
      </div>

      {/* Bio Content */}
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <div className="w-12 h-[1px] bg-neutral-700 mb-6 shrink-0"></div>
        <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-8 flex-grow">
          {bio}
        </p>
        {socials && (
          <div className="flex flex-wrap gap-4 mt-auto pt-6 border-t border-white/10 shrink-0">
            {socials.instagram && (
              <a href={`https://instagram.com/${socials.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s Instagram`} className="text-neutral-400 hover:text-white transition-colors font-mono text-xs flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded">
                <span aria-hidden="true">📸</span> {socials.instagram}
              </a>
            )}
            {socials.facebook && (
              <a href={`https://facebook.com/search/top?q=${encodeURIComponent(socials.facebook)}`} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s Facebook`} className="text-neutral-400 hover:text-white transition-colors font-mono text-xs flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded">
                <span aria-hidden="true">📘</span> {socials.facebook}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MeetTheHost() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen text-white font-sans selection:bg-white selection:text-black pb-24 relative overflow-hidden"
      style={{ 
        background: 'radial-gradient(ellipse at center, #D4AF37 0%, #002366 100%)'
      }}
    >
      <div className="pt-24 px-6 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto w-full">
        <Link to="/" className="btn-primary mb-12 text-xs font-mono tracking-widest uppercase inline-flex">
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Back to Home
        </Link>
        
        <div className="flex flex-col items-center">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wide uppercase mb-16 text-center">
            Meet The Host
          </h1>

          <div className="max-w-2xl w-full">
            <HostCard 
              name="Rob.G"
              role="Host & Creator"
              bio="Rob.G is the voice and vision behind Listening Pleasure. Born and raised in Newport News, VA, Rob.G brings that authentic 757 energy to every episode. By day, he's a truck driver rolling down the highway. By night, he's a dedicated youth football coach with over 15 years of experience mentoring young men on and off the field. His love for the youth runs deep, and coaching has always been more than just football—it's about shaping character. Rob.G started Listening Pleasure to give the people a voice—a real chance to speak their stories, no matter what. This isn't your traditional podcast. It's raw. It's unfiltered. But at the core, it's respectful and family. Every week, Rob.G and the crew link up to catch up, talk real life, and let the people be heard. Known for his direct style, sharp wit, and ability to ask the questions nobody else will, Rob.G keeps the show honest, unpredictable, and 100% real. When he's not behind the mic, you can find him spending time with family, coaching his youth football team, or stacking miles in his truck."
              imageUrl="/robg-photo.JPG"
              socials={{
                instagram: "@CoachRob757",
                facebook: "Robert Gurley"
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
