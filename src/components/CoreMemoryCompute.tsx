import React from 'react';
import { MemoryVectorRecord } from '../types';
import { 
  Database, 
  Cpu, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  Zap, 
  ShieldCheck, 
  HardDrive 
} from 'lucide-react';

interface CoreMemoryComputeProps {
  memoryRecords: MemoryVectorRecord[];
  optimizationCycles: number;
  neuralLoad: number;
  memoryUsedMb: number;
  memoryTotalMb: number;
  onTriggerSelfOptimization: () => void;
  onSyncMemoryWithMaster: () => void;
  isOptimizing: boolean;
  isSyncing: boolean;
  isOffline: boolean;
}

export const CoreMemoryCompute: React.FC<CoreMemoryComputeProps> = ({
  memoryRecords,
  optimizationCycles,
  neuralLoad,
  memoryUsedMb,
  memoryTotalMb,
  onTriggerSelfOptimization,
  onSyncMemoryWithMaster,
  isOptimizing,
  isSyncing,
  isOffline
}) => {
  const memoryPercentage = ((memoryUsedMb / memoryTotalMb) * 100).toFixed(1);

  return (
    <div id="core-memory-compute-module" className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
            <Cpu className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Núcleo de Super-Processamento & Memória Vetorial
            </h2>
            <p className="text-xs text-slate-400">
              Base de dados operacional sincronizada online/offline e motor de auto-aprimoramento contínuo
            </p>
          </div>
        </div>

        {/* Sync & Auto-Optimize Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="sync-database-btn"
            onClick={onSyncMemoryWithMaster}
            disabled={isSyncing || isOffline}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-sky-400' : 'text-slate-400'}`} />
            {isOffline ? 'Sync Pausado (Offline)' : isSyncing ? 'Sincronizando...' : 'Sincronizar com Master'}
          </button>

          <button
            id="trigger-self-optimize-btn"
            onClick={onTriggerSelfOptimization}
            disabled={isOptimizing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
            {isOptimizing ? 'Otimizando Parâmetros...' : 'Executar Auto-Aprimoramento'}
          </button>
        </div>
      </div>

      {/* Compute & Memory Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between mb-1.5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Carga Neural de Cálculo
            </span>
            <span className="font-mono text-indigo-400 font-bold">{neuralLoad.toFixed(1)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${neuralLoad}%` }} />
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between mb-1.5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-sky-400" />
              Armazenamento no Núcleo
            </span>
            <span className="font-mono text-sky-400 font-bold">{memoryPercentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: `${memoryPercentage}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">
            {memoryUsedMb.toFixed(0)} MB / {memoryTotalMb} MB Alocados
          </span>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between mb-1 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Ciclos de Auto-Melhoria
            </span>
            <span className="font-mono text-emerald-400 font-bold">{optimizationCycles}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Redução de jerk cinemático: <strong className="text-emerald-300">-14.2%</strong>
          </p>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between mb-1 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              Estado da Base de Dados
            </span>
            <span className="font-mono text-amber-400 font-bold">
              {isOffline ? 'OFFLINE (CACHE LOCAL)' : 'SINCRONIZADO'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Espelho mestre indexado com redundância local
          </p>
        </div>
      </div>

      {/* Auto-Improvement Vector Records Stream */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Registros de Aprendizado & Refinamento em Fábrica:
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {memoryRecords.length} Vetores Registrados
          </span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {memoryRecords.map((rec, idx) => (
            <div
              key={`${rec.id}-${idx}`}
              id={`memory-record-${rec.id}`}
              className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-bold">
                    {rec.id}
                  </span>
                  <h4 className="font-semibold text-slate-200">{rec.title}</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {rec.description}
                </p>
              </div>

              <div className="text-right shrink-0 font-mono text-[10px]">
                <span className="text-emerald-400 font-bold block">{rec.accuracyDelta}</span>
                <span className="text-sky-400 block">{rec.cycleTimeDelta}</span>
                <span className="text-slate-500 block text-[9px] mt-0.5">{rec.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
