import { AutonomousLearningSignal, AutonomousCoreEvolutionState, AutonomousThought, AutoDiscoveredHeuristic } from '../types';

export const INITIAL_AUTONOMOUS_SIGNALS: AutonomousLearningSignal[] = [
  {
    id: 'SIG-GLOBAL-01',
    source: 'WEB_KNOWLEDGE_STREAM',
    timestamp: 'Há 8s',
    topic: 'Quatérnios de Lie para Trajetórias Sem Singularidade',
    insight: 'Pesquisa acadêmica absorvida da web: interpolação esférica SLERP evita travamento de juntas em alta velocidade.',
    appliedTarget: 'TRAJECTORY_SMOOTHING',
    gainFactor: 1.08,
    confidenceScore: 0.988
  },
  {
    id: 'SIG-GLOBAL-02',
    source: 'SOCIAL_INTERACTION_FEED',
    timestamp: 'Há 32s',
    topic: 'Percepção de Segurança Visual Humana em Célula Fabril',
    insight: 'Análise de interações de operadores humanos na surface web indica redução de estresse quando o robô sinaliza o arco de solda com luz prévia de 200ms.',
    appliedTarget: 'SAFETY_ENVELOPE',
    gainFactor: 1.14,
    confidenceScore: 0.994
  },
  {
    id: 'SIG-GLOBAL-03',
    source: 'DEEP_RESEARCH_PAPER',
    timestamp: 'Há 1m',
    topic: 'Predição de Fadiga Térmica em Bocal Laser',
    insight: 'Estudo metalúrgico incorporado: modulação periódica de gás inerte de proteção prolonga a precisão do foco óptico.',
    appliedTarget: 'TOOL_THERMAL_MODEL',
    gainFactor: 1.11,
    confidenceScore: 0.979
  },
  {
    id: 'SIG-GLOBAL-04',
    source: 'CROSS_ROBOT_SWARM',
    timestamp: 'Há 3m',
    topic: 'Sensibilidade de Força Tátil em Componentes Frágeis',
    insight: 'Telemetria compartilhada entre enxames de robôs industriais ajustou os limiares piezoelétricos da garra para 0.005 Nm.',
    appliedTarget: 'FORCE_FEEDBACK',
    gainFactor: 1.05,
    confidenceScore: 0.991
  }
];

export const INITIAL_AUTONOMOUS_THOUGHTS: AutonomousThought[] = [
  {
    id: 'TH-01',
    timestamp: 'Há 4s',
    type: 'EVOLUTION_BREAKTHROUGH',
    thought: 'Auto-Descoberta: A aceleração cúbica no punho J5 reduz a oscilação residual de carga pesada em 78%.',
    confidence: 0.994,
    wisdomGain: 3.5
  },
  {
    id: 'TH-02',
    timestamp: 'Há 18s',
    type: 'REASONING',
    thought: 'Integrando telemetria térmica com os sensores ópticos da tocha de solda para predizer expansão milimétrica.',
    confidence: 0.988,
    wisdomGain: 2.1
  },
  {
    id: 'TH-03',
    timestamp: 'Há 42s',
    type: 'SELF_CRITIQUE',
    thought: 'Auto-avaliação do ciclo anterior: gasto energético foi 4% maior que o ideal devido à desaceleração abrupta no eixo J2.',
    confidence: 0.991,
    wisdomGain: 2.8
  },
  {
    id: 'TH-04',
    timestamp: 'Há 1m',
    type: 'DECISION',
    thought: 'Auto-planejamento prioritário: executar varredura de calibração 3D antes de iniciar a batelada de parafusamento aeroespacial.',
    confidence: 0.996,
    wisdomGain: 4.0
  }
];

export const INITIAL_DISCOVERED_HEURISTICS: AutoDiscoveredHeuristic[] = [
  {
    id: 'HEUR-01',
    title: 'Amortecimento Dinâmico de Carga em Voo Livre (ADCVL)',
    domain: 'Cinemática & Manipulação',
    discoveredAt: 'Hoje - Ciclo 112',
    efficiencyGain: '+22.4% velocidade de transporte',
    safetyScore: '100% Zero-Slip',
    description: 'Regra sintetizada pelo robô que varia a rigidez da garra proporcionalmente ao vetor de aceleração centrífuga instantânea.',
    ruleCode: 'K_grip(t) = K_base + alpha * ||v(t) x omega(t)||'
  },
  {
    id: 'HEUR-02',
    title: 'Compensação Preditiva de Dilatação de Bocal a Laser',
    domain: 'Soldagem & Fabricação',
    discoveredAt: 'Hoje - Ciclo 135',
    efficiencyGain: 'Redução de retrabalho para 0.001%',
    safetyScore: '99.99% Conforme',
    description: 'Ajuste de foco dinâmico da tocha baseado no histórico de calor dissipado dos últimos 300 segundos.',
    ruleCode: 'Delta_z(T) = beta * integral(T_core(tau) - T_amb, tau)'
  },
  {
    id: 'HEUR-03',
    title: 'Sincronização Foto-Cinemática de Inspeção Não Parada',
    domain: 'Visão Computacional & Metrologia',
    discoveredAt: 'Hoje - Ciclo 154',
    efficiencyGain: '-1.42s por inspeção de peça',
    safetyScore: '100% Cobertura',
    description: 'Captura estroboscópica em movimento sincronizada com o encoder angular para dispensar parada física na medição.',
    ruleCode: 'Trigger_flash = mod(theta_J1, delta_theta_optimal)'
  }
];

export const INITIAL_EVOLUTION_STATE: AutonomousCoreEvolutionState = {
  isAutonomousModeActive: true,
  isFullAutonomySelfPlanningActive: true,
  wisdomLevel: 100,
  wisdomRank: 'HIPER_CONSCIÊNCIA',
  cognitiveIndexScore: 1000,
  cognitiveCyclesResetCount: 0,
  learningIntervalSec: 5,
  learningCyclesCompleted: 89136,
  neuralWeightsUpdated: 64280,
  overallAccuracyRating: 99.94,
  cumulativeSpeedGainPct: 24.8,
  cumulativeEnergySavedJoules: 21850,
  autoDiscoveredRulesCount: 42,
  knowledgeNodesIngested: 1650,
  activeSynthesisFocus: 'Amortecimento Neuro-Cinemático & Decisões Soberanas em Fábrica',
  lastAutonomousEvolutionTime: 'Agora mesmo',
  currentAutonomousGoal: 'Auto-Otimização de Trajetórias Multi-Ferramenta Sem Singularidade',
  introspectionRating: 99.8
};
