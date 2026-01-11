
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Bookmark, MessageSquare, RotateCcw, RotateCw, SkipBack, SkipForward } from 'lucide-react';

interface Hotspot {
  timestamp: number;
  position: { x: number; y: number };
  title: string;
  description: string;
  modelUrl?: string;
}

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  description: string;
  has3DModel?: boolean;
  modelUrl?: string;
  hotspots?: Hotspot[];
  onProgress?: (progress: number) => void;
}

function Model3DViewer({ modelUrl, onClose }: { modelUrl: string; onClose: () => void }) {
  const { scene } = useGLTF(modelUrl);

  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex flex-col">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ flex: 1 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <spotLight position={[0, 10, 0]} intensity={0.5} />
        <primitive object={scene} scale={1.5} />
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
      <div className="absolute top-4 right-4">
        <button
          className="bg-white text-black px-4 py-2 rounded shadow"
          onClick={onClose}
          aria-label="Close 3D View"
        >
          Close 3D View
        </button>
      </div>
    </div>
  );
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title,
  description,
  has3DModel = false,
  modelUrl,
  hotspots = [],
  onProgress,
}) => {
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [pip, setPip] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [quality, setQuality] = useState('720p');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [annotations, setAnnotations] = useState<
    { timestamp: number; note: string }[]
  >([]);
  const [currentAnnotation, setCurrentAnnotation] = useState<string>('');
  
  // Placeholder: map quality label to URL or source variant
  const videoSources: Record<string, string> = {
    '360p': videoUrl,
    '480p': videoUrl,
    '720p': videoUrl,
    '1080p': videoUrl,
  };

  const handlePlayPause = () => setPlaying(!playing);
  const handleMute = () => setMuted(!muted);
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
    setMuted(parseFloat(e.target.value) === 0);
  };

  const handleProgress = (state: { playedSeconds: number; played?: number }) => {
    setPlayedSeconds(state.playedSeconds);
    if (onProgress) onProgress(state.playedSeconds);
  };

  const handleSeek = (seconds: number) => {
    playerRef.current?.seekTo(seconds, 'seconds');
  };

  const handleAddBookmark = () => {
    if (!bookmarks.includes(playedSeconds)) {
      setBookmarks((prev) => [...prev, playedSeconds].sort((a, b) => a - b));
    }
  };

  const handleAddAnnotation = () => {
    if (currentAnnotation.trim()) {
      setAnnotations((prev) => [...prev, { timestamp: playedSeconds, note: currentAnnotation.trim() }]);
      setCurrentAnnotation('');
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.getInternalPlayer()?.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const togglePip = () => {
    setPip(!pip);
  };

  // Keyboard spacebar support for play/pause
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space') {
      event.preventDefault();
      handlePlayPause();
    }
  }, [playing]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Find hotspots active for current time
  const activeHotspots = hotspots.filter(
    (hotspot) =>
      playedSeconds >= hotspot.timestamp &&
      playedSeconds <= hotspot.timestamp + 5 // show hotspot for 5 seconds after timestamp
  );

  return (
    <div className="relative bg-gray-900 text-white rounded-md overflow-hidden w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="mb-4 text-sm text-gray-300">{description}</p>
      <div className="relative aspect-video bg-brand-navy rounded-lg overflow-hidden shadow-inner">
        <ReactPlayer
          ref={playerRef}
          url={videoSources[quality]}
          playing={playing}
          muted={muted}
          volume={volume}
          playbackRate={playbackRate}
          pip={pip}
          width="100%"
          height="100%"
          onProgress={handleProgress}
          controls={false}
        />
        {activeHotspots.map((hotspot, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${hotspot.position.x}%`,
              top: `${hotspot.position.y}%`,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              backgroundColor: 'rgba(59, 130, 246, 0.9)',
              color: '#fff',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              zIndex: 10,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}
            title={`${hotspot.title}: ${hotspot.description}`}
            onClick={() => {
              if (hotspot.modelUrl) {
                setShow3D(true);
                setPlaying(false);
              }
            }}
          >
            {hotspot.title}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4 space-x-2 flex-wrap gap-2">
        <button onClick={handlePlayPause} aria-label="Play/Pause" className="btn-primary">
          {playing ? 'Pause' : 'Play'}
        </button>

        <button onClick={toggleFullscreen} aria-label="Fullscreen Toggle" className="btn-primary">
          Fullscreen
        </button>

        <button onClick={togglePip} aria-label="Picture in Picture Toggle" className="btn-primary">
          PiP
        </button>

        <button onClick={handleMute} aria-label="Mute Toggle" className="btn-primary">
          {muted ? 'Unmute' : 'Mute'}
        </button>

        <input
          aria-label="Volume"
          type="range"
          min={0} max={1} step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          className="w-24"
        />

        <select
          aria-label="Playback Speed"
          value={playbackRate}
          onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
          className="btn-primary py-1 px-2 rounded"
        >
          {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
            <option key={speed} value={speed}>{speed}x</option>
          ))}
        </select>

        <select
          aria-label="Quality Selector"
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          className="btn-primary py-1 px-2 rounded"
        >
          {Object.keys(videoSources).map((q) => (
            <option key={q} value={q}>{q}</option>
          ))}
        </select>

        <button onClick={handleAddBookmark} aria-label="Add Bookmark" className="btn-primary">
          Bookmark
        </button>
      </div>

      {/* Annotation */}
      <div className="mt-4">
        <textarea
          aria-label="Add annotation note"
          placeholder="Add annotation note"
          value={currentAnnotation}
          onChange={(e) => setCurrentAnnotation(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
          rows={2}
        />
        <button onClick={handleAddAnnotation} className="btn-primary mt-2">
          Add Annotation
        </button>
      </div>

      {/* Bookmarks List */}
      {bookmarks.length > 0 && (
        <div className="mt-4 bg-brand-gray/20 border border-brand-gray rounded-lg p-3 max-h-32 overflow-auto">
          <h3 className="mb-2 font-semibold text-brand-navy">Bookmarks</h3>
          {bookmarks.map((time) => (
            <button
              key={time}
              onClick={() => handleSeek(time)}
              className="block w-full text-left p-2 hover:bg-brand-blue/10 rounded-md transition-colors text-sm"
              aria-label={`Bookmark at ${Math.floor(time)} seconds`}
            >
              {Math.floor(time)} seconds
            </button>
          ))}
        </div>
      )}

      {/* Annotations List */}
      {annotations.length > 0 && (
        <div className="mt-4 bg-brand-gray/20 border border-brand-gray rounded-lg p-3 max-h-32 overflow-auto">
          <h3 className="mb-2 font-semibold text-brand-navy">Annotations</h3>
          {annotations.map(({ timestamp, note }, idx) => (
            <div
              key={idx}
              className="border-b border-brand-gray/50 py-2 last:border-b-0"
              aria-label={`Annotation at ${Math.floor(timestamp)} seconds: ${note}`}
            >
              <button
                onClick={() => handleSeek(timestamp)}
                className="underline hover:text-brand-blue mr-2 text-sm"
              >
                {Math.floor(timestamp)}s
              </button>
              <span className="text-sm">{note}</span>
            </div>
          ))}
        </div>
      )}

      {/* 3D Model Viewer */}
      {show3D && modelUrl && (
        <Model3DViewer 
          modelUrl={modelUrl}
          onClose={() => setShow3D(false)}
        />
      )}

      {/* Ask AI Button Placeholder */}
      <div className="mt-4 text-right">
        <button className="bg-brand-blue hover:bg-brand-blue/90 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg">
          Ask AI (Coming Soon)
        </button>
      </div>
    </div>
  );
};
