import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, PlayCircle } from 'lucide-react';

const episodes = [
  {
    id: 1,
    title: `EP-01: THE JOURNEY`,
    description: 'High-definition tracks and a smooth mix for resting and relaxing.',
    duration: '120 Mins',
    image: 'https://img.youtube.com/vi/s3WxUlnStLI/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=s3WxUlnStLI',
    bgPosition: '30% center'
  },
  {
    id: 2,
    title: `EP-02: BISHOP GURLEY INTERVIEW`,
    description: `John 14:2 In My Father's House Are Many Mansions`,
    duration: '1:52:40',
    image: 'https://img.youtube.com/vi/WuBNF2Ru_2E/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=WuBNF2Ru_2E',
    bgPosition: 'center center'
  },
  {
    id: 3,
    title: `EP-03: CARLTON SPIVEY INTERVIEW`,
    description: `Tuesday Mar 10th At 8:30pm On Listening Pleasure Podcast`,
    duration: '2:03:47',
    image: 'https://img.youtube.com/vi/2yd8cH3zoxc/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=2yd8cH3zoxc&t=16s',
    bgPosition: 'center center'
  },
  {
    id: 4,
    title: `EP-04: MIKE V CO-HOST`,
    description: `Mike V Co-Host on the Listening Pleasure Podcast`,
    duration: '120 Mins',
    image: 'https://img.youtube.com/vi/6_JGSUTodUE/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=6_JGSUTodUE',
    bgPosition: 'center center'
  },
  {
    id: 5,
    title: `EP-05: FOOTBALL SPECIAL`,
    description: `Listening Pleasure Podcast`,
    duration: '1:50:23',
    image: '/ep5-thumbnail.jpg',
    url: '#',
    bgPosition: 'center center'
  },
  {
    id: 6,
    title: `EP-06: OPEN TALK TUESDAY`,
    description: `Listening Pleasure Podcast`,
    duration: '120 Mins',
    image: 'https://img.youtube.com/vi/ir-XXfZisio/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=ir-XXfZisio',
    bgPosition: 'center center'
  },
  {
    id: 7,
    title: `EP-07: REVERB`,
    description: `Listening Pleasure Podcast`,
    duration: '120 Mins',
    image: 'https://img.youtube.com/vi/0-VMcdwKgJA/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=0-VMcdwKgJA&t=4s',
    bgPosition: 'center center'
  },
  {
    id: 8,
    title: `EP-08: CATCHING UP!`,
    description: `Listening Pleasure Podcast`,
    duration: '120 Mins',
    image: 'https://img.youtube.com/vi/KJsNLYYVkNI/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=KJsNLYYVkNI',
    bgPosition: 'center center'
  },
  {
    id: 9,
    title: `EP-09: DON'T LOSE YOURSELF`,
    description: `Why you shouldn't lose yourself in relationships`,
    duration: '120 Mins',
    image: 'https://img.youtube.com/vi/pAHse96WJY0/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=pAHse96WJY0',
    bgPosition: 'center center'
  },
  {
    id: 10,
    title: `EP-10: MYTH OF BEING IN LOVE`,
    description: `The myth of "being in love"`,
    duration: '120 Mins',
    image: 'https://img.youtube.com/vi/fSufD8ucOxs/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=fSufD8ucOxs',
    bgPosition: 'center center'
  },
  {
    id: 11,
    title: `EP-11: SUPER BOWL DEBRIEF`,
    description: `Super Bowl Debrief & Heartfelt Chats`,
    duration: '120 Mins',
    image: 'https://img.youtube.com/vi/Rf3DpBUgN88/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=Rf3DpBUgN88',
    bgPosition: 'center center'
  },
  {
    id: 12,
    title: `EP-12: EXCUSES ARE REASONS TO FAIL`,
    description: `Accountability in Sports`,
    duration: '120 Mins',
    image: 'https://img.youtube.com/vi/ayMQk2UQqzM/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=ayMQk2UQqzM',
    bgPosition: 'center center'
  },
  {
    id: 13,
    title: `EP-13: YOUTH FOOTBALL ISSUES`,
    description: `Community Issues Affecting Youth Football`,
    duration: '120 Mins',
    image: 'https://img.youtube.com/vi/o_EWZSkjo_E/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=o_EWZSkjo_E',
    bgPosition: 'center center'
  },
  {
    id: 14,
    title: `EP-14: FAMILY COACHING JOURNEY`,
    description: `From Backyard to Offensive Coordinator`,
    duration: '120 Mins',
    image: 'https://img.youtube.com/vi/AwJLRiyTVkY/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=AwJLRiyTVkY',
    bgPosition: 'center center'
  },
  {
    id: 15,
    title: `EP-15: SEATTLE'S DEFENSE`,
    description: `Why Seattle's Defense Scares New England`,
    duration: '120 Mins',
    image: 'https://img.youtube.com/vi/Bf03ST5sYJU/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=Bf03ST5sYJU',
    bgPosition: 'center center'
  }
];

export default function Episodes() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-black text-white font-sans selection:bg-white selection:text-black min-h-screen relative overflow-x-hidden"
    >
      {/* Hyper Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-900/40 mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/30 mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-rose-900/30 mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <div className="relative z-50 p-6 sm:p-8 md:p-12 lg:p-16 pb-0">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between relative z-10">
          <div>
            <Link to="/" className="btn-primary mb-4 text-xs font-mono tracking-widest uppercase self-start inline-flex">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wide uppercase drop-shadow-lg text-white">
              All Episodes
            </h1>
          </div>
          <div className="hidden md:block text-right bg-white/5 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
            <p className="font-mono text-xs tracking-[0.2em] text-neutral-400 uppercase">Listening Pleasure</p>
            <p className="font-mono text-xs tracking-[0.2em] text-neutral-400 uppercase mt-1">Podcast Archive</p>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative z-10 p-6 sm:p-8 md:p-12 lg:p-16 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          {episodes.map((ep) => (
            <div key={ep.id} className="group [perspective:1000px] h-[350px] sm:h-[400px] w-full cursor-pointer">
              <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                
                {/* Front of Card */}
                <div 
                  className="absolute inset-0 [backface-visibility:hidden] rounded-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-neutral-900 overflow-hidden"
                >
                  <div 
                    className="absolute inset-0 bg-cover"
                    style={{ 
                      backgroundImage: `url('${ep.image}')`,
                      backgroundPosition: 'center center',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80" />
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <h3 className="font-mono font-bold text-lg sm:text-xl tracking-widest text-white uppercase drop-shadow-md text-center">
                      {ep.title.split(':')[0]}
                    </h3>
                  </div>
                </div>

                {/* Back of Card */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] bg-neutral-900 overflow-hidden flex flex-col p-6 text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col h-full items-center justify-center">
                    <div className="flex-grow flex flex-col items-center justify-center">
                      <h3 className="font-display text-xl sm:text-2xl uppercase mb-2 text-white leading-tight">
                        {ep.title}
                      </h3>
                      <p className="font-mono text-xs text-neutral-400 mb-4 tracking-widest uppercase">
                        {ep.duration}
                      </p>
                      <p className="text-sm text-neutral-300 leading-relaxed">
                        {ep.description}
                      </p>
                    </div>
                    
                    <a
                      href={ep.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary mt-4 w-full font-mono text-xs font-bold tracking-[0.2em] uppercase justify-center"
                    >
                      Watch Now
                      <PlayCircle className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
