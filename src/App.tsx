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
import { ContainerWithMostWaterSorter3D } from './components/ContainerWithMostWaterSorter3D';
import { AutonomousAgentOrchestratorHub } from './components/AutonomousAgentOrchestratorHub';
import { QuantumAutonomousMeetingRoom } from './components/QuantumAutonomousMeetingRoom';
import { WiseQuantumBank } from './components/WiseQuantumBank';
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
  Building2
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'wise_quantum_bank' | 'pedestre_formal_delivery' | 'global_physical_industry' | 'sandbox_imagination' | 'workstation_6dof' | 'nexus_os' | 'wisdom' | 'autonomous' | 'orchestrator' | 'toolkit' | 'memory' | 'teleop' | 'water_sorter' | 'agent_orchestrator' | 'quantum_meeting_room'>('wise_quantum_bank');
  const [isQuantumAutonomousActive, setIsQuantumAutonomousActive] = useState<boolean>(false);

  // Quantum Autonomous Speed Loop: Automatically clicks and triggers all features at quantum speed
  useEffect(() => {
    let quantumTimer: NodeJS.Timeout;
    if (isQuantumAutonomousActive) {
      const tabsList: ('wise_quantum_bank' | 'pedestre_formal_delivery' | 'global_physical_industry' | 'sandbox_imagination' | 'workstation_6dof' | 'nexus_os' | 'wisdom' | 'autonomous' | 'orchestrator' | 'toolkit' | 'memory' | 'teleop' | 'water_sorter' | 'agent_orchestrator' | 'quantum_meeting_room')[] = [
        'wise_quantum_bank', 'pedestre_formal_delivery', 'global_physical_industry', 'sandbox_imagination', 'workstation_6dof', 'nexus_os', 'wisdom', 'autonomous', 'orchestrator', 'toolkit', 'memory', 'teleop', 'water_sorter', 'agent_orchestrator', 'quantum_meeting_room'
      ];

      quantumTimer = setInterval(() => {
        setActiveTab((prev) => {
          const currentIndex = tabsList.indexOf(prev);
          const nextIndex = (currentIndex + 1) % tabsList.length;
          return tabsList[nextIndex];
        });

        setOptimizationCycles((c) => c + 350);
        setNeuralLoad((n) => Number((50 + Math.random() * 45).toFixed(1)));
        
        setEvolutionState((prev) => {
          const nextScore = prev.cognitiveIndexScore + 50;
          return {
            ...prev,
            cognitiveIndexScore: nextScore,
            learningCyclesCompleted: prev.learningCyclesCompleted + 25
          };
        });

        setJoints((prev) =>
          prev.map((j) => {
            const newAngle = Math.round(j.angle + (Math.random() - 0.5) * 50);
            const clamped = Math.max(j.minAngle, Math.min(j.maxAngle, newAngle));
            return {
              ...j,
              angle: clamped,
              temperature: Number((38 + Math.random() * 25).toFixed(1))
            };
          })
        );
      }, 250); // Quantum speed click loop every 250ms
    }
    return () => clearInterval(quantumTimer);
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
            <div className="relative w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30 text-white font-black">
              <Bot className="w-6 h-6 text-white" />
              <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  GEMINI ROBOTICS ER-2
                </h1>
                <span className="text-[10px] font-mono font-bold bg-amber-400/10 text-amber-400 border border-amber-400/40 px-2 py-0.5 rounded flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" /> LVL {evolutionState.wisdomLevel} // {evolutionState.wisdomRank.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>Cérebro Autônomo & Auto-Aperfeiçoamento Soberano</span>
                {evolutionState.isFullAutonomySelfPlanningActive && (
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    ● AUTONOMIA TOTAL SOBERANA ATIVA
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-3 text-xs font-mono">
            {/* Online / Offline status badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isOffline ? 'bg-amber-950/60 border-amber-800 text-amber-300' : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 font-bold'}`}>
              {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />}
              <span>{isOffline ? 'OFFLINE (CORE RESILIENTE)' : 'ONLINE (GEMINI NEURAL)'}</span>
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

        {/* Quantum Auto-Speed Autoclicker Toggle Banner */}
        <div className="bg-purple-950/40 border border-purple-600/60 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Modo Autônomo Quântico (Velocidade Relâmpago ⚡)</span>
                </h2>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/40 font-bold">
                  {isQuantumAutonomousActive ? 'ATIVO' : 'DISPONÍVEL'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Ativa o autoclicker quântico para alternar abas, rodar o cérebro, auto-otimizar articulações e calcular IA sem limites de velocidade.
              </p>
            </div>
          </div>

          <button
            id="btn-toggle-quantum-speed"
            onClick={() => setIsQuantumAutonomousActive(!isQuantumAutonomousActive)}
            className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
              isQuantumAutonomousActive
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-rose-600/40'
                : 'bg-gradient-to-r from-amber-400 via-purple-500 to-indigo-500 text-slate-950 shadow-purple-500/30 hover:opacity-95'
            }`}
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{isQuantumAutonomousActive ? '⚡ PARAR QUANTUM AUTO-SPEED' : '✨ 🚀 ATIVAR QUANTUM AUTO-SPEED (VELOCIDADE RELÂMPAGO)'}</span>
          </button>
        </div>

        {/* Tab Navigation Controls */}
        <div className="space-y-2 border-b border-slate-800 pb-4">
          <button
            id="tab-wise-quantum-bank-btn"
            onClick={() => setActiveTab('wise_quantum_bank')}
            className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'wise_quantum_bank'
                ? 'bg-gradient-to-r from-emerald-600 via-[#163300] to-emerald-950 text-white shadow-xl shadow-emerald-500/20 ring-2 ring-[#9fe870] font-black'
                : 'bg-gradient-to-r from-slate-900 via-[#07130b] to-slate-900 hover:border-emerald-500/60 text-[#9fe870] border border-emerald-500/40 shadow-lg'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-[#9fe870] flex items-center justify-center text-slate-950 font-black shrink-0 shadow-md">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="font-black text-sm tracking-wide text-white block">
                  WISE QUANTUM BANK (TODAS AS MOEDAS)
                </span>
                <span className="text-[11px] text-slate-300 block font-normal truncate">
                  Funcionários Quantum Speed • Supermercado (Farinha a Espaçonaves) • Cofre R$ 1,00 Rendendo
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#9fe870]/20 text-[#9fe870] border border-[#9fe870]/40 text-[10px] font-mono font-bold whitespace-nowrap ml-2">
              ⚡ R$ 1,00 RENDENDO
            </span>
          </button>

          <button
            id="tab-pedestre-formal-delivery-btn"
            onClick={() => setActiveTab('pedestre_formal_delivery')}
            className={`w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pedestre_formal_delivery'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 ring-2 ring-sky-400/80 font-black'
                : 'bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-amber-500/30'
            }`}
          >
            <Footprints className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Pedestre Formal Delivery 24h & Vaga SINE (Santa Terezinha de Itaipu - PR)</span>
          </button>

          <button
            id="tab-global-physical-industry-btn"
            onClick={() => setActiveTab('global_physical_industry')}
            className={`w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'global_physical_industry'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 ring-2 ring-sky-400/80 font-black'
                : 'bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Planeta Terra: Indústrias Físicas Tangíveis (Global Mesh)</span>
          </button>

          <button
            id="tab-workstation-6dof-btn"
            onClick={() => setActiveTab('workstation_6dof')}
            className={`w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'workstation_6dof'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 ring-2 ring-sky-400/80 font-black'
                : 'bg-slate-900/90 hover:bg-slate-800 text-rose-400 border border-rose-500/30'
            }`}
          >
            <Factory className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>Posto de Trabalho Cinemática 6-DOF & Máquinas</span>
          </button>

          <button
            id="tab-sandbox-imagination-btn"
            onClick={() => setActiveTab('sandbox_imagination')}
            className={`w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sandbox_imagination'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 ring-2 ring-sky-400/80 font-black'
                : 'bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-amber-500/30'
            }`}
          >
            <Eye className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Visor da Imaginação & Motor Gráfico (Sem Limites)</span>
          </button>

          <button
            id="tab-nexus-os-btn"
            onClick={() => setActiveTab('nexus_os')}
            className={`w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'nexus_os'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 ring-2 ring-sky-400/80 font-black'
                : 'bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30'
            }`}
          >
            <div className="flex items-center gap-1 text-cyan-400 flex-shrink-0">
              <Monitor className="w-4 h-4" />
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <span>NEXUS-OS V8 (PC + Celular + Chrome YouTube)</span>
          </button>

          <button
            id="tab-wisdom-btn"
            onClick={() => setActiveTab('wisdom')}
            className={`w-full text-left flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'wisdom'
                ? 'bg-gradient-to-r from-amber-500 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-amber-500/20 ring-2 ring-amber-400 font-black'
                : 'bg-slate-900/95 hover:bg-slate-800/90 text-amber-300 border border-amber-500/40 hover:border-amber-400/70 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Brain className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <span className="truncate">Cérebro Sábio & Consciência</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 text-[10px] font-mono whitespace-nowrap ml-2">
              {evolutionState.cognitiveIndexScore.toLocaleString()} pts
            </span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              id="tab-autonomous-btn"
              onClick={() => setActiveTab('autonomous')}
              className={`text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'autonomous'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 ring-2 ring-sky-400/80 font-black'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Zap className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Auto-Aprendizado em Fábrica ({evolutionState.learningCyclesCompleted})</span>
            </button>

            <button
              id="tab-orchestrator-btn"
              onClick={() => setActiveTab('orchestrator')}
              className={`text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orchestrator'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 ring-2 ring-sky-400/80 font-black'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Cpu className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Orquestrador de Tarefas</span>
            </button>

            <button
              id="tab-toolkit-btn"
              onClick={() => setActiveTab('toolkit')}
              className={`text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'toolkit'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 ring-2 ring-sky-400/80 font-black'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Wrench className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Kit de Ferramentas ({tools.length})</span>
            </button>

            <button
              id="tab-memory-btn"
              onClick={() => setActiveTab('memory')}
              className={`text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'memory'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 ring-2 ring-sky-400/80 font-black'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <HardDrive className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Memória & Núcleo ({memoryRecords.length})</span>
            </button>

            <button
              id="tab-teleop-btn"
              onClick={() => setActiveTab('teleop')}
              className={`text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'teleop'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 ring-2 ring-sky-400/80 font-black'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Teleoperação Manual 6-DOF</span>
            </button>

            <button
              id="tab-water-sorter-btn"
              onClick={() => setActiveTab('water_sorter')}
              className={`text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'water_sorter'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 ring-2 ring-sky-400/80 font-black'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Droplet className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span>Container Sorter 3D (Água)</span>
            </button>
          </div>

          <button
            id="tab-agent-orchestrator-btn"
            onClick={() => setActiveTab('agent_orchestrator')}
            className={`w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'agent_orchestrator'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 font-black'
                : 'bg-slate-900/90 hover:bg-slate-800 text-purple-300 border border-purple-500/30'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-400 flex-shrink-0 animate-pulse" />
            <span>Orquestrador Master & Multimídia (IA Avançada)</span>
          </button>

          <button
            id="tab-quantum-meeting-room-btn"
            onClick={() => setActiveTab('quantum_meeting_room')}
            className={`w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quantum_meeting_room'
                ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-md shadow-indigo-600/30 font-black'
                : 'bg-slate-900/90 hover:bg-slate-800 text-indigo-300 border border-indigo-500/40'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-400 flex-shrink-0 animate-pulse" />
            <span>Sala de Reunião Autônoma (Quantum Meeting Room)</span>
          </button>
        </div>

        {/* Tab Viewport Contents */}
        <section>
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
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs font-mono text-slate-500">
        <p>
          Gemini Robotics ER-2 Digital Brain Orchestrator & Autonomous Wisdom Engine // Dual-State Resilient Architecture
        </p>
      </footer>
    </div>
  );
}
