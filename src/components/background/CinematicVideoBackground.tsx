import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getBackgroundConfigForPath } from '../../config/backgroundConfigs';
import { ProceduralCanvasBackground } from './ProceduralCanvasBackground';

interface CinematicVideoBackgroundProps {
  children?: React.ReactNode;
}

export const CinematicVideoBackground: React.FC<CinematicVideoBackgroundProps> = ({ children }) => {
  const location = useLocation();
  const config = getBackgroundConfigForPath(location.pathname);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [useFallback, setUseFallback] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Reset video state on route change
    setUseFallback(false);
    setVideoLoaded(false);

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setUseFallback(true);
      return;
    }

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.load();
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoLoaded(true);
          })
          .catch(() => {
            // Video autoplay failed or video file missing -> fallback to procedural canvas
            setUseFallback(true);
          });
      }
    }
  }, [location.pathname, config.videoFile]);

  // Handle tab visibility change to pause video when inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      const videoElement = videoRef.current;
      if (!videoElement) return;
      if (document.hidden) {
        videoElement.pause();
      } else {
        if (!useFallback) {
          videoElement.play().catch(() => setUseFallback(true));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [useFallback]);

  const videoPath = `/videos/${config.videoFile}`;

  return (
    <div className="relative min-h-screen w-full bg-[#08090d]">
      {/* Background Container (fixed, z-index 0 / 1) */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Video Element (z-index 0) */}
        {!useFallback && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-0 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setUseFallback(true)}
            onCanPlay={() => setVideoLoaded(true)}
          >
            <source src={videoPath} type="video/mp4" />
          </video>
        )}

        {/* Procedural Canvas Fallback when video is missing, loading, or fails */}
        {(useFallback || !videoLoaded) && <ProceduralCanvasBackground config={config} />}

        {/* Dark Cinematic Vignette & Overlay (z-index 1) */}
        <div
          className="absolute inset-0 transition-all duration-700 pointer-events-none z-[1]"
          style={{
            background: `
              radial-gradient(circle at 50% 30%, rgba(8, 9, 13, ${config.overlayOpacity * 0.4}) 0%, rgba(8, 9, 13, ${
              config.overlayOpacity * 0.95
            }) 85%),
              linear-gradient(to bottom, rgba(8, 9, 13, 0.7) 0%, rgba(8, 9, 13, ${config.overlayOpacity}) 50%, rgba(8, 9, 13, 0.98) 100%)
            `,
          }}
        />

        {/* Tactical Glow Mesh accent (z-index 1) */}
        <div
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[140px] opacity-20 pointer-events-none transition-colors duration-1000 z-[1]"
          style={{ backgroundColor: config.accentColor }}
        />
        <div
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[160px] opacity-15 pointer-events-none transition-colors duration-1000 z-[1]"
          style={{ backgroundColor: '#3B82F6' }}
        />
      </div>

      {/* Application Layer (z-index 2) */}
      <div className="relative z-[2] min-h-screen">
        {children}
      </div>
    </div>
  );
};
