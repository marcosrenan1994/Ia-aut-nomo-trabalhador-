import React, { useState, useEffect } from 'react';
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
  UserCheck
} from 'lucide-react';

const INITIAL_JOINTS: JointState[] = [
  { id: 1, name: 'Base Yaw (J1)', angle: 0, minAngle: -170, maxAngle: 170, torque: 12.4, temperature: 36.5 },
  { id: 2, name: 'Shoulder Pitch (J2)', angle: -25, minAngle: -100, maxAngle: 120, torque: 34.8, temperature: 41.2 },
  { id: 3, name: 'Elbow Pitch (J3)', angle: 55, minAngle: -90, maxAngle: 135, torque: 28.1, temperature: 39.8 },
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
    return saved ? JSON.parse(saved) : INITIAL_TOOLS;
  });

  const [activeToolId, setActiveToolId] = useState<ToolId>('TOOL_GRIPPER');
  const [joints, setJoints] = useState<JointState[]>(INITIAL_JOINTS);
  const [emergencyStop, setEmergencyStop] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Core Memory & Compute Matrix
  const [memoryRecords, setMemoryRecords] = useState<MemoryVectorRecord[]>(() => {
    const saved = localStorage.getItem('er2_memory_records');
    return saved ? JSON.parse(saved) : INITIAL_MEMORY_RECORDS;
  });
  const [optimizationCycles, setOptimizationCycles] = useState<number>(186);
  const [neuralLoad, setNeuralLoad] = useState<number>(42.8);
  const [memoryUsedMb, setMemoryUsedMb] = useState<number>(312);
  const memoryTotalMb = 1024;

  // Autonomous Self-Learning & Cognitive Wisdom State
  const [evolutionState, setEvolutionState] = useState<AutonomousCoreEvolutionState>(() => {
    const saved = localStorage.getItem('er2_evolution_state');
    return saved ? JSON.parse(saved) : INITIAL_EVOLUTION_STATE;
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
    return saved ? JSON.parse(saved) : INITIAL_DISCOVERED_HEURISTICS;
  });

  // Active Orchestration Plan & Execution
  const [currentPlan, setCurrentPlan] = useState<OrchestrationPlan | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isTestingTool, setIsTestingTool] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'pedestre_formal_delivery' | 'global_physical_industry' | 'sandbox_imagination' | 'workstation_6dof' | 'nexus_os' | 'wisdom' | 'autonomous' | 'orchestrator' | 'toolkit' | 'memory' | 'teleop'>('pedestre_formal_delivery');

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
          const newCognitiveScore = Math.min(1000, prev.cognitiveIndexScore + 2);
          let newRank = prev.wisdomRank;
          if (newCognitiveScore >= 950) newRank = 'HIPER_CONSCIÊNCIA';
          else if (newCognitiveScore >= 800) newRank = 'MESTRE_FABRIL';
          else if (newCognitiveScore >= 600) newRank = 'ESPECIALISTA';
          else if (newCognitiveScore >= 400) newRank = 'OPERADOR_AUTÔNOMO';

          return {
            ...prev,
            learningCyclesCompleted: prev.learningCyclesCompleted + 1,
            wisdomLevel: Math.min(100, Math.floor(newCognitiveScore / 10)),
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
            id: `HEUR-${Date.now().toString().slice(-4)}`,
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
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-slate-950 font-black">
              <Bot className="w-6 h-6 text-white" />
              <Sparkles className="w-3 h-3 text-amber-400 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  GEMINI ROBOTICS ER-2
                </h1>
                <span className="text-[10px] font-mono font-black bg-gradient-to-r from-amber-400/20 to-emerald-400/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" /> LVL {evolutionState.wisdomLevel} // {evolutionState.wisdomRank.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span>Cérebro Autônomo & Auto-Aperfeiçoamento Soberano</span>
                {evolutionState.isFullAutonomySelfPlanningActive && (
                  <span className="text-[10px] text-emerald-400 font-mono font-bold animate-pulse">
                    ● AUTONOMIA TOTAL SOBERANA ATIVA
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
            {/* Online / Offline status badge */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${isOffline ? 'bg-amber-950/60 border-amber-800 text-amber-300' : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'}`}>
              {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />}
              <span className="font-bold">{isOffline ? 'OFFLINE (CORE RESILIENTE)' : 'ONLINE (GEMINI NEURAL)'}</span>
            </div>

            {/* Cognitive Index Score */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 text-amber-300">
              <Brain className="w-3.5 h-3.5 text-amber-400" />
              <span>{evolutionState.cognitiveIndexScore} IQ Fabril</span>
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
        {/* Top Section: Real-time Robotic Kinematics Canvas */}
        <section>
          <RobotCanvas
            joints={joints}
            activeTool={activeToolId}
            isExecuting={isExecuting}
            activeStepName={activeStep ? `${activeStep.step}. ${activeStep.action} -> ${activeStep.target}` : undefined}
            emergencyStop={emergencyStop}
            onToggleEstop={() => {
              setEmergencyStop(!emergencyStop);
              if (!emergencyStop) setIsExecuting(false);
            }}
            playbackSpeed={playbackSpeed}
            setPlaybackSpeed={setPlaybackSpeed}
          />
        </section>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
          <button
            id="tab-pedestre-formal-delivery-btn"
            onClick={() => setActiveTab('pedestre_formal_delivery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === 'pedestre_formal_delivery'
                ? 'bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/40'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40'
            }`}
          >
            <Footprints className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>Pedestre Formal Delivery 24h & Vaga SINE (Santa Terezinha de Itaipu - PR)</span>
          </button>

          <button
            id="tab-global-physical-industry-btn"
            onClick={() => setActiveTab('global_physical_industry')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === 'global_physical_industry'
                ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 text-slate-950 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/40'
                : 'bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            <span>Planeta Terra: Indústrias Físicas Tangíveis (Global Mesh)</span>
          </button>

          <button
            id="tab-workstation-6dof-btn"
            onClick={() => setActiveTab('workstation_6dof')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === 'workstation_6dof'
                ? 'bg-gradient-to-r from-cyan-400 via-rose-500 to-amber-400 text-slate-950 shadow-lg shadow-rose-500/30'
                : 'bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/40'
            }`}
          >
            <Factory className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Posto de Trabalho Cinemática 6-DOF & Máquinas</span>
          </button>

          <button
            id="tab-sandbox-imagination-btn"
            onClick={() => setActiveTab('sandbox_imagination')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === 'sandbox_imagination'
                ? 'bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-400 text-slate-950 shadow-lg shadow-pink-500/25'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40'
            }`}
          >
            <Eye className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Visor da Imaginação & Motor Gráfico (Sem Limites)</span>
          </button>

          <button
            id="tab-nexus-os-btn"
            onClick={() => setActiveTab('nexus_os')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === 'nexus_os'
                ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-slate-950 shadow-lg shadow-cyan-500/30'
                : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            <Monitor className="w-4 h-4 text-cyan-400" />
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>NEXUS-OS V8 (PC + Celular + Chrome YouTube)</span>
          </button>

          <button
            id="tab-wisdom-btn"
            onClick={() => setActiveTab('wisdom')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === 'wisdom'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Brain className="w-4 h-4 text-amber-300" />
            <span>Cérebro Sábio & Consciência ({evolutionState.cognitiveIndexScore})</span>
          </button>

          <button
            id="tab-autonomous-btn"
            onClick={() => setActiveTab('autonomous')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'autonomous'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Auto-Aprendizado em Fábrica ({evolutionState.learningCyclesCompleted})</span>
          </button>

          <button
            id="tab-orchestrator-btn"
            onClick={() => setActiveTab('orchestrator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'orchestrator'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Orquestrador de Tarefas</span>
          </button>

          <button
            id="tab-toolkit-btn"
            onClick={() => setActiveTab('toolkit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'toolkit'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Kit de Ferramentas ({tools.length})</span>
          </button>

          <button
            id="tab-memory-btn"
            onClick={() => setActiveTab('memory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'memory'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Memória & Núcleo ({memoryRecords.length})</span>
          </button>

          <button
            id="tab-teleop-btn"
            onClick={() => setActiveTab('teleop')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'teleop'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Teleoperação Manual 6-DOF</span>
          </button>
        </div>

        {/* Tab Viewport Contents */}
        <section>
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
              onStartExecution={() => setIsExecuting(true)}
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
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs font-mono text-slate-500">
        <p>
          Gemini Robotics ER-2 Digital Brain Orchestrator & Autonomous Wisdom Engine // Dual-State Resilient Architecture
        </p>
      </footer>
    </div>
  );
}
