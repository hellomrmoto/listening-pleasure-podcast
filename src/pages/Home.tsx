import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PlayCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VoicemailWidget from '../components/VoicemailWidget';

gsap.registerPlugin(ScrollTrigger);

export default function Home({ isLoading = false }: { isLoading?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const widgetInnerRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.25;
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
        className="w-full aspect-video object-cover md:fixed md:inset-0 md:h-full opacity-[0.735] md:opacity-40 pointer-events-none z-0 shrink-0 scale-125 origin-center"
        src="https://res.cloudinary.com/dcx2dm5ti/video/upload/v1773431127/Loading_sign_rotate_clockwise_delpmaspu__ygfzml.mp4"
      />

      {/* Content Container */}
      <div className="relative z-10 flex-1 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col md:grid md:grid-cols-12 md:grid-rows-[auto_1fr_auto] gap-y-10 md:gap-y-12 md:min-h-screen">
        {/* Top Row */}
        <div className="order-1 md:order-none col-span-1 md:col-span-8">
          <h1 ref={titleRef} className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] leading-[1.1] tracking-wide mb-6 md:mb-8">
            <div className="overflow-hidden"><div className="hero-line">PODCAST //</div></div>
            <div className="overflow-hidden"><div className="hero-line">LISTEN</div></div>
            <div className="overflow-hidden"><div className="hero-line">PLEASURE.</div></div>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-xl leading-relaxed">
            Unfiltered conversations and unapologetic truths. We tackle the real topics—from social justice to pop culture—with zero sugarcoating. Tune in, get uncomfortable, and grow.
          </p>
        </div>
        
        <div className="order-5 md:order-none col-span-1 md:col-span-4 flex flex-col justify-start md:justify-end items-end mt-8 md:mt-0 gap-6 z-50">
          <div ref={navContainerRef} className="flex flex-wrap items-center gap-1 sm:gap-2 font-mono text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.2em] text-neutral-400 mt-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1.5 shadow-lg">
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
        </div>
        
        <div className="order-3 md:order-none col-span-1 md:col-span-6 flex justify-start md:justify-end items-end mt-2 md:mt-0">
          <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 font-mono text-[10px] sm:text-xs md:text-sm tracking-[0.15em] text-neutral-400">
            <span className="hover:text-white transition-colors cursor-default py-1">STEREO</span>
            <span className="hover:text-white transition-colors cursor-default py-1">HQ</span>
            <span className="hover:text-white transition-colors cursor-default py-1">BASS-HEAVY</span>
            <span className="hover:text-white transition-colors cursor-default py-1">SOUND-SCAPE</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
