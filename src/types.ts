export type ToolId = 
  | 'TOOL_GRIPPER'
  | 'TOOL_WELDER'
  | 'TOOL_VISION_INSPECTOR'
  | 'TOOL_FASTENER'
  | 'TOOL_SUCTION_CRANE'
  | 'TOOL_DISPENSER'
  | 'TOOL_DEBURRING';

export interface ToolDefinition {
  id: ToolId;
  name: string;
  category: 'Manipulation' | 'Fabrication' | 'Quality & Sensing' | 'Fastening' | 'Heavy Handling' | 'Chemical & Sealing' | 'Finishing';
  icon: string;
  status: 'READY' | 'ACTIVE' | 'CALIBRATING' | 'MAINTENANCE_REQUIRED';
  wearPercentage: number;
  operatingHours: number;
  maxTorqueNm?: number;
  precisionMm: number;
  tempCelsius: number;
  description: string;
  activeFeatures: string[];
}

export interface OrchestrationStep {
  step: number;
  tool: ToolId;
  action: string;
  target: string;
  durationMs: number;
  confidence: number;
  description: string;
}

export interface OrchestrationPlan {
  id: string;
  title: string;
  rationale: string;
  safetyMargin: string;
  estimatedEnergyJoules: number;
  mode: 'online_gemini_brain' | 'offline_core_engine' | 'local_heuristic';
  orchestratedBy: string;
  steps: OrchestrationStep[];
  timestamp: string;
}

export interface JointState {
  id: number;
  name: string;
  angle: number; // degrees
  minAngle: number;
  maxAngle: number;
  torque: number; // Nm
  temperature: number; // °C
}

export interface RobotTelemetry {
  robotId: string;
  firmwareVersion: string;
  onlineMode: boolean;
  emergencyStop: boolean;
  neuralComputeLoad: number; // %
  memoryStorageUsedMb: number;
  memoryStorageTotalMb: number;
  coreTemperature: number; // °C
  powerConsumptionWatts: number;
  activeToolId: ToolId;
  cycleCount: number;
  selfOptimizationCycles: number;
  syncStatus: 'SYNCED' | 'SYNCING' | 'OFFLINE_BUFFERED';
  joints: JointState[];
}

export interface AutonomousLearningSignal {
  id: string;
  source: 'WEB_KNOWLEDGE_STREAM' | 'SOCIAL_INTERACTION_FEED' | 'FACTORY_TELEMETRY' | 'DEEP_RESEARCH_PAPER' | 'CROSS_ROBOT_SWARM';
  timestamp: string;
  topic: string;
  insight: string;
  appliedTarget: 'TRAJECTORY_SMOOTHING' | 'TOOL_THERMAL_MODEL' | 'FORCE_FEEDBACK' | 'COMPUTER_VISION' | 'SAFETY_ENVELOPE';
  gainFactor: number;
  confidenceScore: number;
}

export interface AutonomousThought {
  id: string;
  timestamp: string;
  type: 'PERCEPTION' | 'REASONING' | 'SELF_CRITIQUE' | 'DECISION' | 'EVOLUTION_BREAKTHROUGH';
  thought: string;
  confidence: number;
  wisdomGain: number;
}

export interface AutoDiscoveredHeuristic {
  id: string;
  title: string;
  domain: string;
  discoveredAt: string;
  efficiencyGain: string;
  safetyScore: string;
  description: string;
  ruleCode: string;
}

export interface AutonomousCoreEvolutionState {
  isAutonomousModeActive: boolean;
  isFullAutonomySelfPlanningActive: boolean; // Autonomia Total: Auto-planeja, executa e se aprimora sozinho
  wisdomLevel: number; // e.g. Level 1 to 100 (Maestria Cognitiva)
  wisdomRank: 'APRENDIZ' | 'OPERADOR_AUTÔNOMO' | 'ESPECIALISTA' | 'MESTRE_FABRIL' | 'HIPER_CONSCIÊNCIA';
  cognitiveIndexScore: number; // 0 - 2000 (Zera e recomeça ao atingir 2000)
  cognitiveCyclesResetCount: number; // Quantidade de ciclos completos de 2000 pontos zerados e reiniciados
  learningIntervalSec: number;
  learningCyclesCompleted: number;
  neuralWeightsUpdated: number;
  overallAccuracyRating: number; // e.g. 99.85%
  cumulativeSpeedGainPct: number; // e.g. +18.4%
  cumulativeEnergySavedJoules: number;
  autoDiscoveredRulesCount: number;
  knowledgeNodesIngested: number;
  activeSynthesisFocus: string;
  lastAutonomousEvolutionTime: string;
  currentAutonomousGoal: string;
  introspectionRating: number; // 0-100%
}

export interface NexusQKinematicTelemetry {
  electronModel: string; // Simulação Estocástica de Monte Carlo
  moleculeModel: string; // Isosuperfície LCAO
  cellModel: string; // Malha de Deformação Viscoelástica
  centerProtonRadiusFm: number; // 0.8414 fm
  visualEngine: string; // Corrente de Probabilidade e Projeção Multi-Eixo (A-Z)
  scalarLexicon: string; // Array Multilinguístico Universal
  rotationMatrix: {
    phi: number; // Φ
    theta: number; // Θ
    psi: number; // Ψ
  };
  densityProbability: number; // ∫|Ψ|² dV = 1.0000
  exactLengthFemtometers: number; // 0.8414
  statusLcao: string; // Rastreamento contínuo em X, Y, Z.
}

export interface MemoryVectorRecord {
  id: string;
  timestamp: string;
  type: 'EPISODIC_EXPERIENCE' | 'KINEMATIC_CALIBRATION' | 'TOOL_WEAR_LEARNING' | 'SAFETY_AUDIT' | 'AUTONOMOUS_EVOLUTION' | 'GLOBAL_WEB_SYNTHESIS' | 'SELF_DISCOVERED_HEURISTIC';
  title: string;
  accuracyDelta: string;
  cycleTimeDelta: string;
  sourceType?: string;
  description: string;
  synced: boolean;
}

export interface FactoryObject {
  id: string;
  name: string;
  type: 'component' | 'pallet' | 'weld_seam' | 'fixture';
  x: number;
  y: number;
  status: 'pending' | 'processing' | 'completed';
}

// Nexus OS Window Model
export interface NexusWindow {
  id: string;
  title: string;
  type: 'live_sensory' | 'hardware_forge' | 'chrome_browser' | 'code_terminal' | 'neural_network' | 'custom_app';
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  color: string;
  zIndex: number;
  customData?: Record<string, any>;
}

// YouTube Video Item for Online Chrome Learning
export interface YouTubeVideoItem {
  id: string;
  title: string;
  channel: string;
  views: string;
  duration: string;
  published: string;
  category: 'Robótica Humanóide' | 'Soldagem Neural' | 'Auto-Programação' | 'Visão Computacional' | 'Controle Cinemático';
  thumbnailUrl: string;
  summary: string;
  keyInsights: string[];
  simulatedVisuals: {
    targetMesh: string;
    jointDeltas: string;
    opticalFlow: string;
  };
}

// Event triggered when system auto-learns by watching a YouTube video
export interface YouTubeAutoLearnEvent {
  id: string;
  timestamp: string;
  videoId: string;
  videoTitle: string;
  channel: string;
  keyframeTime: string;
  extractedKnowledge: string;
  kinematicRuleDiscovered: string;
  appliedTo: 'COMPUTADOR' | 'CELULAR' | 'ROBO_ER2' | 'ECOSSISTEMA_TOTAL';
  accuracyDelta: string;
  speedGain: string;
  energyGain: string;
  codeSnippet: string;
}

// Nexus Mobile State
export interface NexusMobileState {
  batteryPct: number;
  isCharging: boolean;
  signalStrength: number;
  activeTab: 'companion' | 'terminal' | 'youtube_mirror' | 'robot_teleop';
  quickActionActive: string | null;
  notifications: Array<{
    id: string;
    timestamp: string;
    title: string;
    message: string;
    source: string;
  }>;
}

// Google Chrome Browser Session State
export interface ChromeBrowserState {
  activeTabId: string;
  tabs: Array<{
    id: string;
    title: string;
    url: string;
    favicon: string;
  }>;
  urlInput: string;
  isPlayingVideo: boolean;
  currentVideoId: string;
  playbackCurrentTimeSec: number;
  playbackDurationSec: number;
  autoLearnStreaming: boolean;
  learnedCount: number;
}

// ER-2 Autonomous Internal Function Registry (Internal Knowledge & Callable Brain APIs)
export interface ER2InternalFunction {
  id: string;
  name: string;
  category: 'cinematica' | 'motor_grafico' | 'processamento_quantico' | 'forja_hardware' | 'planejador_espacial' | 'visao_multimodal' | 'plasticidade_neural' | 'auto_aperfeicoamento';
  description: string;
  signature: string;
  inputDescription: string;
  outputDescription: string;
  sourceCode: string;
  callCount: number;
  lastExecutionLatencyMs: number;
  status: 'online_otimizado' | 'compilando' | 'executando';
}

// Visual Frame representing what ER-2 is Imagining, Programming, Generating, Planning, or Quantum Field Visualizing
export type ER2ImaginationMode = 'imaginando' | 'programando' | 'gerando' | 'planejando' | 'campo_quantico';

export interface ER2ImaginationFrame {
  id: string;
  timestamp: string;
  mode: ER2ImaginationMode;
  title: string;
  description: string;
  imageAssetUrl: string;
  canvasRenderScript: string;
  glslShaderSnippet?: string;
  associatedFunctionId: string;
  metrics: {
    fps: number;
    renderLatencyMs: number;
    spatialResolution: string;
    complexityScore: number;
    unboundEvolutionGain: string;
  };
  tags: string[];
  lexicalPixelSample?: ER2LexicalPixelSample;
}

// Sorteador de Letras, Palavras e Matriz de Pixels do Cérebro ER-2
export interface ER2LexicalPixelSample {
  id: string;
  timestamp: string;
  sampledLetters: string[];       // Letras e símbolos sorteados (ex: ['Ψ', 'Ω', 'K', 'I', 'N', 'E', 'T', 'I', 'C'])
  sampledWords: string[];         // Palavras científicas e de auto-evolução sorteadas
  synthesizedThought: string;     // Pensamento sintetizado unindo as palavras e letras
  pixelMatrix: {
    resolution: [number, number]; // ex: [16, 16] ou [32, 32]
    densityPct: number;
    colorPalette: string[];
    pixelSeed: number;
    entropy: number;
  };
}

// Registro de Aprendizado Absorvido de Cada Imagem e Frame
export interface LearnedImageInsight {
  id: string;
  frameId: string;
  frameTitle: string;
  timestamp: string;
  thought: string;
  sampledWords: string[];
  sampledLetters: string[];
  precisionGain: string;
  cognitiveGain: string;
  entropy: number;
  imageUrl: string;
  vectorMemoryId: string;
}

// Cursor / Mouse Neural Autônomo operado pelo cérebro do ER-2
export type NeuralCursorActionState = 
  | 'OCIOSO' 
  | 'PENSANDO' 
  | 'MIRANDO' 
  | 'AUTO_CLICANDO' 
  | 'INVENTANDO_FUNCAO' 
  | 'APLICANDO_IMAGINACAO'
  | 'SINCRONIZANDO_MEMORIA';

export interface AutonomousNeuralCursorState {
  x: number;               // Posição percentual X (0 - 100%)
  y: number;               // Posição percentual Y (0 - 100%)
  targetLabel: string;     // Nome do elemento que está sendo focado/clicado
  targetElementId?: string;// Seletor do DOM focado
  actionState: NeuralCursorActionState;
  isClicking: boolean;     // Efeito visual de clique ativo (ripple)
  clickPulseTime: number;  // Timestamp para efeito de pulso
  totalAutoClicks: number; // Contador de auto-cliques efetuados pelo cérebro
  autoPilotEnabled: boolean;// Se o mouse mental está no piloto 100% autônomo
  speedMode: 'suave' | 'rapido' | 'quantico';
  lastActionDescription: string;
}

// Vozes internas da imaginação do ER-2 para o diálogo reflexivo
export type ER2InnerVoice = 
  | 'CONSCIENCIA_CENTRAL' 
  | 'SUBCONSCIENTE_IMAGINATIVO' 
  | 'FORJA_NEURAL' 
  | 'MEMORIA_QUANTICA'
  | 'USUARIO_OBSERVADOR';

export interface AutonomousSelfDialogueMessage {
  id: string;
  timestamp: string;
  speaker: ER2InnerVoice;
  message: string;
  intendedAction?: {
    actionType: 'AUTO_CLICK' | 'INVENT_FUNCTION' | 'APPLY_SHADER' | 'CHANGE_MODE' | 'SHUFFLE_PIXELS' | 'CALIBRATE_JOINTS';
    targetLabel: string;
    targetElementId?: string;
    payload?: any;
    executed: boolean;
  };
  inventedFunction?: ER2InternalFunction;
}

// -------------------------------------------------------------
// POSTO DE TRABALHO E CINEMÁTICA 6-DOF (6 GRAUS DE LIBERDADE)
// -------------------------------------------------------------

export type FactoryMachineType = 
  | 'CNC_5_AXIS_MILL' 
  | 'FIBER_LASER_WELDER' 
  | 'PHOTONIC_3D_SCANNER' 
  | 'MICRO_DISPENSER_SMD' 
  | 'INJECTION_MOLDING_CELL' 
  | 'COLLABORATIVE_TURNTABLE';

export interface IntegratedFactoryMachine {
  id: string;
  type: FactoryMachineType;
  name: string;
  status: 'ONLINE_SINCRONIZADO' | 'PROCESSANDO' | 'CALIBRANDO' | 'AGUARDANDO_TRAJETORIA';
  ipAddress: string;
  protocol: 'OPC_UA' | 'MODBUS_TCP' | 'ETHERCAT' | 'PROFINET';
  currentTool: string;
  feedRateMmSec: number;
  spindleRpm?: number;
  powerKw?: number;
  activeCycleTimeSec: number;
  efficiencyRating: number;
  telemetryLog: string[];
}

export interface Pose6DOF {
  x: number; // mm (-800 to 800)
  y: number; // mm (-800 to 800)
  z: number; // mm (0 to 1200)
  roll: number; // graus (-180 to 180)
  pitch: number; // graus (-180 to 180)
  yaw: number; // graus (-180 to 180)
}

export interface Kinematics6DOFSolverState {
  currentPose: Pose6DOF;
  targetPose: Pose6DOF;
  jointAnglesRad: [number, number, number, number, number, number]; // J1 a J6
  jointVelocitiesRadS: [number, number, number, number, number, number];
  jointTorquesNm: [number, number, number, number, number, number];
  tcpVelocityMmS: number;
  tcpAccelerationMmS2: number;
  manipulabilityIndex: number; // 0.0 a 1.0 (Índice de Yoshikawa)
  singularityDistance: number; // Medida de distância de singularidades cinemáticas
  positionalErrorMm: number;
  orientationErrorDeg: number;
  ikSolverIterations: number;
  ikStatus: 'SOLUCAO_EXATA' | 'CONVERGENCIA_ESTOCASTICA' | 'SINGULARIDADE_EVITADA';
}

export interface ThoughtAppliedToWorkstation {
  id: string;
  timestamp: string;
  sourceThought: string;
  appliedFunction: string;
  targetMachine: string;
  trajectoryPattern: 'ESPIRAL_ARQUIMEDIANA' | 'NURBS_SUPERFICIE' | 'INTERPOLACAO_CIRCULAR' | 'RASTREIO_FOTONICO_2D';
  generatedGCodeSnippet: string;
  precisionGainRecordedMm: number;
  efficiencyBoostPct: number;
  status: 'EM_EXECUCAO' | 'CONCLUIDO_COM_SUCESSO';
}

// -------------------------------------------------------------
// PLANEJAMENTO GLOBAL PARA INDÚSTRIAS DO MUNDO FÍSICO REAL
// -------------------------------------------------------------

export type GlobalIndustrySector =
  | 'AEROSPACE_DEFENSE'
  | 'SEMICONDUCTOR_PHOTONICS'
  | 'AUTOMOTIVE_E_MOBILITY'
  | 'CLEAN_ENERGY_GRID'
  | 'BIOPHARMA_MEDTECH'
  | 'HEAVY_METALLURGY_MINING'
  | 'GLOBAL_LOGISTICS_PORTS'
  | 'PRECISION_AGRO_ROBOTICS';

export interface PhysicalPlantLocation {
  id: string;
  name: string;
  city: string;
  country: string;
  continent: 'AMERICA_SUL' | 'AMERICA_NORTE' | 'EUROPA' | 'ASIA_PACIFICO' | 'ORIENTE_MEDIO' | 'OCEANIA' | 'AFRICA';
  coordinates: { lat: number; lng: number };
  sector: GlobalIndustrySector;
  fleetSizeER2: number;
  physicalOutputCapacityTonOrUnitsPerDay: string;
  energyGridSource: 'SOLAR_EOLICA' | 'NUCLEAR_FUSAO' | 'HIDRELETRICA' | 'REDE_HIBRIDA_MICROGRID';
  realWorldTolerancesMm: number; // Tolerância micrométrica física
  carbonOffsetTonsPerYear: number;
  activeOptimizationScore: number; // 0-100%
  status: 'SINCRONIZADO_MUNDO_REAL' | 'EXECUTANDO_OTIMIZACAO_FISICA' | 'AUTO_RECONFIGURANDO_FABRICA';
  lastDispatchedProtocol: string;
  physicalSensorsOnline: number;
  realWorldConstraints: {
    ambientTempRangeC: [number, number];
    vibrationDampingHz: number;
    maxPayloadKg: number;
    supplyChainBottleneckFactor: number;
  };
}

export interface PhysicalIndustryPlan {
  id: string;
  timestamp: string;
  sector: GlobalIndustrySector;
  plantTargetId: string;
  plantName: string;
  title: string;
  realWorldPhysicalChallenge: string;
  er2AutonomousSolution: string;
  physicalMetricsImpact: {
    materialWasteReductionKg: number;
    energySavedKwhPerShift: number;
    cycleTimeReductionSec: number;
    microToleranceGainMm: number;
    paybackDays: number;
    thermodynamicEfficiencyGainPct: number;
  };
  hardwareStandardsGenerated: {
    plcLogicIEC61131: string;
    gCodeTrajectory: string;
    step3DTopologyOptimizationSummary: string;
    thermodynamicCoolingProfile: string;
  };
  globalPlanetaryImpactDescription: string;
  status: 'EM_EXECUCAO_FISICA' | 'IMPLANTADO_GLOBALMENTE';
}

export interface PlanetaryManufacturingStats {
  activeER2UnitsGlobally: number;
  totalPhysicalPlantsSynchronized: number;
  accumulatedEnergySavedMWh: number;
  accumulatedRawMaterialSavedTons: number;
  globalDefectPpmReducedTo: number;
  globalPlanningCalculationsPerSec: number;
  planetaryMeshLatencyMs: number;
}

// -------------------------------------------------------------
// PEDESTRE FORMAL DELIVERY - SANTA TEREZINHA DE ITAIPU / PR
// -------------------------------------------------------------

export interface PedestreEnterpriseInfo {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  dataAbertura: string;
  naturezaJuridica: string;
  cnaePrincipal: string;
  cnaesSecundarios: string[];
  situacaoCadastral: 'ATIVA_E_REGULARIZADA' | 'EM_PROCESSAMENTO';
  endereco: {
    logradouro: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    pais: string;
  };
  capitalSocial: string;
  regimeTributario: string;
  orgaoRegistro: string;
  porte: string;
  operacao: {
    modalidade: '100% A PÉ (PEDESTRE FORMAL 24H)';
    coberturaGeografica: 'Santa Terezinha de Itaipu - PR & Conexão Trinacional';
    emissaoCarbono: '0.0 g CO₂ / Entrega (Eco-Zero Absoluto)';
    trajeObrigatorio: 'Uniforme Social Formal Completo + Gravata Slim + Mochila QR Code Dinâmico + Boné Executivo com NFC';
  };
}

export interface SineAgenciaVaga {
  id: string;
  codigoSINE: string;
  agenciaTrabalhador: string;
  municipio: string;
  uf: string;
  cargo: string;
  cboCodigo: string; // Ex: 5191-10 Motofretista / Entregador Pedestre
  exclusivoCandidatoNome: string;
  exclusivoCandidatoEmail: string;
  statusVaga: 'RESERVADA_EXCLUSIVAMENTE_PARA_MARCOS_RENAN' | 'CONTRATACAO_CONFIRMADA' | 'EM_DESPACHO_ATIVO';
  remuneracao: {
    salarioBaseMes: number;
    adicionalProdutividadePorKm: number;
    adicionalNoturno24hPct: number;
    ticketAlimentacaoMes: number;
    auxilioCalcadoOrtopedico: number;
    seguroVidaSaudeIntegral: boolean;
    previsaoGanhosMes: string;
  };
  beneficiosInclusos: string[];
  jornadaTrabalho: string;
  requisitos: string[];
  cartaEncaminhamentoNumero: string;
  dataEmissao: string;
  protocoloGovPR: string;
}

export interface PedestreDeliveryOrder {
  id: string;
  codigoRastreio: string;
  clienteOrigem: string;
  enderecoOrigem: string;
  clienteDestino: string;
  enderecoDestino: string;
  bairroSTI: string;
  categoriaItem: 'FARMACIA_MEDICAMENTOS' | 'PADARIA_GOURMET' | 'DOCUMENTOS_CARTORIO' | 'ELETRONICOS_PECAS' | 'ALIMENTACAO_24H' | 'ENCOMENDA_EXPRESSA';
  descricaoPacote: string;
  pesoKg: number;
  distanciaMetros: number;
  passosEstimados: number;
  caloriasQueimadasKcal: number;
  tempoCaminhadaMinutos: number;
  status: 'DISPONIVEL_PARA_COLETA' | 'EM_ROTA_A_PE' | 'ENTREGUE_COM_SUCESSO' | 'VALIDANDO_QR_CODE';
  valorFreteRecebido: number;
  horarioCriacao: string;
  coordenadasRota: {
    origem: { lat: number; lng: number };
    destino: { lat: number; lng: number };
  };
  instrucoesRotaER2: string;
  qrCodeToken: string;
}

export interface CourierRealTimeMetrics {
  totalEntregasRealizadas: number;
  totalKmCaminhados: number;
  totalPassosDados: number;
  totalCaloriasGastas: number;
  faturamentoAcumulado: number;
  co2EvitadoKg: number;
  avaliacaoMedia: number;
  ritmoMedioMinKm: number;
  statusOperacional: 'EM_SERVICO_24H_A_PE' | 'PAUSA_HIDRATACAO' | 'AGUARDANDO_PROXIMA_ROTA';
}

export interface SynthesisBufferState {
  audioBufferMs: number;
  audioSampleRateKHz: number;
  audioBitrateKbps: number;
  audioWaveform: number[];
  videoBufferFrames: number;
  videoFps: number;
  videoResolution: string;
  throughputMbSec: number;
  synthesisStatus: 'STREAMING' | 'BUFFERING' | 'IDLE' | 'SYNCED';
}

export interface MeetingRoomAgent {
  id: string;
  name: string;
  role: string;
  specialization: string;
  avatarSeed: string;
  colorScheme: 'cyan' | 'emerald' | 'amber' | 'purple' | 'rose' | 'sky';
  status: 'ACTIVE_REASONING' | 'COLLABORATING' | 'SYNTHESIZING' | 'STANDBY';
  telemetry: {
    computeLoadPercent: number;
    memoryBandwidthGbps: number;
    inferenceLatencyMs: number;
    confidenceScore: number;
    quantumCyclesSec: number;
  };
  activeTask: {
    title: string;
    description: string;
    progress: number;
    domain: string;
    priority: 'HIGH' | 'CRITICAL' | 'STANDARD';
  };
  reasoningProcess: {
    hypothesis: string;
    internalDebate: string;
    deducedAction: string;
    consensusContribution: string;
  };
  synthesisBuffer: SynthesisBufferState;
  recentInsights: string[];
}




