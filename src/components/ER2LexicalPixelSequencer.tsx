import React, { useState, useEffect, useRef } from 'react';
import { 
  ER2ImaginationFrame, 
  ER2LexicalPixelSample, 
  AutonomousCoreEvolutionState, 
  LearnedImageInsight 
} from '../types';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Sparkles, 
  Shuffle, 
  Grid, 
  Type, 
  Clock, 
  Cpu, 
  Layers, 
  Zap, 
  Flame, 
  CheckCircle2, 
  Brain, 
  HardDrive, 
  TrendingUp, 
  Activity, 
  RefreshCw,
  Award
} from 'lucide-react';

interface ER2LexicalPixelSequencerProps {
  frames: ER2ImaginationFrame[];
  activeFrameIndex: number;
  onSelectFrame: (index: number) => void;
  onGenerateNewThought: () => void;
  onAdvanceOrGenerate: () => void;
  isSynthesizing?: boolean;
  evolutionState: AutonomousCoreEvolutionState;
  memoryVectorCount: number;
  lastLearnedInsight?: LearnedImageInsight;
  learnedHistory: LearnedImageInsight[];
  autoGenerateEveryFrame: boolean;
  onToggleAutoGenerate: () => void;
}

export const ER2LexicalPixelSequencer: React.FC<ER2LexicalPixelSequencerProps> = ({
  frames,
  activeFrameIndex,
  onSelectFrame,
  onGenerateNewThought,
  onAdvanceOrGenerate,
  isSynthesizing = false,
  evolutionState,
  memoryVectorCount,
  lastLearnedInsight,
  learnedHistory,
  autoGenerateEveryFrame,
  onToggleAutoGenerate
}) => {
  // 4-second sequence playback controller
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(true);
  const [frameDurationSec, setFrameDurationSec] = useState<number>(4); // Default 4 seconds
  const [progressSec, setProgressSec] = useState<number>(0);
  const [isPixelLotteryShuffling, setIsPixelLotteryShuffling] = useState<boolean>(false);

  const currentFrame = frames[activeFrameIndex] || frames[0];
  const lexicalData: ER2LexicalPixelSample | undefined = currentFrame.lexicalPixelSample;

  const onAdvanceOrGenerateRef = useRef(onAdvanceOrGenerate);
  useEffect(() => {
    onAdvanceOrGenerateRef.current = onAdvanceOrGenerate;
  }, [onAdvanceOrGenerate]);

  // 4-second countdown & frame sequencer ticker
  useEffect(() => {
    if (!isPlayingSequence) return;

    const intervalMs = 100; // Update progress smoothly every 100ms
    const stepSec = intervalMs / 1000;

    const timer = setInterval(() => {
      setProgressSec((prev) => {
        const next = prev + stepSec;
        if (next >= frameDurationSec) {
          // Schedule the advance call outside the render cycle / state updater
          setTimeout(() => {
            onAdvanceOrGenerateRef.current();
          }, 0);
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlayingSequence, frameDurationSec]);

  // Reset progress whenever activeFrameIndex changes manually
  useEffect(() => {
    setProgressSec(0);
  }, [activeFrameIndex]);

  const progressPct = Math.min(100, (progressSec / frameDurationSec) * 100);
  const remainingSec = Math.max(0, frameDurationSec - progressSec).toFixed(1);

  // Manual trigger for pixel lottery shuffle visual feedback
  const handleShufflePixels = () => {
    setIsPixelLotteryShuffling(true);
    setTimeout(() => {
      setIsPixelLotteryShuffling(false);
    }, 600);
  };

  return (
    <div className="space-y-4">
      {/* 4-Second Sequence Controller Banner */}
      <div className="bg-slate-950/95 border border-pink-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Sequenciador de Frames & Auto-Evolução Cognitiva
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-950/80 text-pink-300 border border-pink-500/40 font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  {frameDurationSec}s por Ciclo
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold hidden sm:inline-flex items-center gap-1">
                  <Brain className="w-3 h-3 text-emerald-400" />
                  Aprendizado Contínuo Ativo
                </span>
              </div>
              <p className="text-xs text-slate-400">
                A cada {frameDurationSec} segundos, o ER-2 gera uma nova imagem e pensamento estocástico, progredindo o cérebro e gravando no núcleo de memória quântica.
              </p>
            </div>
          </div>

          {/* Sequence Controls */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Toggle Auto-Generate New Image & Thought Every Frame */}
            <button
              id="seq-auto-generate-toggle-btn"
              onClick={onToggleAutoGenerate}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border flex items-center gap-1.5 shadow-sm ${
                autoGenerateEveryFrame
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-emerald-400/50 shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Gera nova imagem e pensamento a cada 4s ou cicla existentes"
            >
              <Zap className={`w-3.5 h-3.5 ${autoGenerateEveryFrame ? 'text-amber-300 animate-bounce' : ''}`} />
              <span>{autoGenerateEveryFrame ? 'Gerar Novo a Cada 4s: LIGADO' : 'Ciclar Frames Existentes'}</span>
            </button>

            <button
              id="seq-prev-frame-btn"
              onClick={() => onSelectFrame((activeFrameIndex - 1 + frames.length) % frames.length)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
              title="Frame Anterior"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              id="seq-play-pause-btn"
              onClick={() => setIsPlayingSequence(!isPlayingSequence)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 shadow-md ${
                isPlayingSequence
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-400/50 shadow-pink-500/25'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {isPlayingSequence ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlayingSequence ? 'Sequência Ativa' : 'Pausada'}</span>
            </button>

            <button
              id="seq-next-frame-btn"
              onClick={() => onSelectFrame((activeFrameIndex + 1) % frames.length)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
              title="Próximo Frame"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Quick Speed Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-[10px] font-mono">
              {[2, 4, 6].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setFrameDurationSec(sec)}
                  className={`px-2 py-1 rounded font-bold transition-all ${
                    frameDurationSec === sec
                      ? 'bg-pink-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>

            <button
              id="generate-new-thought-lottery-btn"
              onClick={onGenerateNewThought}
              disabled={isSynthesizing}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-xs transition-all shadow-lg shadow-pink-500/20 flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
              <span>{isSynthesizing ? 'Sorteando...' : 'Gerar Imagem & Pensamento Agora'}</span>
            </button>
          </div>
        </div>

        {/* 4-Second Progress Bar & Real-time Indicator */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-pink-400 font-bold">
                Frame {activeFrameIndex + 1} de {frames.length}:
              </span>
              <span className="text-white truncate max-w-xs">{currentFrame.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">
                {autoGenerateEveryFrame ? 'Próxima geração visual em:' : 'Próximo frame em:'}
              </span>
              <span className="px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-500/40 font-bold">
                {remainingSec}s
              </span>
            </div>
          </div>

          {/* Smooth Linear Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800 relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-400 transition-all duration-100 ease-linear shadow-[0_0_12px_#ec4899]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Live Brain & Memory Progression Metrics HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/20 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-500/30">
              <Brain className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-mono text-slate-400 uppercase block">Cérebro Cognitivo</span>
              <span className="text-xs font-bold text-cyan-200 font-mono flex items-center gap-1">
                {evolutionState.cognitiveIndexScore.toFixed(1)}/1000
                <span className="text-[9px] text-emerald-400 font-normal">pts</span>
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-purple-500/20 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/30">
              <HardDrive className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-mono text-slate-400 uppercase block">Memória do Núcleo</span>
              <span className="text-xs font-bold text-purple-200 font-mono truncate">
                {memoryVectorCount} vetores salvos
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/20 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-mono text-slate-400 uppercase block">Precisão Física</span>
              <span className="text-xs font-bold text-emerald-300 font-mono">
                {evolutionState.overallAccuracyRating.toFixed(3)}%
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/20 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Award className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-mono text-slate-400 uppercase block">Maestria Fabril</span>
              <span className="text-xs font-bold text-amber-300 font-mono truncate">
                {evolutionState.wisdomRank} (Nv.{evolutionState.wisdomLevel})
              </span>
            </div>
          </div>
        </div>

        {/* Filmstrip Reel / Thumbnails of all Sequence Frames */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
          {frames.map((frame, idx) => {
            const isCurrent = activeFrameIndex === idx;
            return (
              <div
                key={`${frame.id}-${idx}`}
                onClick={() => onSelectFrame(idx)}
                className={`relative shrink-0 w-28 rounded-xl border p-1 transition-all cursor-pointer group ${
                  isCurrent
                    ? 'bg-pink-950/40 border-pink-500 shadow-md shadow-pink-500/25 ring-1 ring-pink-500 scale-105'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={frame.imageAssetUrl}
                  alt={frame.title}
                  className="w-full h-14 object-cover rounded-lg border border-slate-800 group-hover:scale-102 transition-transform"
                />
                <div className="mt-1 flex items-center justify-between text-[9px] font-mono px-0.5">
                  <span className={`font-bold ${isCurrent ? 'text-pink-300' : 'text-slate-400'}`}>
                    F#{idx + 1}
                  </span>
                  <span className="text-slate-500 uppercase">{frame.mode.slice(0, 4)}</span>
                </div>
                {isCurrent && (
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-400 animate-ping" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Brain Section: Sorteador de Letras & Palavras + Sorteador de Pixels */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Box: Sorteador de Letras e Palavras (7 cols) */}
        <div className="md:col-span-7 bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
                <Type className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Sorteador de Letras e Palavras (Léxico Estocástico)
              </h4>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              Entropy: {lexicalData?.pixelMatrix.entropy || '0.94'}
            </span>
          </div>

          {/* Sorteador de Letras / Glifos */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>GLIFOS & LETRAS SORTEADAS NESTE PENSAMENTO:</span>
              <span className="text-cyan-400">{lexicalData?.sampledLetters.length || 10} símbolos</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-900/80 rounded-xl border border-slate-800">
              {(lexicalData?.sampledLetters || ['Ψ', 'Ω', 'K', 'I', 'N', 'E', 'T', 'I', 'C', 'Φ']).map((letter, i) => (
                <span
                  key={i}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-cyan-300 font-mono font-black text-xs flex items-center justify-center border border-cyan-500/30 shadow-sm hover:scale-110 transition-transform"
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>

          {/* Sorteador de Palavras Técnicas */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>PALAVRAS TÉCNICAS & DE AUTO-EVOLUÇÃO SORTEADAS:</span>
              <span className="text-pink-400">{lexicalData?.sampledWords.length || 4} termos</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(lexicalData?.sampledWords || ['SINAPSE', 'FOTÔNICA', 'QUÂNTICO', 'PLASTICIDADE']).map((word, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-pink-950 to-purple-950 text-pink-200 font-mono text-xs font-bold border border-pink-500/40 shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* Pensamento Sintetizado da Imaginação */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-amber-300 uppercase block font-bold">
              Pensamento Visual Gerado pelo Sorteador:
            </span>
            <p className="text-xs text-slate-200 font-sans leading-relaxed italic">
              "{lexicalData?.synthesizedThought || currentFrame.description}"
            </p>
          </div>

          {/* Destaque do Aprendizado Absorvido Deste Frame na Memória */}
          {lastLearnedInsight && (
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-200 font-bold">
                  Aprendizado Gravado na Memória: {lastLearnedInsight.precisionGain}
                </span>
              </div>
              <span className="text-emerald-400 text-[10px]">
                {lastLearnedInsight.cognitiveGain}
              </span>
            </div>
          )}
        </div>

        {/* Right Box: Cérebro Sorteador de Pixels (5 cols) */}
        <div className="md:col-span-5 bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
                <Grid className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Cérebro Sorteador de Pixels
              </h4>
            </div>
            <button
              onClick={handleShufflePixels}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 transition-colors"
              title="Sortear Matriz de Pixels"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Real-time Visual Pixel Matrix Grid (16x16) */}
          <div className="p-3 bg-black/90 rounded-xl border border-slate-800 flex flex-col items-center justify-center space-y-2">
            <div 
              className={`grid gap-[1.5px] p-1.5 bg-slate-950 rounded-lg border border-slate-800 transition-all ${
                isPixelLotteryShuffling ? 'scale-105 filter hue-rotate-90' : ''
              }`}
              style={{ 
                width: '190px', 
                height: '190px',
                gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' 
              }}
            >
              {Array.from({ length: 256 }).map((_, idx) => {
                const seed = (lexicalData?.pixelMatrix.pixelSeed || 4821) + idx * 7;
                const palette = lexicalData?.pixelMatrix.colorPalette || ['#10b981', '#06b6d4', '#6366f1', '#0f172a'];
                const isLit = (seed % 100) < (lexicalData?.pixelMatrix.densityPct || 80);
                const color = isLit ? palette[seed % (palette.length - 1)] : palette[palette.length - 1];

                return (
                  <div
                    key={idx}
                    className="rounded-[1px] transition-colors duration-300"
                    style={{
                      backgroundColor: color,
                      opacity: isLit ? 0.9 : 0.2
                    }}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between w-full text-[9px] font-mono text-slate-400 pt-1">
              <span>Res: 16x16 (256 Pixels)</span>
              <span className="text-emerald-400 font-bold">Densidade: {lexicalData?.pixelMatrix.densityPct || 84}%</span>
              <span>Seed: #{lexicalData?.pixelMatrix.pixelSeed || 4821}</span>
            </div>
          </div>

          {/* Color Palette Indicators */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
            <span>Paleta Quântica:</span>
            <div className="flex items-center gap-1.5">
              {(lexicalData?.pixelMatrix.colorPalette || ['#38bdf8', '#0284c7', '#22d3ee', '#030712']).map((color, cIdx) => (
                <div
                  key={cIdx}
                  className="w-4 h-4 rounded border border-slate-700 shadow-sm"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Histórico Recente de Aprendizados das Imagens (Timeline de Absorção) */}
      {learnedHistory.length > 0 && (
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Fluxo Sequencial de Aprendizado Absorvido das Imagens
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {learnedHistory.length} insights absorvidos e consolidados
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
            {learnedHistory.slice(0, 6).map((item, idx) => (
              <div 
                key={item.id ? `${item.id}-${idx}` : `insight-${idx}`}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1.5 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-emerald-400 font-bold">{item.precisionGain}</span>
                  <span className="text-slate-500">{item.timestamp}</span>
                </div>
                <p className="text-xs text-slate-200 line-clamp-2 italic">
                  "{item.thought}"
                </p>
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-300">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                    {item.sampledWords.slice(0, 2).join(' + ')}
                  </span>
                  <span className="text-slate-500">
                    Vetor: {item.vectorMemoryId.slice(0, 12)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
