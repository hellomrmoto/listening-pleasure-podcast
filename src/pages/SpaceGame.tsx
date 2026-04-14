import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Rocket, Trophy, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Game Constants & Types ---
const FPS = 60;
const FRICTION = 0.7; // friction coefficient of space (0 = no friction, 1 = lots)
const SHIP_SIZE = 30; // ship height in pixels
const SHIP_THRUST = 5; // acceleration of the ship in pixels per second per second
const TURN_SPEED = 360; // turn speed in degrees per second
const ROIDS_NUM = 5; // starting number of asteroids
const ROIDS_SIZE = 100; // starting size of asteroids in pixels
const ROIDS_SPD = 50; // max starting speed of asteroids in pixels per second
const ROIDS_VERT = 10; // average number of vertices on each asteroid
const LASER_MAX = 10; // maximum number of lasers on screen at once
const LASER_SPD = 500; // speed of lasers in pixels per second
const LASER_DIST = 0.6; // max distance laser can travel as fraction of screen width
const LASER_EXPLODE_DUR = 0.1; // duration of the lasers' explosion

export default function SpaceGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('spaceGameHighScore') || '0')
  );
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // --- Game State ---
    let level = 0;
    let roidsTotal = (ROIDS_NUM + level) * 7;
    let roidsLeft = roidsTotal;
    let ship = newShip();
    let roids: any[] = [];
    let text = "";
    let textAlpha = 0;
    let animationFrameId: number;
    let currentScore = 0;

    createAsteroidBelt();

    // --- Input Handling ---
    const keyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          ship.rot = ((TURN_SPEED / 180) * Math.PI) / FPS;
          break;
        case 'ArrowUp':
        case 'KeyW':
          ship.thrusting = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          ship.rot = ((-TURN_SPEED / 180) * Math.PI) / FPS;
          break;
        case 'Space':
          shootLaser();
          break;
      }
    };

    const keyUp = (e: KeyboardEvent) => {
      if (gameOver) return;
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
        case 'ArrowRight':
        case 'KeyD':
          ship.rot = 0;
          break;
        case 'ArrowUp':
        case 'KeyW':
          ship.thrusting = false;
          break;
        case 'Space':
          ship.canShoot = true;
          break;
      }
    };

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    // --- Entities ---
    function newShip() {
      return {
        x: canvas!.width / 2,
        y: canvas!.height / 2,
        a: (90 / 180) * Math.PI, // convert to radians
        r: SHIP_SIZE / 2,
        blinkNum: Math.ceil(30),
        blinkTime: Math.ceil(3),
        canShoot: true,
        dead: false,
        explodeTime: 0,
        lasers: [] as any[],
        rot: 0,
        thrusting: false,
        thrust: {
          x: 0,
          y: 0,
        },
      };
    }

    function shootLaser() {
      if (ship.canShoot && ship.lasers.length < LASER_MAX) {
        ship.lasers.push({
          x: ship.x + (4 / 3) * ship.r * Math.cos(ship.a),
          y: ship.y - (4 / 3) * ship.r * Math.sin(ship.a),
          xv: (LASER_SPD * Math.cos(ship.a)) / FPS,
          yv: -(LASER_SPD * Math.sin(ship.a)) / FPS,
          dist: 0,
          explodeTime: 0,
        });
      }
      ship.canShoot = false;
    }

    function createAsteroidBelt() {
      roids = [];
      let x, y;
      for (let i = 0; i < ROIDS_NUM + level; i++) {
        do {
          x = Math.floor(Math.random() * canvas!.width);
          y = Math.floor(Math.random() * canvas!.height);
        } while (distBetweenPoints(ship.x, ship.y, x, y) < ROIDS_SIZE * 2 + ship.r);
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 2)));
      }
    }

    function newAsteroid(x: number, y: number, r: number) {
      const lvlMult = 1 + 0.1 * level;
      const roid = {
        x: x,
        y: y,
        xv: ((Math.random() * ROIDS_SPD * lvlMult) / FPS) * (Math.random() < 0.5 ? 1 : -1),
        yv: ((Math.random() * ROIDS_SPD * lvlMult) / FPS) * (Math.random() < 0.5 ? 1 : -1),
        r: r,
        a: Math.random() * Math.PI * 2,
        vert: Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT / 2),
        offs: [] as number[],
      };
      for (let i = 0; i < roid.vert; i++) {
        roid.offs.push(Math.random() * 0.4 * 2 + 1 - 0.4);
      }
      return roid;
    }

    function distBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    function explodeShip() {
      ship.explodeTime = Math.ceil(0.3 * FPS);
    }

    function destroyAsteroid(index: number) {
      const x = roids[index].x;
      const y = roids[index].y;
      const r = roids[index].r;

      // split the asteroid in two if necessary
      if (r === Math.ceil(ROIDS_SIZE / 2)) {
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 4)));
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 4)));
        currentScore += 20;
      } else if (r === Math.ceil(ROIDS_SIZE / 4)) {
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 8)));
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 8)));
        currentScore += 50;
      } else {
        currentScore += 100;
      }

      setScore(currentScore);
      roids.splice(index, 1);

      // new level when no more asteroids
      if (roids.length === 0) {
        level++;
        createAsteroidBelt();
      }
    }

    // --- Main Game Loop ---
    function update() {
      if (!ctx || !canvas) return;

      const blinkOn = ship.blinkNum % 2 === 0;
      const exploding = ship.explodeTime > 0;

      // draw space
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // thrust the ship
      if (ship.thrusting && !ship.dead) {
        ship.thrust.x += (SHIP_THRUST * Math.cos(ship.a)) / FPS;
        ship.thrust.y -= (SHIP_THRUST * Math.sin(ship.a)) / FPS;

        // draw the thruster
        if (!exploding && blinkOn) {
          ctx.fillStyle = '#f97316';
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = SHIP_SIZE / 10;
          ctx.beginPath();
          ctx.moveTo(
            ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
            ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
          );
          ctx.lineTo(
            ship.x - ship.r * (5 / 3) * Math.cos(ship.a),
            ship.y + ship.r * (5 / 3) * Math.sin(ship.a)
          );
          ctx.lineTo(
            ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
            ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
          );
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      } else {
        // apply friction
        ship.thrust.x -= (FRICTION * ship.thrust.x) / FPS;
        ship.thrust.y -= (FRICTION * ship.thrust.y) / FPS;
      }

      // draw the ship
      if (!exploding) {
        if (blinkOn && !ship.dead) {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = SHIP_SIZE / 20;
          ctx.beginPath();
          ctx.moveTo(
            ship.x + (4 / 3) * ship.r * Math.cos(ship.a),
            ship.y - (4 / 3) * ship.r * Math.sin(ship.a)
          );
          ctx.lineTo(
            ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + Math.sin(ship.a)),
            ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - Math.cos(ship.a))
          );
          ctx.lineTo(
            ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - Math.sin(ship.a)),
            ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + Math.cos(ship.a))
          );
          ctx.closePath();
          ctx.stroke();
        }

        // handle blinking
        if (ship.blinkNum > 0) {
          ship.blinkTime--;
          if (ship.blinkTime === 0) {
            ship.blinkTime = Math.ceil(3);
            ship.blinkNum--;
          }
        }
      } else {
        // draw the explosion
        ctx.fillStyle = '#8b0000';
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.7, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.4, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.1, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 0.8, 0, Math.PI * 2, false);
        ctx.fill();
      }

      // draw the asteroids
      let a, r, x, y, offs, vert;
      for (let i = 0; i < roids.length; i++) {
        ctx.strokeStyle = '#a3a3a3';
        ctx.lineWidth = SHIP_SIZE / 20;

        a = roids[i].a;
        r = roids[i].r;
        x = roids[i].x;
        y = roids[i].y;
        offs = roids[i].offs;
        vert = roids[i].vert;

        ctx.beginPath();
        for (let j = 0; j < vert; j++) {
          ctx.lineTo(
            x + r * offs[j] * Math.cos(a + (j * Math.PI * 2) / vert),
            y + r * offs[j] * Math.sin(a + (j * Math.PI * 2) / vert)
          );
        }
        ctx.closePath();
        ctx.stroke();
      }

      // draw the lasers
      for (let i = 0; i < ship.lasers.length; i++) {
        if (ship.lasers[i].explodeTime === 0) {
          ctx.fillStyle = '#a855f7';
          ctx.beginPath();
          ctx.arc(ship.lasers[i].x, ship.lasers[i].y, SHIP_SIZE / 15, 0, Math.PI * 2, false);
          ctx.fill();
        } else {
          // draw the explosion
          ctx.fillStyle = '#d8b4fe';
          ctx.beginPath();
          ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.75, 0, Math.PI * 2, false);
          ctx.fill();
          ctx.fillStyle = '#f3e8ff';
          ctx.beginPath();
          ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.5, 0, Math.PI * 2, false);
          ctx.fill();
        }
      }

      // detect laser hits on asteroids
      let ax, ay, ar, lx, ly;
      for (let i = roids.length - 1; i >= 0; i--) {
        ax = roids[i].x;
        ay = roids[i].y;
        ar = roids[i].r;

        for (let j = ship.lasers.length - 1; j >= 0; j--) {
          if (ship.lasers[j].explodeTime === 0) {
            lx = ship.lasers[j].x;
            ly = ship.lasers[j].y;

            if (distBetweenPoints(ax, ay, lx, ly) < ar) {
              // destroy the asteroid and activate the laser explosion
              destroyAsteroid(i);
              ship.lasers[j].explodeTime = Math.ceil(LASER_EXPLODE_DUR * FPS);
              break;
            }
          }
        }
      }

      // check for asteroid collisions (when not exploding)
      if (!exploding) {
        if (ship.blinkNum === 0 && !ship.dead) {
          for (let i = 0; i < roids.length; i++) {
            if (distBetweenPoints(ship.x, ship.y, roids[i].x, roids[i].y) < ship.r + roids[i].r) {
              explodeShip();
              destroyAsteroid(i);
              break;
            }
          }
        }

        // rotate ship
        ship.a += ship.rot;

        // move the ship
        ship.x += ship.thrust.x;
        ship.y += ship.thrust.y;
      } else {
        ship.explodeTime--;
        if (ship.explodeTime === 0) {
          ship.dead = true;
          setGameOver(true);
        }
      }

      // handle edge of screen
      if (ship.x < 0 - ship.r) ship.x = canvas.width + ship.r;
      else if (ship.x > canvas.width + ship.r) ship.x = 0 - ship.r;
      if (ship.y < 0 - ship.r) ship.y = canvas.height + ship.r;
      else if (ship.y > canvas.height + ship.r) ship.y = 0 - ship.r;

      // move the lasers
      for (let i = ship.lasers.length - 1; i >= 0; i--) {
        // check distance
        ship.lasers[i].dist += Math.sqrt(Math.pow(ship.lasers[i].xv, 2) + Math.pow(ship.lasers[i].yv, 2));

        // handle the explosion
        if (ship.lasers[i].explodeTime > 0) {
          ship.lasers[i].explodeTime--;
          if (ship.lasers[i].explodeTime === 0) {
            ship.lasers.splice(i, 1);
            continue;
          }
        } else {
          // move the laser
          ship.lasers[i].x += ship.lasers[i].xv;
          ship.lasers[i].y += ship.lasers[i].yv;

          // calculate distance traveled
          if (ship.lasers[i].dist > canvas.width * LASER_DIST) {
            ship.lasers.splice(i, 1);
            continue;
          }
        }

        // handle edge of screen
        if (ship.lasers[i].x < 0) ship.lasers[i].x = canvas.width;
        else if (ship.lasers[i].x > canvas.width) ship.lasers[i].x = 0;
        if (ship.lasers[i].y < 0) ship.lasers[i].y = canvas.height;
        else if (ship.lasers[i].y > canvas.height) ship.lasers[i].y = 0;
      }

      // move the asteroids
      for (let i = 0; i < roids.length; i++) {
        roids[i].x += roids[i].xv;
        roids[i].y += roids[i].yv;

        // handle edge of screen
        if (roids[i].x < 0 - roids[i].r) roids[i].x = canvas.width + roids[i].r;
        else if (roids[i].x > canvas.width + roids[i].r) roids[i].x = 0 - roids[i].r;
        if (roids[i].y < 0 - roids[i].r) roids[i].y = canvas.height + roids[i].r;
        else if (roids[i].y > canvas.height + roids[i].r) roids[i].y = 0 - roids[i].r;
      }

      animationFrameId = window.requestAnimationFrame(update);
    }

    update();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, gameOver]);

  // Handle high score updates
  useEffect(() => {
    if (gameOver) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('spaceGameHighScore', score.toString());
      }
    }
  }, [gameOver, score, highScore]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col"
    >
      {/* Neon Blue and Gold Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Neon Blue Glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#00f3ff]/10 mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
        {/* Gold Glow */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#d4af37]/10 mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }} />
        {/* Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>
      {/* Header Overlay */}
      <header className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-50 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link to="/" className="p-2 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full border border-white/10 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <Rocket className="w-6 h-6 text-purple-500" />
            <h1 className="font-display text-2xl uppercase tracking-tight font-bold">Asteroid Protocol</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Score</span>
            <span className="font-mono text-2xl font-bold">{score}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1">
              <Trophy className="w-3 h-3" /> High Score
            </span>
            <span className="font-mono text-2xl font-bold text-purple-400">{highScore}</span>
          </div>
        </div>
      </header>

      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-crosshair"
      />

      {/* Start / Game Over Overlay */}
      <AnimatePresence>
        {(!gameStarted || gameOver) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-40"
          >
            <div className="bg-neutral-900/80 border border-white/10 p-12 rounded-3xl flex flex-col items-center text-center max-w-md w-full shadow-2xl">
              {gameOver ? (
                <>
                  <h2 className="font-display text-5xl uppercase tracking-tighter text-red-500 mb-2">Game Over</h2>
                  <p className="font-mono text-neutral-400 mb-8">Final Score: <span className="text-white font-bold">{score}</span></p>
                </>
              ) : (
                <>
                  <Rocket className="w-16 h-16 text-purple-500 mb-6" />
                  <h2 className="font-display text-4xl uppercase tracking-tighter mb-4">Ready to Launch?</h2>
                  <div className="flex flex-col gap-2 text-sm font-mono text-neutral-400 mb-8 text-left bg-black/50 p-4 rounded-xl w-full">
                    <p>🚀 <strong className="text-white">W / Up Arrow</strong> to Thrust</p>
                    <p>🔄 <strong className="text-white">A/D / L/R Arrows</strong> to Rotate</p>
                    <p>💥 <strong className="text-white">Spacebar</strong> to Shoot</p>
                  </div>
                </>
              )}

              <button
                onClick={startGame}
                className="group relative px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-sm overflow-hidden transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-purple-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                  {gameOver ? <><RotateCcw className="w-4 h-4" /> Play Again</> : 'Start Mission'}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
