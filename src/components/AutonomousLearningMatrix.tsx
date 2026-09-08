import React from 'react';
import { AutonomousCoreEvolutionState, AutonomousLearningSignal, MemoryVectorRecord } from '../types';
import { 
  Bot, 
  Brain, 
  Sparkles, 
  Play, 
  Pause, 
  Zap, 
  Globe, 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  RefreshCw, 
  SlidersHorizontal,
  Flame,
  Activity,
  Gauge
} from 'lucide-react';

interface AutonomousLearningMatrixProps {
  evolutionState: AutonomousCoreEvolutionState;
  onToggleAutonomousMode: () => void;
  onChangeLearningInterval: (sec: number) => void;
  onForceAutonomousCycle: () => void;
  activeSignals: AutonomousLearningSignal[];
  recentEvolutionRecords: MemoryVectorRecord[];
  isEvolving: boolean;
  isOffline: boolean;
}

export const AutonomousLearningMatrix: React.FC<AutonomousLearningMatrixProps> = ({
  evolutionState,
  onToggleAutonomousMode,
  onChangeLearningInterval,
  onForceAutonomousCycle,
  activeSignals,
  recentEvolutionRecords,
  isEvolving,
  isOffline
}) => {
  return (
    <div id="autonomous-learning-module" className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
      {/* Header with Autonomous Loop Master Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg border transition-all ${evolutionState.isAutonomousModeActive ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
            <Brain className={`w-5 h-5 ${evolutionState.isAutonomousModeActive ? 'animate-pulse text-emerald-400' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Motor de Auto-Aprendizado & Evolução Autônoma em Fábrica
              </h2>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                evolutionState.isAutonomousModeActive 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {evolutionState.isAutonomousModeActive ? 'AUTO-PILOT APRENDENDO ATIVO' : 'AUTO-APRENDIZADO PAUSADO'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              O robô sintetiza interações da Web global e telemetria de fabricação para se auto-aperfeiçoar continuamente sem intervenção humana
            </p>
          </div>
        </div>

        {/* Master Controls */}
        <div className="flex items-center gap-2">
          {/* Interval selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400 text-[11px]">Ciclo:</span>
            {[3, 5, 10].map((sec) => (
              <button
                key={sec}
                id={`interval-btn-${sec}s`}
                onClick={() => onChangeLearningInterval(sec)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                  evolutionState.learningIntervalSec === sec
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>

          {/* Autonomous Loop Toggle */}
          <button
            id="toggle-autonomous-autopilot-btn"
            onClick={onToggleAutonomousMode}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
              evolutionState.isAutonomousModeActive
                ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black shadow-emerald-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {evolutionState.isAutonomousModeActive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar Auto-Piloto</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Ativar Auto-Aprendizado Autônomo</span>
              </>
            )}
          </button>

          {/* Force Step */}
          <button
            id="force-learning-cycle-btn"
            onClick={onForceAutonomousCycle}
            disabled={isEvolving}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Disparar ciclo de auto-evolução imediatamente"
          >
            <Sparkles className={`w-4 h-4 text-sky-400 ${isEvolving ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Autonomous Evolution Live Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 font-mono block">Ciclos Autônomos:</span>
          <span className="text-sm sm:text-base font-bold font-mono text-emerald-400">
            {evolutionState.learningCyclesCompleted}
          </span>
          <span className="text-[9px] text-slate-500 block mt-0.5">Executados em fábrica</span>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 font-mono block">Pesos Neurais Ajustados:</span>
          <span className="text-sm sm:text-base font-bold font-mono text-indigo-400">
            {evolutionState.neuralWeightsUpdated.toLocaleString()}
          </span>
          <span className="text-[9px] text-slate-500 block mt-0.5">Sinapses otimizadas</span>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 font-mono block">Precisão Acumulada:</span>
          <span className="text-sm sm:text-base font-bold font-mono text-sky-400">
            {evolutionState.overallAccuracyRating.toFixed(2)}%
          </span>
          <span className="text-[9px] text-emerald-400/90 block mt-0.5">±0.001mm micro-desvio</span>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 font-mono block">Ganho de Velocidade:</span>
          <span className="text-sm sm:text-base font-bold font-mono text-amber-400">
            +{evolutionState.cumulativeSpeedGainPct.toFixed(1)}%
          </span>
          <span className="text-[9px] text-slate-500 block mt-0.5">Redução de Jerk/Inércia</span>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 font-mono block">Energia Poupada:</span>
          <span className="text-sm sm:text-base font-bold font-mono text-emerald-300">
            {evolutionState.cumulativeEnergySavedJoules.toLocaleString()} J
          </span>
          <span className="text-[9px] text-slate-500 block mt-0.5">Eficiência de Motores</span>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 font-mono block">Nós Ingestados:</span>
          <span className="text-sm sm:text-base font-bold font-mono text-purple-400">
            {evolutionState.knowledgeNodesIngested}
          </span>
          <span className="text-[9px] text-slate-500 block mt-0.5">Web/Social/Pesquisas</span>
        </div>
      </div>

      {/* Real-time Ingestion Stream & Auto-Tuning Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Left: Live Global Ingestion Stream */}
        <div className="bg-slate-950/90 rounded-lg border border-slate-800 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400 animate-spin" style={{ animationDuration: '18s' }} />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Fluxo Global de Conhecimento em Tempo Real
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              {isOffline ? 'CACHE LOCAL OFFLINE ATIVO' : 'INGESTÃO GLOBAL CONECTADA'}
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {activeSignals.map((signal, idx) => (
              <div
                key={`${signal.id}-${idx}`}
                id={`signal-card-${signal.id}-${idx}`}
                className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 font-semibold">
                    {signal.source.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{signal.timestamp}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">{signal.topic}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {signal.insight}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-sky-400 pt-1">
                  <span>Alvo: {signal.appliedTarget}</span>
                  <span className="text-emerald-400 font-bold">Confiança: {(signal.confidenceScore * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Neural Self-Evolution Matrix & PID Tuning */}
        <div className="bg-slate-950/90 rounded-lg border border-slate-800 p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Auto-Calibração de Ganhos PID & Dinâmica
                </span>
              </div>
              <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
                Foco: {evolutionState.activeSynthesisFocus}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
              O robô calcula dinamicamente os tensores de inércia e adapta o amortecimento das juntas mecânicas com base na carga transportada e na velocidade angular requerida.
            </p>

            <div className="space-y-2 text-xs font-mono bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ganho Proporcional (Kp J1-J6):</span>
                <span className="text-emerald-400 font-bold">1.042 (Auto-ajustado)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ganho Integral (Ki anti-windup):</span>
                <span className="text-sky-400 font-bold">0.021 (Estável)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ganho Derivativo (Kd amortecimento):</span>
                <span className="text-indigo-400 font-bold">0.188 (Vibração zero)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Compensação Térmica de Tocha/Garra:</span>
                <span className="text-amber-400 font-bold">Modulação PWM Ativa</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Última evolução autônoma: {evolutionState.lastAutonomousEvolutionTime}</span>
            <span className="text-emerald-400 font-bold">Auto-Tuning 100% Ativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
