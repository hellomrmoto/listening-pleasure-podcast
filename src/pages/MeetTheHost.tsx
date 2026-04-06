import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HostCardProps {
  name: string;
  role: string;
  bio: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
  innerRef: React.RefObject<HTMLDivElement | null>;
  zIndex: number;
  imageUrl?: string;
}

function HostCard({ name, role, bio, cardRef, innerRef, zIndex, imageUrl }: HostCardProps) {
  return (
    <div 
      ref={cardRef}
      className="absolute top-1/2 left-1/2 w-[85vw] max-w-sm aspect-[3/4] perspective-[1000px] will-change-transform"
      style={{ zIndex }}
    >
      <div 
        ref={innerRef}
        className="relative w-full h-full [transform-style:preserve-3d] will-change-transform"
      >
        {/* Front of Card (Image) */}
        <div className="absolute inset-0 [backface-visibility:hidden] bg-neutral-900 border border-white/10 group">
          {imageUrl ? <img src={imageUrl} alt={name} className="absolute inset-0 w-full h-full object-cover object-center" /> : <div className="absolute inset-0 bg-neutral-800" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />

          {/* Folded Corner Effect */}
          <div className="absolute -top-[1px] -right-[1px] w-16 h-16 z-30 transition-all duration-300 group-hover:w-20 group-hover:h-20">
            <div className="absolute top-0 right-0 w-full h-full bg-[#0a0a0a]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
            <div className="absolute top-0 right-0 w-full h-full drop-shadow-[-4px_4px_6px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-neutral-200 to-neutral-500" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}>
                <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,white_2px,white_4px)]" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-8 z-20">
            <h2 className="font-display text-3xl md:text-4xl mb-2 uppercase">{name}</h2>
            <p className="font-mono text-sm tracking-[0.2em] text-neutral-400 uppercase">{role}</p>
          </div>
        </div>

        {/* Back of Card (Bio) */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-neutral-900 border border-white/10 p-8 flex flex-col justify-center items-center text-center">
          <h2 className="font-display text-3xl mb-6 uppercase text-white">{name}</h2>
          <div className="w-12 h-[1px] bg-neutral-700 mb-6"></div>
          <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
            {bio}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MeetTheHost() {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card1InnerRef = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card2InnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=400%", // 4x window height for scroll duration
            scrub: 1,
            pin: true,
          }
        });

        gsap.set([card1Ref.current, card2Ref.current], { 
          xPercent: -50, 
          yPercent: -50,
          y: "50vh", 
          opacity: 0 
        });

        tl.to(card1Ref.current, { y: 0, opacity: 1, duration: 1 })
          .to(card1InnerRef.current, { rotateY: 180, duration: 1 })
          .to(card2Ref.current, { y: 0, opacity: 1, duration: 1 })
          .addLabel("spread")
          .to(card1Ref.current, { xPercent: 5, duration: 1 }, "spread")
          .to(card2InnerRef.current, { rotateY: 180, duration: 1 }, "spread")
          .to(card2Ref.current, { xPercent: -105, duration: 1 }, "spread");
      });

      mm.add("(max-width: 767px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=400%",
            scrub: 1,
            pin: true,
          }
        });

        gsap.set([card1Ref.current, card2Ref.current], { 
          xPercent: -50, 
          yPercent: -50,
          y: "50vh", 
          opacity: 0 
        });

        tl.to(card1Ref.current, { y: 0, opacity: 1, duration: 1 })
          .to(card1InnerRef.current, { rotateY: 180, duration: 1 })
          .to(card2Ref.current, { y: 0, opacity: 1, duration: 1 })
          .addLabel("spread")
          .to(card1Ref.current, { yPercent: -105, scale: 0.9, duration: 1 }, "spread")
          .to(card2InnerRef.current, { rotateY: 180, duration: 1 }, "spread")
          .to(card2Ref.current, { yPercent: 5, scale: 0.9, duration: 1 }, "spread");
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-black"
    >
      {/* Pinned Animation Section */}
      <div ref={containerRef} className="h-screen w-full relative overflow-hidden flex flex-col">
        {/* Header section */}
        <div className="pt-16 px-6 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto w-full relative z-30">
          <Link to="/" className="btn-primary mb-12 text-xs font-mono tracking-widest uppercase self-start inline-flex">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide uppercase mb-4">
            Meet The Hosts
          </h1>
          <p className="text-neutral-400 font-mono text-sm tracking-widest uppercase">
            Scroll down to reveal
          </p>
        </div>

        {/* Cards Area */}
        <div className="flex-grow relative w-full">
          <HostCard 
            name="Host Name 1"
            role="Co-Founder & DJ"
            bio="Bio placeholder for the first host. Add details about their background, musical influences, and role in the podcast here. They bring the energy and set the tone for every episode."
            cardRef={card1Ref}
            innerRef={card1InnerRef}
            zIndex={10}
            imageUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
          />
          <HostCard 
            name="Host Name 2"
            role="Co-Founder & Producer"
            bio="Bio placeholder for the second host. Add details about their background, musical influences, and role in the podcast here. They are the mastermind behind the soundscapes and audio engineering."
            cardRef={card2Ref}
            innerRef={card2InnerRef}
            zIndex={20}
          />
        </div>
      </div>
      
      {/* Add some padding at the bottom so it doesn't just end abruptly after unpinning */}
      <div className="h-[50vh] flex flex-col items-center justify-center bg-[#0a0a0a] relative z-10">
        <div className="w-[1px] h-24 bg-gradient-to-b from-white/20 to-transparent mb-8"></div>
        <p className="text-neutral-500 font-mono tracking-widest uppercase text-sm">End of Profiles</p>
      </div>
    </motion.div>
  );
}
