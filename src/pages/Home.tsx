import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PlayCircle, Instagram, Facebook } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VoicemailWidget from '../components/VoicemailWidget';

gsap.registerPlugin(ScrollTrigger);

export default function Home({ isLoading = false }: { isLoading?: boolean }) {
  const [adminClickCount, setAdminClickCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const widgetInnerRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
    }
  }, []);

  useEffect(() => {
    if (!titleRef.current || isLoading) return;

    const ctx = gsap.context(() => {
      const lines = titleRef.current!.querySelectorAll('.hero-line');
      
      gsap.set(lines, { y: 120, opacity: 0 });

      gsap.to(lines, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "bounce.out",
        stagger: 0.25,
        delay: 0.6
      });

      if (detailsRef.current) {
        const glowTargets = detailsRef.current.querySelectorAll('.glow-target');
        gsap.to(glowTargets, {
          textShadow: "0px 0px 15px rgba(255, 255, 255, 0.8), 0px 0px 30px rgba(255, 255, 255, 0.4)",
          color: "#ffffff",
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.2,
          delay: 1.5
        });

        // Smoothly shift left when the widget approaches
        const getShift = () => {
          if (window.innerWidth < 768) return 0; // Don't shift on mobile
          const parent = detailsRef.current?.parentElement;
          if (!parent || !detailsRef.current) return 0;
          return -(parent.offsetWidth - detailsRef.current.offsetWidth);
        };

        ScrollTrigger.create({
          trigger: detailsRef.current,
          start: "top center+=100", // Trigger when details section gets close to the widget
          onEnter: () => gsap.to(detailsRef.current, { x: getShift(), duration: 1.5, ease: "expo.out", overwrite: "auto" }),
          onLeaveBack: () => gsap.to(detailsRef.current, { x: 0, duration: 1.5, ease: "expo.out", overwrite: "auto" }),
          invalidateOnRefresh: true,
        });
      }

      if (widgetContainerRef.current && widgetInnerRef.current) {
        ScrollTrigger.create({
          trigger: widgetContainerRef.current,
          start: "top top+=24",
          end: "+=10000",
          pin: true,
          pinSpacing: false,
        });

        gsap.to(widgetInnerRef.current, {
          y: 15,
          duration: 2.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 0.5
        });
      }

      if (navContainerRef.current) {
        const links = navContainerRef.current.querySelectorAll('a');
        const tl = gsap.timeline({ delay: 1 });
        
        // Initial state: stacked up (negative margin) and above screen
        gsap.set(navContainerRef.current, { gap: "0px" });
        gsap.set(links, { 
          y: -100, 
          opacity: 0, 
          marginLeft: (i) => i === 0 ? "0px" : "-60px" 
        });

        tl.to(links, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.5)",
          stagger: 0.1
        })
        .to(links, {
          marginLeft: "0px",
          duration: 0.5,
          ease: "power2.out",
          clearProps: "marginLeft"
        }, "+=0.2")
        .to(navContainerRef.current, {
          gap: "0.5rem",
          duration: 0.5,
          ease: "power2.out",
          clearProps: "gap"
        }, "<");
      }
    });

    return () => ctx.revert();
  }, [isLoading]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="relative min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black overflow-x-hidden flex flex-col md:block"
    >
      {/* Video */}
      <video 
        ref={videoRef}
        autoPlay 
        loop 
        muted 
        playsInline 
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover opacity-[0.35] md:opacity-50 pointer-events-none z-0 bg-black"
        src="/background.mp4"
      />
      
      {/* Video Watermark Cover */}
      <div className="fixed -bottom-4 -right-4 w-48 h-32 md:w-64 md:h-40 bg-gradient-to-tl from-black via-black/95 to-transparent pointer-events-none z-0 blur-sm"></div>

      {/* Content Container */}
      <div className="relative z-10 flex-1 p-6 pt-12 sm:p-8 md:p-12 lg:p-16 flex flex-col md:grid md:grid-cols-12 md:grid-rows-[auto_1fr_auto] gap-y-10 md:gap-y-12 md:min-h-screen">
        {/* Top Row */}
        <div className="order-1 md:order-none col-span-1 md:col-span-8">
          <h1 
            ref={titleRef} 
            onClick={() => setAdminClickCount(prev => prev + 1)}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] leading-[1.1] tracking-wide mb-6 md:mb-8 cursor-default select-none"
          >
            <div className="overflow-hidden"><div className="hero-line">PODCAST //</div></div>
            <div className="overflow-hidden"><div className="hero-line">LISTEN</div></div>
            <div className="overflow-hidden"><div className="hero-line">PLEASURE.</div></div>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-xl leading-relaxed">
            Unfiltered conversations and unapologetic truths. We tackle the real topics—from social justice to pop culture—with zero sugarcoating. Tune in, get uncomfortable, and grow.
          </p>
        </div>
        
        <div className="order-5 md:order-none col-span-1 md:col-span-4 flex flex-col justify-start md:justify-end items-end mt-8 md:mt-0 gap-6 z-50">
          <div ref={navContainerRef} className="flex flex-wrap items-center gap-1 sm:gap-2 font-mono text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.2em] text-neutral-400 mt-2">
            <Link 
              to="/meet-the-host"
              className="hover:text-purple-600 hover:bg-white hover:scale-105 transition-all duration-300 uppercase py-2 px-3 sm:px-5 rounded-full inline-block whitespace-nowrap"
            >
              Hosts
            </Link>
            <Link 
              to="/episodes"
              className="hover:text-purple-600 hover:bg-white hover:scale-105 transition-all duration-300 uppercase py-2 px-3 sm:px-5 rounded-full inline-block whitespace-nowrap"
            >
              Episodes
            </Link>
            <Link 
              to="/about"
              className="hover:text-purple-600 hover:bg-white hover:scale-105 transition-all duration-300 uppercase py-2 px-3 sm:px-5 rounded-full inline-block whitespace-nowrap"
            >
              About
            </Link>
            <Link 
              to="/special-events"
              className="hover:text-purple-600 hover:bg-white hover:scale-105 transition-all duration-300 uppercase py-2 px-3 sm:px-5 rounded-full inline-block whitespace-nowrap"
            >
              Special Events
            </Link>
            <Link 
              to="/pitch"
              className="hover:text-purple-600 hover:bg-white hover:scale-105 transition-all duration-300 uppercase py-2 px-3 sm:px-5 rounded-full inline-block whitespace-nowrap text-white"
            >
              Pitch Us
            </Link>
          </div>

          <div ref={widgetContainerRef} className="w-full max-w-[320px] z-50">
            <div ref={widgetInnerRef} className="w-full">
              <VoicemailWidget />
            </div>
          </div>
        </div>

        {/* Middle Row */}
        {/* Removed PODCAST DETAILS section */}

        {/* Bottom Row */}
        <div className="order-2 md:order-none col-span-1 md:col-span-6 flex flex-col justify-end mt-8 md:mt-0">
          <div className="max-w-sm">
            <a 
              href="http://www.youtube.com/@ListeningPleasurePodcast"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary self-start font-mono text-xs tracking-[0.2em] uppercase"
            >
              Watch on YT
              <PlayCircle className="w-4 h-4 ml-2" aria-hidden="true" />
            </a>
          </div>
        </div>
        
        <div className="order-3 md:order-none col-span-1 md:col-span-6 flex justify-start md:justify-end items-end mt-2 md:mt-0">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 font-mono text-[10px] sm:text-xs md:text-sm tracking-[0.15em] text-neutral-400">
            <a href="https://www.patreon.com/ListeningPleasure" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors py-1 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded" aria-label="Patreon">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true">
                <path d="M15.386.524c-4.764 0-8.64 3.876-8.64 8.64 0 4.75 3.876 8.613 8.64 8.613 4.75 0 8.614-3.864 8.614-8.613C24 4.4 20.136.524 15.386.524M.003 23.537h4.22V.524H.003"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@listeningpleasurepodcast" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors py-1 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded" aria-label="TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.15 4.34-2.9 5.61-1.74 1.28-4.08 1.62-6.13 1.05-2.05-.56-3.74-2.02-4.52-3.96-.78-1.94-.58-4.24.53-6.02 1.1-1.78 2.98-2.93 5.06-3.15.15-.02.31-.02.46-.02v4.06c-1.04.09-2.05.65-2.65 1.49-.6.84-.75 1.96-.4 2.94.35.98 1.18 1.75 2.18 2.03 1 .28 2.11.08 2.92-.54.81-.62 1.3-1.6 1.34-2.63.05-4.5.02-9.01.03-13.51h.01z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/listeningpleasurepodcast?igsh=YzQzYnlvenIyY2Y5" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors py-1 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded" aria-label="Instagram">
              <Instagram className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </a>
            <a href="https://www.facebook.com/share/Y2bcS47qQhtPR47n/?mibextid=qi20mg" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors py-1 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded" aria-label="Facebook">
              <Facebook className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </a>
            <Link to="/inbox" className="hover:text-white transition-colors py-1 opacity-40 hover:opacity-100 ml-2 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              ADMIN
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
