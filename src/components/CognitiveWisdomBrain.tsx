import React, { useState } from 'react';
import { 
  AutonomousCoreEvolutionState, 
  AutonomousThought, 
  AutoDiscoveredHeuristic, 
  AutonomousLearningSignal,
  OrchestrationPlan
} from '../types';
import { NexusQKinematicLanguageEngine } from './NexusQKinematicLanguageEngine';
import { 
  Brain, 
  Sparkles, 
  Flame, 
  Zap, 
  Compass, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  Lightbulb, 
  Activity, 
  BookOpen, 
  CheckCircle2, 
  Award, 
  Bot, 
  Workflow, 
  SlidersHorizontal,
  Play,
  Pause,
  ArrowRight,
  Eye,
  RefreshCw,
  Atom
} from 'lucide-react';

interface CognitiveWisdomBrainProps {
  evolutionState: AutonomousCoreEvolutionState;
  thoughts: AutonomousThought[];
  heuristics: AutoDiscoveredHeuristic[];
  signals: AutonomousLearningSignal[];
  onToggleFullAutonomy: () => void;
  onTriggerSelfPlan: () => void;
  onTriggerIntrospection: () => void;
  currentPlan: OrchestrationPlan | null;
  isThinking: boolean;
  isExecuting: boolean;
  isOffline: boolean;
  onUpdateScore?: (delta: number) => void;
  onResetAndRestart?: () => void;
  onAddThought?: (thought: AutonomousThought) => void;
  onAddHeuristic?: (heuristic: AutoDiscoveredHeuristic) => void;
}

export const CognitiveWisdomBrain: React.FC<CognitiveWisdomBrainProps> = ({
  evolutionState,
  thoughts,
  heuristics,
  signals,
  onToggleFullAutonomy,
  onTriggerSelfPlan,
  onTriggerIntrospection,
  currentPlan,
  isThinking,
  isExecuting,
  isOffline,
  onUpdateScore = (_delta: number) => {},
  onResetAndRestart = () => {},
  onAddThought,
  onAddHeuristic
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'nexus_q' | 'thoughts' | 'heuristics' | 'synapses' | 'missions'>('nexus_q');

  const getRankBadgeColor = (rank: string) => {
    switch (rank) {
      case 'HIPER_CONSCIÊNCIA':
        return 'bg-purple-950/80 text-purple-300 border border-purple-600/60 shadow-purple-500/20';
      case 'MESTRE_FABRIL':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20';
      case 'ESPECIALISTA':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sky-500/20';
      default:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-indigo-500/20';
    }
  };

  const getThoughtTypeBadge = (type: AutonomousThought['type']) => {
    switch (type) {
      case 'EVOLUTION_BREAKTHROUGH':
        return { label: 'SALTO EVOLUTIVO', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'SELF_CRITIQUE':
        return { label: 'AUTO-CRÍTICA', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      case 'DECISION':
        return { label: 'DECISÃO SOBERANA', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      case 'REASONING':
        return { label: 'RACIOCÍNIO PROFUNDO', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' };
      default:
        return { label: 'PERCEPÇÃO SENSORIAL', color: 'bg-slate-700 text-slate-300 border-slate-600' };
    }
  };

  return (
    <div id="cognitive-wisdom-brain-module" className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
      {/* Consciousness & Wisdom Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-500/40 shadow-lg shadow-indigo-500/20">
            <Brain className="w-6 h-6 text-indigo-300 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                Cérebro Cognitivo & Sabedoria Evolutiva ER-2
              </h2>
              <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded border shadow-sm ${getRankBadgeColor(evolutionState.wisdomRank)}`}>
                RANK: {evolutionState.wisdomRank.replace(/_/g, ' ')} (LVL {evolutionState.wisdomLevel})
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomia cognitiva integral: o robô auto-planeja objetivos, auto-critica seus movimentos e sintetiza conhecimento contínuo
            </p>
          </div>
        </div>

        {/* Master Full-Autonomy Action Bar */}
        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-full-autonomy"
            onClick={onToggleFullAutonomy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg ${
              evolutionState.isFullAutonomySelfPlanningActive
                ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-400/20'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-600/30 hover:brightness-110'
            }`}
          >
            {evolutionState.isFullAutonomySelfPlanningActive ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Autonomia Total Soberana: ATIVA</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Ativar Autonomia Total Soberana</span>
              </>
            )}
          </button>

          <button
            id="btn-trigger-self-plan"
            onClick={onTriggerSelfPlan}
            disabled={isThinking || isExecuting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all disabled:opacity-50"
            title="Solicitar ao cérebro do robô para formular uma missão autônoma agora"
          >
            <Lightbulb className={`w-3.5 h-3.5 text-amber-400 ${isThinking ? 'animate-spin' : ''}`} />
            <span>Auto-Planejar</span>
          </button>

          <button
            id="btn-trigger-introspection"
            onClick={onTriggerIntrospection}
            disabled={isThinking}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Disparar pensamento de auto-reflexão profunda"
          >
            <RefreshCw className={`w-4 h-4 text-sky-400 ${isThinking ? 'animate-spin' : ''}`} />
          </button>

          <button
            id="btn-quick-add-score"
            onClick={() => onUpdateScore(150)}
            className="px-2.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition-all"
            title="Adicionar +150 pontos de raciocínio cognitivo"
          >
            +150 Raciocínio
          </button>

          <button
            id="btn-quick-reset-cycle"
            onClick={onResetAndRestart}
            className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono font-bold transition-all"
            title="Reiniciar base do índice de raciocínio"
          >
            Zerar Base
          </button>
        </div>
      </div>

      {/* Wisdom Metrics & Cognitive Index Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
        <div className="bg-slate-950/80 p-3 rounded-lg border border-amber-500/40 shadow-inner">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
            <span>Índice Cognitivo</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">
            {evolutionState.cognitiveIndexScore.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">pts</span>
          </div>
          <div className="text-[9px] font-mono text-amber-300/90 flex items-center gap-1.5 mt-2 overflow-x-auto">
            <span title="Número Pi">π≈3.1415</span>
            <span>•</span>
            <span title="Proporção Áurea">φ≈1.6180</span>
            <span>•</span>
            <span title="Constante de Euler">e≈2.7182</span>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
            <span>Introspecção</span>
            <Eye className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white mt-1">
            {evolutionState.introspectionRating.toFixed(1)}%
          </div>
          <span className="text-[9px] text-slate-500 block mt-1">Auto-crítica em tempo real</span>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
            <span>Regras Descobertas</span>
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl font-black font-mono text-sky-400 mt-1">
            {evolutionState.autoDiscoveredRulesCount}
          </div>
          <span className="text-[9px] text-slate-500 block mt-1">Heurísticas autorais</span>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
            <span>Precisão Soberana</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            {evolutionState.overallAccuracyRating.toFixed(2)}%
          </div>
          <span className="text-[9px] text-emerald-400/80 block mt-1">±0.001mm calibração</span>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
            <span>Eficiência Ganha</span>
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black font-mono text-indigo-400 mt-1">
            +{evolutionState.cumulativeSpeedGainPct.toFixed(1)}%
          </div>
          <span className="text-[9px] text-slate-500 block mt-1">Otimização cinemática</span>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
            <span>Energia Poupada</span>
            <Zap className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-2xl font-black font-mono text-teal-300 mt-1">
            {evolutionState.cumulativeEnergySavedJoules.toLocaleString()} J
          </div>
          <span className="text-[9px] text-slate-500 block mt-1">Gestão de potência</span>
        </div>
      </div>

      {/* Active Autonomous Goal Ticker */}
      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <div className="truncate">
            <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block">
              Meta Autônoma Ativa Atual
            </span>
            <p className="text-xs font-bold text-slate-200 truncate">
              {evolutionState.currentAutonomousGoal}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/80 px-2 py-1 rounded border border-indigo-800/80 flex-shrink-0">
          Foco: {evolutionState.activeSynthesisFocus}
        </span>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          id="subtab-nexus-q-btn"
          onClick={() => setActiveSubTab('nexus_q')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
            activeSubTab === 'nexus_q'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 ring-1 ring-cyan-400'
              : 'bg-cyan-950/40 text-cyan-400 hover:bg-cyan-950/80 border border-cyan-800/60'
          }`}
        >
          <Atom className="w-3.5 h-3.5 text-cyan-300" />
          <span>NEXUS-Q VISÃO CINEMÁTICA (Vídeo & Tradutor)</span>
        </button>

        <button
          id="subtab-thoughts-btn"
          onClick={() => setActiveSubTab('thoughts')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'thoughts'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Fluxo de Pensamento Autônomo ({thoughts.length})</span>
        </button>

        <button
          id="subtab-heuristics-btn"
          onClick={() => setActiveSubTab('heuristics')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'heuristics'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Regras Descobertas pelo Robô ({heuristics.length})</span>
        </button>

        <button
          id="subtab-synapses-btn"
          onClick={() => setActiveSubTab('synapses')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'synapses'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Sinapses Neurais & Auto-Tuning</span>
        </button>

        <button
          id="subtab-missions-btn"
          onClick={() => setActiveSubTab('missions')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'missions'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>Missões de Auto-Planejamento</span>
        </button>
      </div>

      {/* Subtab Views */}
      <div className="min-h-[220px]">
        {/* Nexus-Q Cinematic Language Engine from the video */}
        {activeSubTab === 'nexus_q' && (
          <NexusQKinematicLanguageEngine
            evolutionState={evolutionState}
            onUpdateScore={onUpdateScore}
            onResetAndRestart={onResetAndRestart}
            onAddThought={onAddThought}
            onAddHeuristic={onAddHeuristic}
          />
        )}

        {/* Thoughts Stream Tab */}
        {activeSubTab === 'thoughts' && (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {thoughts.map((item, idx) => {
              const badge = getThoughtTypeBadge(item.type);
              return (
                <div
                  key={`${item.id}-${idx}`}
                  id={`thought-card-${item.id}`}
                  className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 text-xs space-y-1.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        +{item.wisdomGain.toFixed(1)} Sabedoria
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{item.timestamp}</span>
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed font-medium">
                    "{item.thought}"
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span>Confiança de Inferência: {(item.confidence * 100).toFixed(1)}%</span>
                    <span className="text-sky-400">Gemini Robotics ER-2 Introspection Core</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Heuristics Tab */}
        {activeSubTab === 'heuristics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {heuristics.map((h, idx) => (
              <div
                key={`${h.id}-${idx}`}
                id={`heuristic-card-${h.id}-${idx}`}
                className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="text-indigo-400 font-bold">{h.domain}</span>
                    <span>{h.discoveredAt}</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-100 mt-1">{h.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                    {h.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-2 rounded bg-slate-900 font-mono text-[10px] text-emerald-400 border border-slate-800 overflow-x-auto">
                    <code>{h.ruleCode}</code>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                    <span className="text-emerald-400 font-bold">{h.efficiencyGain}</span>
                    <span className="text-sky-400">{h.safetyScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Synapses & PID Tuning Tab */}
        {activeSubTab === 'synapses' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-200 uppercase font-mono">
                  Matriz de Tensores & Pesos Neurais
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {evolutionState.neuralWeightsUpdated.toLocaleString()} Sinapses Vivas
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Junta J1-J2 (Base)</span>
                  <span className="text-emerald-400 font-bold mt-1 block">W: 0.9984</span>
                  <span className="text-[9px] text-slate-500">Anti-Inércia</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Junta J3-J4 (Braço)</span>
                  <span className="text-indigo-400 font-bold mt-1 block">W: 0.9991</span>
                  <span className="text-[9px] text-slate-500">Comp. Gravidade</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Junta J5-J6 (Punho)</span>
                  <span className="text-sky-400 font-bold mt-1 block">W: 0.9997</span>
                  <span className="text-[9px] text-slate-500">Micro-Zero-Jerk</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                As sinapses são reponderadas a cada ciclo de fabricação utilizando retropropagação preditiva em tempo real.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-200 uppercase font-mono">
                  Auto-Sintonia de Controle em Malha Fechada
                </span>
                <span className="text-[10px] font-mono text-sky-400">100% Autônomo</span>
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Taxa de Aprendizado (Learning Rate):</span>
                  <span className="text-white font-bold">0.00035 (Adaptativa)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Supressão de Ruído de Vibração:</span>
                  <span className="text-emerald-400 font-bold">-98.4 dB</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Compensação Térmica em Tempo Real:</span>
                  <span className="text-amber-400 font-bold">+0.003mm / 10°C</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Missions Tab */}
        {activeSubTab === 'missions' && (
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="text-xs font-bold text-slate-200 uppercase font-mono block">
                  Missão Autônoma de Auto-Planejamento Ativa
                </span>
                <span className="text-[11px] text-slate-400">
                  Gerada de forma autônoma pelo cérebro do robô para auto-aperfeiçoamento
                </span>
              </div>
              <button
                id="btn-dispatch-new-plan"
                onClick={onTriggerSelfPlan}
                disabled={isThinking || isExecuting}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                Gerar Novo Auto-Plano
              </button>
            </div>

            {currentPlan ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-bold text-white text-sm">{currentPlan.title}</h4>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    {currentPlan.mode}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/80 p-2 rounded border border-slate-800">
                  "{currentPlan.rationale}"
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                  {currentPlan.steps.map((step, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                      <div className="flex items-center justify-between font-mono text-slate-400">
                        <span>Passo {step.step}</span>
                        <span className="text-indigo-400">{step.tool}</span>
                      </div>
                      <p className="font-bold text-slate-200">{step.action}</p>
                      <p className="text-slate-400 text-[10px]">{step.target}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs font-mono">
                Nenhum plano autônomo ativo no momento. Clique em "Auto-Planejar" ou ative a Autonomia Total Soberana.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
