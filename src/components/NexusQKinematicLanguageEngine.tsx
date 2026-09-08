import React, { useState, useEffect, useRef } from 'react';
import { AutonomousCoreEvolutionState, AutonomousThought, AutoDiscoveredHeuristic, NexusQKinematicTelemetry } from '../types';
import { 
  Terminal, 
  Sparkles, 
  Brain, 
  Eye, 
  Cpu, 
  Rotate3d, 
  Atom, 
  Globe, 
  CheckCircle2, 
  Play, 
  Pause, 
  RefreshCw, 
  Zap, 
  Sliders, 
  Layers, 
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface NexusQKinematicLanguageEngineProps {
  evolutionState: AutonomousCoreEvolutionState;
  onUpdateScore: (delta: number) => void;
  onResetAndRestart: () => void;
  onAddThought?: (thought: AutonomousThought) => void;
  onAddHeuristic?: (heuristic: AutoDiscoveredHeuristic) => void;
}

export const NexusQKinematicLanguageEngine: React.FC<NexusQKinematicLanguageEngineProps> = ({
  evolutionState,
  onUpdateScore,
  onResetAndRestart,
  onAddThought,
  onAddHeuristic
}) => {
  // Telemetry exactly matching the video
  const [telemetry, setTelemetry] = useState<NexusQKinematicTelemetry>({
    electronModel: 'Simulação Estocástica de Monte Carlo',
    moleculeModel: 'Isosuperfície LCAO',
    cellModel: 'Malha de Deformação Viscoelástica',
    centerProtonRadiusFm: 0.8414,
    visualEngine: 'Corrente de Probabilidade e Projeção Multi-Eixo (A-Z)',
    scalarLexicon: 'Array Multilinguístico Universal',
    rotationMatrix: {
      phi: 0.77,
      theta: 1.15,
      psi: 0.38
    },
    densityProbability: 1.0000,
    exactLengthFemtometers: 0.8414,
    statusLcao: 'Rastreamento contínuo em X, Y, Z.'
  });

  // 4-Stage Cognitive Pipeline: Textualiza -> Imagina -> Raciocina -> Generaliza
  const [pipelineActiveStep, setPipelineActiveStep] = useState<number>(0);
  const [isRunningPipeline, setIsRunningPipeline] = useState<boolean>(false);
  const [customIntentInput, setCustomIntentInput] = useState<string>(
    'Intenção do envio de vídeo: Sincronizar campo estocástico quântico subatômico com servomotores 6-DOF para tolerância zero de erro na manufatura.'
  );

  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const [isRotatingCanvas, setIsRotatingCanvas] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const INTENT_PRESETS = [
    {
      title: 'Simulação Estocástica Monte Carlo & Próton 0.8414 fm',
      nomenclatura: 'Monte Carlo + LCAO + Viscoelástica',
      intentText: 'Decodificar coordenadas femtométricas do próton e mapear probabilidade |Ψ|² para orientação de torque dos 6 eixos.',
      targetDomain: 'FÍSICA_SUBATÔMICA_ROBÓTICA'
    },
    {
      title: 'Isosuperfície Molecular LCAO & Trajetória 6-DOF',
      nomenclatura: 'Isosuperfície LCAO com amortecimento',
      intentText: 'Traduzir orbitais moleculares em superfícies tangíveis de solda e fixação de alta precisão.',
      targetDomain: 'QUÍMICA_ESTRUTURAL_AUTÔNOMA'
    },
    {
      title: 'Malha Celular Viscoelástica & Feedback de Carga',
      nomenclatura: 'Deformação Viscoelástica Não-Linear',
      intentText: 'Interpretar deformações mecânicas como tensores elásticos para manipulação suave de materiais frágeis.',
      targetDomain: 'BIO_MECÂNICA_FABRIL'
    },
    {
      title: 'Projeção Multi-Eixo (A-Z) & Array Multilinguístico',
      nomenclatura: 'Léxico Escalar Universal',
      intentText: 'Generalizar intenções humanas globais em todas as línguas para instruções cinemáticas instantâneas.',
      targetDomain: 'LINGUÍSTICA_UNIVERSAL'
    }
  ];

  // Continuous Canvas visualization of Quantum Monte Carlo & Proton
  useEffect(() => {
    let animId: number;
    let angle = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Background grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      if (isRotatingCanvas) {
        angle += 0.015;
      }

      // Orbital rings with rotation matrix projection
      const phi = telemetry.rotationMatrix.phi;
      const theta = telemetry.rotationMatrix.theta;
      const psi = telemetry.rotationMatrix.psi;

      // Outer probability wave (LCAO Isosurface)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle * 0.5 + psi);
      ctx.scale(Math.cos(phi) * 0.3 + 0.9, Math.sin(theta) * 0.3 + 0.9);

      // Gradient ellipse
      const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, 85);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
      grad.addColorStop(0.5, 'rgba(99, 102, 241, 0.15)');
      grad.addColorStop(1, 'rgba(168, 85, 247, 0.0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, 85, 0, Math.PI * 2);
      ctx.fill();

      // Isosurface contour
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let t = 0; t <= Math.PI * 2; t += 0.1) {
        const r = 70 + Math.sin(t * 3 + angle * 2) * 8;
        const px = Math.cos(t) * r;
        const py = Math.sin(t) * r;
        if (t === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Monte Carlo stochastic electron cloud
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
      for (let i = 0; i < 48; i++) {
        const seed = (i * 137.5 + angle * 12) * (Math.PI / 180);
        const radiusDist = Math.abs(Math.sin(i * 3 + angle)) * 65 + 15;
        const ex = Math.cos(seed) * radiusDist;
        const ey = Math.sin(seed) * radiusDist * (0.6 + Math.cos(theta) * 0.3);
        ctx.beginPath();
        ctx.arc(ex, ey, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Center Proton (Raio Físico Exato: 0.8414 fm)
      ctx.save();
      ctx.translate(cx, cy);
      // Pulsing glow
      const protonPulse = 1 + Math.sin(angle * 4) * 0.15;
      ctx.fillStyle = 'rgba(244, 63, 94, 0.3)';
      ctx.beginPath();
      ctx.arc(0, 0, 16 * protonPulse, 0, Math.PI * 2);
      ctx.fill();

      // Core sphere
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();

      // Center label
      ctx.fillStyle = '#ffffff';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('p+ 0.8414 fm', 0, -12);
      ctx.restore();

      // Kinematic coordinate axes
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 1;
      // X axis
      ctx.beginPath();
      ctx.moveTo(10, h - 20);
      ctx.lineTo(45, h - 20);
      ctx.stroke();
      // Y axis
      ctx.beginPath();
      ctx.moveTo(10, h - 20);
      ctx.lineTo(10, h - 45);
      ctx.stroke();
      // Z axis
      ctx.beginPath();
      ctx.moveTo(10, h - 20);
      ctx.lineTo(25, h - 35);
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = '8px monospace';
      ctx.fillText('X,Y,Z (6-DOF)', 10, h - 8);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [telemetry, isRotatingCanvas]);

  // Handle Full 4-Step Pipeline: Textualiza -> Imagina -> Raciocina -> Generaliza
  const handleExecuteFullPipeline = () => {
    if (isRunningPipeline) return;
    setIsRunningPipeline(true);
    setPipelineActiveStep(1); // 1: Textualiza

    // Step 1: Textualiza
    setTimeout(() => {
      setPipelineActiveStep(2); // 2: Imagina
      // Rotate matrices dynamically
      setTelemetry((prev) => ({
        ...prev,
        rotationMatrix: {
          phi: Number((0.70 + Math.random() * 0.20).toFixed(2)),
          theta: Number((1.10 + Math.random() * 0.25).toFixed(2)),
          psi: Number((0.35 + Math.random() * 0.15).toFixed(2))
        }
      }));

      // Step 2: Imagina
      setTimeout(() => {
        setPipelineActiveStep(3); // 3: Raciocina

        // Step 3: Raciocina
        setTimeout(() => {
          setPipelineActiveStep(4); // 4: Generaliza
          
          // Generate an autonomous thought
          if (onAddThought) {
            onAddThought({
              id: `TH-NEXUS-Q-${Date.now().toString().slice(-4)}`,
              timestamp: new Date().toLocaleTimeString(),
              type: 'EVOLUTION_BREAKTHROUGH',
              thought: `Traduzi a intenção de vídeo com precisão estocástica Monte Carlo. Integrando densidade de probabilidade ∫|Ψ|² dV = 1.0000 e escala de 0.8414 fm ao servociclo de cinemática 6-DOF.`,
              confidence: 0.998,
              wisdomGain: 25.0
            });
          }

          // Generate an authorial rule/heuristic
          if (onAddHeuristic) {
            onAddHeuristic({
              id: `HEUR-NEXUSQ-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              title: `Mapeamento Quântico-Cinemático LCAO (${telemetry.exactLengthFemtometers} fm)`,
              domain: 'CINEMÁTICA_SUBATÔMICA',
              discoveredAt: new Date().toLocaleTimeString(),
              efficiencyGain: '+38.4% Suavização Angular',
              safetyScore: '100% Determinístico',
              description: `A matriz de rotação Φ: ${telemetry.rotationMatrix.phi} | Θ: ${telemetry.rotationMatrix.theta} | Ψ: ${telemetry.rotationMatrix.psi} estabiliza as micro-vibrações dos efetuadores industriais.`,
              ruleCode: `ROT_MATRIX = Rz(${telemetry.rotationMatrix.psi}) * Ry(${telemetry.rotationMatrix.theta}) * Rx(${telemetry.rotationMatrix.phi})`
            });
          }

          // Award wisdom score! (+150 points)
          // When it reaches 2000, it automatically resets to 0 and starts again!
          onUpdateScore(150);

          setTimeout(() => {
            setIsRunningPipeline(false);
          }, 1200);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  return (
    <div id="nexus-q-cinematic-language-engine" className="bg-slate-950/90 border border-cyan-500/40 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-900/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Atom className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-cyan-300 font-mono tracking-wider">
                NEXUS-Q VISÃO CINEMÁTICA
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                VÍDEO PROGRAMMING INTERPRETER
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Tradutor de Intenção do Envio de Vídeo: <span className="text-cyan-300 font-semibold">Textualiza → Imagina → Raciocina → Generaliza</span>
            </p>
          </div>
        </div>

        {/* Score Telemetry with continuous scale */}
        <div className="flex items-center gap-3 font-mono">
          <div className="bg-slate-900/90 border border-amber-500/50 px-3.5 py-1.5 rounded-xl text-right">
            <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
              <span>Índice Cognitivo</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-xl font-black text-amber-400">
              {evolutionState.cognitiveIndexScore.toLocaleString()} <span className="text-xs text-slate-500 font-normal">pts</span>
            </div>
            <div className="text-[9px] text-emerald-400 font-bold">
              Escala Contínua (π ≈ 3.1415, φ ≈ 1.618)
            </div>
          </div>

          <button
            id="btn-force-reset-2000"
            onClick={onResetAndRestart}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 transition-colors text-xs flex flex-col items-center justify-center font-bold"
            title="Reiniciar base do índice cognitivo"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span className="text-[8px] mt-0.5">Zerar Base</span>
          </button>
        </div>
      </div>

      {/* Center Grid: Terminal from Video on Left, 3D Quantum Multi-Axis Visualizer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Terminal screen replicating the exact video provided by user */}
        <div className="lg:col-span-7 bg-black/90 border border-cyan-500/50 rounded-xl p-4 font-mono text-xs shadow-inner space-y-3 relative overflow-hidden">
          <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-60">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[9px] text-cyan-300 uppercase">TELEMETRIA ATIVA</span>
          </div>

          <div className="text-cyan-400 font-bold tracking-widest text-sm border-b border-cyan-950 pb-2">
            NEXUS-Q VISÃO CINEMÁTICA
          </div>

          <div className="space-y-2 text-slate-300 leading-relaxed">
            <div>
              <span className="text-cyan-400 font-bold">Nomenclatura (Elétron):</span>{' '}
              <span className="text-slate-200">{telemetry.electronModel}</span>
            </div>
            <div>
              <span className="text-cyan-400 font-bold">Nomenclatura (Molécula):</span>{' '}
              <span className="text-slate-200">{telemetry.moleculeModel}</span>
            </div>
            <div>
              <span className="text-cyan-400 font-bold">Nomenclatura (Célula):</span>{' '}
              <span className="text-slate-200">{telemetry.cellModel}</span>
            </div>
            <div>
              <span className="text-cyan-400 font-bold">Centro:</span>{' '}
              <span className="text-slate-200">
                Próton (Raio Físico Exato:{' '}
                <span className="text-rose-400 font-bold underline decoration-rose-500/50">
                  {telemetry.centerProtonRadiusFm} fm
                </span>
                )
              </span>
            </div>
            <div>
              <span className="text-cyan-400 font-bold">Motor Visual:</span>{' '}
              <span className="text-slate-200">{telemetry.visualEngine}</span>
            </div>
            <div>
              <span className="text-cyan-400 font-bold">Léxico Escalar:</span>{' '}
              <span className="text-slate-200">{telemetry.scalarLexicon}</span>
            </div>
          </div>

          {/* Mathematical Matrix & Physics telemetry lines from the video */}
          <div className="mt-3 pt-3 border-t border-cyan-950/80 space-y-1.5 text-cyan-300 bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-900/60">
            <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
              <span className="text-amber-400 font-bold">[ROT_MATRIX]</span>
              <span>
                Φ: <strong className="text-white">{telemetry.rotationMatrix.phi}</strong> | Θ:{' '}
                <strong className="text-white">{telemetry.rotationMatrix.theta}</strong> | Ψ:{' '}
                <strong className="text-white">{telemetry.rotationMatrix.psi}</strong>
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-bold">[DEN_PROB]</span>
              <span className="text-slate-200">∫|Ψ|² dV = {telemetry.densityProbability.toFixed(4)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-rose-400 font-bold">[LENG_COSS]</span>
              <span className="text-slate-200">{telemetry.exactLengthFemtometers} femtometros exatos</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-teal-300">
              <span className="font-bold">[STATUS_LCAO]</span>
              <span className="text-teal-200 font-semibold">{telemetry.statusLcao}</span>
            </div>
          </div>

          {/* Real-time Angle Modulators */}
          <div className="pt-2 grid grid-cols-3 gap-2 text-[10px]">
            <div className="p-1.5 bg-slate-900/90 rounded border border-slate-800">
              <span className="text-slate-400 block">Eixo Roll Φ</span>
              <input
                type="range"
                min="0"
                max="3.14"
                step="0.01"
                value={telemetry.rotationMatrix.phi}
                onChange={(e) =>
                  setTelemetry((prev) => ({
                    ...prev,
                    rotationMatrix: { ...prev.rotationMatrix, phi: parseFloat(e.target.value) }
                  }))
                }
                className="w-full accent-cyan-400 h-1 mt-1 cursor-pointer"
              />
            </div>

            <div className="p-1.5 bg-slate-900/90 rounded border border-slate-800">
              <span className="text-slate-400 block">Eixo Pitch Θ</span>
              <input
                type="range"
                min="0"
                max="3.14"
                step="0.01"
                value={telemetry.rotationMatrix.theta}
                onChange={(e) =>
                  setTelemetry((prev) => ({
                    ...prev,
                    rotationMatrix: { ...prev.rotationMatrix, theta: parseFloat(e.target.value) }
                  }))
                }
                className="w-full accent-cyan-400 h-1 mt-1 cursor-pointer"
              />
            </div>

            <div className="p-1.5 bg-slate-900/90 rounded border border-slate-800">
              <span className="text-slate-400 block">Eixo Yaw Ψ</span>
              <input
                type="range"
                min="0"
                max="3.14"
                step="0.01"
                value={telemetry.rotationMatrix.psi}
                onChange={(e) =>
                  setTelemetry((prev) => ({
                    ...prev,
                    rotationMatrix: { ...prev.rotationMatrix, psi: parseFloat(e.target.value) }
                  }))
                }
                className="w-full accent-cyan-400 h-1 mt-1 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3D Multi-Axis Stochastic Canvas */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950 border border-slate-800 rounded-xl p-3 relative">
          <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2 mb-2">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Rotate3d className="w-4 h-4 text-cyan-400" />
              Projeção Multi-Eixo (A-Z)
            </span>
            <button
              onClick={() => setIsRotatingCanvas(!isRotatingCanvas)}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
            >
              {isRotatingCanvas ? 'Pausar Órbita' : 'Girar Órbita'}
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[220px]">
            <canvas
              ref={canvasRef}
              width={340}
              height={230}
              className="w-full h-full max-h-[240px] rounded-lg border border-cyan-900/40 bg-slate-950 shadow-inner"
            />
          </div>

          <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1">
            <span>Próton: 0.8414 fm</span>
            <span className="text-emerald-400 font-bold">LCAO Rastreamento Ativo</span>
            <span>Monte Carlo: 48 e-</span>
          </div>
        </div>
      </div>

      {/* 4-Step Engine: Textualiza -> Imagina -> Raciocina -> Generaliza */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              Motor de Tradução e Raciocínio em 4 Etapas
            </h3>
            <p className="text-xs text-slate-400">
              Processamento contínuo: converte a intenção do vídeo em linguagem computacional, projeta visualmente, raciocina fisicamente e generaliza para a fábrica
            </p>
          </div>

          <button
            id="btn-execute-video-pipeline"
            onClick={handleExecuteFullPipeline}
            disabled={isRunningPipeline}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg ${
              isRunningPipeline
                ? 'bg-amber-500 text-slate-950 animate-pulse'
                : 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white hover:brightness-110 shadow-indigo-600/30'
            }`}
          >
            {isRunningPipeline ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processando Etapa {pipelineActiveStep}/4...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Executar: Textualiza → Imagina → Raciocina → Generaliza (+150 IQ)</span>
              </>
            )}
          </button>
        </div>

        {/* 4 Step Visual Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Step 1: Textualiza */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              pipelineActiveStep === 1
                ? 'bg-cyan-950/80 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                : 'bg-slate-950/80 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> 1. TEXTUALIZA
              </span>
              <span className="text-[10px] text-slate-500">Decodificador</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
              Transforma a intenção do vídeo em tokens semânticos e representação matricial formal (Monte Carlo, LCAO, Próton).
            </p>
            <div className="mt-2 text-[9px] font-mono text-cyan-300/80 bg-slate-900 p-1.5 rounded border border-slate-800">
              Tokens: [PROB_DENSITY, MONTE_CARLO, ROT_EULER]
            </div>
          </div>

          {/* Step 2: Imagina */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              pipelineActiveStep === 2
                ? 'bg-purple-950/80 border-purple-400 shadow-lg shadow-purple-500/20 ring-1 ring-purple-400'
                : 'bg-slate-950/80 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-purple-400 font-bold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> 2. IMAGINA
              </span>
              <span className="text-[10px] text-slate-500">Renderizador</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
              Gera no córtex visual a projeção multi-eixo (A-Z) com isosuperfície contínua e nuvem estocástica tridimensional.
            </p>
            <div className="mt-2 text-[9px] font-mono text-purple-300/80 bg-slate-900 p-1.5 rounded border border-slate-800">
              Projeção: Corrente de Probabilidade A-Z
            </div>
          </div>

          {/* Step 3: Raciocina */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              pipelineActiveStep === 3
                ? 'bg-indigo-950/80 border-indigo-400 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400'
                : 'bg-slate-950/80 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-indigo-400 font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> 3. RACIOCINA
              </span>
              <span className="text-[10px] text-slate-500">Tensor Calc</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
              Calcula a translação entre a precisão femtométrica (0.8414 fm) e os servomotores cinemáticos 6-DOF do robô ER-2.
            </p>
            <div className="mt-2 text-[9px] font-mono text-indigo-300/80 bg-slate-900 p-1.5 rounded border border-slate-800">
              Cálculo: [ROT_MATRIX] Φ, Θ, Ψ & ∫|Ψ|² dV
            </div>
          </div>

          {/* Step 4: Generaliza */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              pipelineActiveStep === 4
                ? 'bg-emerald-950/80 border-emerald-400 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400'
                : 'bg-slate-950/80 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> 4. GENERALIZA
              </span>
              <span className="text-[10px] text-slate-500">Léxico Universal</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
              Integra ao Array Multilinguístico Universal, cria novas regras autorais de fábrica e alimenta a sabedoria até 2000.
            </p>
            <div className="mt-2 text-[9px] font-mono text-emerald-300/80 bg-slate-900 p-1.5 rounded border border-slate-800">
              Heurística: Regras Soberanas Sintetizadas
            </div>
          </div>
        </div>

        {/* Custom Intent Formulation & Presets */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold">Intenção Ativa do Envio de Vídeo:</span>
            <span className="text-indigo-400">4 Presets Quânticos Disponíveis</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {INTENT_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActivePresetIndex(idx);
                  setCustomIntentInput(p.intentText);
                  if (idx === 0) {
                    setTelemetry((prev) => ({
                      ...prev,
                      exactLengthFemtometers: 0.8414,
                      rotationMatrix: { phi: 0.77, theta: 1.15, psi: 0.38 }
                    }));
                  } else if (idx === 1) {
                    setTelemetry((prev) => ({
                      ...prev,
                      exactLengthFemtometers: 1.215,
                      rotationMatrix: { phi: 0.92, theta: 1.45, psi: 0.55 }
                    }));
                  } else if (idx === 2) {
                    setTelemetry((prev) => ({
                      ...prev,
                      exactLengthFemtometers: 2.45,
                      rotationMatrix: { phi: 0.45, theta: 0.88, psi: 0.22 }
                    }));
                  } else {
                    setTelemetry((prev) => ({
                      ...prev,
                      exactLengthFemtometers: 0.8414,
                      rotationMatrix: { phi: 1.12, theta: 1.35, psi: 0.78 }
                    }));
                  }
                }}
                className={`p-2 rounded-lg text-left text-xs transition-all border ${
                  activePresetIndex === idx
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold truncate">{p.title}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">{p.nomenclatura}</div>
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={customIntentInput}
              onChange={(e) => setCustomIntentInput(e.target.value)}
              placeholder="Digite a intenção textualizada para raciocinar e generalizar..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <button
              onClick={() => {
                onUpdateScore(50);
                if (onAddThought) {
                  onAddThought({
                    id: `TH-INTENT-${Date.now().toString().slice(-4)}`,
                    timestamp: new Date().toLocaleTimeString(),
                    type: 'REASONING',
                    thought: `Textualizei a intenção: "${customIntentInput}". Deduzindo tensores e integrando ao cérebro do ER-2.`,
                    confidence: 0.99,
                    wisdomGain: 12.0
                  });
                }
              }}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold font-mono transition-colors whitespace-nowrap"
            >
              Raciocinar Intenção (+50)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
