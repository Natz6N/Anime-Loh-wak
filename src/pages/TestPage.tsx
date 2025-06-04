import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  ChevronLeft,
  Download,
  Shield,
} from "lucide-react";
import { DisLikeIcons, LikeDIcons } from "../components/iconsweb";
import { count } from "console";

// Mock data for demonstration
const mockAnime = {
  id: "1",
  title: "Maou Gakuin no Futekigousha",
  titleJapanese: "The Misfit of Demon King Academy",
  image:
    "https://i.pinimg.com/736x/e4/8b/f3/e48bf3ddf693b8698933d5f902a15b43.jpg",
  rating: 8.5,
  releaseYear: 2025,
  duration: "24 Min",
  publishedAgo: "4 Months Ago",
};

const mockEpisodes = Array.from({ length: 7 }, (_, i) => ({
  id: `ep-${i + 1}`,
  number: i + 1,
  title: `Episode ${i + 1} - Adventure Begins`,
  videoUrl: [
    {
      id: `${i}-360p`,
      quality: "360p",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      size: "150MB",
    },
    {
      id: `${i}-480p`,
      quality: "480p",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      size: "250MB",
    },
    {
      id: `${i}-720p`,
      quality: "720p",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      size: "500MB",
    },
    {
      id: `${i}-1080p`,
      quality: "1080p",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      size: "1GB",
    },
  ],
}));

interface SkipButton {
  show: boolean;
  startTime: number;
  endTime: number;
}

interface SkipState {
  forward: boolean;
  backward: boolean;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

function AnimeCardss() {
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [currentQuality, setCurrentQuality] = useState("720p");

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
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [settingsView, setSettingsView] = useState<
    "main" | "quality" | "speed"
  >("main");
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSkipping, setIsSkipping] = useState<SkipState>({
    forward: false,
    backward: false,
  });
  const [skipSpeed, setSkipSpeed] = useState<number>(1);

  // Skip button states
  const [skipIntro, setSkipIntro] = useState<SkipButton>({
    show: false,
    startTime: 0,
    endTime: 90,
  });
  const [skipRecap, setSkipRecap] = useState<SkipButton>({
    show: false,
    startTime: 0,
    endTime: 30,
  });
  const [skipOutro, setSkipOutro] = useState<SkipButton>({
    show: false,
    startTime: 0,
    endTime: 0,
  });

  const reportReasons = [
    "Video tidak bisa diputar",
    "Subtitle tidak sesuai",
    "Bahasa dubbing salah",
    "Episode tidak lengkap",
    "Episode salah",
    "Lainnya...",
  ];

  // Security: Disable right-click context menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  }, []);

  // Security: Disable keyboard shortcuts for downloading
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      // Disable common download shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        return false;
      }

      // Disable F12 (DevTools)
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+I (DevTools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I") {
        e.preventDefault();
        return false;
      }

      // Player controls
      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;
        case "KeyM":
          toggleMute();
          break;
        case "KeyF":
          toggleFullscreen();
          break;
        case "ArrowRight":
          skip(10);
          break;
        case "ArrowLeft":
          skip(-10);
          break;
        case "ArrowUp":
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case "ArrowDown":
          e.preventDefault();
          adjustVolume(-0.1);
          break;
      }
    },
    [volume]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Initialize video
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = volume;
      video.controlsList.add("nodownload");
      video.disablePictureInPicture = true;

      const handleLoadedMetadata = (): void => {
        setDuration(video.duration);
        setSkipOutro((prev) => ({
          ...prev,
          startTime: Math.max(0, video.duration - 90),
          endTime: video.duration,
        }));
      };

      const handleTimeUpdate = (): void => {
        setProgress(video.currentTime);
        checkSkipButtons(video.currentTime);
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [currentEpisode, currentQuality]);

  const checkSkipButtons = useCallback(
    (currentTime: number): void => {
      const introActive =
        currentTime >= skipIntro.startTime && currentTime <= skipIntro.endTime;
      const recapActive =
        currentTime >= skipRecap.startTime && currentTime <= skipRecap.endTime;

      setSkipIntro((prev) => ({
        ...prev,
        show: introActive && !recapActive,
      }));

      setSkipRecap((prev) => ({
        ...prev,
        show: recapActive,
      }));

      const outroActive =
        duration > 0 &&
        currentTime >= skipOutro.startTime &&
        currentTime <= skipOutro.endTime;
      setSkipOutro((prev) => ({
        ...prev,
        show: outroActive,
      }));
    },
    [duration, skipIntro, skipRecap, skipOutro]
  );

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

  const adjustVolume = useCallback(
    (delta: number): void => {
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
    },
    [volume, muted]
  );

  const skip = useCallback((seconds: number): void => {
    const video = videoRef.current;
    if (!video) return;

    const duration = video.duration;
    if (!isFinite(duration) || isNaN(video.currentTime)) return;

    const newTime = Math.max(
      0,
      Math.min(duration, video.currentTime + seconds)
    );
    video.currentTime = newTime;
  }, []);

  const handleProgressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
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
      if (!showSettings) {
        setShowControls(false);
      }
    }, 3000);
  }, [showSettings]);

  const toggleFullscreen = useCallback((): void => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(console.error);
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(console.error);
    }
  }, []);

  const handleSkipIntro = useCallback((): void => {
    if (videoRef.current) {
      videoRef.current.currentTime = skipIntro.endTime;
    }
  }, [skipIntro.endTime]);

  const handleSkipRecap = useCallback((): void => {
    if (videoRef.current) {
      videoRef.current.currentTime = skipRecap.endTime;
    }
  }, [skipRecap.endTime]);

  const handleSkipOutro = useCallback((): void => {
    if (videoRef.current) {
      videoRef.current.currentTime = skipOutro.endTime;
    }
  }, [skipOutro.endTime]);

  const changePlaybackRate = useCallback((rate: number): void => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
    setSettingsView("main");
  }, []);

  const changeQuality = useCallback((quality: string): void => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    const wasPlaying = !video.paused;

    setCurrentQuality(quality);

    // Wait for video to load new quality
    const handleLoadedData = () => {
      video.currentTime = currentTime;
      if (wasPlaying) video.play();
      video.removeEventListener("loadeddata", handleLoadedData);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    setShowSettings(false);
    setSettingsView("main");
  }, []);

  const startSkipping = useCallback(
    (direction: keyof SkipState): void => {
      setIsSkipping((prev) => ({ ...prev, [direction]: true }));
      setSkipSpeed(1);

      skipIntervalRef.current = setInterval(() => {
        const video = videoRef.current;
        if (!video) return;

        const skipAmount = direction === "forward" ? 2 : -2;
        video.currentTime = Math.max(
          0,
          Math.min(duration, video.currentTime + skipAmount)
        );

        setSkipSpeed((prev) => Math.min(prev + 0.5, 5));
      }, 200);
    },
    [duration]
  );

  const stopSkipping = useCallback((direction: keyof SkipState): void => {
    setIsSkipping((prev) => ({ ...prev, [direction]: false }));
    if (skipIntervalRef.current) {
      clearInterval(skipIntervalRef.current);
    }
    setSkipSpeed(1);
  }, []);

  const handleReportSubmit = () => {
    if (!selectedReason) {
      alert("Silakan pilih alasan terlebih dahulu!");
      return;
    }
    alert(`Terima kasih! Laporan kamu: "${selectedReason}" sudah kami terima.`);
    setReportOpen(false);
    setSelectedReason("");
  };

  const currentEpisodeData = mockEpisodes[currentEpisode];
  const currentVideoUrl =
    currentEpisodeData?.videoUrl.find((v) => v.quality === currentQuality)
      ?.url || "";

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

  const renderSettingsPanel = () => {
    if (settingsView === "quality") {
      return (
        <div className="absolute z-10 flex flex-col bottom-20 right-4 bg-black/95 text-white rounded-lg p-4 min-w-48">
          <div className="flex items-center mb-3">
            <button
              onClick={() => setSettingsView("main")}
              className="hover:bg-gray-700 p-1 rounded mr-2"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-semibold">Quality</span>
          </div>
          <div className="space-y-1">
            {currentEpisodeData?.videoUrl.map((video) => (
              <button
                key={video.id}
                onClick={() => changeQuality(video.quality)}
                className={`w-full text-left px-3 py-2 rounded hover:bg-white/10 flex justify-between ${
                  currentQuality === video.quality ? "bg-red-600" : ""
                }`}
              >
                <span>{video.quality}</span>
                <span className="text-xs text-gray-400">{video.size}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (settingsView === "speed") {
      return (
        <div className="absolute flex z-10 flex-col bottom-20 right-4 bg-black/95 text-white rounded-lg p-4 min-w-48">
          <div className="flex items-center mb-3">
            <button
              onClick={() => setSettingsView("main")}
              className="hover:bg-gray-700 p-1 rounded mr-2"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-semibold">Playback Speed</span>
          </div>
          <div className="space-y-1">
            {speedOptions.map((rate) => (
              <button
                key={rate}
                onClick={() => changePlaybackRate(rate)}
                className={`w-full text-left px-3 py-2 rounded hover:bg-white/10 ${
                  playbackRate === rate ? "bg-red-600" : ""
                }`}
              >
                {rate === 1 ? "Normal" : `${rate}x`}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="absolute z-10 flex flex-col bottom-20 right-4 bg-black/95 text-white rounded-lg p-4 min-w-48">
        <button
          onClick={() => setSettingsView("quality")}
          className="bg-gray-800 w-full flex items-center justify-between hover:bg-gray-700 text-white px-3 py-2 rounded-lg mb-2"
        >
          <span>Quality</span>
          <span className="text-xs text-gray-400">{currentQuality}</span>
        </button>
        <button
          onClick={() => setSettingsView("speed")}
          className="bg-gray-800 w-full flex items-center justify-between hover:bg-gray-700 text-white px-3 py-2 rounded-lg"
        >
          <span>Speed</span>
          <span className="text-xs text-gray-400">{playbackRate}x</span>
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="container m-auto p-2 h-screen w-full relative">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onContextMenu={handleContextMenu}
          className="relative w-full rounded-lg group overflow-hidden select-none"
          style={{ aspectRatio: "16/9" }}
        >
          {/* Security overlay to prevent right-click */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <Shield size={12} />
              Protected Content
            </div>
          </div>

          {/* Video Element */}
          <video
            ref={videoRef}
            src={currentVideoUrl}
            className="w-full h-full object-contain"
            controls={false}
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            onContextMenu={handleContextMenu}
            onClick={togglePlay}
            preload="metadata"
          />

          {/* Skip Areas */}
          <div
            className="absolute left-0 top-0 w-1/3 h-full flex items-center justify-start pl-8 cursor-pointer z-10"
            onMouseDown={() => startSkipping("backward")}
            onMouseUp={() => stopSkipping("backward")}
            onMouseLeave={() => stopSkipping("backward")}
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
            className="absolute right-0 top-0 w-1/3 h-full flex items-center justify-end pr-8 cursor-pointer z-10"
            onMouseDown={() => startSkipping("forward")}
            onMouseUp={() => stopSkipping("forward")}
            onMouseLeave={() => stopSkipping("forward")}
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

          {/* Skip Buttons */}
          {showControls && (
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
              {skipRecap.show && (
                <button
                  onClick={handleSkipRecap}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-lg"
                >
                  Skip Recap
                </button>
              )}

              {skipIntro.show && !skipRecap.show && (
                <button
                  onClick={handleSkipIntro}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-lg"
                >
                  Skip Intro
                </button>
              )}

              {skipOutro.show && (
                <button
                  onClick={handleSkipOutro}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-lg"
                >
                  Skip Outro
                </button>
              )}
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && renderSettingsPanel()}

          {/* Controls */}
          <div className="absolute w-full bottom-0 z-10 left-0">
            <div
              className={`p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
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
                      {muted || volume === 0 ? (
                        <VolumeX size={20} />
                      ) : (
                        <Volume2 size={20} />
                      )}
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
          </div>

          {/* Playback Rate Indicator */}
          {playbackRate !== 1 && (
            <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-lg text-sm z-20">
              {playbackRate}x
            </div>
          )}
        </div>

        <div className="flex mt-[40px] flex-auto gap-4">
          {/* Cover */}
          <div
            className="flex flex-1 flex-col items-center justify-center max-w-[170px] min-w-[100px]"
            style={{ aspectRatio: "2/3" }}
          >
            <img
              src={mockAnime.image}
              alt={mockAnime.title}
              className="rounded-lg w-full h-full object-cover"
              onContextMenu={handleContextMenu}
            />
          </div>

          {/* Info */}
          <div className="block flex-1 gap-4 text-start w-full">
            <p className="flex font-semibold text-sm">
              # {mockAnime.titleJapanese}
            </p>
            <h1 className="flex text-4xl font-bold">{mockAnime.title}</h1>
            <div className="flex gap-2">
              <p>{mockAnime.duration}</p>
              <p>{mockAnime.releaseYear}</p>
              <p>Published {mockAnime.publishedAgo}</p>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">★</span>
                <span className="font-bold">{mockAnime.rating}</span>
              </div>
              <button
                onClick={() => setReportOpen(true)}
                title="Laporkan episode error atau bahasa salah"
                className="hover:text-red-600 transition flex items-center gap-1"
              >
                🚨 Report Issue
              </button>
              <div className="flex gap-2 items-center justify">
                <button className="flex items-center rounded rounded-full">
                  <LikeDIcons size={20} />
                  129
                </button>
                <button className="flex items-center rounded rounded-full">
                  <DisLikeIcons size={20} />1
                </button>
              </div>
            </div>
          </div>

          {/* Episode list */}
          <div className="flex-1 rounded-xl bg-gray-200 overflow-hidden block max-h-[300px] p-2 max-w-[300px] min-w-[100px]">
            <ul className="flex items-center w-full h-full flex-col gap-2 scrollbar overflow-x-hidden">
              {mockEpisodes.map((episode, index) => (
                <li
                  key={episode.id}
                  className={`flex items-center justify-between w-full cursor-pointer hover:bg-gray-300 p-2 rounded-lg ${
                    currentEpisode === index ? "bg-blue-100" : ""
                  }`}
                  onClick={() => setCurrentEpisode(index)}
                >
                  <span>
                    Eps {episode.number} ~ {episode.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
{/* User Command */}
        <div className="flex items-center justify w-full mt-20">
          
        </div>
        {/* Report Modal */}
        {reportOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg animate-fadeIn">
              <h2 className="text-xl font-bold mb-4">Laporkan Episode</h2>
              <p className="mb-2 text-sm text-gray-700">
                Apa yang salah dengan episode ini?
              </p>
              <div className="space-y-2">
                {reportReasons.map((reason, idx) => (
                  <label
                    key={idx}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="report"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="accent-red-600"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setReportOpen(false)}
                  className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={handleReportSubmit}
                  className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Hide scrollbar */}
      <style
        dangerouslySetInnerHTML={{
          __html: `.scrollbar::-webkit-scrollbar {display: none;}
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
             .progress-slider {
            background: linear-gradient(to right, #ef4444 0%, #ef4444 ${
              (progress / duration) * 100
            }%, #4b5563 ${(progress / duration) * 100}%, #4b5563 100%);
          }
          
          .volume-slider {
            background: linear-gradient(to right, #ef4444 0%, #ef4444 ${
              (muted ? 0 : volume) * 100
            }%, #4b5563 ${(muted ? 0 : volume) * 100}%, #4b5563 100%);
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
          }`,
        }}
      />
    </>
  );
}

export default AnimeCardss;
