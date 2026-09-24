import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Square, 
  Brain, 
  Zap, 
  Sparkles, 
  HardDrive, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  RefreshCw,
  Wrench,
  Bot,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { AutonomousThought, MemoryVectorRecord, ToolId } from '../types';

interface SalomaoOrchestratorRunBarProps {
  moduleName: string;
  moduleId: string;
  category: string;
  isRunning: boolean;
  onToggleRun: () => void;
  onAddThought?: (thought: AutonomousThought) => void;
  onAddMemoryRecord?: (record: MemoryVectorRecord) => void;
  activeToolId?: ToolId;
}

export const SalomaoOrchestratorRunBar: React.FC<SalomaoOrchestratorRunBarProps> = ({
  moduleName,
  moduleId,
  category,
  isRunning,
  onToggleRun,
  onAddThought,
  onAddMemoryRecord,
  activeToolId = 'TOOL_VISION_INSPECTOR'
}) => {
  const [cycles, setCycles] = useState<number>(0);
  const [currentThought, setCurrentThought] = useState<string>(
    `Orquestrador Salomão pronto para sincronizar módulo [${moduleName}].`
  );
  const [confidence, setConfidence] = useState<number>(98.5);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Autonomous thinking cycle when running inside this dashboard
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCycles((prev) => prev + 1);
      const thoughtsList = [
        `Analisando variáveis heurísticas no módulo ${moduleName}...`,
        `Consolidando padrões e gravando vetor de memória neural no cérebro de Salomão.`,
        `Despachando kit de ferramentas autônomo: ${activeToolId} ativo para este painel.`,
        `Otimizando decisões em tempo real com confiança quântica de ${(98 + Math.random() * 1.9).toFixed(2)}%.`,
        `Painel ${moduleName} agora integrado como extensão de memória de longo prazo do Salomão.`
      ];
      const nextThought = thoughtsList[Math.floor(Math.random() * thoughtsList.length)];
      setCurrentThought(nextThought);
      setConfidence(parseFloat((98 + Math.random() * 1.9).toFixed(1)));

      if (onAddThought) {
        onAddThought({
          id: `th-salomao-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date().toLocaleTimeString('pt-BR'),
          category: 'REASONING',
          hypothesis: `Orquestração autônoma do módulo [${moduleName}]`,
          confidence: 0.99,
          supportingEvidence: [
            `Módulo ID: ${moduleId}`,
            `Categoria: ${category}`,
            `Ciclo de Operação: #${cycles + 1}`
          ],
          falsificationCriteria: 'Incoerência nas métricas de telemetria ou cancelamento manual do usuário.',
          status: 'ACCEPTED'
        });
      }

      if (onAddMemoryRecord && Math.random() > 0.6) {
        onAddMemoryRecord({
          id: `mem-salomao-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('pt-BR'),
          embeddingPreview: [0.24, -0.61, 0.88, 0.45],
          description: `Snapshot autônomo do painel [${moduleName}] sincronizado à memória global de Salomão.`,
          associatedJoints: [120, -70, -78, -30, 10, 0],
          outcome: 'SUCCESS',
          retrievalScore: 0.992
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isRunning, moduleName, moduleId, category, activeToolId, cycles, onAddThought, onAddMemoryRecord]);

  if (isMinimized) {
    return (
      <div className={`p-2.5 px-4 rounded-xl border transition-all duration-200 shadow-md mb-3 flex items-center justify-between gap-3 ${
        isRunning
          ? 'bg-purple-950/80 border-purple-500/60 shadow-purple-900/20'
          : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <Brain className={`w-4 h-4 shrink-0 ${isRunning ? 'text-purple-400 animate-pulse' : 'text-slate-400'}`} />
          <span className="text-xs font-bold text-white truncate">
            Salomão: <span className="text-purple-300 font-mono">{moduleName}</span>
          </span>
          <span className={`px-2 py-0.2 rounded-full text-[9px] font-mono font-bold ${
            isRunning ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
          }`}>
            {isRunning ? 'ATIVO' : 'PARADO'}
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
            {activeToolId}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleRun}
            className={`px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow transition-all ${
              isRunning
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isRunning ? <Square className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-slate-950" />}
            <span>{isRunning ? 'Parar' : 'Rodar (Run)'}</span>
          </button>

          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 text-[10px] font-bold"
            title="Expandir Kit de Ferramentas"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Expandir Kit</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 shadow-xl mb-4 ${
      isRunning
        ? 'bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border-purple-500/70 shadow-purple-900/30 ring-1 ring-purple-400/40'
        : 'bg-slate-900/90 border-slate-800'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Info: Status & Memory Connection */}
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
            isRunning 
              ? 'bg-gradient-to-br from-purple-600 to-indigo-600 border-purple-400 text-white shadow-lg shadow-purple-600/40 animate-pulse' 
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            <Brain className="w-6 h-6" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                <span>Cérebro de Salomão</span>
                <span className="text-slate-400 font-normal">•</span>
                <span className="text-purple-300">{moduleName}</span>
              </span>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border ${
                isRunning
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                {isRunning ? 'ORQUESTRADOR SALOMÃO EM EXECUÇÃO' : 'PARADO'}
              </span>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Memória Conectada
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 line-clamp-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{currentThought}</span>
            </p>
          </div>
        </div>

        {/* Right Info: RUN / STOP Button, Minimize Toggle & Metrics */}
        <div className="flex items-center gap-2.5 justify-end shrink-0">
          <div className="hidden sm:flex flex-col text-right text-[11px] font-mono pr-2 border-r border-slate-800">
            <span className="text-slate-400">Ciclos: <strong className="text-white">{cycles}</strong></span>
            <span className="text-slate-400">Confiança: <strong className="text-emerald-400">{confidence}%</strong></span>
          </div>

          <button
            id={`btn-orchestrator-run-${moduleId}`}
            onClick={onToggleRun}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all transform active:scale-95 ${
              isRunning
                ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-rose-600/30 hover:from-rose-500 hover:to-red-500 border border-rose-400/50'
                : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 shadow-emerald-500/30 hover:opacity-95 border border-emerald-300/40'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="w-4 h-4 fill-white text-white" />
                <span>⏹ PARAR</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>▶ RUN</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Minimalizar Kit de Ferramentas"
          >
            <Minimize2 className="w-4 h-4 text-slate-400" />
            <span className="hidden lg:inline text-[11px]">Minimalizar Kit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
