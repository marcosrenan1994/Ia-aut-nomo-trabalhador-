import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Code, 
  Layers, 
  Zap, 
  Cpu, 
  CheckCircle2, 
  TrendingUp,
  Droplet,
  Box,
  Compass
} from 'lucide-react';
import { AutonomousThought, MemoryVectorRecord } from '../types';

interface Props {
  onAddThought?: (thought: AutonomousThought) => void;
  onAddMemoryRecord?: (record: MemoryVectorRecord) => void;
}

export const ContainerWithMostWaterSorter3D: React.FC<Props> = ({ 
  onAddThought, 
  onAddMemoryRecord 
}) => {
  // Container heights array (LeetCode 11 classic example + custom sorter extension)
  const [heights, setHeights] = useState<number[]>([1, 8, 6, 2, 5, 4, 8, 3, 7, 9, 6]);
  const [left, setLeft] = useState<number>(0);
  const [right, setRight] = useState<number>(heights.length - 1);
  const [maxArea, setMaxArea] = useState<number>(0);
  const [currentArea, setCurrentArea] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeCodeLine, setActiveCodeLine] = useState<number>(1);
  const [sorterSpeedMs, setSorterSpeedMs] = useState<number>(800);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    '[SORTER BRAIN] Algoritmo 3D Container With Most Water inicializado.',
    '[MOTOR GRÁFICO] Pós-processamento de volume líquido ativo em O(N) quântico.'
  ]);

  const [pythonCode] = useState<string>(`def max_area(height):
    left, right = 0, len(height) - 1
    best = 0
    while left < right:
        h = min(height[left], height[right])
        best = max(best, h * (right - left))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return best`);

  // Step execution for the two-pointer water container algorithm
  const executeStep = () => {
    if (left >= right) {
      setIsRunning(false);
      setSimulationLogs(prev => [`[CONCLUÍDO] Área máxima encontrada = ${maxArea}. Sorteio volumétrico finalizado com sucesso.`, ...prev]);
      if (onAddThought) {
        onAddThought({
          id: `THOUGHT-WATER-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('pt-BR'),
          thought: `[Container With Most Water] Algoritmo executado com sucesso. Área máxima calculada: ${maxArea}.`,
          type: 'EVOLUTION_BREAKTHROUGH',
          confidence: 1.0,
          wisdomGain: 35
        });
      }
      return;
    }

    const h = Math.min(heights[left], heights[right]);
    const width = right - left;
    const area = h * width;
    setCurrentArea(area);

    if (area > maxArea) {
      setMaxArea(area);
      setActiveCodeLine(6);
      setSimulationLogs(prev => [`[NOVO MÁXIMO] left=${left}, right=${right}, h=${h}, width=${width} ➔ Área = ${area}`, ...prev]);
    } else {
      setActiveCodeLine(5);
    }

    if (heights[left] < heights[right]) {
      setActiveCodeLine(8);
      setLeft(prev => prev + 1);
    } else {
      setActiveCodeLine(10);
      setRight(prev => prev - 1);
    }
  };

  // Automated playback loop
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      executeStep();
    }, sorterSpeedMs);
    return () => clearInterval(timer);
  }, [isRunning, left, right, maxArea, heights, sorterSpeedMs]);

  const handleReset = () => {
    setIsRunning(false);
    setLeft(0);
    setRight(heights.length - 1);
    setMaxArea(0);
    setCurrentArea(0);
    setActiveCodeLine(1);
    setSimulationLogs(prev => [`[RESET] Reiniciado para estado inicial left=0, right=${heights.length - 1}`, ...prev]);
  };

  const handleRandomizeHeights = () => {
    const newHeights = Array.from({ length: 10 }, () => Math.floor(Math.random() * 9) + 2);
    setHeights(newHeights);
    setIsRunning(false);
    setLeft(0);
    setRight(newHeights.length - 1);
    setMaxArea(0);
    setCurrentArea(0);
    setSimulationLogs(prev => [`[GERADOR] Novas alturas geradas: [${newHeights.join(', ')}]`, ...prev]);
  };

  return (
    <div id="container-water-sorter-module" className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-sky-500/30 p-6 shadow-2xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-sky-400" />
                LeetCode 11 • Container With Most Water 3D
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                Time O(N) • Space O(1)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Box className="w-8 h-8 text-sky-400 animate-bounce" />
              <span>Simulador 3D Sorteador de Volume d'Água & Dois Ponteiros</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed font-medium max-w-3xl">
              Integrado ao cérebro sorteador do Gemini Robotics ER-2: encontre a maior área de contenção de água entre barras verticais em tempo real com computação de dois ponteiros (`left` e `right`).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-5 py-3 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg transition-all ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sky-500/20'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pausar Simulação' : 'Iniciar Sorter 3D'}</span>
            </button>
            <button
              onClick={executeStep}
              disabled={isRunning || left >= right}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>Próximo Passo</span>
            </button>
            <button
              onClick={handleReset}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Reiniciar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-800 font-mono">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Área Máxima (Max Area):</span>
            <span className="text-2xl font-black text-emerald-400">{maxArea}</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Área Atual (Current):</span>
            <span className="text-2xl font-black text-sky-400">{currentArea}</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Ponteiro Esquerdo (L):</span>
            <span className="text-xl font-black text-purple-400">Index {left} (h={heights[left]})</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Ponteiro Direito (R):</span>
            <span className="text-xl font-black text-amber-400">Index {right} (h={heights[right]})</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: 3D/2D Visualizer Container */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white">Visualização Gráfica de Contenção de Água</h3>
            </div>
            <button
              onClick={handleRandomizeHeights}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold"
            >
              Gerar Novas Barras
            </button>
          </div>

          {/* Interactive Bar Chart stage */}
          <div className="relative h-72 bg-slate-950 rounded-xl border border-slate-800 p-6 flex items-end justify-around overflow-hidden">
            {/* Water container highlight fill between left & right */}
            {left < right && (
              <div
                className="absolute bottom-6 bg-sky-500/20 border-t-2 border-b-2 border-sky-400/60 transition-all duration-300"
                style={{
                  left: `${(left / heights.length) * 100 + 4}%`,
                  right: `${100 - ((right + 1) / heights.length) * 100 + 4}%`,
                  height: `${Math.min(heights[left], heights[right]) * 22}px`
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-sky-300 font-mono font-bold text-xs bg-sky-500/10">
                  {Math.min(heights[left], heights[right])} × {right - left} = {Math.min(heights[left], heights[right]) * (right - left)}
                </div>
              </div>
            )}

            {heights.map((h, idx) => {
              const isLeft = idx === left;
              const isRight = idx === right;
              const isInWaterRange = idx >= left && idx <= right;

              return (
                <div key={idx} className="flex flex-col items-center gap-2 z-10">
                  {/* Pointer indicators */}
                  <div className="h-6 flex items-center justify-center">
                    {isLeft && <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-black text-[10px] animate-bounce">L</span>}
                    {isRight && <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-black text-[10px] animate-bounce">R</span>}
                  </div>

                  {/* Bar */}
                  <div
                    className={`w-10 sm:w-12 rounded-t-lg transition-all duration-300 flex items-center justify-center font-mono font-bold text-white shadow-lg ${
                      isLeft || isRight
                        ? 'bg-gradient-to-t from-sky-600 to-indigo-500 ring-4 ring-sky-400/40'
                        : isInWaterRange
                        ? 'bg-slate-700'
                        : 'bg-slate-800 opacity-60'
                    }`}
                    style={{ height: `${h * 22}px` }}
                  >
                    {h}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 font-bold">{idx}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Legenda: <strong className="text-purple-400">L</strong> = Esquerda | <strong className="text-amber-400">R</strong> = Direita</span>
            <span className="text-emerald-400 font-bold">Complexidade: O(N) Tempo / O(1) Espaço</span>
          </div>
        </div>

        {/* Right Col: Python Code Execution & Logs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Code Viewer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Algoritmo Python Executado</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded font-bold">
                LeetCode 11 Active
              </span>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 font-mono text-xs overflow-x-auto space-y-1 border border-slate-800">
              {pythonCode.split('\n').map((line, idx) => {
                const lineNum = idx + 1;
                const isActive = activeCodeLine === lineNum;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 px-2 py-0.5 rounded ${
                      isActive ? 'bg-sky-500/20 border-l-2 border-sky-400 text-sky-200' : 'text-slate-400'
                    }`}
                  >
                    <span className="w-4 text-right text-[10px] text-slate-600">{lineNum}</span>
                    <span>{line}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sorter Brain Logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Logs do Sorter Brain 3D</h3>
              </div>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-2 py-0.5 rounded font-bold">
                Live Stream
              </span>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 font-mono text-[11px] max-h-48 overflow-y-auto space-y-1.5 border border-slate-800">
              {simulationLogs.map((log, idx) => (
                <div key={idx} className="text-slate-300 flex items-center gap-2">
                  <span className="text-purple-400">›</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
