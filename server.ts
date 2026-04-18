import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import nodemailer from "nodemailer";

const app = express();

async function startServer() {
const PORT = Number(process.env.PORT) || 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Increase payload limit for Base64 audio/video
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Email configuration
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // API Routes
  app.post("/api/send-email", async (req, res) => {
    const { name, email, type, data, topic } = req.body;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email credentials not configured. Skipping email send.");
      return res.status(200).json({ status: "skipped", message: "Email credentials not configured" });
    }

    try {
      let subject = "";
      let text = "";
      let attachments = [];

      if (type === 'pitch') {
        subject = `New Podcast Pitch from ${name || 'Anonymous'}`;
        text = `You received a new topic pitch.\n\nFrom: ${name || 'Anonymous'}\nEmail: ${email}\n\nTopic/Pitch:\n${topic}`;
      } else if (type === 'signup') {
        subject = `🎉 New Event Sign-Up from ${name || 'Anonymous'}`;
        text = `You have a new sign-up for the listening party!\n\nName: ${name}\nEmail: ${email}\nTime Slot: ${req.body.timeSlot}\nPhone Number: ${req.body.phone || 'Not provided'}\nQuick Message: ${req.body.notes || 'None'}`;
      } else {
        subject = `New ${type === 'video' ? 'Video' : 'Voice'} Message from ${name || 'Anonymous'}`;
        text = `You received a new ${type} message.\n\nFrom: ${name || 'Anonymous'}\nEmail: ${email}\n\nA copy of the recording is attached.`;
        if (data) {
          attachments.push({
            filename: `message-${Date.now()}.${type === 'video' ? 'webm' : 'webm'}`,
            path: data,
          });
        }
      }

      const mailOptions = {
        from: `"Listening Pleasure Podcast" <${process.env.EMAIL_USER}>`,
        to: "listeningpleasure-podcast@gmail.com",
        subject,
        text,
        attachments,
      };

      await transporter.sendMail(mailOptions);
      res.json({ status: "ok" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ status: "error", message: "Failed to send email" });
    }
  });

  // --- Spades Game Logic ---
  const rooms: Record<string, any> = {};

  io.on('connection', (socket) => {
    socket.on('joinRoom', ({ room, username }) => {
      socket.join(room);
      if (!rooms[room]) {
        rooms[room] = { players: [], status: 'waiting', timer: null, countdown: 7 };
      }
      const r = rooms[room];

      if (r.status === 'playing' || r.players.length >= 4) {
         socket.emit('message', { user: 'System', text: 'Room is full or game already started.' });
         return;
      }

      r.players.push({ id: socket.id, username, isBot: false });
      io.to(room).emit('roomState', { players: r.players, status: r.status, countdown: r.countdown });
      io.to(room).emit('message', { user: 'System', text: `${username} joined the room.` });

      if (r.players.length === 1 && r.status === 'waiting') {
        r.countdown = 7;
        r.timer = setInterval(() => {
          r.countdown--;
          io.to(room).emit('roomState', { players: r.players, status: r.status, countdown: r.countdown });
          if (r.countdown <= 0) {
            clearInterval(r.timer);
            startGame(room);
          }
        }, 1000);
      } else if (r.players.length === 4 && r.status === 'waiting') {
        clearInterval(r.timer);
        startGame(room);
      }
    });

    socket.on('submitBid', ({ room, bid }) => {
      handleBid(room, socket.id, bid);
    });

    socket.on('playCard', ({ room, card }) => {
      handlePlayCard(room, socket.id, card);
    });

    socket.on('leaveRoom', (room) => {
      socket.leave(room);
      if (rooms[room]) {
        rooms[room].players = rooms[room].players.filter((p: any) => p.id !== socket.id);
        io.to(room).emit('roomState', { players: rooms[room].players, status: rooms[room].status, countdown: rooms[room].countdown });
        if (rooms[room].players.length === 0) {
           if (rooms[room].timer) clearInterval(rooms[room].timer);
           delete rooms[room];
        }
      }
    });

    socket.on('sendMessage', (data) => {
      io.to(data.room).emit('message', { user: data.user, text: data.message });
    });

    socket.on('disconnect', () => {
      for (const room in rooms) {
        const r = rooms[room];
        const playerIndex = r.players.findIndex((p: any) => p.id === socket.id);
        if (playerIndex !== -1) {
          const p = r.players[playerIndex];
          r.players.splice(playerIndex, 1);
          io.to(room).emit('message', { user: 'System', text: `${p.username} disconnected.` });
          io.to(room).emit('roomState', { players: r.players, status: r.status, countdown: r.countdown });
          if (r.players.length === 0) {
            if (r.timer) clearInterval(r.timer);
            delete rooms[room];
          }
        }
      }
    });
  });

  function startGame(room: string) {
    const r = rooms[room];
    r.status = 'bidding';
    r.bids = {};
    r.tricksWon = {};
    r.currentBidderIndex = 0;
    
    let botCount = 1;
    while (r.players.length < 4) {
      r.players.push({ id: `bot-${botCount}`, username: `Bot ${botCount}`, isBot: true });
      botCount++;
    }

    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    let deck: any[] = [];
    suits.forEach(s => values.forEach(v => deck.push({ suit: s, value: v })));

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const suitOrder: Record<string, number> = { '♠': 4, '♥': 3, '♣': 2, '♦': 1 };
    const valueOrder: Record<string, number> = { '2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':11,'Q':12,'K':13,'A':14 };

    r.hands = {};
    r.players.forEach((p: any, index: number) => {
      let hand = deck.slice(index * 13, (index + 1) * 13);
      hand.sort((a, b) => {
        if (suitOrder[a.suit] !== suitOrder[b.suit]) {
          return suitOrder[b.suit] - suitOrder[a.suit];
        }
        return valueOrder[b.value] - valueOrder[a.value];
      });
      r.hands[p.id] = hand;
    });

    io.to(room).emit('gameStarted', { players: r.players, status: r.status });

    r.players.forEach((p: any) => {
      if (!p.isBot) {
        io.to(p.id).emit('yourHand', r.hands[p.id]);
      }
    });

    startBiddingTurn(room);
  }

  function startBiddingTurn(room: string) {
    const r = rooms[room];
    if (!r || r.status !== 'bidding') return;
    
    const player = r.players[r.currentBidderIndex];
    r.bidExpiresAt = Date.now() + 11000; // 11 seconds

    io.to(room).emit('bidTurn', {
      username: player.username,
      expiresAt: r.bidExpiresAt
    });

    if (r.bidTimeout) clearTimeout(r.bidTimeout);

    if (player.isBot) {
      // Bot bids after 2-3 seconds
      const botDelay = Math.floor(Math.random() * 2000) + 1500;
      r.bidTimeout = setTimeout(() => {
        const hand = r.hands[player.id];
        let bid = 0;
        let spadesCount = 0;
        hand.forEach((c: any) => {
          if (c.suit === '♠') {
            spadesCount++;
            if (['A', 'K', 'Q'].includes(c.value)) bid++;
          } else {
            if (['A', 'K'].includes(c.value)) bid++;
          }
        });
        if (spadesCount > 3) {
          bid += (spadesCount - 3);
        }
        if (bid > 13) bid = 13;
        if (bid === 0) bid = 1; // Simple bots don't bid Nil yet
        handleBid(room, player.id, bid);
      }, botDelay);
    } else {
      // Player timeout
      r.bidTimeout = setTimeout(() => {
        handleBid(room, player.id, 3); // Default bid if they run out of time
      }, 11000);
    }
  }

  function handleBid(room: string, playerId: string, bid: number) {
    const r = rooms[room];
    if (!r || r.status !== 'bidding') return;
    
    const player = r.players[r.currentBidderIndex];
    if (player.id !== playerId) return; // Not their turn

    if (r.bidTimeout) clearTimeout(r.bidTimeout);

    r.bids[player.username] = bid;
    io.to(room).emit('bidPlaced', { username: player.username, bid });

    r.currentBidderIndex++;
    if (r.currentBidderIndex < 4) {
      startBiddingTurn(room);
    } else {
      r.status = 'playing';
      r.turnIndex = 0; // First player leads
      r.currentTrick = [];
      r.spadesBroken = false;
      io.to(room).emit('phaseChanged', { 
        status: 'playing', 
        bids: r.bids,
        turn: r.players[r.turnIndex].username,
        trick: []
      });
      
      checkBotTurn(room);
    }
  }

  function handlePlayCard(room: string, playerId: string, card: any) {
    const r = rooms[room];
    if (!r || r.status !== 'playing') return;

    const currentPlayer = r.players[r.turnIndex];
    if (currentPlayer.id !== playerId) return;

    const hand = r.hands[playerId];
    const cardIndex = hand.findIndex((c: any) => c.suit === card.suit && c.value === card.value);
    if (cardIndex === -1) return;

    // --- Spades Rules Validation ---
    const leadSuit = r.currentTrick.length > 0 ? r.currentTrick[0].card.suit : null;

    if (leadSuit) {
      // Must follow suit if possible
      const hasLeadSuit = hand.some((c: any) => c.suit === leadSuit);
      if (hasLeadSuit && card.suit !== leadSuit) {
        io.to(playerId).emit('message', { user: 'System', text: `You must follow suit (${leadSuit}).` });
        return;
      }
    } else {
      // Leading a card
      if (card.suit === '♠' && !r.spadesBroken) {
        // Can only lead Spades if broken or ONLY has Spades
        const onlyHasSpades = hand.every((c: any) => c.suit === '♠');
        if (!onlyHasSpades) {
          io.to(playerId).emit('message', { user: 'System', text: "Spades haven't been broken yet." });
          return;
        }
      }
    }

    // If we get here, the move is valid
    hand.splice(cardIndex, 1);
    r.currentTrick.push({ player: currentPlayer.username, card });

    if (card.suit === '♠' && !r.spadesBroken) {
      r.spadesBroken = true;
      io.to(room).emit('message', { user: 'System', text: "Spades have been broken!" });
    }

    io.to(room).emit('cardPlayed', { 
      username: currentPlayer.username, 
      card,
      trick: r.currentTrick
    });

    r.turnIndex = (r.turnIndex + 1) % 4;

    if (r.currentTrick.length === 4) {
      // Trick finished
      setTimeout(() => {
        const winnerUsername = determineTrickWinner(r.currentTrick);
        r.currentTrick = [];
        r.turnIndex = r.players.findIndex((p: any) => p.username === winnerUsername);
        
        // Update tricks won
        if (!r.tricksWon) r.tricksWon = {};
        r.tricksWon[winnerUsername] = (r.tricksWon[winnerUsername] || 0) + 1;

        io.to(room).emit('trickFinished', { 
          winner: winnerUsername,
          turn: winnerUsername,
          tricksWon: r.tricksWon
        });

        if (r.hands[r.players[0].id].length === 0) {
          // Round finished
          r.status = 'waiting';
          io.to(room).emit('roundFinished', { status: 'waiting', finalTricks: r.tricksWon });
        } else {
          checkBotTurn(room);
        }
      }, 1500);
    } else {
      io.to(room).emit('nextTurn', { turn: r.players[r.turnIndex].username });
      checkBotTurn(room);
    }
  }

  function checkBotTurn(room: string) {
    const r = rooms[room];
    if (!r || r.status !== 'playing') return;

    const currentPlayer = r.players[r.turnIndex];
    if (currentPlayer.isBot) {
      setTimeout(() => {
        const hand = r.hands[currentPlayer.id];
        const leadSuit = r.currentTrick.length > 0 ? r.currentTrick[0].card.suit : null;
        
        let cardToPlay;

        if (leadSuit) {
          // Must follow suit
          const followCards = hand.filter((c: any) => c.suit === leadSuit);
          if (followCards.length > 0) {
            cardToPlay = followCards[0];
          } else {
            cardToPlay = hand[0]; // Can play anything if can't follow
          }
        } else {
          // Leading
          const nonSpades = hand.filter((c: any) => c.suit !== '♠');
          if (!r.spadesBroken && nonSpades.length > 0) {
            cardToPlay = nonSpades[0];
          } else {
            cardToPlay = hand[0];
          }
        }

        handlePlayCard(room, currentPlayer.id, cardToPlay);
      }, 1000);
    }
  }

  function determineTrickWinner(trick: any[]) {
    const leadSuit = trick[0].card.suit;
    const suitOrder: Record<string, number> = { '♠': 4, '♥': 3, '♣': 2, '♦': 1 };
    const valueOrder: Record<string, number> = { '2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':11,'Q':12,'K':13,'A':14 };

    let winner = trick[0];
    for (let i = 1; i < trick.length; i++) {
      const current = trick[i];
      if (current.card.suit === '♠' && winner.card.suit !== '♠') {
        winner = current;
      } else if (current.card.suit === winner.card.suit) {
        if (valueOrder[current.card.value] > valueOrder[winner.card.value]) {
          winner = current;
        }
      }
    }
    return winner.player;
  }

  if (process.env.NODE_ENV !== "production") {
    const viteModule = "vite";
    const { createServer: createViteServer } = await import(viteModule);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Listen on port 3000 unless running on Vercel (which handles routing itself)
  if (!process.env.VERCEL) {
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
