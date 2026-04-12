import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, PlayCircle } from 'lucide-react';

const episodes = [
  {
    id: 1,
    title: `EP-01: Episode 1`,
    description: `Episode 1 of the Listening Pleasure Podcast`,
    duration: '120 Mins',
    image: '/ep1-thumb.png',
    url: 'https://www.youtube.com/@ListeningPleasurePodcast',
    bgPosition: 'center center'
  },
  {
    id: 2,
    title: `EP-02: Bridging The Gap`,
    description: `Bridging The Gap`,
    duration: '1:39:59',
    image: '/ep2-thumb.png',
    url: 'https://www.youtube.com/@ListeningPleasurePodcast',
    bgPosition: 'center center'
  },
  {
    id: 3,
    title: `EP-03: Derrick Gurley Jr Interview`,
    description: `Derrick Gurley Jr Interview`,
    duration: '50:21',
    image: '/ep3-thumb.png',
    url: 'https://www.youtube.com/@ListeningPleasurePodcast',
    bgPosition: 'center center'
  },
  {
    id: 4,
    title: `EP-04: 2nd year anniversary`,
    description: `Celebrating our 2nd year anniversary`,
    duration: '3:31:16',
    image: '/ep4-thumb.png',
    url: 'https://www.youtube.com/@ListeningPleasurePodcast',
    bgPosition: 'center center'
  },
  {
    id: 5,
    title: `EP-05: Realtor & Home buying`,
    description: `Realtor & Home buying discussion`,
    duration: '1:11:31',
    image: '/ep5-thumb.png',
    url: 'https://www.youtube.com/live/ioVDQbpCKPc?si=xvFClYnpaIrpqYaY',
    bgPosition: 'center center'
  },
  {
    id: 6,
    title: `EP-06: I'Ziah Emery Interview`,
    description: `I'Ziah Emery Interview`,
    duration: '1:07:12',
    image: '/ep6-thumb.png',
    url: 'https://www.youtube.com/live/eN3EQv2OP0k?si=KStcijrIy1JEmfXk',
    bgPosition: 'center center'
  },
  {
    id: 7,
    title: `EP-07: Travel`,
    description: `Travel`,
    duration: '1:24:27',
    image: '/ep7-thumb.png',
    url: 'https://www.youtube.com/live/nbfhYswHVxo?si=lCG3oOLllbF1TgG0',
    bgPosition: 'center center'
  },
  {
    id: 8,
    title: `EP-08: Youth Football Talk`,
    description: `Youth Football Talk`,
    duration: '1:54:01',
    image: '/ep8-thumb.png',
    url: 'https://www.youtube.com/live/FiBRUdv6HFA?si=Dd_22ZALuhRbztRz',
    bgPosition: 'center center'
  },
  {
    id: 9,
    title: `EP-09: Mac special`,
    description: `Mac special`,
    duration: '1:00:01',
    image: '/ep9-thumb.png',
    url: 'https://www.youtube.com/live/6BhRKqhIhCA?si=hQQT9uih_YKC5VpQ',
    bgPosition: 'center center'
  },
  {
    id: 10,
    title: `EP-10: C.P.S & Goverment Iss`,
    description: `C.P.S & Goverment Issues`,
    duration: '1:45:46',
    image: '/ep10-thumb.png',
    url: 'https://www.youtube.com/live/ZgAegShaccc?si=XVbYrlnhV7v9sktF',
    bgPosition: 'center center'
  },
  {
    id: 11,
    title: `EP-11: Battlefields To Civilian Life`,
    description: `Battlefields To Civilian Life`,
    duration: '1:45:28',
    image: '/ep11-thumb.png',
    url: 'https://www.youtube.com/live/BYS4NOK-Ts4?si=l94NeXU8pFX_aMYm',
    bgPosition: 'center center'
  },
  {
    id: 12,
    title: `EP-12: Kevin White Interview`,
    description: `Kevin White Interview`,
    duration: '49:00',
    image: '/ep12-thumb.png',
    url: 'https://www.youtube.com/live/0OgW2hbYW4g?si=jQFCURWPRtpKvqRz',
    bgPosition: 'center center'
  },
  {
    id: 13,
    title: `EP-13: Bishop Gurley`,
    description: `Bishop Gurley Interview`,
    duration: '1:52:40',
    image: 'https://img.youtube.com/vi/WuBNF2Ru_2E/maxresdefault.jpg',
    url: 'https://www.youtube.com/live/WuBNF2Ru_2E?si=k-qsegFFD97JwwK7',
    bgPosition: 'center center'
  },
  {
    id: 14,
    title: `EP-14: Hip-hop Top 20 Debate`,
    description: `Hip-hop Top 20 Debate`,
    duration: '2:06:37',
    image: '/ep14-thumb.png',
    url: 'https://www.youtube.com/live/gutWR3P5yZg?si=8KjeXdtfJqjWJUND',
    bgPosition: 'center center'
  },
  {
    id: 15,
    title: `EP-15: From wrong to right`,
    description: `From wrong to right`,
    duration: '1:58:46',
    image: '/ep15-thumb.png',
    url: 'https://www.youtube.com/live/6257XcIlOQY?si=A6dn-WS0kbb_20Br',
    bgPosition: 'center center'
  }
];

export default function Episodes() {
  return (
    <motion.main 
      id="main-content"
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
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {episodes.map((ep) => (
            <a 
              key={ep.id} 
              href={ep.url !== '#' ? ep.url : undefined}
              target={ep.url !== '#' ? "_blank" : undefined}
              rel={ep.url !== '#' ? "noopener noreferrer" : undefined}
              className="group [perspective:1000px] aspect-video w-full cursor-pointer block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500 rounded-xl"
            >
              <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]">
                
                {/* Front of Card */}
                <div 
                  className="absolute inset-0 [backface-visibility:hidden] rounded-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-neutral-900 overflow-hidden"
                  aria-hidden="true"
                >
                  <div 
                    className="absolute inset-0 bg-cover"
                    style={{ 
                      backgroundImage: `url('${ep.image}')`,
                      backgroundPosition: 'center center',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-mono font-bold text-sm sm:text-base tracking-widest text-white uppercase drop-shadow-md text-left">
                      {ep.title.split(':')[0]}
                    </h3>
                  </div>
                </div>

                {/* Back of Card */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] bg-neutral-900 overflow-hidden flex flex-col p-4 sm:p-5 text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col h-full items-center justify-center">
                    <div className="flex-grow flex flex-col items-center justify-center w-full">
                      <h3 className="font-display text-lg sm:text-xl uppercase mb-1 text-white leading-tight line-clamp-2">
                        {ep.title}
                      </h3>
                      <p className="font-mono text-[10px] text-neutral-400 mb-2 tracking-widest uppercase">
                        {ep.duration}
                      </p>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-2">
                        {ep.description}
                      </p>
                    </div>
                    
                    <span
                      aria-label={`Watch ${ep.title} on YouTube`}
                      className="btn-primary mt-2 w-full font-mono text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      Watch Now
                      <PlayCircle className="w-3 h-3 sm:w-4 sm:h-4 ml-2" aria-hidden="true" />
                    </span>
                  </div>
                </div>

              </div>
            </a>
          ))}
        </div>
      </div>
    </motion.main>
  );
}
