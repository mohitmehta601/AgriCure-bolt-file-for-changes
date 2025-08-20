import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

interface VideoProps {
  src: string;
  poster?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  width?: number | string;
  height?: number | string;
}

const Video: React.FC<VideoProps> = ({
  src,
  poster,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  className = "",
  width = "100%",
  height = "100vh"
}) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [videoAspectRatio, setVideoAspectRatio] = useState(16/9);

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const aspectRatio = video.videoWidth / video.videoHeight;
      setVideoAspectRatio(aspectRatio);
      setDuration(video.duration);
    };

    const updateTime = () => setCurrentTime(video.currentTime);
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying && screenSize.width >= 768) {
          setShowControls(false);
        }
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('touchstart', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchstart', handleMouseMove);
      }
      clearTimeout(timeout);
    };
  }, [isPlaying, screenSize.width]);

  const getVideoStyles = () => {
    const { width: screenWidth, height: screenHeight } = screenSize;
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;
    const isDesktop = screenWidth >= 1024;

    const controlsHeight = isMobile ? 80 : 100;
    const availableHeight = screenHeight - controlsHeight;
    const availableWidth = screenWidth;

    let videoWidth = availableWidth;
    let videoHeight = availableWidth / videoAspectRatio;

    if (videoHeight > availableHeight) {
      videoHeight = availableHeight;
      videoWidth = availableHeight * videoAspectRatio;
    }

    if (isMobile) {
      return {
        width: '100vw',
        height: '100vh',
        objectFit: 'contain' as const,
        maxWidth: '100%',
        maxHeight: '100%'
      };
    } else if (isTablet) {
      return {
        width: `${Math.min(videoWidth, screenWidth * 0.95)}px`,
        height: `${Math.min(videoHeight, screenHeight * 0.9)}px`,
        objectFit: 'contain' as const,
        maxWidth: '95vw',
        maxHeight: '90vh'
      };
    } else {
      return {
        width: `${Math.min(videoWidth, screenWidth * 0.9)}px`,
        height: `${Math.min(videoHeight, screenHeight * 0.85)}px`,
        objectFit: 'contain' as const,
        maxWidth: '90vw',
        maxHeight: '85vh'
      };
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const time = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const videoStyles = getVideoStyles();
  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024;
  const sliderThumbHeight = isMobile ? '20px' : '16px';
  const sliderThumbWidth = isMobile ? '20px' : '16px';

  const sliderStyles = {
    thumb: {
      appearance: 'none',
      height: isMobile ? '20px' : '16px',
      width: isMobile ? '20px' : '16px',
      borderRadius: '50%',
      background: '#22c55e',
      cursor: 'pointer',
      border: '2px solid #ffffff',
      boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
      transition: 'all 0.2s ease',
    },
    thumbHover: {
      transform: 'scale(1.2)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.6)',
    },
    focus: {
      outline: 'none',
    },
    focusThumb: {
      boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.3)',
    },
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Video Element with Responsive Sizing */}
      <video
        ref={videoRef}
        style={videoStyles}
        className={`transition-all duration-300 ${
          isMobile ? 'w-full h-full' : 'rounded-lg shadow-2xl'
        }`}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        preload="metadata"
        onClick={isMobile ? togglePlay : undefined}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Controls Overlay */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/70 to-transparent p-2 sm:p-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <Button
              variant="secondary"
              size={isMobile ? "sm" : "default"}
              onClick={handleBack}
              className="flex items-center space-x-1 sm:space-x-2 bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm text-xs sm:text-sm transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>

            {/* Logo */}
            <div className="flex items-center space-x-1 sm:space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 transition-all duration-200 hover:bg-white">
              <img src="/logo.png" alt="AgriCure Logo" className="h-4 w-4 sm:h-6 sm:w-6" />
              <span className="text-sm sm:text-lg font-bold text-grass-800">AgriCure</span>
            </div>
          </div>
        </div>

        {/* Center Play Button (when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={togglePlay}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full border-2 border-white/50 transition-all duration-300 hover:scale-110 shadow-lg"
              size={isMobile ? "default" : "lg"}
            >
              <Play className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-white fill-white`} />
            </Button>
          </div>
        )}

        {/* Bottom Controls */}
        {controls && (
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-4">
            {/* Progress Bar */}
            <div className="mb-2 sm:mb-4">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className={`w-full ${isMobile ? 'h-2' : 'h-1 sm:h-2'} bg-white/30 rounded-lg appearance-none cursor-pointer slider transition-all duration-200`}
                style={{
                  background: `linear-gradient(to right, #22c55e 0%, #22c55e ${progress}%, rgba(255,255,255,0.3) ${progress}%, rgba(255,255,255,0.3) 100%)`
                }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Play/Pause */}
                <Button
                  onClick={togglePlay}
                  variant="ghost"
                  size={isMobile ? "sm" : "default"}
                  className="text-white hover:bg-white/20 p-1 sm:p-2 transition-all duration-200 hover:scale-110"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>

                {/* Mute/Unmute */}
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size={isMobile ? "sm" : "default"}
                  className="text-white hover:bg-white/20 p-1 sm:p-2 transition-all duration-200 hover:scale-110"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>

                {/* Time Display */}
                <div className="text-white text-xs sm:text-sm font-mono bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center space-x-2">
                {/* Screen Size Indicator */}
                <div className="text-white text-xs bg-black/30 px-2 py-1 rounded backdrop-blur-sm hidden sm:block">
                  {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
                </div>

                {/* Fullscreen Toggle (Desktop/Tablet only) */}
                {!isMobile && (
                  <Button
                    onClick={toggleFullscreen}
                    variant="ghost"
                    size="default"
                    className="text-white hover:bg-white/20 p-2 transition-all duration-200 hover:scale-110"
                  >
                    {isFullscreen ? (
                      <Minimize className="h-5 w-5" />
                    ) : (
                      <Maximize className="h-5 w-5" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Tap Zones */}
      {isMobile && (
        <>
          {/* Left tap zone - seek backward */}
          <div 
            className="absolute left-0 top-1/4 bottom-1/4 w-1/3 z-40 flex items-center justify-center"
            onDoubleClick={() => {
              const video = videoRef.current;
              if (video) {
                video.currentTime = Math.max(0, video.currentTime - 10);
              }
            }}
          >
            <div className="text-white text-xs bg-black/30 px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
              Double tap to -10s
            </div>
          </div>
          
          {/* Right tap zone - seek forward */}
          <div 
            className="absolute right-0 top-1/4 bottom-1/4 w-1/3 z-40 flex items-center justify-center"
            onDoubleClick={() => {
              const video = videoRef.current;
              if (video) {
                video.currentTime = Math.min(video.duration, video.currentTime + 10);
              }
            }}
          >
            <div className="text-white text-xs bg-black/30 px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
              Double tap to +10s
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Video;