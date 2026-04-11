import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Inbox as InboxIcon, 
  Mic, 
  MessageSquare, 
  Trash2, 
  Play, 
  Pause, 
  Video, 
  Clock, 
  User, 
  Mail,
  LogOut,
  ShieldCheck,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  doc,
  Timestamp 
} from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { db, auth } from '../firebase';

interface VoiceNote {
  id: string;
  name?: string;
  email: string;
  audioData?: string;
  videoData?: string;
  type?: 'audio' | 'video';
  createdAt: Timestamp;
}

interface Pitch {
  id: string;
  name?: string;
  email: string;
  topic: string;
  createdAt: Timestamp;
}

export default function Inbox() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'voice_notes' | 'pitches'>('voice_notes');
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const adminEmails = ["caseydubbz2003@gmail.com", "jwedmonds22@gmail.com"];
  const isAdmin = user?.email && adminEmails.includes(user.email);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const vnQuery = query(collection(db, 'voice_notes'), orderBy('createdAt', 'desc'));
    const pQuery = query(collection(db, 'pitches'), orderBy('createdAt', 'desc'));

    const unsubVN = onSnapshot(vnQuery, (snapshot) => {
      setVoiceNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VoiceNote)));
    }, (err) => {
      console.error("Error fetching voice notes:", err);
      setError("Failed to load voice notes. Check permissions.");
    });

    const unsubP = onSnapshot(pQuery, (snapshot) => {
      setPitches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pitch)));
    }, (err) => {
      console.error("Error fetching pitches:", err);
      setError("Failed to load pitches. Check permissions.");
    });

    return () => {
      unsubVN();
      unsubP();
    };
  }, [isAdmin]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  const handleLogout = () => signOut(auth);

  const handleDelete = async (collectionName: string, id: string) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete.");
    }
  };

  const formatTime = (timestamp: Timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
        <ShieldCheck className="w-16 h-16 text-purple-500 mb-6" />
        <h1 className="font-display text-4xl uppercase mb-4">Admin Access</h1>
        <p className="text-neutral-400 mb-8 text-center max-w-md">
          This area is restricted to podcast administrators. Please log in with your authorized Google account.
        </p>
        <button 
          onClick={handleLogin}
          className="bg-white text-black font-display text-sm uppercase tracking-widest py-4 px-10 rounded-full hover:bg-neutral-200 transition-all flex items-center gap-3"
        >
          Login with Google
        </button>
        <Link to="/" className="mt-8 text-neutral-500 hover:text-white transition-colors flex items-center gap-2 font-mono text-xs uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Site
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="font-display text-4xl uppercase mb-4">Access Denied</h1>
        <p className="text-neutral-400 mb-8 text-center max-w-md">
          Your account ({user.email}) is not authorized to access the admin inbox.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={handleLogout}
            className="border border-white/20 text-white font-display text-xs uppercase tracking-widest py-3 px-8 rounded-full hover:bg-white hover:text-black transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            Logout
          </button>
          <Link to="/" className="bg-white text-black font-display text-xs uppercase tracking-widest py-3 px-8 rounded-full hover:bg-neutral-200 transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none">
            Back to Site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white selection:text-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none" aria-label="Back to Home">
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/20">
                <InboxIcon className="w-5 h-5" />
              </div>
              <h1 className="font-display text-2xl uppercase tracking-tight">Inbox</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Admin</span>
              <span className="text-xs text-white">{user.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-white/10 mb-12">
          <button 
            onClick={() => setActiveTab('voice_notes')}
            className={`pb-4 text-sm font-mono uppercase tracking-[0.2em] transition-all relative ${activeTab === 'voice_notes' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Voice Notes ({voiceNotes.length})
            {activeTab === 'voice_notes' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('pitches')}
            className={`pb-4 text-sm font-mono uppercase tracking-[0.2em] transition-all relative ${activeTab === 'pitches' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Pitches ({pitches.length})
            {activeTab === 'pitches' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm font-mono mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'voice_notes' ? (
            <motion.div 
              key="vn-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {voiceNotes.length === 0 ? (
                <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl">
                  <Mic className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                  <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest">No voice notes yet</p>
                </div>
              ) : (
                voiceNotes.map((note) => (
                  <div key={note.id} className="bg-neutral-900/40 border border-white/5 rounded-3xl p-6 hover:border-white/20 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${note.type === 'video' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {note.type === 'video' ? <Video className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </div>
                      <button 
                        onClick={() => handleDelete('voice_notes', note.id)}
                        aria-label="Delete voice note"
                        className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-neutral-500" aria-hidden="true" />
                        <span className="text-sm font-medium">{note.name || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-neutral-500" aria-hidden="true" />
                        <span className="text-xs text-neutral-400 truncate">{note.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-neutral-500" aria-hidden="true" />
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{formatTime(note.createdAt)}</span>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                      {note.type === 'video' && note.videoData ? (
                        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                          <video 
                            src={note.videoData} 
                            controls 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setPlayingId(playingId === note.id ? null : note.id)}
                            aria-label={playingId === note.id ? "Pause voice note" : "Play voice note"}
                            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                          >
                            {playingId === note.id ? <Pause className="w-4 h-4 fill-current" aria-hidden="true" /> : <Play className="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />}
                          </button>
                          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden" aria-hidden="true">
                            <div className={`h-full bg-purple-500 ${playingId === note.id ? 'w-full transition-all duration-[60s] ease-linear' : 'w-0'}`} />
                          </div>
                        </div>
                      )}
                      {playingId === note.id && note.audioData && (
                        <audio 
                          src={note.audioData} 
                          autoPlay 
                          onEnded={() => setPlayingId(null)}
                          className="hidden"
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="p-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {pitches.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
                  <MessageSquare className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                  <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest">No pitches yet</p>
                </div>
              ) : (
                pitches.map((pitch) => (
                  <div key={pitch.id} className="bg-neutral-900/40 border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
                        <span className="text-sm font-medium text-white">{pitch.name || 'Anonymous'}</span>
                        <span className="text-xs text-neutral-500 font-mono uppercase tracking-widest">{pitch.email}</span>
                        <span className="text-[10px] text-neutral-600 font-mono uppercase tracking-widest">• {formatTime(pitch.createdAt)}</span>
                      </div>
                      <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
                        {pitch.topic}
                      </p>
                    </div>

                    <button 
                      onClick={() => handleDelete('pitches', pitch.id)}
                      aria-label="Delete pitch"
                      className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all self-end sm:self-start focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
                    >
                      <Trash2 className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
