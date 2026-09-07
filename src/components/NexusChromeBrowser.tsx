import React, { useState, useEffect } from 'react';
import { YouTubeVideoItem, YouTubeAutoLearnEvent } from '../types';
import { INITIAL_YOUTUBE_VIDEOS } from '../data/youtubeData';
import { 
  Search, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Shield, 
  Star, 
  Plus, 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  Brain, 
  Tv, 
  Share2, 
  ThumbsUp, 
  Download, 
  CheckCircle2, 
  Cpu, 
  Terminal,
  Activity,
  Layers,
  Zap,
  Globe
} from 'lucide-react';

interface NexusChromeBrowserProps {
  onLearnFromVideo?: (event: YouTubeAutoLearnEvent) => void;
  onDispatchToDevices?: (event: YouTubeAutoLearnEvent) => void;
  activeVideoId?: string;
  onSelectVideo?: (video: YouTubeVideoItem) => void;
  compactMode?: boolean;
}

export const NexusChromeBrowser: React.FC<NexusChromeBrowserProps> = ({
  onLearnFromVideo,
  onDispatchToDevices,
  activeVideoId = 'yt-deepmind-humanoid',
  onSelectVideo,
  compactMode = false
}) => {
  const [videos] = useState<YouTubeVideoItem[]>(INITIAL_YOUTUBE_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideoItem>(() => {
    return videos.find((v) => v.id === activeVideoId) || videos[0];
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(142);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isAutoLearning, setIsAutoLearning] = useState<boolean>(true);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [recentLearned, setRecentLearned] = useState<YouTubeAutoLearnEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('robotics AI deepmind control');
  const [activeTab, setActiveTab] = useState<'youtube' | 'google' | 'nexus-docs'>('youtube');
  const [urlBar, setUrlBar] = useState<string>('https://www.youtube.com/watch?v=deepmind-humanoid-2026');
  const [scanPulse, setScanPulse] = useState<number>(0);

  // Sync when prop changes
  useEffect(() => {
    const found = videos.find((v) => v.id === activeVideoId);
    if (found && found.id !== selectedVideo.id) {
      setSelectedVideo(found);
      setUrlBar(`https://www.youtube.com/watch?v=${found.id}`);
      setCurrentTimeSec(15);
    }
  }, [activeVideoId, videos, selectedVideo.id]);

  // Video playback timer & optical flow simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTimeSec((prev) => (prev >= 720 ? 10 : prev + 1));
        setScanPulse((prev) => (prev + 1) % 100);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Auto-learning continuous stream while video is playing
  useEffect(() => {
    let learnTimer: NodeJS.Timeout;
    if (isAutoLearning && isPlaying) {
      // Trigger a learning extraction every 14 seconds automatically
      learnTimer = setInterval(() => {
        triggerVideoKnowledgeExtraction(false);
      }, 14000);
    }
    return () => clearInterval(learnTimer);
  }, [isAutoLearning, isPlaying, selectedVideo]);

  const handleSelectVideo = (video: YouTubeVideoItem) => {
    setSelectedVideo(video);
    setUrlBar(`https://www.youtube.com/watch?v=${video.id}`);
    setCurrentTimeSec(12);
    setIsPlaying(true);
    if (onSelectVideo) onSelectVideo(video);
  };

  const triggerVideoKnowledgeExtraction = async (manual = true) => {
    setIsExtracting(true);
    try {
      if (!manual) {
        // Fast, zero-quota local stream extraction from playing video frames
        const insightIndex = Math.floor((currentTimeSec / 20) % selectedVideo.keyInsights.length);
        const uniqueId = `EVT-YT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const newEvent: YouTubeAutoLearnEvent = {
          id: uniqueId,
          timestamp: new Date().toLocaleTimeString(),
          videoId: selectedVideo.id,
          videoTitle: selectedVideo.title,
          channel: selectedVideo.channel,
          keyframeTime: `${Math.floor(currentTimeSec / 60)}:${(currentTimeSec % 60).toString().padStart(2, '0')}`,
          extractedKnowledge: selectedVideo.keyInsights[insightIndex] || selectedVideo.keyInsights[0],
          kinematicRuleDiscovered: `R(t) = exp(hat(w)*t) + K_adaptive * ${(0.01 + Math.random() * 0.05).toFixed(3)}`,
          appliedTo: 'ECOSSISTEMA_TOTAL',
          accuracyDelta: `+0.00${(2 + Math.floor(Math.random() * 4))} mm precisão fotônica`,
          speedGain: `+${(12 + Math.floor(Math.random() * 8))}% velocidade de trajetória`,
          energyGain: `-${(18 + Math.floor(Math.random() * 14))}W consumo térmico`,
          codeSnippet: `void adaptJoint_${selectedVideo.id.slice(0, 4)}() { motor.pwm = clamp(0.15, 0.88, dynamic_load); }`
        };

        setRecentLearned((prev) => [newEvent, ...prev.filter((p) => p.id !== newEvent.id).slice(0, 7)]);
        if (onLearnFromVideo) onLearnFromVideo(newEvent);
        if (onDispatchToDevices && onDispatchToDevices !== onLearnFromVideo) onDispatchToDevices(newEvent);
        return;
      }

      const response = await fetch('/api/youtube-learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: selectedVideo.id,
          videoTitle: selectedVideo.title,
          channel: selectedVideo.channel,
          timestampSec: currentTimeSec
        })
      });

      const data = await response.json();
      if (data && data.success) {
        const uniqueId = data.id || `EVT-YT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const newEvent: YouTubeAutoLearnEvent = {
          id: uniqueId,
          timestamp: data.timestamp || new Date().toLocaleTimeString(),
          videoId: selectedVideo.id,
          videoTitle: selectedVideo.title,
          channel: selectedVideo.channel,
          keyframeTime: `${Math.floor(currentTimeSec / 60)}:${(currentTimeSec % 60).toString().padStart(2, '0')}`,
          extractedKnowledge: data.extractedKnowledge || selectedVideo.keyInsights[0],
          kinematicRuleDiscovered: data.kinematicRuleDiscovered || 'T_compensate = J^T * F_optimal + K_wisdom * 0.042',
          appliedTo: data.appliedTo || 'ECOSSISTEMA_TOTAL',
          accuracyDelta: data.accuracyDelta || '+0.003 mm precisão fotônica',
          speedGain: data.speedGain || '+15% velocidade de trajetória',
          energyGain: data.energyGain || '-22W consumo térmico',
          codeSnippet: data.codeSnippet || 'void adaptJointPwm() { motor.pwm = clamp(0.1, 0.9, load); }'
        };

        setRecentLearned((prev) => [newEvent, ...prev.filter((p) => p.id !== newEvent.id).slice(0, 7)]);
        if (onLearnFromVideo) onLearnFromVideo(newEvent);
        if (onDispatchToDevices && onDispatchToDevices !== onLearnFromVideo) onDispatchToDevices(newEvent);

        // Voice prompt if manual trigger
        if (manual && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance('Novo conhecimento extraído do YouTube e transmitido ao Computador, Celular e Robô.');
          utterance.lang = 'pt-BR';
          utterance.rate = 1.1;
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (e) {
      // Handled silently by state fallback
    } finally {
      setIsExtracting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="nexus-chrome-browser" className="flex flex-col h-full bg-[#1e1f22] text-slate-200 rounded-lg overflow-hidden border border-slate-700/80 shadow-2xl">
      {/* Chrome Top Bar: Tabs & Window Controls */}
      <div className="bg-[#18191c] px-2 pt-2 flex items-center justify-between border-b border-black/40 select-none">
        {/* Tabs strip */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-[80%] scrollbar-none">
          {/* Active Tab: YouTube */}
          <div
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs cursor-pointer font-medium transition-all max-w-[220px] truncate ${
              activeTab === 'youtube'
                ? 'bg-[#2b2d31] text-white shadow-sm border-t-2 border-red-500'
                : 'text-slate-400 hover:bg-slate-800/60'
            }`}
          >
            <div className="w-3.5 h-3.5 bg-red-600 rounded-sm flex items-center justify-center text-[8px] text-white font-black flex-shrink-0">
              ▶
            </div>
            <span className="truncate">YouTube - {selectedVideo.title}</span>
            <X className="w-3 h-3 text-slate-400 hover:text-white ml-auto flex-shrink-0" />
          </div>

          {/* Tab 2: Google Pesquisa */}
          <div
            onClick={() => setActiveTab('google')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs cursor-pointer font-medium transition-all max-w-[160px] truncate ${
              activeTab === 'google'
                ? 'bg-[#2b2d31] text-white shadow-sm border-t-2 border-sky-400'
                : 'text-slate-400 hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            <span className="truncate">Google Pesquisa</span>
            <X className="w-3 h-3 text-slate-400 hover:text-white ml-auto flex-shrink-0" />
          </div>

          {/* Tab 3: Nexus OS Docs */}
          <div
            onClick={() => setActiveTab('nexus-docs')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs cursor-pointer font-medium transition-all max-w-[160px] truncate ${
              activeTab === 'nexus-docs'
                ? 'bg-[#2b2d31] text-white shadow-sm border-t-2 border-emerald-400'
                : 'text-slate-400 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate">Nexus OS Kernel V8</span>
            <X className="w-3 h-3 text-slate-400 hover:text-white ml-auto flex-shrink-0" />
          </div>

          <button className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Browser window decoration dots */}
        <div className="flex items-center gap-2 pr-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
        </div>
      </div>

      {/* Chrome Navigation & Omnibar */}
      <div className="bg-[#2b2d31] px-3 py-1.5 flex items-center gap-2 border-b border-black/30">
        <div className="flex items-center gap-1 text-slate-400">
          <button className="p-1 rounded hover:bg-slate-700/60 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded hover:bg-slate-700/60 hover:text-white transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setCurrentTimeSec((p) => p)}
            className="p-1 rounded hover:bg-slate-700/60 hover:text-white transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded hover:bg-slate-700/60 hover:text-white transition-colors">
            <Home className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Omnibar (URL input) */}
        <div className="flex-grow flex items-center bg-[#1e1f22] rounded-full px-3 py-1 text-xs border border-slate-700/60 focus-within:border-sky-500 transition-all">
          <Shield className="w-3.5 h-3.5 text-emerald-400 mr-2 flex-shrink-0" />
          <input
            id="chrome-url-input"
            type="text"
            value={urlBar}
            onChange={(e) => setUrlBar(e.target.value)}
            className="w-full bg-transparent text-slate-200 font-mono text-[11px] outline-none"
          />
          <Star className="w-3.5 h-3.5 text-slate-500 hover:text-amber-400 cursor-pointer ml-2 flex-shrink-0" />
        </div>

        {/* Auto-Learning Master Switch badge */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            id="chrome-auto-learn-toggle"
            onClick={() => setIsAutoLearning(!isAutoLearning)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono transition-all border ${
              isAutoLearning
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Auto-aprendizado contínuo assistindo ao vídeo"
          >
            <Brain className={`w-3.5 h-3.5 ${isAutoLearning ? 'text-emerald-400 animate-pulse' : ''}`} />
            <span>{isAutoLearning ? 'AUTO-APRENDENDO AO VIVO' : 'APRENDIZADO PAUSADO'}</span>
          </button>
        </div>
      </div>

      {/* Chrome Content Body */}
      <div className="flex-grow overflow-y-auto bg-[#0f0f0f] text-white">
        {activeTab === 'youtube' ? (
          <div className="p-3 sm:p-4 space-y-4">
            {/* YouTube App Top Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-5 bg-red-600 rounded flex items-center justify-center text-white text-[10px] font-bold shadow-md shadow-red-600/30">
                  ▶
                </div>
                <span className="font-bold text-sm tracking-tight text-white flex items-center">
                  YouTube <span className="text-[10px] font-mono text-red-500 ml-1 font-black">AI CORTEX</span>
                </span>
              </div>

              {/* YouTube Search Input */}
              <div className="flex items-center bg-[#222] rounded-full border border-[#333] px-3 py-1 text-xs w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Pesquisar vídeos de robótica e IA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-white w-full outline-none text-xs"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
              </div>

              {/* Video Category Tags */}
              <div className="hidden md:flex items-center gap-1.5 text-[11px]">
                {['Tudo', 'Robótica Humanóide', 'Soldagem Laser', 'Controle Motor', 'Cinemática'].map((cat, idx) => (
                  <button
                    key={cat}
                    className={`px-2.5 py-0.5 rounded-full ${
                      idx === 0 ? 'bg-white text-black font-semibold' : 'bg-[#272727] text-slate-300 hover:bg-[#3f3f3f]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Main Player & Ingestion Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Video Player Column (2/3 width) */}
              <div className="lg:col-span-2 space-y-3">
                {/* Visual Player Canvas */}
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl group select-none">
                  {/* Background Video Simulation */}
                  <img
                    src={selectedVideo.thumbnailUrl}
                    alt={selectedVideo.title}
                    className="w-full h-full object-cover opacity-60"
                  />

                  {/* Neural Vision Overlay & Optical Tracking Markers */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none p-3 flex flex-col justify-between font-mono">
                    {/* Top HUD Overlay */}
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-cyan-500/40 text-cyan-300">
                        <Activity className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
                        <span>OCR ÓPTICO & RASTREAMENTO CINEMÁTICO</span>
                      </div>
                      <div className="bg-red-950/80 border border-red-800 px-2 py-0.5 rounded text-[10px] text-red-300 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                        AO VIVO YOUTUBE // 60 FPS
                      </div>
                    </div>

                    {/* Mid-canvas dynamic bounding box and coordinate tracker */}
                    <div className="flex items-center justify-center my-auto">
                      <div className="relative w-48 h-32 border border-cyan-400/80 rounded bg-cyan-950/20 p-2 animate-pulse">
                        <div className="absolute -top-3 left-1 text-[9px] bg-cyan-950 px-1 text-cyan-300 border border-cyan-500/50">
                          {selectedVideo.simulatedVisuals.targetMesh}
                        </div>
                        <div className="text-[9px] text-slate-300 space-y-1">
                          <p className="text-emerald-400">{selectedVideo.simulatedVisuals.jointDeltas}</p>
                          <p className="text-amber-300 text-[8px]">{selectedVideo.simulatedVisuals.opticalFlow}</p>
                        </div>
                        {/* Target reticle crosshairs */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
                      </div>
                    </div>

                    {/* Bottom overlay: Live telemetry */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 bg-black/80 px-2 py-1 rounded">
                      <span>Tempo de Análise: {formatTime(currentTimeSec)} / {selectedVideo.duration}</span>
                      <span className="text-emerald-400 font-bold">Extração Ativa: {isExtracting ? 'PROCESSANDO SINAPSE...' : 'CONECTADO'}</span>
                    </div>
                  </div>

                  {/* Player Controls Bar */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 to-transparent p-2.5 flex flex-col gap-1.5">
                    {/* Progress Bar */}
                    <div className="relative w-full h-1.5 bg-slate-800 rounded-full cursor-pointer overflow-hidden">
                      <div
                        className="h-full bg-red-600 rounded-full transition-all"
                        style={{ width: `${(currentTimeSec / 720) * 100}%` }}
                      ></div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          id="yt-play-pause-btn"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="text-white hover:text-red-400 transition-colors p-1"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className="text-white hover:text-slate-300 transition-colors"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <span className="text-[11px] font-mono text-slate-300">
                          {formatTime(currentTimeSec)} / {selectedVideo.duration}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Instant Learn Button */}
                        <button
                          id="yt-extract-now-btn"
                          onClick={() => triggerVideoKnowledgeExtraction(true)}
                          disabled={isExtracting}
                          className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white px-2.5 py-1 rounded text-[11px] font-bold shadow-md shadow-red-600/30 transition-all"
                        >
                          <Sparkles className={`w-3 h-3 text-amber-300 ${isExtracting ? 'animate-spin' : ''}`} />
                          <span>{isExtracting ? 'Extraindo...' : 'Auto-Aprender Deste Vídeo'}</span>
                        </button>
                        <span className="text-[10px] bg-red-900/60 text-red-300 border border-red-700/60 px-1.5 py-0.5 rounded font-bold">
                          4K HD
                        </span>
                        <Maximize2 className="w-3.5 h-3.5 text-slate-400 hover:text-white cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Info & Channel Header */}
                <div className="space-y-2">
                  <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
                    {selectedVideo.title}
                  </h1>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                        {selectedVideo.channel.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white flex items-center gap-1">
                          {selectedVideo.channel}
                          <CheckCircle2 className="w-3 h-3 text-sky-400" />
                        </h3>
                        <p className="text-[10px] text-slate-400">1.28M inscritos</p>
                      </div>
                      <button className="ml-2 bg-white hover:bg-slate-200 text-black text-xs font-bold px-3 py-1 rounded-full transition-all">
                        Inscrito
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <button className="flex items-center gap-1.5 bg-[#272727] hover:bg-[#383838] px-3 py-1 rounded-full text-slate-200">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>42K</span>
                      </button>
                      <button className="flex items-center gap-1.5 bg-[#272727] hover:bg-[#383838] px-3 py-1 rounded-full text-slate-200">
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Compartilhar</span>
                      </button>
                      <button className="flex items-center gap-1.5 bg-[#272727] hover:bg-[#383838] px-3 py-1 rounded-full text-slate-200">
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  {/* Video Description with Learning Summary */}
                  <div className="bg-[#272727]/70 p-3 rounded-xl text-xs space-y-2">
                    <div className="flex items-center gap-3 text-slate-300 font-medium text-[11px]">
                      <span>{selectedVideo.views}</span>
                      <span>{selectedVideo.published}</span>
                      <span className="text-cyan-400">#{selectedVideo.category.replace(/ /g, '')}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {selectedVideo.summary}
                    </p>

                    {/* Key Technical Insights extracted */}
                    <div className="pt-2 border-t border-slate-700/60 space-y-1">
                      <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider font-bold block">
                        Conhecimento Técnico Detectado no Vídeo:
                      </span>
                      <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                        {selectedVideo.keyInsights.map((insight, i) => (
                          <li key={i}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar: Up Next & Live Learned Feed (1/3 width) */}
              <div className="space-y-4">
                {/* Live YouTube Auto-Learning Stream Box */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white uppercase font-mono">
                        Sinapses Extraídas ao Vivo
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                      Transmitindo
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    O cérebro assiste aos quadros e gera código C++ e regras para o Computador e Celular:
                  </p>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {recentLearned.length === 0 ? (
                      <div className="text-center py-4 text-xs text-slate-500 font-mono">
                        Assistindo vídeo... o próximo pacote de aprendizado será gerado automaticamente.
                      </div>
                    ) : (
                      recentLearned.map((item, idx) => (
                        <div
                          key={`${item.id}-${idx}`}
                          className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-amber-400 font-bold">{item.keyframeTime}</span>
                            <span className="text-cyan-400 font-semibold">{item.appliedTo}</span>
                          </div>
                          <p className="text-slate-200 font-medium">{item.extractedKnowledge}</p>
                          <code className="text-[10px] font-mono text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded block">
                            {item.kinematicRuleDiscovered}
                          </code>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                            <span>{item.accuracyDelta}</span>
                            <span className="text-amber-300">{item.energyGain}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Up Next / Recommended YouTube Videos */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase font-mono block">
                    Vídeos Recomendados para Auto-Aprendizado
                  </span>

                  <div className="space-y-2.5">
                    {videos.map((vid) => (
                      <div
                        key={vid.id}
                        onClick={() => handleSelectVideo(vid)}
                        className={`flex gap-2.5 p-2 rounded-lg cursor-pointer transition-all border ${
                          selectedVideo.id === vid.id
                            ? 'bg-slate-800 border-red-500/60 shadow-md'
                            : 'bg-[#181818] border-transparent hover:bg-[#252525]'
                        }`}
                      >
                        <div className="relative w-28 h-16 rounded overflow-hidden flex-shrink-0 bg-slate-900">
                          <img
                            src={vid.thumbnailUrl}
                            alt={vid.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.2 rounded text-[9px] font-mono text-white">
                            {vid.duration}
                          </span>
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="text-xs font-semibold text-white line-clamp-2 leading-tight">
                            {vid.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 truncate">{vid.channel}</p>
                          <span className="text-[9px] font-mono text-cyan-400">{vid.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'google' ? (
          /* Google Search Tab */
          <div className="p-8 max-w-2xl mx-auto space-y-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-blue-400">G</span>
              <span className="text-red-400">o</span>
              <span className="text-yellow-400">o</span>
              <span className="text-blue-400">g</span>
              <span className="text-green-400">l</span>
              <span className="text-red-400">e</span>
            </h1>
            <div className="flex items-center bg-[#2b2d31] rounded-full border border-slate-700 px-4 py-2.5 shadow-lg">
              <Search className="w-4 h-4 text-slate-400 mr-3" />
              <input
                type="text"
                defaultValue="algoritmos de controle robótico e auto-aprendizado neural"
                className="w-full bg-transparent text-white outline-none text-xs"
              />
            </div>
            <p className="text-xs text-slate-400">
              O motor de busca do Chrome monitora publicações da web científica para alimentar o Nexus OS.
            </p>
          </div>
        ) : (
          /* Nexus OS Kernel Docs Tab */
          <div className="p-6 max-w-3xl mx-auto space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              Documentação Oficial do Nexus OS V8
            </h2>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <p className="text-emerald-400">&gt; ARCHITECTURE: Hybrid Dual-Core (RTOS + Neural VLA Engine)</p>
              <p>&gt; INTER-DEVICE BUS: Real-time shared memory between PC, Mobile &amp; Chrome</p>
              <p>&gt; AUTO-LEARN PIPELINE: Optical frame extraction from YouTube streams at 60Hz</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
