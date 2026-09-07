import React, { useState, useEffect, useRef } from 'react';
import { 
  JointState, 
  AutonomousCoreEvolutionState, 
  MemoryVectorRecord, 
  AutonomousThought,
  IntegratedFactoryMachine,
  Pose6DOF,
  Kinematics6DOFSolverState,
  ThoughtAppliedToWorkstation,
  ER2ImaginationFrame,
  ER2InternalFunction
} from '../types';
import { 
  Sliders, 
  Activity, 
  Layers, 
  Cpu, 
  Zap, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Wrench, 
  Gauge, 
  Play, 
  Pause, 
  Target, 
  Compass, 
  ArrowUpRight, 
  Code, 
  HardDrive, 
  Terminal, 
  ShieldCheck, 
  Factory,
  Radio
} from 'lucide-react';

interface ER2Workstation6DOFProps {
  joints: JointState[];
  evolutionState: AutonomousCoreEvolutionState;
  onUpdateEvolutionState: React.Dispatch<React.SetStateAction<AutonomousCoreEvolutionState>>;
  onAddMemoryRecord: (record: MemoryVectorRecord) => void;
  onAddThought: (thought: AutonomousThought) => void;
  memoryRecords: MemoryVectorRecord[];
  isOffline: boolean;
  currentFrame?: ER2ImaginationFrame;
  inventedFunctions?: ER2InternalFunction[];
}

// Lista de máquinas fabris integradas ao posto de trabalho do ER-2
const INITIAL_MACHINES: IntegratedFactoryMachine[] = [
  {
    id: 'MACH-CNC-5AXIS',
    type: 'CNC_5_AXIS_MILL',
    name: 'Centro de Microusinagem CNC 5-Eixos Ultra-Precision',
    status: 'ONLINE_SINCRONIZADO',
    ipAddress: '192.168.10.101',
    protocol: 'OPC_UA',
    currentTool: 'Fresa Toroidal Diamantada Ø1.5mm',
    feedRateMmSec: 120,
    spindleRpm: 24000,
    powerKw: 4.8,
    activeCycleTimeSec: 42,
    efficiencyRating: 99.4,
    telemetryLog: [
      'Conexão OPC UA estabelecida com sucesso.',
      'Calibração de offset de ferramenta TCP validada (±0.0008mm).',
      'Aguardando interpolação cinemática 6-DOF do ER-2.'
    ]
  },
  {
    id: 'MACH-LASER-WELD',
    type: 'FIBER_LASER_WELDER',
    name: 'Célula de Soldagem Laser Fibrada 1070nm (Titânio/Inconel)',
    status: 'ONLINE_SINCRONIZADO',
    ipAddress: '192.168.10.102',
    protocol: 'ETHERCAT',
    currentTool: 'Cabeçote Óptico Laser 2000W c/ Gás Argônio',
    feedRateMmSec: 45,
    powerKw: 2.0,
    activeCycleTimeSec: 28,
    efficiencyRating: 99.8,
    telemetryLog: [
      'Feixe laser sincronizado via barramento EtherCAT a 1kHz.',
      'Temperatura da câmara de gás estável a 21.4°C.',
      'Trajetória de costura térmica pronta para disparo.'
    ]
  },
  {
    id: 'MACH-SCAN-3D',
    type: 'PHOTONIC_3D_SCANNER',
    name: 'Scanner Fotônico 3D e Metrologia Dimensional Óptica',
    status: 'ONLINE_SINCRONIZADO',
    ipAddress: '192.168.10.103',
    protocol: 'PROFINET',
    currentTool: 'Câmera Térmica & Projetor de Franjas Azuis 405nm',
    feedRateMmSec: 200,
    activeCycleTimeSec: 15,
    efficiencyRating: 99.9,
    telemetryLog: [
      'Nuvem de pontos 3D calibrada com resolução de 0.5 µm.',
      'Inspeção dimensional em malha fechada ativa.'
    ]
  },
  {
    id: 'MACH-SMD-DISPENSER',
    type: 'MICRO_DISPENSER_SMD',
    name: 'Dispensador Piezoelétrico de Epóxi & Micro-SMD',
    status: 'AGUARDANDO_TRAJETORIA',
    ipAddress: '192.168.10.104',
    protocol: 'MODBUS_TCP',
    currentTool: 'Bico Dosador Sub-Milimétrico 0.12mm',
    feedRateMmSec: 80,
    activeCycleTimeSec: 35,
    efficiencyRating: 98.9,
    telemetryLog: [
      'Viscosidade do polímero condutivo equalizada.',
      'Aguardando coordenadas de dispensação SMD.'
    ]
  }
];

export const ER2Workstation6DOF: React.FC<ER2Workstation6DOFProps> = ({
  joints,
  evolutionState,
  onUpdateEvolutionState,
  onAddMemoryRecord,
  onAddThought,
  memoryRecords,
  isOffline,
  currentFrame,
  inventedFunctions = []
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [machines, setMachines] = useState<IntegratedFactoryMachine[]>(INITIAL_MACHINES);
  const [selectedMachineId, setSelectedMachineId] = useState<string>('MACH-CNC-5AXIS');
  const [activeEndEffectorTool, setActiveEndEffectorTool] = useState<string>('Garra Paralela Adaptativa');
  
  // Estado do Solucionador Cinemático 6-DOF
  const [solverState, setSolverState] = useState<Kinematics6DOFSolverState>({
    currentPose: { x: 380.5, y: 120.2, z: 450.0, roll: 0.0, pitch: 45.0, yaw: 15.0 },
    targetPose: { x: 420.0, y: 180.0, z: 410.0, roll: 0.0, pitch: 30.0, yaw: 0.0 },
    jointAnglesRad: [0.26, 0.45, -0.62, 0.0, 0.78, 0.15],
    jointVelocitiesRadS: [0.05, 0.08, -0.04, 0.0, 0.12, 0.03],
    jointTorquesNm: [14.2, 28.6, 19.4, 6.2, 4.8, 1.9],
    tcpVelocityMmS: 185.4,
    tcpAccelerationMmS2: 620.0,
    manipulabilityIndex: 0.892,
    singularityDistance: 0.94,
    positionalErrorMm: 0.0018,
    orientationErrorDeg: 0.024,
    ikSolverIterations: 4,
    ikStatus: 'SOLUCAO_EXATA'
  });

  // Histórico de Pensamentos e Imagens Aplicados na Cinemática e Máquinas
  const [appliedActions, setAppliedActions] = useState<ThoughtAppliedToWorkstation[]>([
    {
      id: 'ACT-INIT-01',
      timestamp: '14:30:12',
      sourceThought: 'Otimização de rugosidade superficial em titânio Ti-6Al-4V via compensação de torque estocástico.',
      appliedFunction: 'compensateStochasticGravityTorque()',
      targetMachine: 'Centro de Microusinagem CNC 5-Eixos',
      trajectoryPattern: 'ESPIRAL_ARQUIMEDIANA',
      generatedGCodeSnippet: 'G90 G21 G17\nG01 X420.500 Y180.250 Z410.000 F180\nG02 X425.000 Y185.000 I4.500 J0.000 F120\nM03 S24000',
      precisionGainRecordedMm: 0.0032,
      efficiencyBoostPct: 18.5,
      status: 'CONCLUIDO_COM_SUCESSO'
    }
  ]);

  // Modo autônomo contínuo de auto-aplicação no posto
  const [autoApplyLoopActive, setAutoApplyLoopActive] = useState<boolean>(true);
  const [gcodeStream, setGcodeStream] = useState<string[]>([]);
  const [workpieceMaterial, setWorkpieceMaterial] = useState<'TITANIO_GR5' | 'INCONEL_718' | 'SILICIO_QUÂNTICO' | 'POLIMERO_PEEK'>('TITANIO_GR5');

  // Níveis de maestria nas 6 habilidades fabris do robô
  const [skillsMatrix, setSkillsMatrix] = useState({
    hsmMilling: 94.6,
    laserWelding: 96.2,
    smdAssembly: 91.8,
    opticalInspection: 98.4,
    singularityAvoidance: 97.5,
    thermalEquilibrium: 95.1
  });

  // Função para aplicar um pensamento/imagem na cinemática do posto de trabalho
  const handleApplyThoughtToWorkstation = (customThoughtText?: string, customFunction?: string) => {
    const timeStr = new Date().toLocaleTimeString('pt-BR');
    const selectedMach = machines.find((m) => m.id === selectedMachineId) || machines[0];
    const randSeed = Math.floor(Math.random() * 9000) + 1000;

    const thoughtText = customThoughtText || (
      currentFrame?.promptSynthesis || 
      'Aplicação de interpolação esférica SLERP e controle de velocidade contínua para acabamento espelhado sub-micrométrico.'
    );

    const fnName = customFunction || (
      inventedFunctions[0]?.name || 
      'refineMicroActuatorSlerp()'
    );

    const trajectories = [
      'ESPIRAL_ARQUIMEDIANA',
      'NURBS_SUPERFICIE',
      'INTERPOLACAO_CIRCULAR',
      'RASTREIO_FOTONICO_2D'
    ] as const;
    const chosenPattern = trajectories[randSeed % trajectories.length];

    const targetX = Number((350 + (Math.random() * 180 - 90)).toFixed(3));
    const targetY = Number((150 + (Math.random() * 160 - 80)).toFixed(3));
    const targetZ = Number((420 + (Math.random() * 100 - 50)).toFixed(3));
    const targetRoll = Number(((Math.random() - 0.5) * 40).toFixed(2));
    const targetPitch = Number((30 + (Math.random() - 0.5) * 30).toFixed(2));
    const targetYaw = Number(((Math.random() - 0.5) * 60).toFixed(2));

    const generatedGCode = [
      `; --- PROGRAMA GERADO PELO CÉREBRO ER-2 ---`,
      `; Data: ${timeStr} | Padrão: ${chosenPattern}`,
      `G90 G21 G94 G17 G64`,
      `G00 X${targetX} Y${targetY} Z${targetZ + 20} A${targetRoll} B${targetPitch} C${targetYaw}`,
      `G01 Z${targetZ} F${selectedMach.feedRateMmSec * 60}`,
      chosenPattern === 'INTERPOLACAO_CIRCULAR' 
        ? `G02 X${(targetX + 15).toFixed(3)} Y${(targetY + 15).toFixed(3)} R15.000 F${selectedMach.feedRateMmSec * 45}` 
        : `G01 X${(targetX + 22).toFixed(3)} Y${(targetY + 18).toFixed(3)} F${selectedMach.feedRateMmSec * 60}`,
      `M08 ; Fluido de corte e gás inerte ativados`,
      `M05 M09`,
      `G00 Z${targetZ + 50}`,
      `; --- FIM DO BLOCO CINEMÁTICO ER-2 ---`
    ].join('\n');

    const newAction: ThoughtAppliedToWorkstation = {
      id: `ACT-6DOF-${Date.now()}-${randSeed}`,
      timestamp: timeStr,
      sourceThought: thoughtText,
      appliedFunction: fnName,
      targetMachine: selectedMach.name,
      trajectoryPattern: chosenPattern,
      generatedGCodeSnippet: generatedGCode,
      precisionGainRecordedMm: Number((0.0020 + Math.random() * 0.0025).toFixed(4)),
      efficiencyBoostPct: Number((12.0 + Math.random() * 14.0).toFixed(1)),
      status: 'CONCLUIDO_COM_SUCESSO'
    };

    setAppliedActions((prev) => [newAction, ...prev.slice(0, 19)]);
    setGcodeStream(generatedGCode.split('\n'));

    // Atualiza pose e cinemática 6-DOF
    setSolverState((prev) => ({
      ...prev,
      targetPose: { x: targetX, y: targetY, z: targetZ, roll: targetRoll, pitch: targetPitch, yaw: targetYaw },
      currentPose: {
        x: Number((prev.currentPose.x * 0.4 + targetX * 0.6).toFixed(3)),
        y: Number((prev.currentPose.y * 0.4 + targetY * 0.6).toFixed(3)),
        z: Number((prev.currentPose.z * 0.4 + targetZ * 0.6).toFixed(3)),
        roll: targetRoll,
        pitch: targetPitch,
        yaw: targetYaw
      },
      manipulabilityIndex: Math.min(0.995, Number((prev.manipulabilityIndex + 0.004).toFixed(3))),
      positionalErrorMm: Number((Math.random() * 0.0012 + 0.0006).toFixed(4)),
      singularityDistance: 0.96
    }));

    // Incrementa habilidades fabris
    setSkillsMatrix((prev) => ({
      hsmMilling: Math.min(99.9, Number((prev.hsmMilling + 0.12).toFixed(1))),
      laserWelding: Math.min(99.9, Number((prev.laserWelding + 0.14).toFixed(1))),
      smdAssembly: Math.min(99.9, Number((prev.smdAssembly + 0.15).toFixed(1))),
      opticalInspection: Math.min(99.9, Number((prev.opticalInspection + 0.08).toFixed(1))),
      singularityAvoidance: Math.min(99.9, Number((prev.singularityAvoidance + 0.10).toFixed(1))),
      thermalEquilibrium: Math.min(99.9, Number((prev.thermalEquilibrium + 0.11).toFixed(1)))
    }));

    // Registra na Memória Quântica do Núcleo
    const memRec: MemoryVectorRecord = {
      id: `MEM-6DOF-${Date.now()}`,
      timestamp: timeStr,
      type: 'KINEMATIC_CALIBRATION',
      title: `Cinemática 6-DOF Aplicada: ${selectedMach.name}`,
      accuracyDelta: `+${newAction.precisionGainRecordedMm} mm`,
      cycleTimeDelta: `-${(newAction.efficiencyBoostPct * 0.8).toFixed(1)} ms`,
      sourceType: 'POSTO_FABRIL_6DOF',
      description: `O robô ER-2 aplicou o pensamento "${thoughtText.slice(0, 60)}..." na máquina ${selectedMach.name}, gerando trajetória ${chosenPattern} e G-Code validado.`,
      synced: true
    };
    onAddMemoryRecord(memRec);

    // Emite pensamento autônomo
    onAddThought({
      id: `THOUGHT-WORKSTATION-${Date.now()}`,
      timestamp: timeStr,
      type: 'MOTOR_CALIBRATION',
      thought: `[Posto 6-DOF] Executei trajetória ${chosenPattern} com a máquina ${selectedMach.name}. Ganho de precisão de +${newAction.precisionGainRecordedMm}mm em material ${workpieceMaterial}.`,
      confidence: 99.8,
      wisdomGain: 1.2
    });

    // Atualiza cérebro e evolução
    onUpdateEvolutionState((prev) => ({
      ...prev,
      knowledgeNodesIngested: prev.knowledgeNodesIngested + 1,
      neuralWeightsUpdated: prev.neuralWeightsUpdated + 140,
      cognitiveIndexScore: Math.min(1000, Number((prev.cognitiveIndexScore + 0.85).toFixed(2))),
      overallAccuracyRating: Math.min(99.999, Number((prev.overallAccuracyRating + 0.0014).toFixed(4))),
      activeSynthesisFocus: `Posto 6-DOF: ${selectedMach.name} (${chosenPattern})`
    }));
  };

  // Loop de auto-aplicação autônoma periódica
  useEffect(() => {
    if (!autoApplyLoopActive) return;

    const interval = setInterval(() => {
      handleApplyThoughtToWorkstation();
    }, 7500);

    return () => clearInterval(interval);
  }, [autoApplyLoopActive, selectedMachineId, currentFrame, inventedFunctions, workpieceMaterial]);

  // Renderização 2D/3D no Canvas do Posto de Trabalho e Braço 6-DOF
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const renderScene = () => {
      tick++;
      const w = canvas.width;
      const h = canvas.height;

      // Fundo escuro com grid cibernético industrial
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      // Grid Isométrico de Fábrica
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 28;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Mesa de Trabalho & Posto de Usinagem
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(40, h - 140, w - 80, 110, 12);
      ctx.fill();
      ctx.stroke();

      // Placa de Fixação / Peça de Trabalho
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(w / 2 - 120, h - 120, 240, 70, 8);
      ctx.fill();
      ctx.stroke();

      // Rótulo da Peça
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(`MATERIAL ATIVO: ${workpieceMaterial} | FIXAÇÃO PNEUMÁTICA 6.2 BAR`, w / 2 - 110, h - 98);
      ctx.fillText(`COORD CARTESIANAS TCP: X:${solverState.currentPose.x.toFixed(1)} Y:${solverState.currentPose.y.toFixed(1)} Z:${solverState.currentPose.z.toFixed(1)}`, w / 2 - 110, h - 80);

      // Base do Robô ER-2 (J1)
      const baseX = w / 2;
      const baseY = h - 140;

      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(baseX, baseY, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();

      // Cinemática Direta Simplificada das 6 Juntas para o Canvas
      const q1 = solverState.jointAnglesRad[0] + Math.sin(tick * 0.03) * 0.1;
      const q2 = solverState.jointAnglesRad[1] + Math.cos(tick * 0.02) * 0.08;
      const q3 = solverState.jointAnglesRad[2] + Math.sin(tick * 0.025) * 0.06;
      const q4 = solverState.jointAnglesRad[3];
      const q5 = solverState.jointAnglesRad[4];
      const q6 = solverState.jointAnglesRad[5];

      // Link 1 (Ombro / J2)
      const l1 = 85;
      const j2X = baseX + Math.sin(q1) * 30;
      const j2Y = baseY - 50;

      // Link 2 (Braço / Cotovelo J3)
      const l2 = 110;
      const j3X = j2X + Math.cos(q2) * l2;
      const j3Y = j2Y - Math.sin(q2) * l2;

      // Link 3 (Antebraço / Pulso 1 J4)
      const l3 = 95;
      const j4X = j3X + Math.cos(q2 + q3) * l3;
      const j4Y = j3Y - Math.sin(q2 + q3) * l3;

      // Link 4/5 (Pulso 2 J5)
      const l4 = 40;
      const j5X = j4X + Math.cos(q2 + q3 + q4) * l4;
      const j5Y = j4Y - Math.sin(q2 + q3 + q4) * l4;

      // TCP Flange (J6 + Ferramenta Ativa)
      const l5 = 35;
      const tcpX = j5X + Math.cos(q2 + q3 + q4 + q5) * l5;
      const tcpY = j5Y - Math.sin(q2 + q3 + q4 + q5) * l5;

      // Desenho dos Segmentos do Braço com Efeito Glow
      const drawSegment = (x1: number, y1: number, x2: number, y2: number, color: string, width: number) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      };

      // Desenho dos Links com Gradientes
      drawSegment(baseX, baseY, j2X, j2Y, '#0284c7', 16);
      drawSegment(j2X, j2Y, j3X, j3Y, '#0ea5e9', 12);
      drawSegment(j3X, j3Y, j4X, j4Y, '#38bdf8', 10);
      drawSegment(j4X, j4Y, j5X, j5Y, '#7dd3fc', 8);
      drawSegment(j5X, j5Y, tcpX, tcpY, '#f43f5e', 6);

      // Juntas Esféricas (J1 a J6)
      const drawJoint = (x: number, y: number, name: string, color: string) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(name, x + 9, y + 3);
      };

      drawJoint(baseX, baseY, 'J1', '#0369a1');
      drawJoint(j2X, j2Y, 'J2', '#0284c7');
      drawJoint(j3X, j3Y, 'J3', '#0ea5e9');
      drawJoint(j4X, j4Y, 'J4', '#38bdf8');
      drawJoint(j5X, j5Y, 'J5', '#a855f7');
      drawJoint(tcpX, tcpY, `TCP (${activeEndEffectorTool})`, '#f43f5e');

      // Feixe Laser / Efeito de Usinagem saindo do TCP
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tcpX, tcpY);
      ctx.lineTo(w / 2 - 20 + Math.sin(tick * 0.1) * 30, h - 85);
      ctx.stroke();

      // Faíscas Estocásticas no Ponto de Contato
      const sparkX = w / 2 - 20 + Math.sin(tick * 0.1) * 30;
      const sparkY = h - 85;
      for (let s = 0; s < 5; s++) {
        ctx.fillStyle = s % 2 === 0 ? '#fde047' : '#f43f5e';
        ctx.beginPath();
        ctx.arc(
          sparkX + (Math.random() - 0.5) * 16,
          sparkY + (Math.random() - 0.5) * 12,
          1.5 + Math.random() * 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // Trajetória do Pensamento Projetada no Espaço (Holograma Ciano)
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let t = 0; t < Math.PI * 2; t += 0.2) {
        const r = 25 + t * 4;
        const px = w / 2 - 20 + Math.cos(t + tick * 0.05) * r;
        const py = h - 85 + Math.sin(t + tick * 0.05) * (r * 0.4);
        if (t === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      animId = requestAnimationFrame(renderScene);
    };

    renderScene();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [solverState, activeEndEffectorTool, workpieceMaterial]);

  const selectedMachine = machines.find((m) => m.id === selectedMachineId) || machines[0];

  return (
    <div className="space-y-4 font-sans text-slate-100">
      {/* Top Banner: Posto de Trabalho 6-DOF & Hub Fabril Integrado */}
      <div className="bg-slate-950/95 border border-cyan-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-rose-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/30">
            <Factory className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white tracking-wide uppercase">
                Posto de Trabalho Cinemática 6-DOF & Hub de Máquinas
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
                IK/FK Sincronizado a 1kHz
              </span>
            </div>
            <p className="text-xs text-slate-400">
              O ER-2 projeta seus pensamentos e fotogramas gerados diretamente na cinemática das 6 juntas, comanda centros CNC, solda laser e inspeção óptica com precisão sub-micrométrica.
            </p>
          </div>
        </div>

        {/* Controles Globais do Posto */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Alternador de Auto-Aplicação Contínua */}
          <button
            id="btn-toggle-auto-workstation-loop"
            onClick={() => setAutoApplyLoopActive(!autoApplyLoopActive)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 shadow-sm ${
              autoApplyLoopActive
                ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-slate-950 border-emerald-300 shadow-emerald-500/20 font-black'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {autoApplyLoopActive ? <Pause className="w-4 h-4 text-slate-950" /> : <Play className="w-4 h-4 text-emerald-400" />}
            <span>{autoApplyLoopActive ? 'Auto-Aplicação de Pensamentos: LIGADA' : 'Auto-Aplicação Pausada'}</span>
          </button>

          {/* Botão de Disparo Manual Imediato */}
          <button
            id="btn-force-apply-thought-now"
            onClick={() => handleApplyThoughtToWorkstation()}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-rose-600 hover:opacity-95 text-white text-xs font-black transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Aplicar Pensamento & Imagem Agora</span>
          </button>
        </div>
      </div>

      {/* Grid Principal: Visualizador 3D/2D da Cinemática 6-DOF + Telemetria de Juntas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Coluna 1 & 2: Canvas Interativo do Posto Fabril + Seleção de Ferramenta e Material */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Visualização Cinemática do Posto de Trabalho
                </h3>
              </div>

              {/* Seletor de Ferramenta Efetuadora */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400 text-[11px]">Ferramenta TCP:</span>
                <select
                  value={activeEndEffectorTool}
                  onChange={(e) => setActiveEndEffectorTool(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-cyan-300 text-xs rounded-lg px-2.5 py-1 outline-none font-bold"
                >
                  <option value="Garra Paralela Adaptativa">Garra Paralela Adaptativa (Preensão)</option>
                  <option value="Fuso CNC 24k RPM">Fuso de Microusinagem 24.000 RPM</option>
                  <option value="Cabeçote Laser 1070nm">Cabeçote Laser Fibrado 2000W</option>
                  <option value="Sonda Fotônica 3D">Sonda de Metrologia Fotônica</option>
                  <option value="Dispensador Epóxi SMD">Dispensador Piezo SMD 0.12mm</option>
                </select>
              </div>

              {/* Seletor de Material da Peça */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400 text-[11px]">Material:</span>
                <select
                  value={workpieceMaterial}
                  onChange={(e) => setWorkpieceMaterial(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-rose-300 text-xs rounded-lg px-2.5 py-1 outline-none font-bold"
                >
                  <option value="TITANIO_GR5">Titânio Grau 5 (Ti-6Al-4V)</option>
                  <option value="INCONEL_718">Superliga Inconel 718</option>
                  <option value="SILICIO_QUÂNTICO">Wafer Silício Quântico 300mm</option>
                  <option value="POLIMERO_PEEK">Polímero Termoplástico PEEK</option>
                </select>
              </div>
            </div>

            {/* Canvas de Renderização em Tempo Real */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black">
              <canvas
                ref={canvasRef}
                width={720}
                height={320}
                className="w-full h-72 object-cover block"
              />

              {/* Overlay de Status do Solucionador IK */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                <div className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold backdrop-blur-sm">
                  Índice de Yoshikawa: {solverState.manipulabilityIndex.toFixed(3)} (Ótimo)
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold backdrop-blur-sm">
                  Erro Posicional: {solverState.positionalErrorMm.toFixed(4)} mm
                </div>
              </div>
            </div>

            {/* Barra de Coordenadas 6-DOF (X, Y, Z, Roll, Pitch, Yaw) */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center font-mono">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">X (mm)</div>
                <div className="text-xs font-bold text-cyan-300">{solverState.currentPose.x.toFixed(1)}</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Y (mm)</div>
                <div className="text-xs font-bold text-cyan-300">{solverState.currentPose.y.toFixed(1)}</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Z (mm)</div>
                <div className="text-xs font-bold text-cyan-300">{solverState.currentPose.z.toFixed(1)}</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Roll (°)</div>
                <div className="text-xs font-bold text-purple-300">{solverState.currentPose.roll.toFixed(1)}°</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Pitch (°)</div>
                <div className="text-xs font-bold text-purple-300">{solverState.currentPose.pitch.toFixed(1)}°</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Yaw (°)</div>
                <div className="text-xs font-bold text-purple-300">{solverState.currentPose.yaw.toFixed(1)}°</div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 3: Matriz de Habilidades Fabris & Máquinas Integradas */}
        <div className="space-y-3">
          {/* Matriz de Habilidades Fabris Auto-Aperfeiçoadas */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Maestria Fabril do ER-2
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 font-bold">
                Nível: Hiper-Especialista
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Microusinagem HSM:</span>
                  <span className="text-cyan-300 font-bold">{skillsMatrix.hsmMilling.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full transition-all duration-500" style={{ width: `${skillsMatrix.hsmMilling}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Soldagem Laser Fibrada:</span>
                  <span className="text-rose-400 font-bold">{skillsMatrix.laserWelding.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${skillsMatrix.laserWelding}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Montagem Micro-SMD:</span>
                  <span className="text-purple-400 font-bold">{skillsMatrix.smdAssembly.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${skillsMatrix.smdAssembly}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Metrologia Dimensional Óptica:</span>
                  <span className="text-emerald-400 font-bold">{skillsMatrix.opticalInspection.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${skillsMatrix.opticalInspection}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Desvio de Singularidades:</span>
                  <span className="text-amber-400 font-bold">{skillsMatrix.singularityAvoidance.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${skillsMatrix.singularityAvoidance}%` }} />
                </div>
              </div>
            </div>
          </div>

            {/* Máquinas Integradas com Seleção */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Máquinas Industriais Conectadas
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-cyan-300">
                  {machines.length} online
                </span>
              </div>

              <div className="space-y-2">
                {machines.map((mach) => (
                  <button
                    key={mach.id}
                    onClick={() => setSelectedMachineId(mach.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                      selectedMachineId === mach.id
                        ? 'bg-cyan-950/70 border-cyan-500 text-white shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold truncate max-w-[200px]">{mach.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {mach.protocol} | IP: {mach.ipAddress} | Eficiência: {mach.efficiencyRating}%
                      </div>
                    </div>
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${selectedMachineId === mach.id ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </button>
                ))}
              </div>
            </div>
        </div>
      </div>

      {/* Bloco Inferior: Feed de Ações Aplicadas pelo Cérebro + Gerador de G-Code em Tempo Real */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Histórico de Pensamentos Aplicados na Cinemática e Máquinas */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Pensamentos e Imagens Aplicados no Posto Fabril
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {appliedActions.length} ações executadas
            </span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
            {appliedActions.map((act, idx) => (
              <div 
                key={`${act.id}-${idx}`}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs font-mono"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-cyan-300 font-bold">{act.targetMachine}</span>
                  <span className="text-slate-500">{act.timestamp}</span>
                </div>
                <p className="text-slate-200 font-sans text-xs">
                  "{act.sourceThought}"
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                  <span className="text-purple-300">Padrão: {act.trajectoryPattern}</span>
                  <span className="text-emerald-400 font-bold">
                    Ganho: +{act.precisionGainRecordedMm} mm | +{act.efficiencyBoostPct}% eficiênc.
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Console de G-Code & Interpolação Linear 6-DOF */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                G-Code & Diretivas de Máquina Geradas pelo Cérebro ER-2
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              Status: BUFFER PRONTO
            </span>
          </div>

          <pre className="text-[10px] font-mono text-emerald-300 bg-black/90 p-3 rounded-xl border border-slate-800 h-64 overflow-y-auto leading-relaxed scrollbar-thin">
            {gcodeStream.length > 0 ? (
              gcodeStream.map((line, idx) => (
                <div key={idx} className={line.startsWith(';') ? 'text-slate-500' : 'text-emerald-400'}>
                  {line}
                </div>
              ))
            ) : (
              <div className="text-slate-500">
                ; Nenhum código G-Code gerado recentemente.
                ; Clique em "Aplicar Pensamento & Imagem Agora" para compilar uma trajetória 6-DOF.
              </div>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};
