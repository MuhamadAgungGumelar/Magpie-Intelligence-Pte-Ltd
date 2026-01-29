'use client';

import { useEffect, useState } from 'react';
import useLoadingStore from '@/store/loadingStore';

export default function GlobalLoadingBar() {
  const isLoading = useLoadingStore((state) => state.isLoading);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    if (isLoading) {
      setVisible(true);
      setProgress(0);

      // Simulate progress animation
      progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          const increment = Math.random() * 10;
          return Math.min(prev + increment, 90);
        });
      }, 200);
    } else {
      // Complete the progress bar
      setProgress(100);

      // Hide after animation completes
      timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 400);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transition-all duration-300 ease-out shadow-lg"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
        }}
      >
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-r from-transparent to-white opacity-30 animate-pulse" />
      </div>
    </div>
  );
}
