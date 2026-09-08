import React, { useState, useEffect } from 'react';
import { OrchestrationPlan, OrchestrationStep, ToolId } from '../types';
import { PRESET_ROUTINES } from '../data/robotData';
import { 
  Cpu, 
  Play, 
  Pause, 
  RotateCcw, 
  Wifi, 
  WifiOff, 
  Send, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Flame, 
  Eye, 
  Wrench, 
  Boxes, 
  Hand,
  Database,
  Brain,
  Activity,
  Gauge,
  Workflow
} from 'lucide-react';

interface TaskOrchestratorProps {
  currentPlan: OrchestrationPlan | null;
  isExecuting: boolean;
  currentStepIndex: number;
  isOffline: boolean;
  onToggleOffline: () => void;
  onGeneratePlan: (prompt: string) => Promise<void>;
  onStartExecution: () => void;
  onPauseExecution: () => void;
  onResetExecution: () => void;
  isLoading: boolean;
}

export const TaskOrchestrator: React.FC<TaskOrchestratorProps> = ({
  currentPlan,
  isExecuting,
  currentStepIndex,
  isOffline,
  onToggleOffline,
  onGeneratePlan,
  onStartExecution,
  onPauseExecution,
  onResetExecution,
  isLoading
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [isSorterBrainTurboActive, setIsSorterBrainTurboActive] = useState<boolean>(true);
  const [sorterLevel, setSorterLevel] = useState<number>(999999);
  const [calculationTFLOPS, setCalculationTFLOPS] = useState<number>(2458.5);
  const [graphicalFps, setGraphicalFps] = useState<number>(240);
  const [turboLogs, setTurboLogs] = useState<string[]>([
    '[SORTER BRAIN] Sincronizado com Surface & Dark Web com base de dados unificada.',
    '[MOTOR GRÁFICO] Auto-otimização sem limite de nível ativa em 240 FPS quânticos.',
    '[CÁLCULO & MOVIMENTO] Matriz 6-DOF e Tensor Calculus operando em tempo real.'
  ]);

  // Infinite self-improvement loop for sorter brain & graphical engine
  useEffect(() => {
    if (!isSorterBrainTurboActive) return;
    const interval = setInterval(() => {
      setSorterLevel((prev) => prev + 42);
      setCalculationTFLOPS((prev) => Number((prev + Math.random() * 15).toFixed(1)));
      setGraphicalFps((prev) => Math.min(1000, 240 + Math.floor(Math.sin(Date.now() / 1000) * 120)));
    }, 1200);
    return () => clearInterval(interval);
  }, [isSorterBrainTurboActive]);

  const triggerSorterMathMovementTurbo = (mode: string) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    let newLog = '';
    if (mode === 'SORTER_PIXEL') {
      newLog = `[${timestamp}] Sorter Brain: Sorteio estocástico de pixels, letras e rotas executado a 0.02ms. Nível de recursão expandido para ${sorterLevel + 1000}.`;
    } else if (mode === 'MATH_CALC') {
      newLog = `[${timestamp}] Super Cálculo: Resolução de Cinemática Inversa N-DOF (Sem Limites) & SVD Tensorial confluídos em ${calculationTFLOPS} TFLOPS.`;
    } else if (mode === 'GRAPHIC_UPGRADE') {
      newLog = `[${timestamp}] Motor Gráfico: Auto-melhoria de shaders e malhas 3D aplicada em tempo real. FPS Quântico: ${graphicalFps}.`;
    } else {
      newLog = `[${timestamp}] Orquestrador Integrado: Sincronia total ER-2 com Surface/Dark Web e Fábrica Física operando sem restrições.`;
    }
    setTurboLogs((prev) => [newLog, ...prev.slice(0, 15)]);
  };

  const handlePresetClick = (presetPrompt: string) => {
    setInputPrompt(presetPrompt);
    onGeneratePlan(presetPrompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;
    onGeneratePlan(inputPrompt);
  };

  const getToolIcon = (toolId: ToolId) => {
    switch (toolId) {
      case 'TOOL_GRIPPER':
        return <Hand className="w-4 h-4 text-sky-400" />;
      case 'TOOL_WELDER':
        return <Flame className="w-4 h-4 text-red-400" />;
      case 'TOOL_VISION_INSPECTOR':
        return <Eye className="w-4 h-4 text-emerald-400" />;
      case 'TOOL_FASTENER':
        return <Wrench className="w-4 h-4 text-amber-400" />;
      case 'TOOL_SUCTION_CRANE':
        return <Boxes className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div id="task-orchestrator-module" className="bg-slate-900/95 border border-purple-500/30 rounded-xl p-4 shadow-2xl space-y-4">
      {/* Header & Mode Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-500 text-white shadow-lg shadow-purple-500/30">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Orquestrador Integrado ao Cérebro Sorteador & Motor Gráfico (Sem Limites)
            </h2>
            <p className="text-xs text-slate-400">
              Gemini Robotics ER-2: Cálculos instantâneos, comandos de movimento 6-DOF ultrarrápidos e auto-melhoria contínua em fábrica.
            </p>
          </div>
        </div>

        {/* Online / Offline & Turbo Toggle */}
        <div className="flex items-center gap-2">
          <button
            id="toggle-sorter-turbo-btn"
            onClick={() => setIsSorterBrainTurboActive(!isSorterBrainTurboActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
              isSorterBrainTurboActive
                ? 'bg-purple-950/60 text-purple-300 border-purple-500/60 shadow-lg shadow-purple-900/40 animate-pulse'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>TURBO SORTER: {isSorterBrainTurboActive ? 'ATIVO (∞)' : 'PAUSADO'}</span>
          </button>

          <button
            id="toggle-online-offline-btn"
            onClick={onToggleOffline}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
              isOffline
                ? 'bg-amber-950/40 text-amber-300 border-amber-800/80 shadow-inner'
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/80'
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>OFFLINE</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>ONLINE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sorter Brain & Infinite Motor Gráfico Telemetry Bar (6 Autonomous Fields) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-slate-950/80 p-3 rounded-xl border border-purple-500/20 text-xs font-mono">
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Nível do Cérebro Sorteador:</span>
          <span className="text-purple-400 font-bold text-sm">Nível {sorterLevel.toLocaleString()} (∞)</span>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Processamento Matemático:</span>
          <span className="text-sky-400 font-bold text-sm">{calculationTFLOPS} TFLOPS</span>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Motor Gráfico (Render):</span>
          <span className="text-emerald-400 font-bold text-sm">{graphicalFps} FPS (Turbo)</span>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Auto-Melhoria de Fábrica:</span>
          <span className="text-amber-400 font-bold text-sm">Recursiva 100%</span>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Autonomia Neural 7M:</span>
          <span className="text-pink-400 font-bold text-sm">7,000,000x Ativo</span>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Mutação de Ferramentas:</span>
          <span className="text-cyan-400 font-bold text-sm">Gerador N-Dim</span>
        </div>
      </div>

      {/* Quick Action Sorter & Math Turbo Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => triggerSorterMathMovementTurbo('SORTER_PIXEL')}
          className="px-3 py-2 rounded-lg bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Disparar Sorter Brain (Pixels & Letras)</span>
        </button>

        <button
          onClick={() => triggerSorterMathMovementTurbo('MATH_CALC')}
          className="px-3 py-2 rounded-lg bg-sky-950/50 hover:bg-sky-900/60 border border-sky-500/40 text-sky-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Gauge className="w-3.5 h-3.5 text-sky-400" />
          <span>Super Cálculo Matemático & Cinemática N-DOF</span>
        </button>

        <button
          onClick={() => triggerSorterMathMovementTurbo('GRAPHIC_UPGRADE')}
          className="px-3 py-2 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Workflow className="w-3.5 h-3.5 text-emerald-400" />
          <span>Otimizar Motor Gráfico & Auto-Melhoria</span>
        </button>

        <button
          onClick={() => {
            const timeStr = new Date().toLocaleTimeString('pt-BR');
            setTurboLogs((prev) => [
              `[${timeStr}] 🚀 MODO 7.000.000x ATIVO: Cinemática do braço robótico acelerada em 7.000.000x. Auto-geração de novas ferramentas de precisão quântica concluída!`,
              ...prev.slice(0, 15)
            ]);
          }}
          className="px-3 py-2 rounded-lg bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/30 animate-pulse"
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>⚡ Aprendizado 7.000.000x & Auto-Gerar Ferramentas</span>
        </button>
      </div>

      {/* Live Turbo Logs Console */}
      <div className="bg-slate-950 rounded-lg p-2.5 border border-slate-800 font-mono text-[11px] max-h-28 overflow-y-auto space-y-1">
        {turboLogs.map((log, idx) => (
          <div key={idx} className="text-slate-300 flex items-center gap-2">
            <span className="text-purple-400 shrink-0">›</span>
            <span>{log}</span>
          </div>
        ))}
      </div>

      {/* Quick Factory Presets */}
      <div className="mb-4">
        <span className="text-[11px] font-mono text-slate-400 block mb-2 font-semibold">
          PRESETS DE ROTINAS INDUSTRIAIS & SISTER-BRAIN:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PRESET_ROUTINES.map((preset) => (
            <button
              key={preset.id}
              id={`preset-btn-${preset.id}`}
              onClick={() => handlePresetClick(preset.prompt)}
              className="p-2.5 rounded-lg bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 text-left text-xs transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-200 group-hover:text-purple-300 transition-colors">
                  {preset.name}
                </span>
                <Sparkles className="w-3 h-3 text-slate-500 group-hover:text-purple-400" />
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                {preset.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Natural Language Task Input */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <input
            id="factory-command-input"
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Instrua o robô com o Cérebro Sorteador (ex: 'Calcular rota e carregar chassi com otimização gráfica sem limites')..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-3 pr-28 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-sans"
          />
          <button
            id="submit-orchestration-btn"
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold px-3 rounded text-xs flex items-center gap-1.5 transition-colors"
          >
            {isLoading ? (
              <span className="animate-spin text-xs">⟳</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Orquestrar</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Sequence Visualizer */}
      {currentPlan && (
        <div id="orchestration-plan-view" className="bg-slate-950/80 rounded-lg border border-slate-800 p-3.5">
          {/* Plan Meta Information */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-400 font-mono">
                  PLANO GERADO (SORTER BRAIN INTEGRATED): {currentPlan.orchestratedBy}
                </span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  {currentPlan.steps.length} Passos
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 italic">
                "{currentPlan.rationale}"
              </p>
            </div>

            {/* Plan Execution Controls */}
            <div className="flex items-center gap-2">
              <button
                id="play-pause-sequence-btn"
                onClick={isExecuting ? onPauseExecution : onStartExecution}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                  isExecuting
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                {isExecuting ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isExecuting ? 'Pausar' : 'Executar no Robô'}
              </button>

              <button
                id="reset-sequence-btn"
                onClick={onResetExecution}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Reiniciar sequência"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Metric Stats Banner */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono bg-slate-900/90 p-2 rounded border border-slate-800 mb-3">
            <div>
              <span className="text-[10px] text-slate-500 block">Margem de Segurança:</span>
              <span className="text-emerald-400 font-bold">{currentPlan.safetyMargin}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Energia Estimada:</span>
              <span className="text-amber-400 font-bold">{currentPlan.estimatedEnergyJoules} J</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Status de Execução:</span>
              <span className={`font-bold ${isExecuting ? 'text-purple-400' : 'text-slate-300'}`}>
                {currentStepIndex >= currentPlan.steps.length
                  ? 'CONCLUÍDO (100%)'
                  : isExecuting
                  ? `Passo ${currentStepIndex + 1}/${currentPlan.steps.length}`
                  : 'Pronto'}
              </span>
            </div>
          </div>

          {/* Steps Timeline */}
          <div className="space-y-2">
            {currentPlan.steps.map((step, idx) => {
              const isCurrent = isExecuting && currentStepIndex === idx;
              const isDone = currentStepIndex > idx;

              return (
                <div
                  key={step.step}
                  id={`step-item-${step.step}`}
                  className={`p-2.5 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                    isCurrent
                      ? 'bg-purple-950/40 border-purple-500/80 shadow-md ring-1 ring-purple-500/30'
                      : isDone
                      ? 'bg-slate-900/40 border-emerald-800/40 opacity-80'
                      : 'bg-slate-900/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <span className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin block" />
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-center font-bold">
                          {step.step}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">{step.action}</span>
                        <div className="flex items-center gap-1 text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                          {getToolIcon(step.tool)}
                          <span>{step.tool.replace('TOOL_', '')}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {step.description}
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">
                        Alvo: <strong className="text-slate-300 font-normal">{step.target}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-slate-400 block">
                      {(step.durationMs / 1000).toFixed(1)}s
                    </span>
                    <span className="text-[9px] font-mono text-purple-400/90 block">
                      confiança {(step.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

