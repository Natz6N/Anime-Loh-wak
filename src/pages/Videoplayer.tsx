import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, Settings, Maximize, ChevronDown, ChevronUp } from 'lucide-react';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

interface Episode {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
}

interface SkipButton {
  show: boolean;
  startTime: number;
  endTime: number;
}

interface SkipState {
  forward: boolean;
  backward: boolean;
}

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout>();
  const skipIntervalRef = useRef<NodeJS.Timeout>();

  const [playing, setPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(1);
  const [muted, setMuted] = useState<boolean>(false);
  const [showEpisodes, setShowEpisodes] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSkipping, setIsSkipping] = useState<SkipState>({ forward: false, backward: false });
  const [skipSpeed, setSkipSpeed] = useState<number>(1);

  // Skip button states - separate for each type
  const [skipIntro, setSkipIntro] = useState<SkipButton>({ 
    show: false, 
    startTime: 0, 
    endTime: 90 
  });
  const [skipRecap, setSkipRecap] = useState<SkipButton>({ 
    show: false, 
    startTime: 0, 
    endTime: 30 
  });
  const [skipOutro, setSkipOutro] = useState<SkipButton>({ 
    show: false, 
    startTime: 0, 
    endTime: 0 
  });

  // Sample episodes data
  const episodes: Episode[] = [
    { id: 1, title: "Episode 1: The Beginning", duration: "24:30", thumbnail: "/api/placeholder/160/90" },
    { id: 2, title: "Episode 2: New Powers", duration: "23:45", thumbnail: "/api/placeholder/160/90" },
    { id: 3, title: "Episode 3: First Battle", duration: "24:15", thumbnail: "/api/placeholder/160/90" },
    { id: 4, title: "Episode 4: Hidden Truth", duration: "23:30", thumbnail: "/api/placeholder/160/90" },
  ];

  const currentEpisode = episodes[0];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
        case 'ArrowRight':
          skip(10);
          break;
        case 'ArrowLeft':
          skip(-10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          adjustVolume(-0.1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [volume]);

  // Initialize video
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = volume;
      
      const handleLoadedMetadata = (): void => {
        setDuration(video.duration);
        // Set outro start time (last 90 seconds)
        setSkipOutro(prev => ({
          ...prev,
          startTime: Math.max(0, video.duration - 90),
          endTime: video.duration
        }));
      };

      const handleTimeUpdate = (): void => {
        setProgress(video.currentTime);
        checkSkipButtons(video.currentTime);
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('timeupdate', handleTimeUpdate);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, []);

  const checkSkipButtons = useCallback((currentTime: number): void => {
    // Check skip intro (0-90 seconds, but not if recap is active)
    const introActive = currentTime >= skipIntro.startTime && currentTime <= skipIntro.endTime;
    const recapActive = currentTime >= skipRecap.startTime && currentTime <= skipRecap.endTime;
    
    // Show skip intro only if not in recap period
    setSkipIntro(prev => ({ 
      ...prev, 
      show: introActive && !recapActive 
    }));
    
    // Show skip recap (0-30 seconds) - higher priority than intro
    setSkipRecap(prev => ({ 
      ...prev, 
      show: recapActive 
    }));
    
    // Show skip outro (last 90 seconds)
    const outroActive = duration > 0 && currentTime >= skipOutro.startTime && currentTime <= skipOutro.endTime;
    setSkipOutro(prev => ({ 
      ...prev, 
      show: outroActive 
    }));
  }, [duration, skipIntro.startTime, skipIntro.endTime, skipRecap.startTime, skipRecap.endTime, skipOutro.startTime, skipOutro.endTime]);

  const togglePlay = useCallback((): void => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback((): void => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  const adjustVolume = useCallback((delta: number): void => {
    const newVolume = Math.max(0, Math.min(1, volume + delta));
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume === 0) {
        setMuted(true);
      } else if (muted) {
        setMuted(false);
      }
    }
  }, [volume, muted]);

  const skip = useCallback((seconds: number): void => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  }, [duration]);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newTime = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setMuted(newVolume === 0);
    }
  };

  const handleMouseMove = useCallback((): void => {
    setShowControls(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (!showEpisodes && !showSettings) {
        setShowControls(false);
      }
    }, 3000);
  }, [showEpisodes, showSettings]);

  const toggleFullscreen = useCallback((): void => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(console.error);
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(console.error);
    }
  }, []);

  // Skip functions - direct jump, not fast forward
  const handleSkipIntro = useCallback((): void => {
    if (videoRef.current) {
      videoRef.current.currentTime = skipIntro.endTime; // Jump to end of intro
    }
  }, [skipIntro.endTime]);

  const handleSkipRecap = useCallback((): void => {
    if (videoRef.current) {
      videoRef.current.currentTime = skipRecap.endTime; // Jump to end of recap
    }
  }, [skipRecap.endTime]);

  const handleSkipOutro = useCallback((): void => {
    if (videoRef.current) {
      videoRef.current.currentTime = skipOutro.endTime; // Jump to end of video
    }
  }, [skipOutro.endTime]);

  const changePlaybackRate = useCallback((rate: number): void => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  }, []);

  // Fast forward/rewind on hold
  const startSkipping = useCallback((direction: keyof SkipState): void => {
    setIsSkipping(prev => ({ ...prev, [direction]: true }));
    setSkipSpeed(1);
    
    skipIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      if (!video) return;
      
      const skipAmount = direction === 'forward' ? 2 : -2;
      video.currentTime = Math.max(0, Math.min(duration, video.currentTime + skipAmount));
      
      setSkipSpeed(prev => Math.min(prev + 0.5, 5));
    }, 200);
  }, [duration]);

  const stopSkipping = useCallback((direction: keyof SkipState): void => {
    setIsSkipping(prev => ({ ...prev, [direction]: false }));
    if (skipIntervalRef.current) {
      clearInterval(skipIntervalRef.current);
    }
    setSkipSpeed(1);
  }, []);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
      if (skipIntervalRef.current) {
        clearInterval(skipIntervalRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-black group overflow-hidden"
      style={{ aspectRatio: '16/9' }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        className="w-full h-full object-contain"
        controls={false}
        onClick={togglePlay}
      />

      {/* Skip Areas */}
      <div 
        className="absolute left-0 top-0 w-1/3 h-full flex items-center justify-start pl-8 cursor-pointer"
        onMouseDown={() => startSkipping('backward')}
        onMouseUp={() => stopSkipping('backward')}
        onMouseLeave={() => stopSkipping('backward')}
      >
        {isSkipping.backward && (
          <div className="bg-black/80 rounded-full p-4 text-white">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏪</span>
              <span>{skipSpeed.toFixed(1)}x</span>
            </div>
          </div>
        )}
      </div>

      <div 
        className="absolute right-0 top-0 w-1/3 h-full flex items-center justify-end pr-8 cursor-pointer"
        onMouseDown={() => startSkipping('forward')}
        onMouseUp={() => stopSkipping('forward')}
        onMouseLeave={() => stopSkipping('forward')}
      >
        {isSkipping.forward && (
          <div className="bg-black/80 rounded-full p-4 text-white">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏩</span>
              <span>{skipSpeed.toFixed(1)}x</span>
            </div>
          </div>
        )}
      </div>

      {/* Skip Buttons - Prioritized display */}
      {showControls && (
        <>
          {/* Recap has highest priority */}
          {skipRecap.show && (
            <button
              onClick={handleSkipRecap}
              className="absolute top-4 right-4 w-fit bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-lg"
            >
              Skip Recap
            </button>
          )}
          
          {/* Skip Intro - only show if recap is not active */}
          {skipIntro.show && !skipRecap.show && (
            <button
              onClick={handleSkipIntro}
              className="absolute top-4 w-fit right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-lg"
            >
              Skip Intro
            </button>
          )}
          
          {/* Skip Outro */}
          {skipOutro.show && (
            <button
              onClick={handleSkipOutro}
              className="absolute top-4 right-4 w-fit bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-lg"
            >
              Skip Outro
            </button>
          )}
        </>
      )}

      {/* Episodes Panel */}
      {showEpisodes && (
        <div className="absolute top-0 right-0 w-80 h-full bg-black/95 text-white p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Episodes</h3>
            <button 
              onClick={() => setShowEpisodes(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            {episodes.map((episode) => (
              <div 
                key={episode.id}
                className={`flex gap-3 p-2 rounded cursor-pointer hover:bg-white/10 ${
                  episode.id === currentEpisode.id ? 'bg-red-600/30' : ''
                }`}
              >
                <img 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  className="w-20 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{episode.title}</h4>
                  <p className="text-xs text-gray-400">{episode.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute bottom-20 right-4 bg-black/95 text-white rounded-lg p-4 min-w-48">
          <h4 className="font-semibold mb-3">Playback Speed</h4>
          <div className="space-y-2">
            {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
              <button
                key={rate}
                onClick={() => changePlaybackRate(rate)}
                className={`w-full text-left px-3 py-2 rounded hover:bg-white/10 ${
                  playbackRate === rate ? 'bg-red-600' : ''
                }`}
              >
                {rate === 1 ? 'Normal' : `${rate}x`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 text-white transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min={0}
            max={duration}
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer progress-slider"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={togglePlay}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
              type="button"
            >
              {playing ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleMute}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
                type="button"
              >
                {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer volume-slider"
              />
            </div>

            <span className="text-sm">
              {formatTime(progress)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowEpisodes(!showEpisodes)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors flex items-center gap-1 text-sm"
              type="button"
            >
              <span>Episodes</span>
              {showEpisodes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
              type="button"
            >
              <Settings size={20} />
            </button>
            
            <button 
              onClick={toggleFullscreen}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
              type="button"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Playback Rate Indicator */}
      {playbackRate !== 1 && (
        <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-lg text-sm">
          {playbackRate}x
        </div>
      )}

      {/* Custom CSS for sliders */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .progress-slider {
            background: linear-gradient(to right, #ef4444 0%, #ef4444 ${(progress / duration) * 100}%, #4b5563 ${(progress / duration) * 100}%, #4b5563 100%);
          }
          
          .volume-slider {
            background: linear-gradient(to right, #ef4444 0%, #ef4444 ${(muted ? 0 : volume) * 100}%, #4b5563 ${(muted ? 0 : volume) * 100}%, #4b5563 100%);
          }
          
          .progress-slider::-webkit-slider-thumb,
          .volume-slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #ef4444;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          }
          
          .progress-slider::-moz-range-thumb,
          .volume-slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #ef4444;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          }
        `
      }} />
    </div>
  );
};

export default VideoPlayer;