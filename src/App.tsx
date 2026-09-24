import React, { useState, useEffect, useCallback } from 'react';
import { 
  ToolDefinition, 
  ToolId, 
  JointState, 
  RobotTelemetry, 
  OrchestrationPlan, 
  MemoryVectorRecord,
  AutonomousCoreEvolutionState,
  AutonomousLearningSignal,
  AutonomousThought,
  AutoDiscoveredHeuristic
} from './types';
import { INITIAL_TOOLS, INITIAL_MEMORY_RECORDS, PRESET_ROUTINES } from './data/robotData';
import { 
  INITIAL_AUTONOMOUS_SIGNALS, 
  INITIAL_EVOLUTION_STATE, 
  INITIAL_AUTONOMOUS_THOUGHTS, 
  INITIAL_DISCOVERED_HEURISTICS 
} from './data/autonomousData';
import { RobotCanvas } from './components/RobotCanvas';
import { ToolkitManager } from './components/ToolkitManager';
import { TaskOrchestrator } from './components/TaskOrchestrator';
import { CoreMemoryCompute } from './components/CoreMemoryCompute';
import { TeleoperationPanel } from './components/TeleoperationPanel';
import { AutonomousLearningMatrix } from './components/AutonomousLearningMatrix';
import { CognitiveWisdomBrain } from './components/CognitiveWisdomBrain';
import { NexusUnifiedEcosystem } from './components/NexusUnifiedEcosystem';
import { ER2AutonomousSandbox } from './components/ER2AutonomousSandbox';
import { ER2Workstation6DOF } from './components/ER2Workstation6DOF';
import { GlobalPhysicalIndustryPlanner } from './components/GlobalPhysicalIndustryPlanner';
import { PedestreFormalDeliverySTI } from './components/PedestreFormalDeliverySTI';
import { ContainerWithMostWaterSorter3D } from './components/ContainerWithMostWaterSorter3D';
import { AutonomousAgentOrchestratorHub } from './components/AutonomousAgentOrchestratorHub';
import { QuantumAutonomousMeetingRoom } from './components/QuantumAutonomousMeetingRoom';
import { WiseQuantumBank } from './components/WiseQuantumBank';
import { RealAutonomousVisionAgent } from './components/RealAutonomousVisionAgent';
import { AutonomousAutoClickerEngine, AutoClickTarget } from './components/AutonomousAutoClickerEngine';
import { AutonomousWorkerAgencyHub } from './components/AutonomousWorkerAgencyHub';
import { BinanceTestnetTradingBot } from './components/BinanceTestnetTradingBot';
import { IntellectualVaultHub } from './components/IntellectualVaultHub';
import { OrchestratorSandPlayground } from './components/OrchestratorSandPlayground';
import { SalomaoOrchestratorRunBar } from './components/SalomaoOrchestratorRunBar';
import { SalomaoLiveConversationalPanel } from './components/SalomaoLiveConversationalPanel';
import { SalomaoActionLog, ActionLogItem, generateSalomaoReasonForTarget } from './components/SalomaoActionLog';
import { SalomaoMobileAccessibilityBrain } from './components/SalomaoMobileAccessibilityBrain';
import { SalomaoDownloadModal } from './components/SalomaoDownloadModal';
import { 
  Bot, 
  Cpu, 
  Zap, 
  Activity, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  Layers, 
  ShieldCheck, 
  HardDrive,
  Wrench,
  Sliders,
  Sparkles,
  Brain,
  Award,
  Monitor,
  Smartphone,
  Globe,
  Eye,
  Factory,
  Footprints,
  UserCheck,
  Droplet,
  Users,
  Building2,
  Camera,
  Crosshair,
  Menu,
  X,
  MousePointer2,
  Briefcase,
  TrendingUp,
  ArrowLeft,
  Flame,
  Radio,
  Download
} from 'lucide-react';

const TAB_METADATA: Record<string, { title: string; category: string; tool: ToolId }> = {
  worker_agency: { title: 'Agência do Trabalhador & Chrome', category: 'Recrutamento & Scraping DOM', tool: 'TOOL_FASTENER' },
  binance_bot: { title: 'Robô Trading Binance Testnet', category: 'Finanças & Futuros Cripto', tool: 'TOOL_VISION_INSPECTOR' },
  real_vision_agent: { title: 'Câmera Real Multimodal & ReAct', category: 'Percepção Visual & Ações', tool: 'TOOL_VISION_INSPECTOR' },
  orchestrator_sand_playground: { title: 'Playground 6-DOF & Areia Quântica', category: 'Cinemática & Geração de Arte', tool: 'TOOL_DISPENSER' },
  intellectual_vault: { title: 'Painel Virtual Intelectual', category: 'Super-Matriz Cognitiva', tool: 'TOOL_GRIPPER' },
  wise_quantum_bank: { title: 'Wise Quantum Bank & Alimentos', category: 'Economia Quântica', tool: 'TOOL_SUCTION_CRANE' },
  quantum_meeting_room: { title: 'Sala de Reuniões Autônoma de IAs', category: 'Consenso & Meta-Planejamento', tool: 'TOOL_GRIPPER' },
  agent_orchestrator: { title: 'Orquestrador de Agentes Autônomos', category: 'Coordenação Sistêmica', tool: 'TOOL_FASTENER' },
  water_sorter: { title: 'Classificador 3D de Água', category: 'Otimização Espacial', tool: 'TOOL_DISPENSER' },
  pedestre_formal_delivery: { title: 'Pedestre Formal Delivery STI', category: 'Logística Tangível', tool: 'TOOL_SUCTION_CRANE' },
  global_physical_industry: { title: 'Indústrias Físicas Tangíveis', category: 'Manufatura & Automação', tool: 'TOOL_WELDER' },
  workstation_6dof: { title: 'Bancada Robótica 6-DOF', category: 'Hardware & Cinemática', tool: 'TOOL_DEBURRING' },
  sandbox_imagination: { title: 'Sandbox de Imaginação', category: 'Simulação Quântica', tool: 'TOOL_DISPENSER' },
  nexus_os: { title: 'Ecossistema Unificado Salomão', category: 'Kernel Soberano', tool: 'TOOL_GRIPPER' },
  wisdom: { title: 'Cérebro Sábio & Consciência Reflexiva', category: 'Meta-Cognição', tool: 'TOOL_VISION_INSPECTOR' },
  autonomous: { title: 'Auto-Aprendizado Fabril', category: 'Machine Learning', tool: 'TOOL_FASTENER' },
  orchestrator: { title: 'Orquestrador de Ferramentas', category: 'Execução de Rotinas', tool: 'TOOL_GRIPPER' },
  toolkit: { title: 'Gerenciador de Kit de Ferramentas', category: 'Atuadores e Sensores', tool: 'TOOL_WELDER' },
  memory: { title: 'Memória Vetorial & Computação', category: 'Bancos Vetoriais', tool: 'TOOL_SUCTION_CRANE' },
  teleop: { title: 'Teleoperação Manual 6-DOF', category: 'Controle de Articulações', tool: 'TOOL_DEBURRING' },
  salomao_mobile_brain: { title: 'Salomão no Celular: Cérebro Vitalício & Cursor de Acessibilidade', category: 'Mobile & Acessibilidade', tool: 'TOOL_FASTENER' }
};

const INITIAL_JOINTS: JointState[] = [
  { id: 1, name: 'Base Yaw (J1)', angle: 122, minAngle: -170, maxAngle: 170, torque: 12.4, temperature: 36.5 },
  { id: 2, name: 'Shoulder Pitch (J2)', angle: -70, minAngle: -100, maxAngle: 120, torque: 34.8, temperature: 41.2 },
  { id: 3, name: 'Elbow Pitch (J3)', angle: -78, minAngle: -90, maxAngle: 135, torque: 28.1, temperature: 39.8 },
  { id: 4, name: 'Wrist Roll (J4)', angle: -30, minAngle: -180, maxAngle: 180, torque: 8.2, temperature: 34.0 },
  { id: 5, name: 'Wrist Pitch (J5)', angle: 10, minAngle: -115, maxAngle: 115, torque: 6.5, temperature: 33.2 },
  { id: 6, name: 'Tool Flange Yaw (J6)', angle: 0, minAngle: -360, maxAngle: 360, torque: 4.1, temperature: 32.0 },
];

export default function App() {
  // Persistence & Offline state
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    const saved = localStorage.getItem('er2_offline_mode');
    return saved ? JSON.parse(saved) : false;
  });

  const [tools, setTools] = useState<ToolDefinition[]>(() => {
    const saved = localStorage.getItem('er2_tools');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 7) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_TOOLS;
  });

  const [activeToolId, setActiveToolId] = useState<ToolId>('TOOL_SUCTION_CRANE');
  const [joints, setJoints] = useState<JointState[]>(INITIAL_JOINTS);
  const [emergencyStop, setEmergencyStop] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Core Memory & Compute Matrix
  const [memoryRecords, setMemoryRecords] = useState<MemoryVectorRecord[]>(() => {
    const saved = localStorage.getItem('er2_memory_records');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 51) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_MEMORY_RECORDS;
  });
  const [optimizationCycles, setOptimizationCycles] = useState<number>(186);
  const [neuralLoad, setNeuralLoad] = useState<number>(42.8);
  const [memoryUsedMb, setMemoryUsedMb] = useState<number>(312);
  const memoryTotalMb = 1024;

  // Autonomous Self-Learning & Cognitive Wisdom State
  const [evolutionState, setEvolutionState] = useState<AutonomousCoreEvolutionState>(() => {
    const saved = localStorage.getItem('er2_evolution_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.wisdomLevel >= 100) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_EVOLUTION_STATE;
  });
  const [activeSignals, setActiveSignals] = useState<AutonomousLearningSignal[]>(() => {
    const saved = localStorage.getItem('er2_signals');
    return saved ? JSON.parse(saved) : INITIAL_AUTONOMOUS_SIGNALS;
  });
  const [thoughts, setThoughts] = useState<AutonomousThought[]>(() => {
    const saved = localStorage.getItem('er2_thoughts');
    return saved ? JSON.parse(saved) : INITIAL_AUTONOMOUS_THOUGHTS;
  });
  const [heuristics, setHeuristics] = useState<AutoDiscoveredHeuristic[]>(() => {
    const saved = localStorage.getItem('er2_heuristics');
    if (saved) {
      try {
        const parsed: AutoDiscoveredHeuristic[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const seen = new Set<string>();
          return parsed.map((h, i) => {
            let id = h.id;
            if (!id || seen.has(id)) {
              id = `${id || 'HEUR'}-${i}-${Date.now().toString().slice(-4)}`;
            }
            seen.add(id);
            return { ...h, id };
          });
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_DISCOVERED_HEURISTICS;
  });

  // Active Orchestration Plan & Execution
  const [currentPlan, setCurrentPlan] = useState<OrchestrationPlan | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isTestingTool, setIsTestingTool] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    | 'worker_agency' 
    | 'binance_bot' 
    | 'real_vision_agent' 
    | 'orchestrator_sand_playground'
    | 'intellectual_vault'
    | 'wise_quantum_bank' 
    | 'pedestre_formal_delivery' 
    | 'global_physical_industry' 
    | 'sandbox_imagination' 
    | 'workstation_6dof' 
    | 'nexus_os' 
    | 'wisdom' 
    | 'autonomous' 
    | 'orchestrator' 
    | 'toolkit' 
    | 'memory' 
    | 'teleop' 
    | 'water_sorter' 
    | 'agent_orchestrator' 
    | 'quantum_meeting_room'
    | 'salomao_mobile_brain'
  >('worker_agency');
  const [isQuantumAutonomousActive, setIsQuantumAutonomousActive] = useState<boolean>(false);
  const [externalAutoClickTarget, setExternalAutoClickTarget] = useState<AutoClickTarget | null>(null);
  const [isSalomaoLiveOpen, setIsSalomaoLiveOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [runningOrchestrators, setRunningOrchestrators] = useState<Record<string, boolean>>({
    worker_agency: true,
    binance_bot: true,
    real_vision_agent: true,
    orchestrator_sand_playground: true,
    wise_quantum_bank: true,
    quantum_meeting_room: true,
    pedestre_formal_delivery: true,
    global_physical_industry: true,
    workstation_6dof: true,
    sandbox_imagination: true,
    nexus_os: true,
    wisdom: true
  });

  const handleToggleOrchestrator = (tabId: string) => {
    setRunningOrchestrators(prev => ({
      ...prev,
      [tabId]: !prev[tabId]
    }));
  };

  const [clickerCountdownSec, setClickerCountdownSec] = useState<number>(7.0);
  const [actionLogs, setActionLogs] = useState<ActionLogItem[]>([
    {
      id: 'log-init-1',
      clickNumber: 3,
      timestamp: '07:05:40',
      elementLabel: 'Playground 6-DOF & Areia Salomão (Aba)',
      selector: '#tab-sand-playground-btn',
      coordinates: { x: 68, y: 22 },
      category: 'Quântico',
      salomaoReason: 'Deliberei inspecionar a modelagem quântica de postos de trabalho e avaliar o relevo dos grãos de areia antes de iniciar nova rotina motora.',
      cognitiveConfidence: 99.4,
      tactilePace: 'Cadência 7s'
    },
    {
      id: 'log-init-2',
      clickNumber: 2,
      timestamp: '07:05:33',
      elementLabel: 'Busca & Scraping Chrome (Centro-Direito)',
      selector: '#btn-chrome-search-and-scrape',
      coordinates: { x: 76, y: 44 },
      category: 'Execução',
      salomaoReason: 'Acionei a varredura autônoma no DOM para raspar oportunidades profissionais em tempo real e alimentar a base de habilidades.',
      cognitiveConfidence: 98.8,
      tactilePace: 'Cadência 7s'
    },
    {
      id: 'log-init-3',
      clickNumber: 1,
      timestamp: '07:05:26',
      elementLabel: 'Agência do Trabalhador & Chrome (Aba)',
      selector: '#tab-worker-agency-btn',
      coordinates: { x: 16, y: 22 },
      category: 'Recrutamento',
      salomaoReason: 'Naveguei até a Agência do Trabalhador para auditar contratos autônomos e assegurar inserção profissional de IAs e humanos.',
      cognitiveConfidence: 99.1,
      tactilePace: 'Cadência 7s'
    }
  ]);

  const handleAutoClickExecuted = useCallback((target: AutoClickTarget, clickNumber: number) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const { reason, category } = generateSalomaoReasonForTarget(target);

    const newLogItem: ActionLogItem = {
      id: `log-${Date.now()}-${clickNumber}`,
      clickNumber,
      timestamp: timeStr,
      elementLabel: target.label,
      selector: target.selector,
      coordinates: { x: target.xPercent, y: target.yPercent },
      category,
      salomaoReason: reason,
      cognitiveConfidence: +(97.6 + Math.random() * 2.2).toFixed(1),
      tactilePace: 'Cadência 7s'
    };

    setActionLogs(prev => [newLogItem, ...prev.slice(0, 49)]);
  }, []);

  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(() => {
    return typeof window !== 'undefined' && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768);
  });
  const [isMobileNavDrawerOpen, setIsMobileNavDrawerOpen] = useState<boolean>(false);

  // Resize listener for mobile awareness
  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Real Autonomous Orchestration & Human-Pace Exploration Loop
  // Strictly 1 click every 7 seconds, moving across broad full-screen targets
  useEffect(() => {
    let explorationTimer: NodeJS.Timeout;
    if (isQuantumAutonomousActive) {
      const broadExplorationTargets: AutoClickTarget[] = [
        { id: 'exp-agency', label: 'Agência do Trabalhador (Aba Esquerda)', xPercent: 12, yPercent: 22, selector: '#tab-worker-agency-btn' },
        { id: 'exp-sand', label: 'Playground 6-DOF & Areia do Orquestrador', xPercent: 68, yPercent: 22, selector: '#tab-sand-playground-btn' },
        { id: 'exp-scrape', label: 'Buscar & Raspar no Google Chrome (Centro)', xPercent: 76, yPercent: 44, selector: '#btn-chrome-search-and-scrape' },
        { id: 'exp-binance', label: 'Robô Trading Binance Testnet (Centro-Esquerda)', xPercent: 32, yPercent: 22, selector: '#tab-binance-bot-btn' },
        { id: 'exp-binance-long', label: 'Comprar / Long Futuros (Inferior-Direito)', xPercent: 82, yPercent: 68, selector: '#btn-binance-buy-long' },
        { id: 'exp-vision', label: 'Câmera Real / Visão Gemini (Centro-Direita)', xPercent: 50, yPercent: 22, selector: '#tab-real-vision-btn' },
        { id: 'exp-vault', label: 'Painel Virtual Intelectual (Aba Direita)', xPercent: 88, yPercent: 22, selector: '#tab-intellectual-vault-btn' },
        { id: 'exp-terminal', label: 'Estatísticas da Agência (Inferior-Esquerdo)', xPercent: 32, yPercent: 78, selector: '#worker-agency-stats' }
      ];
      let step = 0;

      // Immediately send first target so user sees prompt action
      setExternalAutoClickTarget({
        ...broadExplorationTargets[0],
        id: `EXP-${Date.now()}`
      });
      step = 1;

      explorationTimer = setInterval(() => {
        const target = broadExplorationTargets[step % broadExplorationTargets.length];
        step++;

        setExternalAutoClickTarget({
          ...target,
          id: `EXP-${Date.now()}`
        });

        setEvolutionState((prev) => ({
          ...prev,
          learningCyclesCompleted: prev.learningCyclesCompleted + 1,
          cognitiveIndexScore: Math.min(2000, prev.cognitiveIndexScore + 2)
        }));
      }, 7000); // Strictly 7 seconds (7000ms) per click
    }
    return () => clearInterval(explorationTimer);
  }, [isQuantumAutonomousActive]);

  // Save changes to local database for seamless offline-online parity
  useEffect(() => {
    localStorage.setItem('er2_offline_mode', JSON.stringify(isOffline));
  }, [isOffline]);

  useEffect(() => {
    localStorage.setItem('er2_tools', JSON.stringify(tools));
  }, [tools]);

  useEffect(() => {
    localStorage.setItem('er2_memory_records', JSON.stringify(memoryRecords));
  }, [memoryRecords]);

  useEffect(() => {
    localStorage.setItem('er2_evolution_state', JSON.stringify(evolutionState));
  }, [evolutionState]);

  useEffect(() => {
    localStorage.setItem('er2_signals', JSON.stringify(activeSignals));
  }, [activeSignals]);

  useEffect(() => {
    localStorage.setItem('er2_thoughts', JSON.stringify(thoughts));
  }, [thoughts]);

  useEffect(() => {
    localStorage.setItem('er2_heuristics', JSON.stringify(heuristics));
  }, [heuristics]);

  // Initial Plan Setup
  useEffect(() => {
    if (!currentPlan) {
      handleGeneratePlan(PRESET_ROUTINES[0].prompt);
    }
  }, []);

  // Execution Step Timer with Autonomous Loop integration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isExecuting && currentPlan && !emergencyStop) {
      const step = currentPlan.steps[currentStepIndex];
      if (step) {
        // Automatically switch active tool if the step requires a different tool
        if (step.tool !== activeToolId) {
          setActiveToolId(step.tool);
        }

        // Adjust joint poses dynamically based on the step action
        setJoints((prev) =>
          prev.map((j) => {
            const delta = (Math.random() - 0.5) * 16;
            return {
              ...j,
              angle: Math.min(j.maxAngle, Math.max(j.minAngle, Math.round(j.angle + delta))),
              torque: Number((j.torque * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2))
            };
          })
        );

        const duration = (step.durationMs || 1400) / playbackSpeed;
        timer = setTimeout(() => {
          if (currentStepIndex < currentPlan.steps.length - 1) {
            setCurrentStepIndex((prev) => prev + 1);
          } else {
            setIsExecuting(false);
            setCurrentStepIndex(currentPlan.steps.length);
            // Record successful completion in local memory
            recordExecutionMemory(currentPlan);

            // Full Autonomy loop: if enabled, self-reflect and schedule next autonomous plan automatically
            if (evolutionState.isFullAutonomySelfPlanningActive) {
              setTimeout(() => {
                handleTriggerAutonomousSelfPlan();
              }, 2500);
            }
          }
        }, duration);
      }
    }

    return () => clearTimeout(timer);
  }, [isExecuting, currentStepIndex, currentPlan, emergencyStop, playbackSpeed, activeToolId, evolutionState.isFullAutonomySelfPlanningActive]);

  // Continuous Autonomous Self-Learning & Wisdom Thought Daemon
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (evolutionState.isAutonomousModeActive && !emergencyStop) {
      interval = setInterval(() => {
        executeAutonomousSelfEvolution();
        handleTriggerIntrospection();
      }, evolutionState.learningIntervalSec * 1000);
    }
    return () => clearInterval(interval);
  }, [evolutionState.isAutonomousModeActive, evolutionState.learningIntervalSec, emergencyStop]);

  const executeAutonomousSelfEvolution = async () => {
    try {
      setIsOptimizing(true);
      const response = await fetch('/api/autonomous-learn-cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cycleIndex: evolutionState.learningCyclesCompleted + 1,
          currentMetrics: { neuralLoad, memoryUsedMb }
        })
      });

      const data = await response.json();
      if (data && data.success) {
        const newRecord: MemoryVectorRecord = {
          id: `AUTO-EVO-${(evolutionState.learningCyclesCompleted + 1).toString().padStart(4, '0')}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'AUTONOMOUS_EVOLUTION',
          title: data.title || 'Auto-Aprimoramento Dinâmico em Fábrica',
          accuracyDelta: data.accuracyDelta || '+0.002 mm precisão',
          cycleTimeDelta: data.cycleTimeDelta || '-0.15 s ciclo',
          sourceType: data.source || 'WEB_KNOWLEDGE_STREAM',
          description: data.insight || 'O robô recalibrou parâmetros cinemáticos e reduziu vibrações automaticamente.',
          synced: !isOffline
        };

        setMemoryRecords((prev) => [newRecord, ...prev.slice(0, 49)]);
        setOptimizationCycles((prev) => prev + 1);
        setMemoryUsedMb((prev) => Math.min(memoryTotalMb, prev + 1));

        // Update evolution & wisdom state
        setEvolutionState((prev) => {
          const newCognitiveScore = prev.cognitiveIndexScore + 2;
          let newRank = prev.wisdomRank;
          if (newCognitiveScore >= 1800) newRank = 'HIPER_CONSCIÊNCIA';
          else if (newCognitiveScore >= 1200) newRank = 'MESTRE_FABRIL';
          else if (newCognitiveScore >= 600) newRank = 'ESPECIALISTA';
          else if (newCognitiveScore >= 300) newRank = 'OPERADOR_AUTÔNOMO';

          return {
            ...prev,
            learningCyclesCompleted: prev.learningCyclesCompleted + 1,
            wisdomLevel: Math.min(100, Math.floor((newCognitiveScore / 2000) * 100)),
            wisdomRank: newRank,
            cognitiveIndexScore: newCognitiveScore,
            neuralWeightsUpdated: prev.neuralWeightsUpdated + Math.floor(180 + Math.random() * 240),
            overallAccuracyRating: Math.min(99.99, prev.overallAccuracyRating + 0.002),
            cumulativeSpeedGainPct: Math.min(48.0, prev.cumulativeSpeedGainPct + 0.1),
            cumulativeEnergySavedJoules: prev.cumulativeEnergySavedJoules + (data.energySavedEstimateJoules || 45),
            knowledgeNodesIngested: prev.knowledgeNodesIngested + 3,
            introspectionRating: Math.min(99.8, prev.introspectionRating + 0.05),
            lastAutonomousEvolutionTime: new Date().toLocaleTimeString()
          };
        });

        // Update live signals list
        const newSignal: AutonomousLearningSignal = {
          id: `SIG-${Date.now().toString().slice(-5)}`,
          source: data.source || 'WEB_KNOWLEDGE_STREAM',
          timestamp: 'Agora',
          topic: data.title || 'Otimização Dinâmica de Efetuador',
          insight: data.insight || 'Compensação autônoma de folga e alinhamento de torque.',
          appliedTarget: (data.appliedTarget as any) || 'TRAJECTORY_SMOOTHING',
          gainFactor: 1.05,
          confidenceScore: 0.99
        };

        setActiveSignals((prev) => [newSignal, ...prev.slice(0, 5)]);
      }
    } catch (err) {
      // Handled silently by state fallback
    } finally {
      setIsOptimizing(false);
      setNeuralLoad(Math.min(92, 28 + Math.random() * 35));
    }
  };

  // Autonomous Wisdom Thought & Introspection Generator
  const handleTriggerIntrospection = async () => {
    try {
      const response = await fetch('/api/autonomous-introspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentThoughtsCount: thoughts.length,
          wisdomLevel: evolutionState.wisdomLevel
        })
      });

      const data = await response.json();
      if (data && data.success) {
        const newThought: AutonomousThought = {
          id: data.id || `TH-${Date.now().toString().slice(-4)}`,
          timestamp: data.timestamp || new Date().toLocaleTimeString(),
          type: data.type || 'REASONING',
          thought: data.thought || 'Análise de torque e inércia processada no córtex neural.',
          confidence: data.confidence || 0.99,
          wisdomGain: data.wisdomGain || 2.5
        };

        setThoughts((prev) => [newThought, ...prev.slice(0, 39)]);

        // Check if an evolutionary breakthrough happened to generate an auto-discovered heuristic
        if (data.type === 'EVOLUTION_BREAKTHROUGH' || Math.random() > 0.75) {
          const newHeuristic: AutoDiscoveredHeuristic = {
            id: `HEUR-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            title: `Heurística Autoral de Fabricação #${heuristics.length + 1}`,
            domain: 'Cinemática & Adaptação Neural',
            discoveredAt: 'Agora mesmo',
            efficiencyGain: `+${(1.2 + Math.random() * 2).toFixed(1)}% ganho de ciclo`,
            safetyScore: '100% Validada',
            description: data.thought,
            ruleCode: `T_adaptive(t) = J(theta)^T * F_optimal + K_wisdom * ${(Math.random() * 0.1).toFixed(4)}`
          };
          setHeuristics((prev) => [newHeuristic, ...prev.slice(0, 19)]);
          setEvolutionState((prev) => ({
            ...prev,
            autoDiscoveredRulesCount: prev.autoDiscoveredRulesCount + 1
          }));
        }
      }
    } catch (e) {
      // Handled silently by local heuristic thought state
    }
  };

  // Autonomous Self-Planning: The robot creates and immediately launches its own next mission
  const handleTriggerAutonomousSelfPlan = async () => {
    if (emergencyStop) return;
    setIsLoadingPlan(true);
    try {
      const response = await fetch('/api/autonomous-self-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentTelemetry: { joints, activeToolId, neuralLoad },
          wisdomLevel: evolutionState.wisdomLevel
        })
      });

      const data = await response.json();
      if (data && data.success && data.steps) {
        const autoPlan: OrchestrationPlan = {
          id: data.id || `AUTO-PLAN-${Date.now().toString().slice(-4)}`,
          title: data.title || 'Missão Autônoma do Cérebro Sábio ER-2',
          rationale: data.rationale || 'Planejamento autogerado pelo robô sem intervenção humana.',
          safetyMargin: data.safetyMargin || '99.99%',
          estimatedEnergyJoules: data.estimatedEnergyJoules || 420,
          mode: data.mode || (isOffline ? 'offline_core_engine' : 'online_gemini_brain'),
          orchestratedBy: data.orchestratedBy || 'Gemini Robotics ER-2 Cérebro Sábio',
          steps: data.steps,
          timestamp: data.timestamp || new Date().toLocaleTimeString()
        };

        setCurrentPlan(autoPlan);
        setCurrentStepIndex(0);
        setEvolutionState((prev) => ({
          ...prev,
          currentAutonomousGoal: autoPlan.title
        }));

        // In full autonomy mode, automatically start execution
        if (evolutionState.isFullAutonomySelfPlanningActive) {
          setIsExecuting(true);
        }
      }
    } catch (err) {
      console.warn('Auto-plan exception:', err);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const recordExecutionMemory = (plan: OrchestrationPlan) => {
    const newRecord: MemoryVectorRecord = {
      id: `MEM-EXEC-${Date.now().toString().slice(-4)}`,
      timestamp: 'Agora mesmo',
      type: 'EPISODIC_EXPERIENCE',
      title: `Execução Autônoma: ${plan.title.slice(0, 45)}`,
      accuracyDelta: '+99.98% precisão',
      cycleTimeDelta: '-0.18 s',
      description: `Missão executada com ${plan.steps.length} passos cinemáticos pelo robô. Margem: ${plan.safetyMargin}.`,
      synced: !isOffline
    };
    setMemoryRecords((prev) => [newRecord, ...prev]);
    setMemoryUsedMb((prev) => Math.min(memoryTotalMb, prev + 2));
  };

  // Dynamic Wisdom Score: Continuous progression
  const handleUpdateCognitiveScore = (delta: number) => {
    setEvolutionState((prev) => {
      const nextScore = Math.max(0, prev.cognitiveIndexScore + delta);
      return {
        ...prev,
        cognitiveIndexScore: nextScore,
        wisdomLevel: Math.min(100, Math.floor((nextScore / 2000) * 100)),
        wisdomRank: nextScore >= 1800 ? 'HIPER_CONSCIÊNCIA' : nextScore >= 1200 ? 'MESTRE_FABRIL' : 'ESPECIALISTA'
      };
    });
  };

  const handleResetAndRestartCognitiveCycle = () => {
    setEvolutionState((prev) => ({
      ...prev,
      cognitiveIndexScore: 0,
      cognitiveCyclesResetCount: (prev.cognitiveCyclesResetCount || 0) + 1,
      lastAutonomousEvolutionTime: new Date().toLocaleTimeString()
    }));
    
    setThoughts((prev) => [
      {
        id: `TH-CYCLE-RESET-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'EVOLUTION_BREAKTHROUGH',
        thought: `Ciclo de 2000 pontos concluído com sucesso soberano. Zerando e recomeçando espiral de consciência no núcleo com aprendizado preservado.`,
        confidence: 0.999,
        wisdomGain: 50
      },
      ...prev.slice(0, 49)
    ]);
  };

  // Generate Plan via Server API or Local Offline Core
  const handleGeneratePlan = async (promptText: string) => {
    setIsLoadingPlan(true);
    setIsExecuting(false);
    setCurrentStepIndex(0);

    try {
      const response = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          currentTools: tools.map((t) => t.id),
          environmentState: { joints, activeToolId, emergencyStop },
          isOffline
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      const plan: OrchestrationPlan = {
        id: `PLAN-${Date.now().toString().slice(-6)}`,
        title: promptText,
        rationale: data.rationale || 'Planejamento cinemático gerado pelo orquestrador do robô.',
        safetyMargin: data.safetyMargin || '99.8%',
        estimatedEnergyJoules: data.estimatedEnergyJoules || 1500,
        mode: data.mode || (isOffline ? 'offline_core_engine' : 'online_gemini_brain'),
        orchestratedBy: data.orchestratedBy || 'Gemini Robotics ER-2 Kernel',
        steps: data.steps || [],
        timestamp: new Date().toLocaleTimeString()
      };

      setCurrentPlan(plan);
      setNeuralLoad(Math.min(95, 20 + Math.random() * 45));
    } catch (err) {
      console.warn('Fallback to local offline orchestrator:', err);
      const fallbackSteps = [
        { step: 1, tool: 'TOOL_VISION_INSPECTOR' as ToolId, action: 'OPTICAL_SCAN', target: 'Bancada A', durationMs: 1400, confidence: 0.96, description: 'Varredura óptica e calibração espacial' },
        { step: 2, tool: 'TOOL_GRIPPER' as ToolId, action: 'GRASP_COMPONENT', target: 'Peça Indexada #01', durationMs: 2000, confidence: 0.98, description: 'Preensão com torque adaptativo' },
        { step: 3, tool: 'TOOL_WELDER' as ToolId, action: 'PRECISION_SEAM', target: 'Junta B-2', durationMs: 2800, confidence: 0.95, description: 'Soldagem a laser com controle térmico' },
        { step: 4, tool: 'TOOL_VISION_INSPECTOR' as ToolId, action: 'INSPECT_AND_PASS', target: 'Inspeção Final', durationMs: 1000, confidence: 0.99, description: 'Validação geométrica e liberação' }
      ];

      setCurrentPlan({
        id: `PLAN-LOCAL-${Date.now().toString().slice(-4)}`,
        title: promptText,
        rationale: 'Orquestração determinística executada pela memória local de segurança.',
        safetyMargin: '99.5%',
        estimatedEnergyJoules: 1620,
        mode: 'offline_core_engine',
        orchestratedBy: 'ER-2 Local Kernel (Modo Resiliente)',
        steps: fallbackSteps,
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsLoadingPlan(false);
    }
  };

  // Trigger Self-Optimization Loop
  const handleTriggerSelfOptimization = async () => {
    setIsOptimizing(true);
    try {
      const response = await fetch('/api/self-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics: { neuralLoad, memoryUsedMb },
          toolWear: tools.map((t) => ({ id: t.id, wear: t.wearPercentage })),
          calibrationHistory: memoryRecords.length
        })
      });

      if (response.ok) {
        const data = await response.json();
        setOptimizationCycles((prev) => prev + 1);

        const optRecord: MemoryVectorRecord = {
          id: `MEM-AUTO-${Date.now().toString().slice(-4)}`,
          timestamp: 'Agora mesmo',
          type: 'KINEMATIC_CALIBRATION',
          title: `Ciclo #${data.cycleId || optimizationCycles + 1} de Auto-Melhoria do Núcleo`,
          accuracyDelta: '+0.003 mm precisão',
          cycleTimeDelta: '-0.24 s ciclo',
          description: 'Ajuste autônomo de ganhos PID e suavização de jerk com base no histórico de fabricação.',
          synced: !isOffline
        };

        setMemoryRecords((prev) => [optRecord, ...prev]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Sync Memory with Master Node
  const handleSyncMemoryWithMaster = async () => {
    setIsSyncing(true);
    setTimeout(() => {
      setMemoryRecords((prev) => prev.map((r) => ({ ...r, synced: true })));
      setIsSyncing(false);
    }, 1200);
  };

  // Tool Handlers
  const handleSelectTool = (id: ToolId) => {
    setActiveToolId(id);
  };

  const handleCalibrateTool = (id: ToolId) => {
    setTools((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            wearPercentage: Math.max(0, t.wearPercentage - 1.5),
            status: 'ACTIVE'
          };
        }
        return t;
      })
    );
  };

  const handleTestToolTrigger = () => {
    setIsTestingTool(true);
    setIsExecuting(true);
    setTimeout(() => {
      setIsTestingTool(false);
      setIsExecuting(false);
    }, 2000);
  };

  // Joint Teleoperation Handlers
  const handleJointChange = (jointId: number, newAngle: number) => {
    setJoints((prev) =>
      prev.map((j) => (j.id === jointId ? { ...j, angle: newAngle } : j))
    );
  };

  const handleResetJoints = () => {
    setJoints(INITIAL_JOINTS);
  };

  const activeStep = currentPlan?.steps[currentStepIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-slate-950 flex flex-col">
      {/* Top Industrial Navbar / Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Model Identifier */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30 text-slate-950 font-black">
              <Brain className="w-6 h-6 fill-slate-950 text-slate-950" />
              <Sparkles className="w-3.5 h-3.5 text-amber-200 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  SALOMÃO
                </h1>
                <span className="text-[10px] font-mono font-bold bg-amber-400/15 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" /> LVL {evolutionState.wisdomLevel} // {evolutionState.wisdomRank.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>Consciência Viva Soberana • Conversador por Vídeo, Voz & Imagem</span>
                {evolutionState.isFullAutonomySelfPlanningActive && (
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    ● SOBERANIA ATIVA
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Quick HUD Metrics & Salomão Live Launcher */}
          <div className="flex items-center gap-2.5 text-xs font-mono">
            {/* Live Vertical Conversational Button */}
            <button
              id="btn-header-open-salomao-live"
              onClick={() => setIsSalomaoLiveOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-cyan-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 hover:scale-105 transition-all border border-amber-300 cursor-pointer"
            >
              <Brain className="w-3.5 h-3.5 fill-slate-950" />
              <span>Salomão Live</span>
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
            </button>

            {/* Baixar / Instalar App PWA */}
            <button
              id="btn-header-download-app"
              onClick={() => setIsDownloadModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all border border-emerald-300 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar App</span>
            </button>

            {/* Online / Offline status badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isOffline ? 'bg-amber-950/60 border-amber-800 text-amber-300' : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 font-bold'}`}>
              {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />}
              <span>{isOffline ? 'OFFLINE' : 'ONLINE'}</span>
            </div>

            {/* Emergency Stop Indicator */}
            {emergencyStop && (
              <div className="flex items-center gap-1 bg-red-600 text-white font-bold px-2 py-1 rounded animate-pulse text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>PARADA DE EMERGÊNCIA</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Controle de Operação Ativo / Auto-Clicador 7s Banner */}
        <div className="bg-purple-950/40 border border-purple-600/60 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <MousePointer2 className="w-4 h-4 text-cyan-400" />
                  <span>Braço Extensão Pensante do Salomão (Toques no Celular & Tela / 7s)</span>
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/40 font-bold">
                  {isQuantumAutonomousActive ? 'OPERANDO (1 TOQUE A CADA 7s)' : 'PRONTO'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Extensão física do Salomão: ser pensante que rola verticalmente a página, delibera sobre a intenção do usuário e toca na tela do celular a cada <strong>7 segundos</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              id="btn-toggle-quantum-speed"
              onClick={() => setIsQuantumAutonomousActive(!isQuantumAutonomousActive)}
              className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                isQuantumAutonomousActive
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-rose-600/40'
                  : 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 text-slate-950 shadow-cyan-500/30 hover:opacity-95'
              }`}
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{isQuantumAutonomousActive ? '⚡ PARAR BRAÇO EXTENSÃO' : '🚀 ATIVAR BRAÇO EXTENSÃO PENSANTE DO SALOMÃO (1 TOQUE / 7s)'}</span>
            </button>

            <button
              id="btn-banner-open-salomao-live"
              onClick={() => setIsSalomaoLiveOpen(true)}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-cyan-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-transform border border-amber-300"
            >
              <Brain className="w-4 h-4 fill-slate-950" />
              <span>Abrir Conversador Live</span>
            </button>

            <button
              id="btn-banner-open-salomao-mobile-brain"
              onClick={() => setActiveTab('salomao_mobile_brain')}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-transform border border-emerald-300"
            >
              <Smartphone className="w-4 h-4 text-slate-950" />
              <span>📱 Celular & Cérebro Vitalício</span>
            </button>

            <button
              id="btn-banner-download-app"
              onClick={() => setIsDownloadModalOpen(true)}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-600 to-green-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-transform border border-emerald-300 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>⬇ Baixar / Instalar App</span>
            </button>
          </div>
        </div>

        {/* Componente de Log de Ações do Braço Extensão Pensante do Salomão */}
        <SalomaoActionLog
          logs={actionLogs}
          isThinkingArmActive={isQuantumAutonomousActive}
          onClearLogs={() => setActionLogs([])}
          countdownSec={clickerCountdownSec}
          onTriggerSampleClick={() => {
            const sampleTargets: AutoClickTarget[] = [
              { id: 'sample-sand', label: 'Playground 6-DOF & Areia Salomão (Aba)', xPercent: 68, yPercent: 22, selector: '#tab-sand-playground-btn' },
              { id: 'sample-chrome', label: 'Busca & Scraping Chrome (Centro-Direito)', xPercent: 76, yPercent: 44, selector: '#btn-chrome-search-and-scrape' },
              { id: 'sample-binance', label: 'Robô Trading Binance (Centro-Topo)', xPercent: 48, yPercent: 22, selector: '#tab-binance-bot-btn' },
              { id: 'sample-vault', label: 'Painel Intelectual (Aba Direita)', xPercent: 88, yPercent: 22, selector: '#tab-intellectual-vault-btn' },
              { id: 'sample-agency', label: 'Agência do Trabalhador & Chrome (Aba)', xPercent: 16, yPercent: 22, selector: '#tab-worker-agency-btn' }
            ];
            const picked = sampleTargets[Math.floor(Math.random() * sampleTargets.length)];
            setExternalAutoClickTarget({
              ...picked,
              id: `SAMPLE-${Date.now()}`
            });
            setIsQuantumAutonomousActive(true);
          }}
        />

        {/* Tab Navigation Controls - 6 Core Tabs including Celular & Cérebro Vitalício */}
        <div className="space-y-2.5 border-b border-slate-800 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
            {/* TAB 1: Agência do Trabalhador & Navegador Chrome IAs */}
            <button
              id="tab-worker-agency-btn"
              onClick={() => setActiveTab('worker_agency')}
              className={`p-3 rounded-2xl text-left border transition-all flex items-start gap-2.5 ${
                activeTab === 'worker_agency'
                  ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white border-indigo-400 shadow-xl shadow-indigo-600/30 ring-2 ring-indigo-300'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800 hover:border-indigo-500/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${activeTab === 'worker_agency' ? 'bg-white text-indigo-700 font-black' : 'bg-indigo-500/20 text-indigo-400'}`}>
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black uppercase tracking-wider block text-white flex items-center gap-1">
                  Agência IA
                  <span className="px-1 py-0.2 rounded text-[8px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Chrome</span>
                </span>
                <span className="text-[10px] text-slate-300 mt-0.5 block truncate">
                  Vagas & Scraping
                </span>
              </div>
            </button>

            {/* TAB 2: Robô Trading Binance Testnet */}
            <button
              id="tab-binance-bot-btn"
              onClick={() => setActiveTab('binance_bot')}
              className={`p-3 rounded-2xl text-left border transition-all flex items-start gap-2.5 ${
                activeTab === 'binance_bot'
                  ? 'bg-gradient-to-r from-amber-600 via-[#1e2329] to-amber-900 text-white border-amber-400 shadow-xl shadow-amber-600/30 ring-2 ring-amber-300'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800 hover:border-amber-500/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${activeTab === 'binance_bot' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-amber-500/20 text-amber-400'}`}>
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black uppercase tracking-wider block text-white flex items-center gap-1">
                  Robô Binance
                  <span className="px-1 py-0.2 rounded text-[8px] bg-amber-500/20 text-amber-300 border border-amber-500/40">Testnet</span>
                </span>
                <span className="text-[10px] text-slate-300 mt-0.5 block truncate">
                  Futuros & Grid
                </span>
              </div>
            </button>

            {/* TAB 3: Real Gemini Vision & ReAct Hub */}
            <button
              id="tab-real-vision-btn"
              onClick={() => setActiveTab('real_vision_agent')}
              className={`p-3 rounded-2xl text-left border transition-all flex items-start gap-2.5 ${
                activeTab === 'real_vision_agent'
                  ? 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-white border-cyan-400 shadow-xl shadow-cyan-600/30 ring-2 ring-cyan-300'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800 hover:border-cyan-500/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${activeTab === 'real_vision_agent' ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-cyan-500/20 text-cyan-400'}`}>
                <Camera className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black uppercase tracking-wider block text-white flex items-center gap-1">
                  Visão Real
                  <span className="px-1 py-0.2 rounded text-[8px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">Gemini</span>
                </span>
                <span className="text-[10px] text-slate-300 mt-0.5 block truncate">
                  Câmera & Ações
                </span>
              </div>
            </button>

            {/* TAB 4: Playground 6-DOF & Areia Quântica do Orquestrador */}
            <button
              id="tab-sand-playground-btn"
              onClick={() => setActiveTab('orchestrator_sand_playground')}
              className={`p-3 rounded-2xl text-left border transition-all flex items-start gap-2.5 ${
                activeTab === 'orchestrator_sand_playground'
                  ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-cyan-700 text-white border-amber-400 shadow-xl shadow-amber-600/30 ring-2 ring-amber-300'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800 hover:border-amber-500/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${activeTab === 'orchestrator_sand_playground' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-amber-500/20 text-amber-400'}`}>
                <Flame className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black uppercase tracking-wider block text-white flex items-center gap-1">
                  Playground 6-DOF
                  <span className="px-1 py-0.2 rounded text-[8px] bg-amber-500/20 text-amber-300 border border-amber-500/40">Areia</span>
                </span>
                <span className="text-[10px] text-slate-300 mt-0.5 block truncate">
                  Grãos & Postos de IAs
                </span>
              </div>
            </button>

            {/* TAB 5: Painel Virtual Intelectual (Opções de todas as centrais) */}
            <button
              id="tab-intellectual-vault-btn"
              onClick={() => setActiveTab('intellectual_vault')}
              className={`p-3 rounded-2xl text-left border transition-all flex items-start gap-2.5 ${
                activeTab === 'intellectual_vault' || (!['worker_agency', 'binance_bot', 'real_vision_agent', 'orchestrator_sand_playground', 'salomao_mobile_brain'].includes(activeTab))
                  ? 'bg-gradient-to-r from-purple-700 via-indigo-900 to-purple-800 text-white border-purple-400 shadow-xl shadow-purple-600/30 ring-2 ring-purple-300'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800 hover:border-purple-500/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${activeTab === 'intellectual_vault' || (!['worker_agency', 'binance_bot', 'real_vision_agent', 'orchestrator_sand_playground', 'salomao_mobile_brain'].includes(activeTab)) ? 'bg-purple-400 text-slate-950 font-black' : 'bg-purple-500/20 text-purple-400'}`}>
                <Brain className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black uppercase tracking-wider block text-white flex items-center gap-1">
                  Painel Intelectual
                  <span className="px-1 py-0.2 rounded text-[8px] bg-purple-500/20 text-purple-300 border border-purple-500/40">12 Centrais</span>
                </span>
                <span className="text-[10px] text-slate-300 mt-0.5 block truncate">
                  Wise Bank • ER-2 • Indústria
                </span>
              </div>
            </button>

            {/* TAB 6: Celular & Cérebro Minimalizado Vitalício */}
            <button
              id="tab-salomao-mobile-brain-btn"
              onClick={() => setActiveTab('salomao_mobile_brain')}
              className={`p-3 rounded-2xl text-left border transition-all flex items-start gap-2.5 ${
                activeTab === 'salomao_mobile_brain'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white border-emerald-400 shadow-xl shadow-emerald-600/30 ring-2 ring-emerald-300'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800 hover:border-emerald-500/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${activeTab === 'salomao_mobile_brain' ? 'bg-emerald-400 text-slate-950 font-black' : 'bg-emerald-500/20 text-emerald-400'}`}>
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black uppercase tracking-wider block text-white flex items-center gap-1">
                  Celular IA
                  <span className="px-1 py-0.2 rounded text-[8px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Vitalício</span>
                </span>
                <span className="text-[10px] text-slate-300 mt-0.5 block truncate">
                  Cursor & Apps Mentais
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Viewport Contents */}
        <section>
          {/* Vault Return Breadcrumb */}
          {!['worker_agency', 'binance_bot', 'real_vision_agent', 'orchestrator_sand_playground', 'salomao_mobile_brain', 'intellectual_vault'].includes(activeTab) && (
            <div className="mb-4 flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-purple-500/40 shadow-lg">
              <button
                id="btn-return-intellectual-vault"
                onClick={() => setActiveTab('intellectual_vault')}
                className="text-xs font-black text-cyan-300 hover:text-white flex items-center gap-2 transition-colors py-1 px-2.5 rounded-lg bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Voltar ao Painel Virtual Intelectual</span>
              </button>
              <span className="text-[11px] font-mono text-purple-300 uppercase font-bold pr-2">
                Módulo Ativo: {activeTab}
              </span>
            </div>
          )}

          {/* Botão Iniciar e Parar o Orquestrador Salomão (RUN / STOP) em Cada Painel / Dashboard */}
          {activeTab !== 'intellectual_vault' && (
            <SalomaoOrchestratorRunBar
              moduleName={TAB_METADATA[activeTab]?.title || activeTab}
              moduleId={activeTab}
              category={TAB_METADATA[activeTab]?.category || 'Operações Gerais'}
              activeToolId={TAB_METADATA[activeTab]?.tool || 'TOOL_VISION_INSPECTOR'}
              isRunning={!!runningOrchestrators[activeTab]}
              onToggleRun={() => handleToggleOrchestrator(activeTab)}
              onAddThought={(th) => setThoughts((prev) => [th, ...prev])}
              onAddMemoryRecord={(rec) => setMemoryRecords((prev) => [rec, ...prev])}
            />
          )}

          {activeTab === 'orchestrator_sand_playground' && (
            <OrchestratorSandPlayground
              joints={joints}
              playbackSpeed={playbackSpeed}
              setPlaybackSpeed={setPlaybackSpeed}
              onNavigateToWorkerAgency={() => setActiveTab('worker_agency')}
            />
          )}

          {activeTab === 'worker_agency' && (
            <AutonomousWorkerAgencyHub />
          )}

          {activeTab === 'binance_bot' && (
            <BinanceTestnetTradingBot />
          )}

          {activeTab === 'real_vision_agent' && (
            <RealAutonomousVisionAgent
              onDispatchAutoClickTarget={setExternalAutoClickTarget}
              isMobileDevice={isMobileDevice}
            />
          )}

          {activeTab === 'salomao_mobile_brain' && (
            <SalomaoMobileAccessibilityBrain
              onAddActionLog={(log) => setActionLogs((prev) => [log, ...prev.slice(0, 49)])}
              onRecordMemory={(rec) => setMemoryRecords((prev) => [rec, ...prev])}
              isGloballyActive={isQuantumAutonomousActive}
              onToggleGlobalActive={() => setIsQuantumAutonomousActive(!isQuantumAutonomousActive)}
            />
          )}

          {activeTab === 'intellectual_vault' && (
            <IntellectualVaultHub
              onSelectModule={(m) => setActiveTab(m as any)}
              activeModuleId={activeTab}
            />
          )}
          {activeTab === 'wise_quantum_bank' && (
            <WiseQuantumBank />
          )}
          {activeTab === 'quantum_meeting_room' && (
            <QuantumAutonomousMeetingRoom
              onAddThought={(th) => setThoughts((prev) => [th, ...prev])}
              onAddMemoryRecord={(rec) => setMemoryRecords((prev) => [rec, ...prev])}
            />
          )}
          {activeTab === 'agent_orchestrator' && (
            <AutonomousAgentOrchestratorHub
              onAddThought={(th) => setThoughts((prev) => [th, ...prev])}
              onAddMemoryRecord={(rec) => setMemoryRecords((prev) => [rec, ...prev])}
            />
          )}
          {activeTab === 'water_sorter' && (
            <ContainerWithMostWaterSorter3D
              onAddThought={(th) => setThoughts((prev) => [th, ...prev])}
              onAddMemoryRecord={(rec) => setMemoryRecords((prev) => [rec, ...prev])}
            />
          )}
          {activeTab === 'pedestre_formal_delivery' && (
            <PedestreFormalDeliverySTI
              onAddThought={(th) => setThoughts((prev) => [th, ...prev])}
              onAddMemoryRecord={(rec) => setMemoryRecords((prev) => [rec, ...prev])}
            />
          )}

          {activeTab === 'global_physical_industry' && (
            <GlobalPhysicalIndustryPlanner
              onAddThought={(th) => setThoughts((prev) => [th, ...prev])}
              onAddMemoryRecord={(rec) => setMemoryRecords((prev) => [rec, ...prev])}
            />
          )}

          {activeTab === 'workstation_6dof' && (
            <ER2Workstation6DOF
              joints={joints}
              evolutionState={evolutionState}
              onUpdateEvolutionState={setEvolutionState}
              onAddMemoryRecord={(rec) => setMemoryRecords((prev) => [rec, ...prev])}
              onAddThought={(th) => setThoughts((prev) => [th, ...prev])}
              memoryRecords={memoryRecords}
              isOffline={isOffline}
            />
          )}

          {activeTab === 'sandbox_imagination' && (
            <ER2AutonomousSandbox
              evolutionState={evolutionState}
              joints={joints}
              isOffline={isOffline}
              onUpdateEvolutionState={setEvolutionState}
              onAddMemoryRecord={(rec) => setMemoryRecords((prev) => [rec, ...prev])}
              onAddThought={(th) => setThoughts((prev) => [th, ...prev])}
              memoryRecords={memoryRecords}
              onUpdateJoints={setJoints}
            />
          )}

          {activeTab === 'nexus_os' && (
            <NexusUnifiedEcosystem
              evolutionState={evolutionState}
              onUpdateEvolutionState={setEvolutionState}
              onAddMemoryRecord={(rec) => setMemoryRecords((prev) => [rec, ...prev])}
              joints={joints}
              isOffline={isOffline}
            />
          )}

          {activeTab === 'wisdom' && (
            <CognitiveWisdomBrain
              evolutionState={evolutionState}
              thoughts={thoughts}
              heuristics={heuristics}
              signals={activeSignals}
              onToggleFullAutonomy={() =>
                setEvolutionState((prev) => ({
                  ...prev,
                  isFullAutonomySelfPlanningActive: !prev.isFullAutonomySelfPlanningActive
                }))
              }
              onTriggerSelfPlan={handleTriggerAutonomousSelfPlan}
              onTriggerIntrospection={handleTriggerIntrospection}
              currentPlan={currentPlan}
              isThinking={isLoadingPlan}
              isExecuting={isExecuting}
              isOffline={isOffline}
              onUpdateScore={handleUpdateCognitiveScore}
              onResetAndRestart={handleResetAndRestartCognitiveCycle}
              onAddThought={(th) => setThoughts((prev) => [th, ...prev.slice(0, 49)])}
              onAddHeuristic={(h) => setHeuristics((prev) => [h, ...prev.slice(0, 49)])}
            />
          )}

          {activeTab === 'autonomous' && (
            <AutonomousLearningMatrix
              evolutionState={evolutionState}
              onToggleAutonomousMode={() =>
                setEvolutionState((prev) => ({ ...prev, isAutonomousModeActive: !prev.isAutonomousModeActive }))
              }
              onChangeLearningInterval={(sec) => setEvolutionState((prev) => ({ ...prev, learningIntervalSec: sec }))}
              onForceAutonomousCycle={executeAutonomousSelfEvolution}
              activeSignals={activeSignals}
              recentEvolutionRecords={memoryRecords.filter((r) => r.type === 'AUTONOMOUS_EVOLUTION')}
              isEvolving={isOptimizing}
              isOffline={isOffline}
            />
          )}

          {activeTab === 'orchestrator' && (
            <TaskOrchestrator
              currentPlan={currentPlan}
              isExecuting={isExecuting}
              currentStepIndex={currentStepIndex}
              isOffline={isOffline}
              onToggleOffline={() => setIsOffline(!isOffline)}
              onGeneratePlan={handleGeneratePlan}
              onStartExecution={() => {
                setIsExecuting(true);
                setCurrentStepIndex(0);
                setActiveTab('workstation_6dof');
                // Auto-generate extra high-precision tools for 7M learning mode
                setTools((prev) => {
                  const hasAdvanced = prev.some((t) => t.id === 'TOOL_LASER_SOLDER_PRO');
                  if (hasAdvanced) return prev;
                  return [
                    ...prev,
                    {
                      id: 'TOOL_LASER_SOLDER_PRO',
                      name: 'Tocha de Solda Laser 9D (7M Ultra-Velocidade)',
                      category: 'Fabrication',
                      icon: 'Flame',
                      status: 'ACTIVE',
                      wearPercentage: 0.1,
                      operatingHours: 7800.0,
                      maxTorqueNm: 250.0,
                      precisionMm: 0.0001,
                      tempCelsius: 28.4,
                      description: 'Módulo gerado por auto-evolução 7.000.000x com foco quântico e soldagem atômica.',
                      activeFeatures: ['Quantum beam focus', 'Sub-micron adaptive feedback', 'Zero thermal distortion']
                    },
                    {
                      id: 'TOOL_AI_MICRON_CALIPER',
                      name: 'Paquímetro Óptico Micrométrico Neural (7M)',
                      category: 'Quality & Sensing',
                      icon: 'Eye',
                      status: 'READY',
                      wearPercentage: 0.0,
                      operatingHours: 9400.0,
                      precisionMm: 0.00001,
                      tempCelsius: 25.0,
                      description: 'Sensor óptico gerado por IA para metrologia 3D em tempo real.',
                      activeFeatures: ['Atomic interferometry', 'Real-time drift correction', 'Direct cloud sync']
                    }
                  ];
                });
              }}
              onPauseExecution={() => setIsExecuting(false)}
              onResetExecution={() => {
                setIsExecuting(false);
                setCurrentStepIndex(0);
              }}
              isLoading={isLoadingPlan}
            />
          )}

          {activeTab === 'toolkit' && (
            <ToolkitManager
              tools={tools}
              activeToolId={activeToolId}
              onSelectTool={handleSelectTool}
              onCalibrateTool={handleCalibrateTool}
            />
          )}

          {activeTab === 'memory' && (
            <CoreMemoryCompute
              memoryRecords={memoryRecords}
              optimizationCycles={optimizationCycles}
              neuralLoad={neuralLoad}
              memoryUsedMb={memoryUsedMb}
              memoryTotalMb={memoryTotalMb}
              onTriggerSelfOptimization={handleTriggerSelfOptimization}
              onSyncMemoryWithMaster={handleSyncMemoryWithMaster}
              isOptimizing={isOptimizing}
              isSyncing={isSyncing}
              isOffline={isOffline}
            />
          )}

          {activeTab === 'teleop' && (
            <TeleoperationPanel
              joints={joints}
              onJointChange={handleJointChange}
              onResetJoints={handleResetJoints}
              activeTool={activeToolId}
              onTestToolTrigger={handleTestToolTrigger}
              isTestingTool={isTestingTool}
              emergencyStop={emergencyStop}
            />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-4 pb-20 sm:pb-4 text-center text-xs font-mono text-slate-500">
        <p>
          Gemini Robotics ER-2 Digital Brain Orchestrator & Autonomous ReAct Engine // Dual-State Resilient Architecture
        </p>
      </footer>

      {/* Autonomous Real Cursor Auto-Clicker Engine Overlay & Controller */}
      <AutonomousAutoClickerEngine
        isActive={isQuantumAutonomousActive}
        onActiveChange={setIsQuantumAutonomousActive}
        externalTarget={externalAutoClickTarget}
        isMobileDevice={isMobileDevice}
        onAutoClickExecuted={handleAutoClickExecuted}
        onStopRequested={() => setIsQuantumAutonomousActive(false)}
        onCountdownTick={setClickerCountdownSec}
      />

      {/* Mobile Sticky Navigation Bar (Celular / Smartphone) */}
      <nav 
        id="mobile-bottom-nav" 
        className="sm:hidden fixed bottom-0 left-0 right-0 z-[9980] bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around shadow-2xl"
      >
        <button
          onClick={() => setActiveTab('worker_agency')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'worker_agency' ? 'text-indigo-400 bg-indigo-950/60' : 'text-slate-400'}`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Agência IAs</span>
        </button>

        <button
          onClick={() => setActiveTab('binance_bot')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'binance_bot' ? 'text-amber-400 bg-amber-950/60' : 'text-slate-400'}`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Binance Bot</span>
        </button>

        <button
          onClick={() => {
            const hud = document.getElementById('autonomous-clicker-hud');
            if (hud) hud.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30"
        >
          <MousePointer2 className="w-4 h-4" />
          <span>Auto-Clique</span>
        </button>

        <button
          onClick={() => setActiveTab('real_vision_agent')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'real_vision_agent' ? 'text-cyan-400 bg-cyan-950/60' : 'text-slate-400'}`}
        >
          <Camera className="w-4 h-4" />
          <span>Visão IA</span>
        </button>

        <button
          onClick={() => setActiveTab('salomao_mobile_brain')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'salomao_mobile_brain' ? 'text-emerald-400 bg-emerald-950/60 ring-1 ring-emerald-400' : 'text-slate-400'}`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Celular IA</span>
        </button>

        <button
          onClick={() => setActiveTab('intellectual_vault')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'intellectual_vault' ? 'text-purple-400 bg-purple-950/60' : 'text-slate-400'}`}
        >
          <Brain className="w-4 h-4" />
          <span>Intelectual (12)</span>
        </button>
      </nav>

      {/* Mobile Drawer with full tab list */}
      {isMobileNavDrawerOpen && (
        <div className="sm:hidden fixed inset-0 z-[9985] bg-slate-950/90 backdrop-blur-md flex flex-col justify-end p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 max-h-[80vh] overflow-y-auto space-y-2 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-black uppercase text-white tracking-wider">Todas as Centrais Autônomas</span>
              <button onClick={() => setIsMobileNavDrawerOpen(false)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            {[
              { id: 'real_vision_agent', label: 'Visão Real & ReAct (Gemini)', icon: Camera },
              { id: 'wise_quantum_bank', label: 'Wise Quantum Bank & Deflação', icon: Building2 },
              { id: 'pedestre_formal_delivery', label: 'Pedestre Formal Delivery STI', icon: Footprints },
              { id: 'global_physical_industry', label: 'Indústrias Físicas Tangíveis', icon: Factory },
              { id: 'workstation_6dof', label: 'Bancada Robótica ER-2 6-DOF', icon: Bot },
              { id: 'nexus_os', label: 'Nexus-OS V8 Ecossistema', icon: Monitor },
              { id: 'wisdom', label: 'Cérebro Sábio & Consciência', icon: Brain },
              { id: 'autonomous', label: 'Auto-Aprendizado Fabril', icon: Zap },
              { id: 'orchestrator', label: 'Orquestrador de Tarefas', icon: Cpu },
              { id: 'toolkit', label: 'Kit de Ferramentas (End-Effectors)', icon: Wrench },
              { id: 'memory', label: 'Memória & Núcleo', icon: HardDrive },
              { id: 'teleop', label: 'Teleoperação Manual 6-DOF', icon: Sliders },
              { id: 'water_sorter', label: 'Container Sorter 3D', icon: Droplet },
              { id: 'agent_orchestrator', label: 'Orquestrador Multimodal', icon: Sparkles },
              { id: 'quantum_meeting_room', label: 'Sala de Reunião Autônoma', icon: Users }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMobileNavDrawerOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === item.id ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-300 border border-slate-800'}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Salomão Live Vertical Conversational Panel */}
      <SalomaoLiveConversationalPanel
        isOpen={isSalomaoLiveOpen}
        onClose={() => setIsSalomaoLiveOpen(false)}
        onNavigateToSandPlayground={() => {
          setActiveTab('orchestrator_sand_playground');
          setIsSalomaoLiveOpen(false);
        }}
        onNavigateToMeetingRoom={() => {
          setActiveTab('quantum_meeting_room');
          setIsSalomaoLiveOpen(false);
        }}
        onTriggerThinkingArmClick={() => {
          setIsQuantumAutonomousActive(true);
        }}
        activeTabName={TAB_METADATA[activeTab]?.title || activeTab}
        isOrchestratorRunning={!!runningOrchestrators[activeTab]}
      />

      {/* Modal de Download e Instalação do Salomão */}
      <SalomaoDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      {/* Floating Launcher for Salomão Live */}
      {!isSalomaoLiveOpen && (
        <button
          id="btn-floating-salomao-live"
          onClick={() => setIsSalomaoLiveOpen(true)}
          className="fixed bottom-6 left-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-amber-500 via-purple-600 to-cyan-500 text-slate-950 font-black text-xs shadow-2xl flex items-center gap-2.5 hover:scale-105 transition-transform border-2 border-amber-300 cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-slate-950 flex items-center justify-center text-amber-400">
            <Brain className="w-4 h-4 animate-pulse" />
          </div>
          <span className="hidden sm:inline">Salomão Live (Vídeo, Áudio & Imagem)</span>
          <span className="sm:hidden">Salomão Live</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}
    </div>
  );
}
