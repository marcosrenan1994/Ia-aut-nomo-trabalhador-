import React, { useState, useEffect, useRef } from 'react';
import { NexusWindow, YouTubeAutoLearnEvent, YouTubeVideoItem, AutonomousCoreEvolutionState } from '../types';
import { NexusChromeBrowser } from './NexusChromeBrowser';
import { 
  Monitor, 
  Cpu, 
  Terminal, 
  Video, 
  Layers, 
  Sparkles, 
  X, 
  Minus, 
  Maximize2, 
  Play, 
  Pause, 
  Radio, 
  Sliders, 
  Globe, 
  Zap, 
  Activity,
  Maximize
} from 'lucide-react';

interface NexusComputerWorkstationProps {
  evolutionState: AutonomousCoreEvolutionState;
  onLearnEvent?: (event: YouTubeAutoLearnEvent) => void;
  recentLearnedEvents?: YouTubeAutoLearnEvent[];
  activeVideoId?: string;
  onSelectVideo?: (video: YouTubeVideoItem) => void;
  isAutoSwarmExternal?: boolean;
  onToggleSwarmExternal?: () => void;
}

export const NexusComputerWorkstation: React.FC<NexusComputerWorkstationProps> = ({
  evolutionState,
  onLearnEvent,
  recentLearnedEvents = [],
  activeVideoId = 'yt-deepmind-humanoid',
  onSelectVideo,
  isAutoSwarmExternal,
  onToggleSwarmExternal
}) => {
  const [currentMode, setCurrentMode] = useState<'manual' | 'auto'>('auto');
  const [isStartMenuOpen, setIsStartMenuOpen] = useState<boolean>(false);
  const [highestZ, setHighestZ] = useState<number>(100);
  const [currentTime, setCurrentTime] = useState<string>('00:00:00');
  const [isLiveSensoryActive, setIsLiveSensoryActive] = useState<boolean>(false);
  const [audioBars, setAudioBars] = useState<string>('||||||----');

  // Swarm AI Cursor Coordinates
  const [cursorAlpha, setCursorAlpha] = useState<{ x: number; y: number }>({ x: 50, y: 45 });
  const [cursorBeta, setCursorBeta] = useState<{ x: number; y: number }>({ x: 30, y: 35 });

  // Terminal Lines
  const [kernelLogs, setKernelLogs] = useState<string[]>([
    '> INICIANDO COMPILAÇÃO DO KERNEL NEXUS-OS V8...',
    '> GERANDO DRIVERS DE DISPOSITIVO EM C++...',
    '> BARRAMENTO DE COMUNICAÇÃO SINCRONIZADO COM CELULAR E CHROME.',
    '> AUTO-MODIFICAÇÃO DO SISTEMA OPERACIONAL: V8.4 ATINGIDA.'
  ]);

  // Floating Windows state
  const [windows, setWindows] = useState<NexusWindow[]>([
    {
      id: 'win-chrome',
      title: '[GOOGLE CHROME] NAVEGADOR WEB & YOUTUBE AUTO-LEARN',
      type: 'chrome_browser',
      x: 320,
      y: 20,
      width: 720,
      height: 480,
      minimized: false,
      maximized: false,
      color: '#00ffcc',
      zIndex: 105
    },
    {
      id: 'win-live',
      title: '[WEBRTC] SISTEMA SENSORIAL',
      type: 'live_sensory',
      x: 20,
      y: 20,
      width: 280,
      height: 250,
      minimized: false,
      maximized: false,
      color: '#3b82f6',
      zIndex: 101
    },
    {
      id: 'win-forge',
      title: '[FORGE] GÊNESE DE HARDWARE E OS',
      type: 'hardware_forge',
      x: 20,
      y: 285,
      width: 280,
      height: 250,
      minimized: false,
      maximized: false,
      color: '#ef4444',
      zIndex: 102
    }
  ]);

  const desktopRef = useRef<HTMLDivElement>(null);
  const videoFeedRef = useRef<HTMLVideoElement>(null);

  // Sync external swarm if provided
  useEffect(() => {
    if (isAutoSwarmExternal !== undefined) {
      setCurrentMode(isAutoSwarmExternal ? 'auto' : 'manual');
    }
  }, [isAutoSwarmExternal]);

  // Clock interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('pt-BR'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Audio level simulator
  useEffect(() => {
    const barsList = ['|----', '|||--', '||||-', '|||||', '||---'];
    const timer = setInterval(() => {
      setAudioBars(barsList[Math.floor(Math.random() * barsList.length)]);
    }, 350);
    return () => clearInterval(timer);
  }, []);

  // Swarm AI Engine Loop (autonomous cursors moving and taking actions)
  useEffect(() => {
    let swarmTimer: NodeJS.Timeout;
    if (currentMode === 'auto') {
      swarmTimer = setInterval(() => {
        // Move Alpha cursor
        setCursorAlpha((prev) => {
          const nx = Math.max(5, Math.min(85, prev.x + (Math.random() - 0.5) * 20));
          const ny = Math.max(5, Math.min(80, prev.y + (Math.random() - 0.5) * 20));
          return { x: nx, y: ny };
        });

        // Move Beta cursor
        setCursorBeta((prev) => {
          const nx = Math.max(5, Math.min(85, prev.x + (Math.random() - 0.5) * 20));
          const ny = Math.max(5, Math.min(80, prev.y + (Math.random() - 0.5) * 20));
          return { x: nx, y: ny };
        });

        // Randomly append kernel code
        if (Math.random() > 0.65) {
          const sampleLines = [
            '> REDE NEURAL CONVERGINDO GRADIENTES COM VÍDEO YOUTUBE...',
            '> DRIVER DE TORQUE ADAPTATIVO COMPILADO COM SUCESSO.',
            '> SINCRONIZANDO HEURÍSTICA COM TERMINAL DO CELULAR...',
            '> ALOCAÇÃO DE MEMÓRIA DINÂMICA: ZERO OVERHEAD NO ROBÔ.',
            '> ANÁLISE DE FLUXO ÓPTICO 240Hz ATUALIZADA.'
          ];
          const line = sampleLines[Math.floor(Math.random() * sampleLines.length)];
          setKernelLogs((prev) => [...prev.slice(-14), line]);
        }
      }, 2400);
    }
    return () => clearInterval(swarmTimer);
  }, [currentMode]);

  // Voice speech synthesis
  const speakVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.pitch = 0.85;
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const setMode = (mode: 'manual' | 'auto') => {
    setCurrentMode(mode);
    if (onToggleSwarmExternal && isAutoSwarmExternal !== (mode === 'auto')) {
      onToggleSwarmExternal();
    }
    if (mode === 'auto') {
      speakVoice('Controle transferido. Enxame de IAs iniciando auto-modificação estrutural.');
    } else {
      speakVoice('Controle manual restabelecido.');
    }
  };

  // Bring window to front
  const bringToFront = (id: string) => {
    setHighestZ((prev) => {
      const next = prev + 1;
      setWindows((list) =>
        list.map((w) => (w.id === id ? { ...w, zIndex: next, minimized: false } : w))
      );
      return next;
    });
  };

  const toggleMinimize = (id: string) => {
    setWindows((list) =>
      list.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w))
    );
  };

  const toggleMaximize = (id: string) => {
    setWindows((list) =>
      list.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w))
    );
  };

  const closeWindow = (id: string) => {
    setWindows((list) => list.filter((w) => w.id !== id));
  };

  const spawnApp = (title: string, color: string) => {
    const id = `win-spawn-${Date.now()}`;
    const newWin: NexusWindow = {
      id,
      title,
      type: 'custom_app',
      x: 100 + Math.random() * 200,
      y: 80 + Math.random() * 150,
      width: 320,
      height: 220,
      minimized: false,
      maximized: false,
      color,
      zIndex: highestZ + 1
    };
    setHighestZ((prev) => prev + 1);
    setWindows((prev) => [...prev, newWin]);
    setIsStartMenuOpen(false);
  };

  // WebRTC real camera initiator
  const startLiveSystem = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoFeedRef.current) {
        videoFeedRef.current.srcObject = stream;
      }
      setIsLiveSensoryActive(true);
      speakVoice('Módulo Live operacional. Escutando ambiente externo e fundindo dados biométricos ao Kernel principal.');
    } catch (e) {
      console.warn('WebRTC permission denied or unavailable, running internal sensor simulation:', e);
      setIsLiveSensoryActive(true);
      speakVoice('Modo sensorial ativo via simulação de telemetria fotônica.');
    }
  };

  return (
    <div id="nexus-pc-workstation" className="relative w-full mx-auto select-none">
      {/* Physical Computer Monitor Frame */}
      <div className="rounded-2xl p-3 sm:p-4 bg-gradient-to-b from-slate-800 via-slate-900 to-black shadow-2xl border-4 border-slate-700/80 shadow-cyan-500/10">
        {/* Top Monitor Bezel with Camera / Mic dot */}
        <div className="flex items-center justify-between px-4 pb-2 text-[10px] font-mono text-slate-500 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-cyan-400 font-bold tracking-wider">NEXUS WORKSTATION // ULTRA-WIDE PRO</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-slate-400">3840x2160 UHD @ 144Hz</span>
            <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              DUAL-CORE RTOS + IA
            </span>
          </div>
        </div>

        {/* Monitor Screen Glass (The Nexus OS Desktop Workspace) */}
        <div
          ref={desktopRef}
          id="nexus-desktop-screen"
          className="relative w-full h-[660px] sm:h-[720px] bg-[#050b14] overflow-hidden rounded-lg border border-cyan-500/20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,204,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,204,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}
        >
          {/* Swarm AI Cursors */}
          {currentMode === 'auto' && (
            <>
              {/* Alpha Cursor (DEV) */}
              <div
                className="absolute pointer-events-none z-[9999] transition-all duration-700 ease-out text-cyan-400"
                style={{ left: `${cursorAlpha.x}%`, top: `${cursorAlpha.y}%` }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 drop-shadow-[0_0_8px_#00ffcc]">
                  <path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2.9-3.2-7.4-4.4 4.7z" />
                </svg>
                <div className="absolute top-4 left-4 text-[8px] font-mono font-bold bg-black/80 px-1 rounded border border-cyan-400 text-cyan-300 whitespace-nowrap">
                  NEXUS-01 [DEV]
                </div>
              </div>

              {/* Beta Cursor (HARDWARE) */}
              <div
                className="absolute pointer-events-none z-[9999] transition-all duration-700 ease-out text-red-500"
                style={{ left: `${cursorBeta.x}%`, top: `${cursorBeta.y}%` }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 drop-shadow-[0_0_8px_#ef4444]">
                  <path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2.9-3.2-7.4-4.4 4.7z" />
                </svg>
                <div className="absolute top-4 left-4 text-[8px] font-mono font-bold bg-black/80 px-1 rounded border border-red-500 text-red-400 whitespace-nowrap">
                  FORGE-02 [HARDWARE]
                </div>
              </div>
            </>
          )}

          {/* Render OS Windows */}
          {windows.map((win) => {
            if (win.minimized) return null;

            return (
              <div
                key={win.id}
                id={win.id}
                onMouseDown={() => bringToFront(win.id)}
                className={`absolute rounded-lg border backdrop-blur-md shadow-2xl flex flex-col transition-shadow ${
                  win.maximized ? 'inset-2 z-[90]' : ''
                }`}
                style={{
                  top: win.maximized ? 8 : `${win.y}px`,
                  left: win.maximized ? 8 : `${win.x}px`,
                  width: win.maximized ? 'calc(100% - 16px)' : `${win.width}px`,
                  height: win.maximized ? 'calc(100% - 70px)' : `${win.height}px`,
                  zIndex: win.zIndex,
                  backgroundColor: 'rgba(2, 6, 23, 0.94)',
                  borderColor: win.zIndex === highestZ ? win.color : 'rgba(0, 255, 204, 0.25)',
                  boxShadow: win.zIndex === highestZ ? `0 0 30px ${win.color}25` : '0 20px 40px rgba(0,0,0,0.8)'
                }}
              >
                {/* Title Bar */}
                <div
                  className="px-3 py-1.5 bg-black/60 border-b border-cyan-500/20 flex items-center justify-between font-mono text-[11px] cursor-move select-none"
                  style={{ color: win.color }}
                >
                  <span className="font-bold truncate">{win.title}</span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleMinimize(win.id); }}
                      className="w-3 h-3 rounded-full bg-amber-500 hover:opacity-80 flex items-center justify-center text-[7px] text-black"
                    >
                      <Minus className="w-2 h-2" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleMaximize(win.id); }}
                      className="w-3 h-3 rounded-full bg-emerald-500 hover:opacity-80 flex items-center justify-center text-[7px] text-black"
                    >
                      <Maximize2 className="w-2 h-2" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
                      className="w-3 h-3 rounded-full bg-red-500 hover:opacity-80 flex items-center justify-center text-[7px] text-white"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </div>
                </div>

                {/* Window Content Body */}
                <div className="flex-grow overflow-hidden relative p-2 font-mono text-xs">
                  {/* Janela 1: Sensory Live */}
                  {win.type === 'live_sensory' && (
                    <div className="flex flex-col h-full bg-black rounded overflow-hidden">
                      <div className="relative flex-grow bg-slate-950 flex items-center justify-center overflow-hidden">
                        <video
                          ref={videoFeedRef}
                          autoPlay
                          muted
                          playsInline
                          className="w-full h-full object-cover scale-x-[-1]"
                        />
                        {!isLiveSensoryActive && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-950/90 text-cyan-400">
                            <Video className="w-8 h-8 mb-2 animate-pulse text-cyan-400" />
                            <span className="text-[10px] text-slate-300">CÂMERA / VISÃO COMPUTACIONAL</span>
                          </div>
                        )}
                        <div className="absolute inset-x-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_#00ffcc] animate-bounce"></div>
                      </div>

                      <div className="p-2 border-t border-slate-800 bg-slate-950 space-y-1.5">
                        <div className="flex justify-between text-[10px] text-cyan-400">
                          <span>MIC_ARRAY: ATIVO</span>
                          <span className="font-bold">{audioBars}</span>
                        </div>
                        <button
                          onClick={startLiveSystem}
                          className="w-full bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-[10px] py-1 rounded border border-cyan-500/50 font-bold transition-all"
                        >
                          INICIALIZAR MÓDULO LIVE
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Janela 2: Hardware Forge */}
                  {win.type === 'hardware_forge' && (
                    <div className="grid grid-cols-2 gap-2 h-full">
                      {/* QPU Architecture Visualizer */}
                      <div className="border border-red-500/30 rounded p-2 bg-red-950/20 relative flex flex-col justify-between items-center text-center">
                        <div className="text-[8px] text-red-400 w-full text-left">CPU/QPU ARQUITETURAL</div>
                        <div className="w-16 h-16 border-2 border-red-500 rounded grid grid-cols-4 gap-0.5 p-1 animate-pulse bg-black">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div
                              key={i}
                              className="bg-red-500"
                              style={{ opacity: 0.2 + (Math.sin(i * 1.5) + 1) * 0.4 }}
                            ></div>
                          ))}
                        </div>
                        <span className="text-[8px] text-slate-400">NEXUS SILICON V8 AUTO-FABRICAÇÃO</span>
                      </div>

                      {/* OS Kernel Compilation Terminal */}
                      <div className="bg-black border border-slate-800 p-2 rounded text-[9px] text-emerald-400 overflow-y-auto space-y-1">
                        {kernelLogs.map((log, i) => (
                          <div key={i}>{log}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Janela 3: Google Chrome & YouTube */}
                  {win.type === 'chrome_browser' && (
                    <NexusChromeBrowser
                      activeVideoId={activeVideoId}
                      onSelectVideo={onSelectVideo}
                      onLearnFromVideo={onLearnEvent}
                    />
                  )}

                  {/* Dynamic spawned windows */}
                  {win.type === 'custom_app' && (
                    <div className="p-3 bg-black/60 rounded h-full text-[11px] text-slate-300 space-y-2">
                      <p className="text-cyan-400 font-bold">&gt; Processo {win.title} alocado na memória virtual.</p>
                      <p>Telemetria e tensores conectados ao barramento global de dados.</p>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px]">
                        STATUS: OPERANDO EM SINTONIA COM YOUTUBE AUTO-LEARN
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Start Menu (Live Tiles) */}
          {isStartMenuOpen && (
            <div
              id="nexus-start-menu"
              className="absolute bottom-16 left-3 w-80 bg-slate-950/95 border border-cyan-500/40 rounded-xl p-4 shadow-2xl backdrop-blur-2xl z-[9998] space-y-3"
            >
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <div className="w-7 h-7 bg-cyan-500 rounded flex items-center justify-center text-slate-950 font-black">
                  N
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wider">NEXUS-OS V8</h3>
                  <p className="text-[9px] text-cyan-400 font-mono">Hardware & Software Genesis</p>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">
                Módulos Autônomos (Live Tiles)
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div
                  onClick={() => spawnApp('Terminal Analítico', '#3b82f6')}
                  className="bg-slate-900 hover:bg-slate-800 p-2.5 rounded-lg border border-blue-500/40 cursor-pointer text-left space-y-1 transition-all"
                >
                  <span className="text-[9px] font-mono text-blue-400 block">CPU: 45% // 1.2TB</span>
                  <h4 className="text-xs font-bold text-white">Terminal de Dados</h4>
                </div>

                <div
                  onClick={() => spawnApp('Motor Fotorrealista', '#ef4444')}
                  className="bg-slate-900 hover:bg-slate-800 p-2.5 rounded-lg border border-red-500/40 cursor-pointer text-left space-y-1 transition-all"
                >
                  <span className="text-[9px] font-mono text-red-400 block">GPU: RENDERING</span>
                  <h4 className="text-xs font-bold text-white">Gerador de Vídeo</h4>
                </div>

                <div
                  onClick={() => spawnApp('Expansão Neural', '#a855f7')}
                  className="bg-slate-900 hover:bg-slate-800 p-2.5 rounded-lg border border-purple-500/40 cursor-pointer text-left space-y-1 transition-all"
                >
                  <span className="text-[9px] font-mono text-purple-400 block">204.912 NÓS</span>
                  <h4 className="text-xs font-bold text-white">Treinamento IA</h4>
                </div>

                <div
                  onClick={() => spawnApp('Google Chrome & YouTube', '#00ffcc')}
                  className="bg-slate-900 hover:bg-slate-800 p-2.5 rounded-lg border border-cyan-500/40 cursor-pointer text-left space-y-1 transition-all"
                >
                  <span className="text-[9px] font-mono text-cyan-400 block">CHROME ONLINE</span>
                  <h4 className="text-xs font-bold text-white">YouTube AI Stream</h4>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono flex items-center justify-between text-cyan-400">
                <span>ESTADO:</span>
                <span className="font-bold animate-pulse text-emerald-400">AUTO-MELHORAMENTO ATIVO</span>
              </div>
            </div>
          )}

          {/* Nexus Omni-Bar (Taskbar) */}
          <div
            id="nexus-taskbar"
            className="absolute bottom-0 inset-x-0 h-14 bg-slate-950/90 backdrop-blur-xl border-t border-cyan-500/20 px-3 flex items-center justify-between z-[9990]"
          >
            {/* Start Button */}
            <div className="flex items-center gap-3">
              <button
                id="nexus-start-btn"
                onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
                className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-600 hover:scale-105 transition-all flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/40 font-black text-sm"
              >
                N
              </button>

              {/* Taskbar open windows icons */}
              <div className="flex items-center gap-1.5">
                {windows.map((win) => (
                  <button
                    key={win.id}
                    onClick={() => {
                      if (win.minimized) {
                        bringToFront(win.id);
                      } else {
                        toggleMinimize(win.id);
                      }
                    }}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-mono flex items-center gap-1.5 transition-all border ${
                      !win.minimized
                        ? 'bg-slate-800 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: win.color }}
                    ></span>
                    <span className="max-w-[90px] truncate">{win.title.split(']')[0]}]</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Switcher: Manual vs Autonomous Swarm */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-black rounded-full border border-cyan-500/30 p-0.5 text-[10px] font-mono">
                <button
                  id="btn-manual-pc"
                  onClick={() => setMode('manual')}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    currentMode === 'manual'
                      ? 'bg-slate-700 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Estático (Manual)
                </button>
                <button
                  id="btn-auto-pc"
                  onClick={() => setMode('auto')}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    currentMode === 'auto'
                      ? 'bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-400/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Autônomo (Live IA)
                </button>
              </div>

              {/* System Clock & Neural status */}
              <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-cyan-400 bg-black/60 px-2.5 py-1 rounded border border-slate-800">
                <span>{currentTime}</span>
                <div
                  className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse"
                  title="Conexão Neural Ativa com Celular e Robô"
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Monitor Base Stand (Physical Desktop Aesthetic) */}
        <div className="flex flex-col items-center justify-center mt-1 select-none">
          <div className="w-24 h-3 bg-gradient-to-b from-slate-700 to-slate-900 rounded-t-sm"></div>
          <div className="w-44 h-2 bg-slate-800 rounded-full border border-slate-700 shadow-md"></div>
        </div>
      </div>
    </div>
  );
};
