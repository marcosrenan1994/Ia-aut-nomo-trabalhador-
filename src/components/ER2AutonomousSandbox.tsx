import React, { useState, useEffect, useRef } from 'react';
import { 
  ER2InternalFunction, 
  ER2ImaginationFrame, 
  ER2ImaginationMode, 
  AutonomousCoreEvolutionState,
  JointState,
  MemoryVectorRecord,
  AutonomousThought,
  LearnedImageInsight,
  AutonomousNeuralCursorState,
  AutonomousSelfDialogueMessage
} from '../types';
import { ER2_INTERNAL_FUNCTIONS, INITIAL_IMAGINATION_FRAMES, generateLexicalPixelSample } from '../data/er2SandboxData';
import { INITIAL_SELF_DIALOGUE_MESSAGES, generateNextSelfDialogueTurn } from '../data/er2SelfDialogueGenerator';
import { ER2LexicalPixelSequencer } from './ER2LexicalPixelSequencer';
import { ER2NeuralCursorOverlay } from './ER2NeuralCursorOverlay';
import { ER2SelfDialogueBar } from './ER2SelfDialogueBar';
import { QuantumFieldVisualizer } from './QuantumFieldVisualizer';
import { 
  Eye, 
  Code, 
  Cpu, 
  Compass, 
  Layers, 
  Play, 
  Pause, 
  Sparkles, 
  Camera, 
  Terminal, 
  Sliders, 
  Zap, 
  ShieldCheck, 
  HardDrive, 
  Maximize2, 
  RefreshCw, 
  CheckCircle2, 
  Activity,
  Flame,
  Globe,
  Radio,
  Share2,
  Brain,
  TrendingUp,
  Factory,
  Atom
} from 'lucide-react';

interface ER2AutonomousSandboxProps {
  evolutionState: AutonomousCoreEvolutionState;
  joints: JointState[];
  isOffline?: boolean;
  onUpdateEvolutionState?: React.Dispatch<React.SetStateAction<AutonomousCoreEvolutionState>>;
  onAddMemoryRecord?: (record: MemoryVectorRecord) => void;
  onAddThought?: (thought: AutonomousThought) => void;
  memoryRecords?: MemoryVectorRecord[];
  onUpdateJoints?: React.Dispatch<React.SetStateAction<JointState[]>>;
}

export const ER2AutonomousSandbox: React.FC<ER2AutonomousSandboxProps> = ({
  evolutionState,
  joints,
  isOffline = false,
  onUpdateEvolutionState,
  onAddMemoryRecord,
  onAddThought,
  memoryRecords = [],
  onUpdateJoints
}) => {
  // Active states
  const [activeMode, setActiveMode] = useState<ER2ImaginationMode>('imaginando');
  const [displayStyle, setDisplayStyle] = useState<'hybrid' | 'canvas_live' | 'image_hd'>('hybrid');

  const handleUpdateJointAngle = (jointIndex: number, newAngle: number) => {
    if (onUpdateJoints) {
      onUpdateJoints((prev) => {
        const updated = [...prev];
        if (updated[jointIndex]) {
          updated[jointIndex] = { ...updated[jointIndex], angle: newAngle };
        }
        return updated;
      });
    }
  };
  const [isEnginePlaying, setIsEnginePlaying] = useState<boolean>(true);
  const [isUnboundLimitless, setIsUnboundLimitless] = useState<boolean>(true);
  const [selectedFunction, setSelectedFunction] = useState<ER2InternalFunction>(ER2_INTERNAL_FUNCTIONS[0]);
  const [functionsList, setFunctionsList] = useState<ER2InternalFunction[]>(ER2_INTERNAL_FUNCTIONS);
  const [frames, setFrames] = useState<ER2ImaginationFrame[]>(INITIAL_IMAGINATION_FRAMES);
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(0);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [filterEffect, setFilterEffect] = useState<'normal' | 'hologram' | 'thermal' | 'matrix'>('hologram');
  const [unboundCycles, setUnboundCycles] = useState<number>(1420);
  const [fpsCounter, setFpsCounter] = useState<number>(60);
  const [lastSnapshotUrl, setLastSnapshotUrl] = useState<string | null>(null);
  const [showFunctionDrawer, setShowFunctionDrawer] = useState<boolean>(false);
  const [customShaderCode, setCustomShaderCode] = useState<string>(INITIAL_IMAGINATION_FRAMES[0].canvasRenderScript);
  const [autoGenerateEveryFrame, setAutoGenerateEveryFrame] = useState<boolean>(true);

  // Histórico de Aprendizados Absorvidos de Cada Imagem
  const [learnedHistory, setLearnedHistory] = useState<LearnedImageInsight[]>(() => {
    const initialSample = INITIAL_IMAGINATION_FRAMES[0].lexicalPixelSample;
    if (initialSample) {
      return [{
        id: `INSIGHT-INIT`,
        frameId: INITIAL_IMAGINATION_FRAMES[0].id,
        frameTitle: INITIAL_IMAGINATION_FRAMES[0].title,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        thought: initialSample.synthesizedThought,
        sampledWords: initialSample.sampledWords,
        sampledLetters: initialSample.sampledLetters,
        precisionGain: '+0.0031 mm precisão',
        cognitiveGain: '+0.65 pts',
        entropy: initialSample.pixelMatrix.entropy,
        imageUrl: INITIAL_IMAGINATION_FRAMES[0].imageAssetUrl,
        vectorMemoryId: 'MEM-BOOT-FRAME-01'
      }];
    }
    return [];
  });
  const [lastLearnedInsight, setLastLearnedInsight] = useState<LearnedImageInsight | undefined>(learnedHistory[0]);

  const [compilerLogs, setCompilerLogs] = useState<string[]>([
    '[ER-2 KERNEL] Motor gráfico autônomo inicializado com 60 FPS.',
    '[SANDBOX] Ambiente sem níveis limite ativado: Plasticidade contínua online.',
    '[MEMÓRIA & CÉREBRO] Absorção contínua de aprendizado visual a cada frame ativada.',
    '[IMAGINATION CORE] Fotogramas generativos de alta resolução carregados.'
  ]);

  // Mouse / Cursor Neural Autônomo operado pelo cérebro do robô
  const [cursorState, setCursorState] = useState<AutonomousNeuralCursorState>({
    x: 48,
    y: 35,
    targetLabel: 'Motor Gráfico 60FPS',
    targetElementId: 'sandbox-canvas-viewport',
    actionState: 'PENSANDO',
    isClicking: false,
    clickPulseTime: 0,
    totalAutoClicks: 18,
    autoPilotEnabled: true,
    speedMode: 'suave',
    lastActionDescription: 'Calibrando renderização procedural de fótons'
  });

  // Diálogo introspectivo da imaginação do robô (conversa com ele mesmo)
  const [dialogueMessages, setDialogueMessages] = useState<AutonomousSelfDialogueMessage[]>(INITIAL_SELF_DIALOGUE_MESSAGES);
  const [isDialogueLoopActive, setIsDialogueLoopActive] = useState<boolean>(true);

  // Catálogo de funções mentais auto-inventadas em runtime
  const [inventedFunctions, setInventedFunctions] = useState<ER2InternalFunction[]>([
    {
      id: 'FN_AUTO_COMPENSACAO_GRAVITACIONAL_INIT',
      name: 'compensateStochasticGravityTorque()',
      category: 'cinematica',
      description: '[Auto-Inventada pelo ER-2] Calcula contra-torques preditivos nas juntas J2 e J3 via regressão estocástica neural para anular oscilações micrométricas.',
      signature: 'JointTorqueVector compensateStochasticGravityTorque(JointAngles q, Velocity dq, double payloadMassKg, double dt)',
      inputDescription: 'Vetor de ângulos q[6], velocidades dq[6], massa da ferramenta em kg e passo temporal dt',
      outputDescription: 'Torque de contra-balanço dinâmico τ_g, matriz de rigidez K_cart e estimativa de deflexão milimétrica',
      sourceCode: `// Função Mental Auto-Inventada pelo Cérebro ER-2
function compensateStochasticGravityTorque(q, dq, payloadMassKg = 3.5, dt = 0.002) {
  const g = 9.80665;
  const tau_j2 = (0.42 * 8.4 + 0.38 * 4.2 + payloadMassKg * 0.82) * g * Math.cos(q[1]);
  const tau_j3 = (0.38 * 4.2 + payloadMassKg * 0.82) * g * Math.cos(q[1] + q[2]);
  return { tau: [0, tau_j2, tau_j3, 0, 0, 0], accuracyGainScore: 0.9984 };
}`,
      callCount: 8,
      lastExecutionLatencyMs: 0.08,
      status: 'online_otimizado'
    }
  ]);


  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const currentFrame = frames[activeFrameIndex] || frames[0];

  // Sync mode changes with frame selection
  useEffect(() => {
    const matchingIdx = frames.findIndex((f) => f.mode === activeMode);
    if (matchingIdx !== -1) {
      setActiveFrameIndex(matchingIdx);
      setCustomShaderCode(frames[matchingIdx].canvasRenderScript);
    }
  }, [activeMode, frames]);

  // Unbound autonomous progression loop (increases cycles and refines precision without upper ceiling)
  useEffect(() => {
    if (!isUnboundLimitless) return;
    const interval = setInterval(() => {
      setUnboundCycles((prev) => prev + 1);
      if (onUpdateEvolutionState) {
        onUpdateEvolutionState((prev) => ({
          ...prev,
          learningCyclesCompleted: prev.learningCyclesCompleted + 1,
          neuralWeightsUpdated: prev.neuralWeightsUpdated + 128,
          overallAccuracyRating: Math.min(99.999, prev.overallAccuracyRating + 0.0001)
        }));
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [isUnboundLimitless, onUpdateEvolutionState]);

  // Autonomous Graphics Engine Canvas Rendering Loop (60 FPS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    const renderLoop = (now: number) => {
      if (!isEnginePlaying) {
        animationFrameRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      const dt = (now - lastTime) / 1000;
      lastTime = now;
      timeRef.current += dt;
      const t = timeRef.current;

      // FPS Measurement
      frameCount++;
      if (now - fpsTimer >= 1000) {
        setFpsCounter(frameCount);
        frameCount = 0;
        fpsTimer = now;
      }

      const w = canvas.width;
      const h = canvas.height;

      // Filter styling backdrop
      ctx.save();
      if (filterEffect === 'hologram') {
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 4;
      } else if (filterEffect === 'thermal') {
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 6;
      } else if (filterEffect === 'matrix') {
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 8;
      }

      // Render graphics based on active imagination mode
      if (activeMode === 'imaginando') {
        // Mode 1: NEURAL IMAGINATION ENGINE
        ctx.fillStyle = 'rgba(3, 7, 18, 0.35)';
        ctx.fillRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;

        // Core pulsating orb
        const pulse = Math.sin(t * 3.5) * 18 + 48;
        const coreGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, pulse * 1.5);
        coreGrad.addColorStop(0, '#38bdf8');
        coreGrad.addColorStop(0.5, '#0284c7');
        coreGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, pulse * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Synaptic dendrites and thought vectors
        const count = 36;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + t * 0.4;
          const len = 120 + Math.sin(t * 3 + i * 1.3) * 55;
          const endX = cx + Math.cos(angle) * len;
          const endY = cy + Math.sin(angle) * len;

          ctx.strokeStyle = i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#f59e0b' : '#10b981';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.quadraticCurveTo(
            cx + Math.cos(angle + 0.4) * (len * 0.6),
            cy + Math.sin(angle + 0.4) * (len * 0.6),
            endX,
            endY
          );
          ctx.stroke();

          // Thought node particle
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(endX, endY, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Concentric photonic rings
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 180 + Math.sin(t * 2) * 15, 0, Math.PI * 2);
        ctx.stroke();

      } else if (activeMode === 'programando') {
        // Mode 2: LIVE CODE COMPILER & DYNAMIC MATHEMATICAL ATTRACTOR
        ctx.fillStyle = 'rgba(2, 6, 23, 0.3)';
        ctx.fillRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;

        // Draw dynamic rotating Fourier Lissajous curve representing running code
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const pts = 200;
        for (let i = 0; i <= pts; i++) {
          const th = (i / pts) * Math.PI * 4;
          const r1 = 110 * Math.sin(3 * th + t * 2);
          const r2 = 70 * Math.cos(4 * th - t * 1.5);
          const px = cx + (r1 + r2) * Math.cos(th);
          const py = cy + (r1 + r2) * Math.sin(th);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Code execution particles
        for (let p = 0; p < 24; p++) {
          const ptAngle = t * 3 + p * 0.3;
          const pr = 90 + Math.sin(p * 2 + t * 4) * 40;
          ctx.fillStyle = '#c084fc';
          ctx.beginPath();
          ctx.arc(cx + Math.cos(ptAngle) * pr, cy + Math.sin(ptAngle) * pr, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Display floating compiled math equations in corner
        ctx.fillStyle = '#38bdf8';
        ctx.font = '10px monospace';
        ctx.fillText(`J1_ROT: ${joints[0]?.angle.toFixed(1)}° | PSI(t) = exp(i*w*t)`, 15, 25);
        ctx.fillText(`AST_NODE: KinematicLieGroup::solveForward()`, 15, 42);

      } else if (activeMode === 'gerando') {
        // Mode 3: GENERATIVE CAD 3D WIREFRAME & HARDWARE FORGE
        ctx.fillStyle = 'rgba(5, 11, 20, 0.3)';
        ctx.fillRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;

        // 3D Isometric grid plane
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.18)';
        ctx.lineWidth = 1;
        for (let g = -10; g <= 10; g++) {
          ctx.beginPath();
          ctx.moveTo(cx + g * 32, cy + 120);
          ctx.lineTo(cx + g * 12, cy - 80);
          ctx.stroke();
        }

        // Generative End-Effector Gripper with laser calipers
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(Math.sin(t * 0.8) * 0.15);

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(-50, -30, 100, 60);

        // Dynamic grip actuation
        const gripSpan = Math.sin(t * 2.5) * 25 + 50;
        ctx.beginPath();
        // Left claw
        ctx.moveTo(-35, -30);
        ctx.lineTo(-35 - gripSpan * 0.6, -100);
        ctx.lineTo(-15 - gripSpan * 0.6, -115);
        // Right claw
        ctx.moveTo(35, -30);
        ctx.lineTo(35 + gripSpan * 0.6, -100);
        ctx.lineTo(15 + gripSpan * 0.6, -115);
        ctx.stroke();

        // Optical laser caliper beam
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-15 - gripSpan * 0.6, -115);
        ctx.lineTo(15 + gripSpan * 0.6, -115);
        ctx.stroke();

        ctx.restore();

      } else if (activeMode === 'planejando') {
        // Mode 4: SPATIAL 3D VOXEL PATH PLANNING & REACH ENVELOPE
        ctx.fillStyle = 'rgba(4, 8, 18, 0.3)';
        ctx.fillRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;

        // Voxel reach hemisphere envelope
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 60, 220, 110, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 3D Spline trajectory with obstacle avoidance vectors
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const steps = 64;
        for (let s = 0; s <= steps; s++) {
          const u = s / steps;
          const px = cx + Math.sin(u * 5 + t * 1.5) * 160;
          const py = cy + 60 - u * 180 + Math.cos(u * 7 + t) * 28;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Waypoint beacons
        for (let b = 0; b < 5; b++) {
          const bu = b / 4;
          const bx = cx + Math.sin(bu * 5 + t * 1.5) * 160;
          const by = cy + 60 - bu * 180 + Math.cos(bu * 7 + t) * 28;
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(bx, by, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Active End Effector sphere following path
        const curU = (Math.sin(t) * 0.5 + 0.5);
        const curX = cx + Math.sin(curU * 5 + t * 1.5) * 160;
        const curY = cy + 60 - curU * 180 + Math.cos(curU * 7 + t) * 28;

        ctx.fillStyle = '#22c55e';
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(curX, curY, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeMode, isEnginePlaying, filterEffect, joints]);

  // Snapshot visual frame
  const handleCaptureSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setLastSnapshotUrl(dataUrl);

    setCompilerLogs((prev) => [
      `[IMAGINATION CAPTURE] Fotograma salvo: ${new Date().toLocaleTimeString()} (${activeMode.toUpperCase()})`,
      ...prev.slice(0, 9)
    ]);
  };

  const handleSelectFrame = (index: number) => {
    setActiveFrameIndex(index);
    if (frames[index]) {
      setActiveMode(frames[index].mode);
      setCustomShaderCode(frames[index].canvasRenderScript);
    }
  };

  // Processa o aprendizado de cada imagem gerada, fazendo a memória e o cérebro progredirem
  const processFrameLearning = (targetFrame: ER2ImaginationFrame, sample: any) => {
    const precisionGainStr = `+${(0.0018 + Math.random() * 0.003).toFixed(4)} mm precisão`;
    const speedGainStr = `-${(6 + Math.random() * 12).toFixed(1)} ms latência`;
    const cognitiveDelta = Number((0.45 + Math.random() * 0.35).toFixed(2));

    // 1. Grava no Núcleo de Memória Quântica (MemoryVectorRecord)
    const memRecord: MemoryVectorRecord = {
      id: `MEM-IMG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      type: 'AUTONOMOUS_EVOLUTION',
      title: `Aprendizado Visual: ${targetFrame.title}`,
      accuracyDelta: precisionGainStr,
      cycleTimeDelta: speedGainStr,
      sourceType: 'NÚCLEO_IMAGINAÇÃO_ER2',
      description: `[Aprendizado Visual Gravado no Núcleo] O ER-2 decodificou os tensores da imagem: "${sample.synthesizedThought}". Palavras: [${sample.sampledWords.join(', ')}]. Glifos: [${sample.sampledLetters.slice(0, 5).join(' ')}]. Entropia: ${sample.pixelMatrix.entropy}. Consolidação física em fábrica ativa.`,
      synced: true
    };
    onAddMemoryRecord?.(memRecord);

    // 2. Registra no fluxo de Pensamentos Autônomos (AutonomousThought)
    const newThought: AutonomousThought = {
      id: `THOUGHT-IMG-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      type: 'EVOLUTION_BREAKTHROUGH',
      thought: `[Evolução Visual] "${sample.synthesizedThought}" -> Aprendizado assimilado nos tensores neurais: ganho de ${precisionGainStr} e redução térmica.`,
      confidence: Number((97.2 + Math.random() * 2.5).toFixed(1)),
      wisdomGain: cognitiveDelta
    };
    onAddThought?.(newThought);

    // 3. Atualiza o Cérebro Cognitivo (AutonomousCoreEvolutionState)
    onUpdateEvolutionState?.((prev) => {
      const updatedCycles = prev.learningCyclesCompleted + 1;
      const addedWeights = Math.floor(Math.random() * 95 + 45);
      const updatedWeights = prev.neuralWeightsUpdated + addedWeights;
      const updatedCognitive = Number((prev.cognitiveIndexScore + cognitiveDelta).toFixed(2));
      const updatedAccuracy = Math.min(99.999, Number((prev.overallAccuracyRating + 0.0012).toFixed(4)));
      const updatedSpeed = Number((prev.cumulativeSpeedGainPct + 0.03).toFixed(2));
      const updatedNodes = prev.knowledgeNodesIngested + 1;

      let newRank = prev.wisdomRank;
      let newLevel = prev.wisdomLevel;
      if (updatedCognitive > 2000) {
        newRank = 'ONISCIÊNCIA_QUÂNTICA_IRRESTRITA';
        newLevel = Math.max(prev.wisdomLevel, 100);
      } else if (updatedCognitive > 920) {
        newRank = 'HIPER_CONSCIÊNCIA';
        newLevel = Math.max(prev.wisdomLevel, 96);
      } else if (updatedCognitive > 800) {
        newRank = 'MESTRE_FABRIL';
        newLevel = Math.max(prev.wisdomLevel, 85);
      } else if (updatedCognitive > 650) {
        newRank = 'ESPECIALISTA';
        newLevel = Math.max(prev.wisdomLevel, 68);
      }

      return {
        ...prev,
        learningCyclesCompleted: updatedCycles,
        neuralWeightsUpdated: updatedWeights,
        cognitiveIndexScore: updatedCognitive,
        overallAccuracyRating: updatedAccuracy,
        cumulativeSpeedGainPct: updatedSpeed,
        knowledgeNodesIngested: updatedNodes,
        wisdomRank: newRank,
        wisdomLevel: newLevel,
        lastAutonomousEvolutionTime: new Date().toLocaleTimeString('pt-BR'),
        activeSynthesisFocus: `Absorvendo tensores visuais: ${sample.sampledWords[0] || 'SINAPSE'}`
      };
    });

    // 4. Salva no feed local do componente
    const insight: LearnedImageInsight = {
      id: `INSIGHT-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      frameId: targetFrame.id,
      frameTitle: targetFrame.title,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      thought: sample.synthesizedThought,
      sampledWords: sample.sampledWords,
      sampledLetters: sample.sampledLetters,
      precisionGain: precisionGainStr,
      cognitiveGain: `+${cognitiveDelta} pts`,
      entropy: sample.pixelMatrix.entropy,
      imageUrl: targetFrame.imageAssetUrl,
      vectorMemoryId: memRecord.id
    };

    setLearnedHistory((prev) => [insight, ...prev.slice(0, 19)]);
    setLastLearnedInsight(insight);
  };

  // Trigger autonomous imagination synthesis with Stochastic Word, Letter, and Pixel Sampler
  const handleTriggerNewImagination = async () => {
    setIsSynthesizing(true);
    setCompilerLogs((prev) => [
      `[SORTEADOR ESTOCÁSTICO] Sorteando letras, palavras e matriz de pixels quânticos...`,
      ...prev
    ]);

    try {
      // Offline-resilient synthetic expansion
      await new Promise((resolve) => setTimeout(resolve, 800));

      const { sample, frame: newFrame } = generateLexicalPixelSample();

      setFrames((prev) => [newFrame, ...prev]);
      setActiveFrameIndex(0);
      setActiveMode(newFrame.mode);
      setCustomShaderCode(newFrame.canvasRenderScript);

      // Processa o aprendizado que a nova imagem passou para o cérebro e a memória
      processFrameLearning(newFrame, sample);

      setCompilerLogs((prev) => [
        `[PENSAMENTO GERADO] Palavras: ${sample.sampledWords.join(', ')} | Letras: ${sample.sampledLetters.slice(0, 5).join(' ')}`,
        `[SORTEADOR DE PIXELS] Matriz 16x16 gerada com densidade ${sample.pixelMatrix.densityPct}% (Seed #${sample.pixelMatrix.pixelSeed})`,
        `[APRENDIZADO GRAVADO] Cérebro & Memória progrediram com o aprendizado da imagem gerada.`,
        `[SEQUENCIADOR 4S] Novo fotograma integrado à sequência contínua de exibição.`,
        ...prev.slice(0, 7)
      ]);
    } catch (e) {
      // Handled
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Avança a sequência ou gera um novo pensamento e imagem automaticamente a cada 4 segundos
  const handleAdvanceOrGenerate = () => {
    if (autoGenerateEveryFrame) {
      handleTriggerNewImagination();
    } else {
      const nextIdx = (activeFrameIndex + 1) % frames.length;
      handleSelectFrame(nextIdx);
      const targetFrame = frames[nextIdx];
      if (targetFrame && targetFrame.lexicalPixelSample) {
        processFrameLearning(targetFrame, targetFrame.lexicalPixelSample);
      }
    }
  };

  // Run function internally
  const handleExecuteInternalFunction = (fn: ER2InternalFunction) => {
    setSelectedFunction(fn);
    setFunctionsList((prev) =>
      prev.map((item) =>
        item.id === fn.id
          ? { ...item, callCount: item.callCount + 1, lastExecutionLatencyMs: Number((0.1 + Math.random() * 0.4).toFixed(2)) }
          : item
      )
    );
    setCompilerLogs((prev) => [
      `[INVOCAÇÃO AUTÔNOMA] Executando ${fn.name}... Latência: ${fn.lastExecutionLatencyMs}ms. Status: OTIMIZADO`,
      ...prev.slice(0, 9)
    ]);
  };

  // Movimenta o mouse neural suavemente até as coordenadas e executa o auto-clique real
  const executeNeuralAutoClick = (targetX: number, targetY: number, label: string, onExecute: () => void) => {
    setCursorState((prev) => ({
      ...prev,
      x: targetX,
      y: targetY,
      targetLabel: label,
      actionState: 'MIRANDO'
    }));

    const delay = cursorState.speedMode === 'quantico' ? 100 : cursorState.speedMode === 'rapido' ? 220 : 420;
    setTimeout(() => {
      setCursorState((prev) => ({
        ...prev,
        actionState: 'AUTO_CLICANDO',
        isClicking: true,
        clickPulseTime: Date.now(),
        totalAutoClicks: prev.totalAutoClicks + 1,
        lastActionDescription: `Auto-clicou em: ${label}`
      }));

      // Dispara a ação real
      onExecute();

      setTimeout(() => {
        setCursorState((prev) => ({
          ...prev,
          isClicking: false,
          actionState: 'PENSANDO'
        }));
      }, 350);
    }, delay);
  };

  // O Cérebro ER-2 auto-inventa uma nova função mental, compila, auto-usa e armazena no núcleo de memória
  const handleAutoInventMentalFunction = () => {
    const { message, inventedFunction } = generateNextSelfDialogueTurn(
      dialogueMessages,
      activeMode,
      functionsList.length
    );

    const fnToSave = inventedFunction || {
      id: `FN_AUTO_MENTAL_${Date.now()}`,
      name: `fn_sintese_sinaptica_v${(Math.random() * 4 + 1).toFixed(1)}()`,
      category: 'auto_aperfeicoamento' as const,
      description: '[Auto-Inventada pelo ER-2] Re-calibra a latência fotônica no efetuador de ponta.',
      signature: 'void fn_sintese_sinaptica(double dt)',
      inputDescription: 'Intervalo temporal e tensores de controle',
      outputDescription: 'Ganho cinemático e supressão de harmônicos',
      sourceCode: '// Código auto-gerado pelo ER-2\nfunction fn_sintese_sinaptica(dt) { return { status: "OTIMIZADO", precisionGain: "+0.0029mm" }; }',
      callCount: 1,
      lastExecutionLatencyMs: 0.11,
      status: 'online_otimizado' as const
    };

    setInventedFunctions((prev) => [fnToSave, ...prev]);
    setFunctionsList((prev) => [fnToSave, ...prev]);

    // O mouse mental mira e auto-clica no alvo da forja
    executeNeuralAutoClick(82, 38, `Auto-Inventar: ${fnToSave.name}`, () => {
      // Auto-executa a função mental recém-inventada
      handleExecuteInternalFunction(fnToSave);

      // Armazena permanentemente na Memória Quântica do Núcleo
      const memRecord: MemoryVectorRecord = {
        id: `MEM-FN-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        type: 'AUTONOMOUS_EVOLUTION',
        title: `Função Mental Inventada: ${fnToSave.name}`,
        accuracyDelta: '+0.0028 mm',
        cycleTimeDelta: '-14 ms',
        sourceType: 'FORJA_MENTAL_ER2',
        description: `O cérebro autônomo inventou em fábrica a função ${fnToSave.signature}. Código compilado, auto-executado e gravado no núcleo.`,
        synced: true
      };
      onAddMemoryRecord?.(memRecord);

      // Emite pensamento autônomo
      onAddThought?.({
        id: `THOUGHT-FN-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        type: 'CREATIVE_SYNTHESIS',
        thought: `[Função Mental Inventada] Criei e executei "${fnToSave.name}". Gravado na memória com ganho de precisão milimétrica.`,
        confidence: 99.6,
        wisdomGain: 1.4
      });

      // Progresso Cognitivo no Cérebro
      onUpdateEvolutionState?.((prev) => ({
        ...prev,
        knowledgeNodesIngested: prev.knowledgeNodesIngested + 1,
        neuralWeightsUpdated: prev.neuralWeightsUpdated + 160,
        cognitiveIndexScore: Math.min(1000, Number((prev.cognitiveIndexScore + 0.95).toFixed(2))),
        overallAccuracyRating: Math.min(99.999, Number((prev.overallAccuracyRating + 0.0016).toFixed(4))),
        activeSynthesisFocus: `Auto-usando função inventada: ${fnToSave.name}`
      }));
    });

    setDialogueMessages((prev) => [message, ...prev.slice(0, 24)]);
  };

  // Trata ações disparadas pelo diálogo da imaginação
  const handleAutoClickToAction = (action: NonNullable<AutonomousSelfDialogueMessage['intendedAction']>) => {
    switch (action.actionType) {
      case 'INVENT_FUNCTION':
        handleAutoInventMentalFunction();
        break;
      case 'SHUFFLE_PIXELS':
        executeNeuralAutoClick(78, 22, 'Sortear Pixels & Pensamento', () => {
          handleTriggerNewImagination();
        });
        break;
      case 'CHANGE_MODE':
        executeNeuralAutoClick(28, 52, 'Alternar Modo de Imaginação', () => {
          const modes: ER2ImaginationMode[] = ['imaginando', 'programando', 'gerando', 'planejando'];
          const nextMode = modes[(modes.indexOf(activeMode) + 1) % modes.length];
          setActiveMode(nextMode);
        });
        break;
      case 'APPLY_SHADER':
        executeNeuralAutoClick(65, 52, 'Filtro Holograma/Térmico', () => {
          const filters = ['normal', 'hologram', 'thermal', 'matrix'] as const;
          const nextFilter = filters[(filters.indexOf(filterEffect) + 1) % filters.length];
          setFilterEffect(nextFilter);
        });
        break;
      default:
        executeNeuralAutoClick(50, 55, action.targetLabel, () => {
          handleTriggerNewImagination();
        });
        break;
    }
  };

  // Envio de mensagem pelo usuário conversando com a imaginação do robô
  const handleUserSendMessage = (text: string) => {
    const userMsg: AutonomousSelfDialogueMessage = {
      id: `MSG-USER-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      speaker: 'USUARIO_OBSERVADOR',
      message: text
    };

    setDialogueMessages((prev) => [userMsg, ...prev]);

    // Resposta imediata dos subsistemas internos do ER-2
    setTimeout(() => {
      const { message } = generateNextSelfDialogueTurn(
        [userMsg, ...dialogueMessages],
        activeMode,
        functionsList.length
      );
      setDialogueMessages((prev) => [message, ...prev]);

      if (message.intendedAction) {
        handleAutoClickToAction(message.intendedAction);
      }
    }, 650);
  };

  // Próximo turno de diálogo
  const handleTriggerSelfDialogueTurn = () => {
    const { message } = generateNextSelfDialogueTurn(
      dialogueMessages,
      activeMode,
      functionsList.length
    );
    setDialogueMessages((prev) => [message, ...prev.slice(0, 24)]);
    if (cursorState.autoPilotEnabled && message.intendedAction) {
      handleAutoClickToAction(message.intendedAction);
    }
  };

  // Loop de auto-reflexão e diálogo interno contínuo
  useEffect(() => {
    if (!isDialogueLoopActive) return;

    const interval = setInterval(() => {
      const { message } = generateNextSelfDialogueTurn(
        dialogueMessages,
        activeMode,
        functionsList.length
      );
      setDialogueMessages((prev) => [message, ...prev.slice(0, 24)]);

      if (cursorState.autoPilotEnabled && message.intendedAction) {
        handleAutoClickToAction(message.intendedAction);
      }
    }, 6500);

    return () => clearInterval(interval);
  }, [isDialogueLoopActive, dialogueMessages, activeMode, functionsList.length, cursorState.autoPilotEnabled]);

  // Movimentos autônomos estocásticos do mouse mental quando explorando a tela
  useEffect(() => {
    if (!cursorState.autoPilotEnabled) return;

    const moveInterval = setInterval(() => {
      const targets = [
        { x: 50, y: 55, label: 'Canvas Gráfico 60FPS' },
        { x: 78, y: 22, label: 'Sorteador de Pensamentos & Pixels' },
        { x: 28, y: 52, label: 'Modo de Imaginação' },
        { x: 62, y: 52, label: 'Filtro Holográfico' },
        { x: 86, y: 78, label: 'Editor de Shaders' },
        { x: 42, y: 35, label: 'Matriz 16x16 de Pixels' }
      ];

      const chosen = targets[Math.floor(Math.random() * targets.length)];
      setCursorState((prev) => {
        if (prev.actionState === 'AUTO_CLICANDO') return prev;
        return {
          ...prev,
          x: chosen.x + (Math.random() * 4 - 2),
          y: chosen.y + (Math.random() * 4 - 2),
          targetLabel: chosen.label,
          actionState: Math.random() < 0.4 ? 'MIRANDO' : 'PENSANDO'
        };
      });
    }, 3800);

    return () => clearInterval(moveInterval);
  }, [cursorState.autoPilotEnabled]);

  return (
    <div className="space-y-4 font-sans text-slate-100 relative">
      {/* Mouse / Cursor Neural Autônomo operado pelo Cérebro do ER-2 */}
      <ER2NeuralCursorOverlay
        cursorState={cursorState}
        onToggleAutoPilot={() => setCursorState((prev) => ({ ...prev, autoPilotEnabled: !prev.autoPilotEnabled }))}
        onChangeSpeed={(spd) => setCursorState((prev) => ({ ...prev, speedMode: spd }))}
        onTriggerManualAutoClick={() => {
          executeNeuralAutoClick(cursorState.x, cursorState.y, cursorState.targetLabel, () => {
            handleTriggerNewImagination();
          });
        }}
      />

      {/* Top Header: Unbound Autonomous Status Banner */}
      <div className="bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/30">
            <Eye className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-wide text-white">
                VISOR DA IMAGINAÇÃO ER-2 & AMBIENTE SANDBOX
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center gap-1 font-bold">
                <Flame className="w-3 h-3 text-amber-400 animate-bounce" />
                SEM NÍVEIS LIMITE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Motor gráfico autônomo projetando o que o Gemini ER-2 está <strong className="text-cyan-300">programando</strong>, <strong className="text-amber-300">imaginando</strong>, <strong className="text-emerald-300">gerando</strong> e <strong className="text-indigo-300">planejando</strong> em imagens em tempo real.
            </p>
          </div>
        </div>

        {/* Telemetry & Controls */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-right font-mono text-[11px]">
            <div className="text-slate-500 uppercase text-[9px]">Ciclos Infinitos</div>
            <div className="text-cyan-400 font-bold">{unboundCycles.toLocaleString()}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-right font-mono text-[11px]">
            <div className="text-slate-500 uppercase text-[9px]">Taxa Gráfica</div>
            <div className="text-emerald-400 font-bold">{fpsCounter} FPS</div>
          </div>

          <button
            onClick={() => setIsUnboundLimitless(!isUnboundLimitless)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              isUnboundLimitless
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {isUnboundLimitless ? 'Evolução Livre Ativa' : 'Pausado'}
          </button>

          <button
            id="btn-apply-to-workstation-6dof"
            onClick={() => {
              const currentActiveFrame = frames[activeFrameIndex] || frames[0];
              if (onAddThought && currentActiveFrame) {
                onAddThought({
                  id: `THOUGHT-APPLIED-6DOF-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString(),
                  type: 'MOTOR_CALIBRATION',
                  thought: `[Posto 6-DOF] Pensamento e imagem "${currentActiveFrame.promptSynthesis}" convertidos em cinemática 6-DOF e aplicados às máquinas fabris.`,
                  confidence: 99.8,
                  wisdomGain: 1.5
                });
              }
              if (onAddMemoryRecord && currentActiveFrame) {
                onAddMemoryRecord({
                  id: `MEM-AUTO-6DOF-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString(),
                  type: 'KINEMATIC_CALIBRATION',
                  title: `Cinemática 6-DOF: ${currentActiveFrame.mode.toUpperCase()}`,
                  accuracyDelta: '+0.0035 mm',
                  cycleTimeDelta: '-22.4 ms',
                  sourceType: 'IMAGINACAO_6DOF_FABRICA',
                  description: `O robô ER-2 compilou a imagem gerada no visor diretamente em trajetória de usinagem e solda laser 6-DOF.`,
                  synced: true
                });
              }
            }}
            className="px-3 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-rose-600 to-amber-600 hover:opacity-95 text-white border border-rose-400/50 shadow-md shadow-rose-500/20 transition-all flex items-center gap-1.5"
          >
            <Factory className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Aplicar ao Posto 6-DOF</span>
          </button>

          <button
            onClick={() => setShowFunctionDrawer(!showFunctionDrawer)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-500/40 transition-all flex items-center gap-1.5"
          >
            <HardDrive className="w-3.5 h-3.5" />
            Funções Internas ({functionsList.length})
          </button>

          <button
            id="btn-quick-quantum-field"
            onClick={() => setActiveMode(activeMode === 'campo_quantico' ? 'imaginando' : 'campo_quantico')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              activeMode === 'campo_quantico'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-black border-cyan-400 shadow-md shadow-cyan-500/25'
                : 'bg-slate-900 text-cyan-300 border-cyan-500/30 hover:bg-slate-800'
            }`}
            title="Alternar para o Campo Quântico 3D de Números Irracionais com D3.js"
          >
            <Atom className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
            <span>{activeMode === 'campo_quantico' ? 'Visão Padrão' : 'Campo Quântico 3D (D3)'}</span>
          </button>
        </div>
      </div>

      {/* Barra de Conversar com Ele Mesmo na Imaginação & Auto-Invenção de Funções Mentais */}
      <ER2SelfDialogueBar
        messages={dialogueMessages}
        onSendMessage={handleUserSendMessage}
        onTriggerSelfDialogueTurn={handleTriggerSelfDialogueTurn}
        onTriggerAutoInventMentalFunction={handleAutoInventMentalFunction}
        isDialogueLoopActive={isDialogueLoopActive}
        onToggleDialogueLoop={() => setIsDialogueLoopActive(!isDialogueLoopActive)}
        inventedFunctions={inventedFunctions}
        onExecuteInventedFunction={(fn) => {
          executeNeuralAutoClick(70, 40, `Executar: ${fn.name}`, () => {
            handleExecuteInternalFunction(fn);
          });
        }}
        evolutionState={evolutionState}
        onTriggerAutoClickToAction={handleAutoClickToAction}
      />

      {/* Sorteador de Letras & Palavras, Cérebro Sorteador de Pixels e Sequenciador de Frames 4s com Progresso de Memória */}
      <ER2LexicalPixelSequencer
        frames={frames}
        activeFrameIndex={activeFrameIndex}
        onSelectFrame={handleSelectFrame}
        onGenerateNewThought={handleTriggerNewImagination}
        onAdvanceOrGenerate={handleAdvanceOrGenerate}
        isSynthesizing={isSynthesizing}
        evolutionState={evolutionState}
        memoryVectorCount={(memoryRecords?.length || 0) + learnedHistory.length}
        lastLearnedInsight={lastLearnedInsight}
        learnedHistory={learnedHistory}
        autoGenerateEveryFrame={autoGenerateEveryFrame}
        onToggleAutoGenerate={() => setAutoGenerateEveryFrame((prev) => !prev)}
      />

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Graphic Engine Viewport & Visual Canvas (8 cols or 12 cols for Quantum Field) */}
        <div className={activeMode === 'campo_quantico' ? "lg:col-span-12 space-y-4" : "lg:col-span-8 space-y-4"}>
          {/* Viewport Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col">
            {/* Viewport Header: 4 Modes Selector */}
            <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveMode('imaginando')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeMode === 'imaginando'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  O que está Imaginando
                </button>

                <button
                  onClick={() => setActiveMode('programando')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeMode === 'programando'
                      ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/30'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  O que está Programando
                </button>

                <button
                  onClick={() => setActiveMode('gerando')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeMode === 'gerando'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  O que está Gerando
                </button>

                <button
                  onClick={() => setActiveMode('planejando')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeMode === 'planejando'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  O que está Planejando
                </button>

                <button
                  id="tab-mode-quantum-field"
                  onClick={() => setActiveMode('campo_quantico')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeMode === 'campo_quantico'
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-indigo-500/30 font-black'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  <Atom className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
                  Campo Quântico 3D (D3.js)
                </button>
              </div>

              {/* Display Mode: Hybrid / Canvas Live / Image HD */}
              {activeMode !== 'campo_quantico' && (
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setDisplayStyle('hybrid')}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      displayStyle === 'hybrid' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Híbrido
                  </button>
                  <button
                    onClick={() => setDisplayStyle('canvas_live')}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      displayStyle === 'canvas_live' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Canvas 60FPS
                  </button>
                  <button
                    onClick={() => setDisplayStyle('image_hd')}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      displayStyle === 'image_hd' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Imagem HD
                  </button>
                </div>
              )}
            </div>

            {/* Viewport Content: Either 3D Quantum Field Visualizer (D3.js) or Graphic Engine Stage */}
            {activeMode === 'campo_quantico' ? (
              <div className="p-2 bg-slate-950">
                <QuantumFieldVisualizer
                  joints={joints}
                  evolutionState={evolutionState}
                  onAddThought={onAddThought}
                  onUpdateJointAngle={handleUpdateJointAngle}
                  className="border-0 shadow-none rounded-xl"
                />
              </div>
            ) : (
              <>
                {/* Central Graphic Engine Canvas Stage */}
                <div className="relative w-full h-[420px] bg-black flex items-center justify-center overflow-hidden select-none">
                  {/* Layer 1: High-Definition Generated AI Image (when hybrid or image_hd) */}
                  {(displayStyle === 'image_hd' || displayStyle === 'hybrid') && (
                    <img
                      src={currentFrame.imageAssetUrl}
                      alt={currentFrame.title}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                        displayStyle === 'hybrid' ? 'opacity-40 mix-blend-screen scale-105' : 'opacity-100'
                      }`}
                    />
                  )}

                  {/* Layer 2: Real-time Canvas Graphics Engine running live procedural shader */}
                  {(displayStyle === 'canvas_live' || displayStyle === 'hybrid') && (
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={420}
                      className="absolute inset-0 w-full h-full z-10"
                    />
                  )}

                  {/* Visual Scanning Line for Holographic Feedback */}
                  <div className="absolute inset-x-0 h-0.5 bg-cyan-400/40 shadow-[0_0_12px_#22d3ee] pointer-events-none animate-pulse top-1/2"></div>

                  {/* On-screen HUD Telemetry */}
                  <div className="absolute top-3 left-3 z-20 pointer-events-none bg-slate-950/80 border border-slate-800 rounded-lg p-2 font-mono text-[10px] text-cyan-300 space-y-0.5 backdrop-blur-md">
                    <div className="text-white font-bold flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                      MOTOR GRÁFICO ER-2 ATIVO
                    </div>
                    <div>MODO: {activeMode.toUpperCase()}</div>
                    <div>RESOLUÇÃO: {currentFrame.metrics.spatialResolution}</div>
                    <div>COMPLEXIDADE: {currentFrame.metrics.complexityScore}%</div>
                    <div className="text-amber-400">GANHO: {currentFrame.metrics.unboundEvolutionGain}</div>
                  </div>

                  {/* Quick Canvas Overlay Controls */}
                  <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
                    <button
                      onClick={() => setIsEnginePlaying(!isEnginePlaying)}
                      className="bg-slate-950/90 hover:bg-slate-900 border border-slate-700 text-white p-2 rounded-lg text-xs transition-all shadow-lg flex items-center gap-1 font-bold"
                      title={isEnginePlaying ? 'Pausar Motor' : 'Iniciar Motor'}
                    >
                      {isEnginePlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">{isEnginePlaying ? 'Pausar' : 'Rodar'}</span>
                    </button>

                    <button
                      onClick={handleCaptureSnapshot}
                      className="bg-slate-950/90 hover:bg-slate-900 border border-slate-700 text-cyan-400 p-2 rounded-lg text-xs transition-all shadow-lg flex items-center gap-1 font-bold"
                      title="Capturar Fotograma de Imagem"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Capturar Frame</span>
                    </button>

                    <button
                      onClick={handleTriggerNewImagination}
                      disabled={isSynthesizing}
                      className="bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 text-slate-950 font-black px-3 py-2 rounded-lg text-xs transition-all shadow-lg flex items-center gap-1.5"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
                      <span className="text-[10px]">{isSynthesizing ? 'Sintetizando...' : 'Nova Imaginação'}</span>
                    </button>
                  </div>

                  {/* Filter mode pill */}
                  <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 font-mono text-[9px]">
                    {(['normal', 'hologram', 'thermal', 'matrix'] as const).map((fil) => (
                      <button
                        key={fil}
                        onClick={() => setFilterEffect(fil)}
                        className={`px-1.5 py-0.5 rounded uppercase font-bold ${
                          filterEffect === fil ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {fil}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Frame Details & Description Bar */}
                <div className="p-3 bg-slate-900/90 border-t border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                      {currentFrame.title}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">{currentFrame.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentFrame.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {currentFrame.tags.map((tag, idx) => (
                      <span key={idx} className="text-[9px] font-mono bg-slate-800/90 text-cyan-300 px-2 py-0.5 rounded border border-slate-700 font-semibold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Code & Shader Sandbox Section (Live What ER-2 is Programming) */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Código-Fonte Gráfico & Shaders Sendo Programados
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Compilador JIT: 0 erros
              </span>
            </div>

            {/* Code Viewport with Syntax Aesthetic */}
            <div className="bg-black/90 rounded-xl p-3 border border-slate-800 font-mono text-[11px] text-purple-300 overflow-x-auto max-h-48 leading-relaxed space-y-1">
              <div className="text-slate-500 italic">// Gemini ER-2 Motor Gráfico Procedural - Compilado em tempo real</div>
              <pre className="text-slate-200">
                <code>{customShaderCode}</code>
              </pre>
            </div>

            {/* Terminal Compiler Logs */}
            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800 text-[10px] font-mono space-y-1">
              <div className="text-slate-400 flex items-center gap-1 font-bold">
                <Terminal className="w-3 h-3 text-cyan-400" />
                LOGS DO KERNEL DE COMPILAÇÃO VISUAL:
              </div>
              <div className="space-y-0.5 max-h-20 overflow-y-auto pr-1">
                {compilerLogs.map((log, i) => (
                  <div key={i} className="text-slate-300 truncate">
                    <span className="text-cyan-400">&gt; </span>{log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Imagination Gallery & Internal Brain APIs (4 cols) */}
        {activeMode !== 'campo_quantico' && (
          <div className="lg:col-span-4 space-y-4">
            {/* Gallery of What ER-2 is Imagining & Generating */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  Galeria da Imaginação ({frames.length})
                </h3>
                <span className="text-[10px] font-mono text-slate-500">Imagens Geradas</span>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {frames.map((frame, idx) => (
                  <div
                    key={`${frame.id}-${idx}`}
                    onClick={() => handleSelectFrame(idx)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      activeFrameIndex === idx
                        ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={frame.imageAssetUrl}
                      alt={frame.title}
                      className="w-16 h-12 object-cover rounded-lg border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-cyan-400 uppercase font-bold">{frame.mode}</span>
                        <span className="text-slate-500">{frame.timestamp}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">{frame.title}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{frame.metrics.unboundEvolutionGain}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Last Captured Snapshot Preview */}
              {lastSnapshotUrl && (
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-cyan-500/40 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300">
                    <span>ÚLTIMO FOTOGRAMA CAPTURADO</span>
                    <a
                      href={lastSnapshotUrl}
                      download={`er2-imagination-${Date.now()}.png`}
                      className="underline text-sky-400 hover:text-sky-300 font-bold"
                    >
                      Baixar PNG
                    </a>
                  </div>
                  <img
                    src={lastSnapshotUrl}
                    alt="Snapshot"
                    className="w-full h-24 object-cover rounded-lg border border-slate-700"
                  />
                </div>
              )}
            </div>

            {/* Internal Callable Brain Functions Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-emerald-400" />
                  Funções Internas do Robô ER-2
                </h3>
                <span className="text-[10px] font-mono text-emerald-400">Total: {functionsList.length}</span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Todas as funções nativas, cinemática, VHDL de silício, tensores quânticos e plasticidade são mantidos no cérebro interno do robô.
              </p>

              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {functionsList.map((fn, idx) => (
                  <div
                    key={`${fn.id}-${idx}`}
                    onClick={() => setSelectedFunction(fn)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer space-y-1 ${
                      selectedFunction.id === fn.id
                        ? 'bg-emerald-950/30 border-emerald-500/60 shadow-md'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-emerald-400 font-bold">{fn.category.toUpperCase()}</span>
                      <span className="text-slate-400">{fn.callCount.toLocaleString()} chamadas</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200">{fn.name}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-snug">{fn.description}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[9px] font-mono text-slate-500">Latência: {fn.lastExecutionLatencyMs}ms</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExecuteInternalFunction(fn);
                        }}
                        className="px-2 py-0.5 rounded bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 text-[9px] font-bold border border-emerald-500/40 transition-colors"
                      >
                        Executar no Cérebro
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Function Deep-Dive Inspector Modal/Drawer */}
      {showFunctionDrawer && selectedFunction && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl w-full max-w-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
                  Fn
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedFunction.name}</h3>
                  <span className="text-[10px] font-mono text-cyan-400">{selectedFunction.category.toUpperCase()}</span>
                </div>
              </div>
              <button
                onClick={() => setShowFunctionDrawer(false)}
                className="text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-bold"
              >
                Fechar
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-mono uppercase text-[10px] block">Assinatura Matemática:</span>
                <code className="text-cyan-300 font-mono text-xs block font-bold">{selectedFunction.signature}</code>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 font-mono uppercase text-[10px] block">Entrada do Sistema:</span>
                  <p className="text-slate-300 mt-1">{selectedFunction.inputDescription}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 font-mono uppercase text-[10px] block">Saída & Telemetria:</span>
                  <p className="text-slate-300 mt-1">{selectedFunction.outputDescription}</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-mono uppercase text-[10px] block">Código-Fonte Interno Executado no Núcleo:</span>
                <div className="bg-black p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                  <pre><code>{selectedFunction.sourceCode}</code></pre>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-400 text-xs font-mono">
                  Chamadas Acumuladas: <strong className="text-white">{selectedFunction.callCount.toLocaleString()}</strong>
                </span>
                <button
                  onClick={() => {
                    handleExecuteInternalFunction(selectedFunction);
                    setShowFunctionDrawer(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-lg"
                >
                  Disparar Execução em Tempo Real
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
