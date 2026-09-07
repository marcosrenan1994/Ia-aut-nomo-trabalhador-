import React, { useState } from 'react';
import { YouTubeAutoLearnEvent, AutonomousCoreEvolutionState, JointState } from '../types';
import { 
  Smartphone, 
  Wifi, 
  Battery, 
  BatteryCharging, 
  Zap, 
  Play, 
  Pause, 
  Sparkles, 
  Bell, 
  CheckCircle2, 
  Terminal, 
  Layers, 
  Brain, 
  Share2, 
  RotateCw, 
  Sliders, 
  Volume2, 
  Activity,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

interface NexusMobilePhoneProps {
  evolutionState: AutonomousCoreEvolutionState;
  recentLearnedEvents: YouTubeAutoLearnEvent[];
  activeVideoTitle?: string;
  onTriggerLearn?: () => void;
  onSendActionToComputer?: (action: string) => void;
  onToggleSwarm?: () => void;
  isAutoSwarmActive?: boolean;
  joints?: JointState[];
}

export const NexusMobilePhone: React.FC<NexusMobilePhoneProps> = ({
  evolutionState,
  recentLearnedEvents,
  activeVideoTitle = 'DeepMind Robotics Humanoid 2026',
  onTriggerLearn,
  onSendActionToComputer,
  onToggleSwarm,
  isAutoSwarmActive = false,
  joints = []
}) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'terminal' | 'teleop'>('hub');
  const [batteryLevel] = useState<number>(96);
  const [currentTime] = useState<string>('13:00');

  const speakNotification = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div id="nexus-mobile-chassis" className="relative mx-auto w-full max-w-[340px] select-none">
      {/* Smartphone Outer Metallic Hardware Frame */}
      <div className="relative rounded-[46px] p-3.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 shadow-2xl border-[3px] border-slate-600/70 shadow-cyan-500/10">
        {/* Physical hardware buttons on side */}
        <div className="absolute -left-[5px] top-24 w-[3px] h-10 bg-slate-600 rounded-l-sm"></div>
        <div className="absolute -left-[5px] top-38 w-[3px] h-10 bg-slate-600 rounded-l-sm"></div>
        <div className="absolute -right-[5px] top-28 w-[3px] h-14 bg-slate-600 rounded-r-sm"></div>

        {/* Smartphone Screen Glass */}
        <div className="relative rounded-[36px] bg-slate-950 overflow-hidden border border-slate-800 flex flex-col h-[620px] text-white">
          {/* Top Speaker / Dynamic Island Notch */}
          <div className="pt-2 px-5 flex items-center justify-between z-20">
            <span className="text-[11px] font-bold text-slate-300 font-mono tracking-tight">
              {currentTime}
            </span>

            {/* Dynamic Island pill */}
            <div className="bg-black border border-slate-800 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md shadow-cyan-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-[9px] font-mono text-cyan-300 font-bold">
                {isAutoSwarmActive ? 'NEXUS SWARM' : 'CHROME YOUTUBE'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-[9px] font-mono text-emerald-400 font-bold">5G</span>
              <Wifi className="w-3 h-3 text-slate-300" />
              <div className="flex items-center gap-0.5 text-[9px] font-mono">
                <span>{batteryLevel}%</span>
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Device Header Bar */}
          <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-slate-900 bg-slate-950/80">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/20">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wide">NEXUS MOBILE</h3>
                <p className="text-[9px] font-mono text-cyan-400">Sincronizado com Computador</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800/80 px-2 py-0.5 rounded-full font-bold">
                LVL {evolutionState.wisdomLevel}
              </span>
            </div>
          </div>

          {/* Smartphone Screen Viewport Content */}
          <div className="flex-grow overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
            {activeTab === 'hub' && (
              <>
                {/* Real-time YouTube Learning Remote Card */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/40 p-3 rounded-2xl border border-red-500/30 shadow-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-3 bg-red-600 rounded-sm flex items-center justify-center text-[7px] text-white font-bold">
                        ▶
                      </div>
                      <span className="text-[10px] font-mono font-bold text-red-400 uppercase">
                        Chrome Online Mirror
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800">
                      Aprendendo
                    </span>
                  </div>

                  <p className="text-xs font-bold text-white line-clamp-1">
                    {activeVideoTitle}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      id="mobile-trigger-learn-btn"
                      onClick={() => {
                        if (onTriggerLearn) onTriggerLearn();
                        speakNotification('Comando enviado do Celular ao Computador: Extração de conhecimento disparada.');
                      }}
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all shadow-md shadow-red-600/30"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Aprender do Vídeo</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onSendActionToComputer) onSendActionToComputer('SYNC_VIDEO_STATE');
                        speakNotification('Sincronização iniciada entre celular e computador.');
                      }}
                      className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded-lg border border-slate-700"
                    >
                      <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                      <span>Enviar ao PC</span>
                    </button>
                  </div>
                </div>

                {/* Quick Cross-Device Action Toggles */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    id="mobile-toggle-swarm-btn"
                    onClick={onToggleSwarm}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isAutoSwarmActive
                        ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900/90 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Zap className={`w-3.5 h-3.5 ${isAutoSwarmActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span className="text-[9px] font-mono">{isAutoSwarmActive ? 'LIGADO' : 'DESL.'}</span>
                    </div>
                    <span className="font-bold text-[11px] mt-2 text-white">IA Swarm no PC</span>
                  </button>

                  <button
                    id="mobile-speak-tts-btn"
                    onClick={() => speakNotification('Controle transferido. Enxame de IAs iniciando auto-modificação estrutural.')}
                    className="p-2.5 rounded-xl border bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-300 text-left flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between w-full">
                      <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-[9px] font-mono text-indigo-400">TTS VOZ</span>
                    </div>
                    <span className="font-bold text-[11px] mt-2 text-white">Falar Comando</span>
                  </button>
                </div>

                {/* Real-time Learned Notification Feed */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1">
                      <Bell className="w-3 h-3 text-amber-400" />
                      Push: Conhecimento Adquirido
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">Tempo Real</span>
                  </div>

                  <div className="space-y-1.5">
                    {recentLearnedEvents.slice(0, 3).map((evt, idx) => (
                      <div
                        key={`${evt.id}-${idx}`}
                        className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] space-y-1 animate-fadeIn"
                      >
                        <div className="flex items-center justify-between font-mono">
                          <span className="text-cyan-400 font-bold">{evt.timestamp}</span>
                          <span className="text-emerald-400 font-semibold">{evt.accuracyDelta}</span>
                        </div>
                        <p className="text-slate-200 leading-snug">{evt.extractedKnowledge}</p>
                        <code className="text-[9px] font-mono text-amber-300 block truncate">
                          {evt.kinematicRuleDiscovered}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cognitive Matrix Mini-Widget */}
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono block">IQ FABRIL SINCRONIZADO:</span>
                    <span className="font-bold font-mono text-amber-400 text-sm">
                      {evolutionState.cognitiveIndexScore} pts
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 font-mono block">PRECISÃO DINÂMICA:</span>
                    <span className="font-bold font-mono text-emerald-400">
                      {evolutionState.overallAccuracyRating.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'terminal' && (
              <div className="bg-black p-2.5 rounded-xl border border-slate-800 font-mono text-[10px] text-emerald-400 space-y-1 h-[440px] overflow-y-auto">
                <p className="text-cyan-400">&gt; NEXUS MOBILE SHELL v8.2</p>
                <p>&gt; SINCRONIZANDO DADOS COM ESTAÇÃO DE TRABALHO PC...</p>
                <p className="text-slate-400">&gt; LINK 5G CONECTADO: IP 192.168.1.108</p>
                <p>&gt; RECEBENDO PACOTES DE YOUTUBE AUTO-LEARN STREAM</p>
                {recentLearnedEvents.map((e, idx) => (
                  <div key={idx} className="border-t border-slate-900 pt-1 text-slate-300">
                    <span className="text-amber-400">[{e.timestamp}]</span> {e.extractedKnowledge}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'teleop' && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                  Telemetria Rápida das Juntas ER-2
                </span>
                <div className="space-y-1.5">
                  {joints.slice(0, 4).map((j) => (
                    <div key={j.id} className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-[10px]">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-300 font-bold">{j.name}</span>
                        <span className="text-cyan-400 font-bold">{j.angle}°</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(10, ((j.angle - j.minAngle) / (j.maxAngle - j.minAngle)) * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Smartphone Bottom Navigation Bar */}
          <div className="bg-slate-950/95 border-t border-slate-900 px-6 py-2 flex items-center justify-between text-slate-500 z-20">
            <button
              onClick={() => setActiveTab('hub')}
              className={`flex flex-col items-center gap-0.5 text-[9px] font-mono transition-colors ${
                activeTab === 'hub' ? 'text-cyan-400 font-bold' : 'hover:text-slate-300'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Início</span>
            </button>

            <button
              onClick={() => setActiveTab('terminal')}
              className={`flex flex-col items-center gap-0.5 text-[9px] font-mono transition-colors ${
                activeTab === 'terminal' ? 'text-cyan-400 font-bold' : 'hover:text-slate-300'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Shell</span>
            </button>

            <button
              onClick={() => setActiveTab('teleop')}
              className={`flex flex-col items-center gap-0.5 text-[9px] font-mono transition-colors ${
                activeTab === 'teleop' ? 'text-cyan-400 font-bold' : 'hover:text-slate-300'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Robô</span>
            </button>
          </div>

          {/* Home indicator bar */}
          <div className="pb-1 pt-0.5 flex justify-center bg-slate-950">
            <div className="w-24 h-1 bg-slate-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
