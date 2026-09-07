import React, { useState } from 'react';
import { 
  AutonomousCoreEvolutionState, 
  YouTubeAutoLearnEvent, 
  YouTubeVideoItem, 
  JointState,
  MemoryVectorRecord
} from '../types';
import { NexusComputerWorkstation } from './NexusComputerWorkstation';
import { NexusMobilePhone } from './NexusMobilePhone';
import { NexusChromeBrowser } from './NexusChromeBrowser';
import { INITIAL_YOUTUBE_VIDEOS, INITIAL_LEARN_EVENTS } from '../data/youtubeData';
import { 
  Monitor, 
  Smartphone, 
  Globe, 
  Zap, 
  Sparkles, 
  Brain, 
  Radio, 
  CheckCircle2, 
  Volume2, 
  Layers, 
  Activity, 
  Cpu,
  Share2,
  Tv
} from 'lucide-react';

interface NexusUnifiedEcosystemProps {
  evolutionState: AutonomousCoreEvolutionState;
  onUpdateEvolutionState?: (updater: (prev: AutonomousCoreEvolutionState) => AutonomousCoreEvolutionState) => void;
  onAddMemoryRecord?: (record: MemoryVectorRecord) => void;
  joints?: JointState[];
  isOffline?: boolean;
}

export const NexusUnifiedEcosystem: React.FC<NexusUnifiedEcosystemProps> = ({
  evolutionState,
  onUpdateEvolutionState,
  onAddMemoryRecord,
  joints = [],
  isOffline = false
}) => {
  const [viewLayout, setViewLayout] = useState<'split' | 'pc_only' | 'mobile_only' | 'chrome_only'>('split');
  const [activeVideo, setActiveVideo] = useState<YouTubeVideoItem>(INITIAL_YOUTUBE_VIDEOS[0]);
  const [learnedEvents, setLearnedEvents] = useState<YouTubeAutoLearnEvent[]>(INITIAL_LEARN_EVENTS);
  const [isSwarmActive, setIsSwarmActive] = useState<boolean>(true);
  const [crossBusPulse, setCrossBusPulse] = useState<boolean>(false);

  // Broadcast learning event from YouTube to all devices
  const handleLearnFromYouTube = (event: YouTubeAutoLearnEvent) => {
    setLearnedEvents((prev) => {
      if (prev.some((e) => e.id === event.id)) return prev;
      return [event, ...prev.slice(0, 19)];
    });
    setCrossBusPulse(true);
    setTimeout(() => setCrossBusPulse(false), 1200);

    // Update global evolution state
    if (onUpdateEvolutionState) {
      onUpdateEvolutionState((prev) => {
        const newScore = Math.min(1000, prev.cognitiveIndexScore + 4);
        return {
          ...prev,
          cognitiveIndexScore: newScore,
          wisdomLevel: Math.min(100, Math.floor(newScore / 10)),
          knowledgeNodesIngested: prev.knowledgeNodesIngested + 2,
          overallAccuracyRating: Math.min(99.99, prev.overallAccuracyRating + 0.003),
          cumulativeSpeedGainPct: Math.min(48.0, prev.cumulativeSpeedGainPct + 0.15),
          cumulativeEnergySavedJoules: prev.cumulativeEnergySavedJoules + 60,
          neuralWeightsUpdated: prev.neuralWeightsUpdated + 320,
          lastAutonomousEvolutionTime: new Date().toLocaleTimeString()
        };
      });
    }

    // Add to core memory records
    if (onAddMemoryRecord) {
      const memory: MemoryVectorRecord = {
        id: `MEM-YT-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'GLOBAL_WEB_SYNTHESIS',
        title: `YouTube Learn: ${event.videoTitle.slice(0, 40)}`,
        accuracyDelta: event.accuracyDelta,
        cycleTimeDelta: event.speedGain,
        sourceType: 'YOUTUBE_NEURAL_VISION',
        description: `Extraído via Chrome Online. Regra: ${event.kinematicRuleDiscovered}. Transmitido para Computador, Celular e Robô ER-2.`,
        synced: !isOffline
      };
      onAddMemoryRecord(memory);
    }
  };

  const handleMobileActionToPC = (action: string) => {
    if (action === 'SYNC_VIDEO_STATE') {
      setCrossBusPulse(true);
      setTimeout(() => setCrossBusPulse(false), 800);
    }
  };

  return (
    <div id="nexus-unified-ecosystem-view" className="space-y-4">
      {/* Ecosystem Global Navigation & Telemetry Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20 font-black">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  NEXUS-OS V8: ECOSSISTEMA SINCRONIZADO
                </h2>
                <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded">
                  COMPUTADOR + CELULAR + GOOGLE CHROME
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>Todas as telas interagem entre si e auto-aprendem assistindo a vídeos no YouTube online</span>
                <span className="text-emerald-400 font-mono font-bold">● BARRAMENTO ATIVO</span>
              </p>
            </div>
          </div>

          {/* View Layout Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              id="view-layout-split"
              onClick={() => setViewLayout('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewLayout === 'split'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <Smartphone className="w-3.5 h-3.5" />
              <span>Visão Dividida (PC + Celular)</span>
            </button>

            <button
              id="view-layout-pc"
              onClick={() => setViewLayout('pc_only')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewLayout === 'pc_only'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Apenas PC</span>
            </button>

            <button
              id="view-layout-mobile"
              onClick={() => setViewLayout('mobile_only')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewLayout === 'mobile_only'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Apenas Celular</span>
            </button>

            <button
              id="view-layout-chrome"
              onClick={() => setViewLayout('chrome_only')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewLayout === 'chrome_only'
                  ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Chrome & YouTube</span>
            </button>
          </div>
        </div>

        {/* Real-time Cross-Device Neural Data Bus Indicator */}
        <div className={`p-2.5 rounded-lg border transition-all duration-300 flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${
          crossBusPulse 
            ? 'bg-cyan-950/90 border-cyan-400 shadow-lg shadow-cyan-500/20 text-cyan-200' 
            : 'bg-slate-950/80 border-slate-800/80 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${crossBusPulse ? 'text-cyan-300 animate-spin' : 'text-emerald-400 animate-pulse'}`} />
            <span className="font-bold text-slate-200">Barramento Neural em Tempo Real:</span>
            <span className="text-cyan-400 font-semibold truncate max-w-[280px] sm:max-w-md">
              YouTube ➜ Google Chrome ➜ Nexus PC Workstation ➜ Celular ➜ Robô ER-2
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400 font-bold">
              {learnedEvents.length} Sinapses Extraídas
            </span>
            <span className="text-amber-400 font-bold">
              +{evolutionState.cumulativeSpeedGainPct.toFixed(1)}% Ganho de Ciclo
            </span>
          </div>
        </div>
      </div>

      {/* Main Viewport depending on selected layout */}
      {viewLayout === 'split' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
          {/* Left: Computador (Nexus Computer Workstation) 8 Cols */}
          <div className="xl:col-span-8 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-cyan-400" />
                Estação de Trabalho Computador (Nexus-OS V8)
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                JANELAS DRAGGABLE & TERMINAL ATIVO
              </span>
            </div>

            <NexusComputerWorkstation
              evolutionState={evolutionState}
              onLearnEvent={handleLearnFromYouTube}
              recentLearnedEvents={learnedEvents}
              activeVideoId={activeVideo.id}
              onSelectVideo={(v) => setActiveVideo(v)}
              isAutoSwarmExternal={isSwarmActive}
              onToggleSwarmExternal={() => setIsSwarmActive(!isSwarmActive)}
            />
          </div>

          {/* Right: Celular (Nexus Mobile Phone) 4 Cols */}
          <div className="xl:col-span-4 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                Smartphone Celular (Nexus Mobile V8)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                5G SINCRONIZADO
              </span>
            </div>

            <NexusMobilePhone
              evolutionState={evolutionState}
              recentLearnedEvents={learnedEvents}
              activeVideoTitle={activeVideo.title}
              onTriggerLearn={() => {
                const syntheticEvent: YouTubeAutoLearnEvent = {
                  id: `EVT-YT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                  timestamp: new Date().toLocaleTimeString(),
                  videoId: activeVideo.id,
                  videoTitle: activeVideo.title,
                  channel: activeVideo.channel,
                  keyframeTime: '06:12',
                  extractedKnowledge: 'Controle dinâmico de torque antecipatório sincronizado via celular.',
                  kinematicRuleDiscovered: 'tau_pre = J^T * (M_hat * a_des + C_hat * v_cur)',
                  appliedTo: 'CELULAR',
                  accuracyDelta: '+0.002 mm precisão',
                  speedGain: '+11% velocidade',
                  energyGain: '-14W consumo térmico',
                  codeSnippet: 'applyPreTorqueFeedforward(joint_torques);'
                };
                handleLearnFromYouTube(syntheticEvent);
              }}
              onSendActionToComputer={handleMobileActionToPC}
              onToggleSwarm={() => setIsSwarmActive(!isSwarmActive)}
              isAutoSwarmActive={isSwarmActive}
              joints={joints}
            />
          </div>
        </div>
      )}

      {viewLayout === 'pc_only' && (
        <div className="space-y-2">
          <NexusComputerWorkstation
            evolutionState={evolutionState}
            onLearnEvent={handleLearnFromYouTube}
            recentLearnedEvents={learnedEvents}
            activeVideoId={activeVideo.id}
            onSelectVideo={(v) => setActiveVideo(v)}
            isAutoSwarmExternal={isSwarmActive}
            onToggleSwarmExternal={() => setIsSwarmActive(!isSwarmActive)}
          />
        </div>
      )}

      {viewLayout === 'mobile_only' && (
        <div className="py-4">
          <NexusMobilePhone
            evolutionState={evolutionState}
            recentLearnedEvents={learnedEvents}
            activeVideoTitle={activeVideo.title}
            onTriggerLearn={() => {
              const syntheticEvent: YouTubeAutoLearnEvent = {
                id: `EVT-YT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                timestamp: new Date().toLocaleTimeString(),
                videoId: activeVideo.id,
                videoTitle: activeVideo.title,
                channel: activeVideo.channel,
                keyframeTime: '08:45',
                extractedKnowledge: 'Auto-calibração senoidal aprendida do YouTube pelo celular.',
                kinematicRuleDiscovered: 'Theta_offset = mean(laser_deviations)',
                appliedTo: 'CELULAR',
                accuracyDelta: '+0.003 mm precisão',
                speedGain: '+16% agilidade',
                energyGain: '-18W economia',
                codeSnippet: 'calibrateSineOffsets();'
              };
              handleLearnFromYouTube(syntheticEvent);
            }}
            onSendActionToComputer={handleMobileActionToPC}
            onToggleSwarm={() => setIsSwarmActive(!isSwarmActive)}
            isAutoSwarmActive={isSwarmActive}
            joints={joints}
          />
        </div>
      )}

      {viewLayout === 'chrome_only' && (
        <div className="h-[750px]">
          <NexusChromeBrowser
            activeVideoId={activeVideo.id}
            onSelectVideo={(v) => setActiveVideo(v)}
            onLearnFromVideo={handleLearnFromYouTube}
          />
        </div>
      )}
    </div>
  );
};
