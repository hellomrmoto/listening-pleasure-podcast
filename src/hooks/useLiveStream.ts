import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface LiveStreamData {
  isLive: boolean;
  videoUrl: string;
  title: string;
  description: string;
}

export function useLiveStream() {
  const [liveData, setLiveData] = useState<LiveStreamData>({
    isLive: false,
    videoUrl: '',
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'livestream'), (docSnap) => {
      if (docSnap.exists()) {
        setLiveData(docSnap.data() as LiveStreamData);
      } else {
        setLiveData({
          isLive: false,
          videoUrl: '',
          title: '',
          description: ''
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error reading livestream settings:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { liveData, loading };
}
