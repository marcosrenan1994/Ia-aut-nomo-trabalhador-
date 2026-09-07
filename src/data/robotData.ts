import { ToolDefinition, MemoryVectorRecord, OrchestrationPlan } from '../types';

export const INITIAL_TOOLS: ToolDefinition[] = [
  {
    id: 'TOOL_GRIPPER',
    name: 'Garra Tátil de Alta Precisão (Adaptive Gripper)',
    category: 'Manipulation',
    icon: 'HandMetal',
    status: 'ACTIVE',
    wearPercentage: 8.4,
    operatingHours: 412.5,
    maxTorqueNm: 45.0,
    precisionMm: 0.005,
    tempCelsius: 38.2,
    description: 'Pinça adaptativa servo-acionada com sensores de força piezoelétricos na ponta dos dedos.',
    activeFeatures: ['Micro-torque feedback', 'Auto-centering', 'Pneumatic assist']
  },
  {
    id: 'TOOL_WELDER',
    name: 'Tocha de Solda Laser / Arco Multieixo (Laser Welder)',
    category: 'Fabrication',
    icon: 'Flame',
    status: 'READY',
    wearPercentage: 14.1,
    operatingHours: 230.0,
    precisionMm: 0.012,
    tempCelsius: 44.8,
    description: 'Módulo de soldagem por pulso laser contínuo com bocal de gás inerte e controle de costura em tempo real.',
    activeFeatures: ['Laser seam tracking', 'Thermal beam shaping', 'Argon shielding monitor']
  },
  {
    id: 'TOOL_VISION_INSPECTOR',
    name: 'Sensor Fotônico 3D & Scanner de Qualidade',
    category: 'Quality & Sensing',
    icon: 'Eye',
    status: 'READY',
    wearPercentage: 2.1,
    operatingHours: 580.2,
    precisionMm: 0.001,
    tempCelsius: 35.0,
    description: 'Scanner estéreo confocal de alta taxa de quadros para inspeção micrométrica e nuvem de pontos.',
    activeFeatures: ['Sub-millimeter pointcloud', 'Defect classification', 'Surface reflectivity map']
  },
  {
    id: 'TOOL_FASTENER',
    name: 'Apertador Eletrônico com Encoder Angular',
    category: 'Fastening',
    icon: 'Wrench',
    status: 'READY',
    wearPercentage: 11.7,
    operatingHours: 310.8,
    maxTorqueNm: 120.0,
    precisionMm: 0.02,
    tempCelsius: 39.5,
    description: 'Ferramenta de torque programável com desaceleração dinâmica e registro de curvas de assentamento.',
    activeFeatures: ['Torque angle verification', 'Fastener thread sync', 'Anti-strip limiter']
  },
  {
    id: 'TOOL_SUCTION_CRANE',
    name: 'Manipulador por Sucção a Vácuo Venturi',
    category: 'Heavy Handling',
    icon: 'Boxes',
    status: 'READY',
    wearPercentage: 5.9,
    operatingHours: 195.4,
    precisionMm: 0.05,
    tempCelsius: 32.1,
    description: 'Ventosa multicanal de sucção rápida projetada para chapas metálicas, painéis e caixas pesadas.',
    activeFeatures: ['Vacuum seal telemetry', 'Emergency drop lock', 'Variable suction zones']
  }
];

export const INITIAL_MEMORY_RECORDS: MemoryVectorRecord[] = [
  {
    id: 'MEM-OPT-089',
    timestamp: 'Hoje, 09:42:15',
    type: 'KINEMATIC_CALIBRATION',
    title: 'Compensação de Folga Dinâmica no Eixo J3',
    accuracyDelta: '+0.004 mm',
    cycleTimeDelta: '-0.18 s',
    description: 'O algoritmo neural ajustou o amortecimento da junta para eliminar micro-vibrações durante desaceleração rápida.',
    synced: true
  },
  {
    id: 'MEM-OPT-088',
    timestamp: 'Hoje, 08:15:30',
    type: 'EPISODIC_EXPERIENCE',
    title: 'Otimização de Trajetória da Garra para Peças de Alumínio',
    accuracyDelta: '+99.7% aderência',
    cycleTimeDelta: '-0.34 s',
    description: 'Padrão de preensão refinado com base em 1.200 ciclos de pega anteriores na esteira.',
    synced: true
  },
  {
    id: 'MEM-OPT-087',
    timestamp: 'Ontem, 23:50:11',
    type: 'TOOL_WEAR_LEARNING',
    title: 'Predição de Desgaste Térmico da Tocha Laser',
    accuracyDelta: '0.00 drift',
    cycleTimeDelta: '0.00 s',
    description: 'Modulação de potência adaptativa aplicada para estender a vida útil do bocal cerâmico em 18%.',
    synced: true
  },
  {
    id: 'MEM-OPT-086',
    timestamp: 'Ontem, 19:12:44',
    type: 'SAFETY_AUDIT',
    title: 'Atualização do Envelope de Segurança Espacial',
    accuracyDelta: 'Margem 99.9%',
    cycleTimeDelta: '-0.05 s',
    description: 'Zona de exclusão recalculada com base no fluxo de operadores na célula de trabalho.',
    synced: true
  }
];

export const PRESET_ROUTINES = [
  {
    id: 'routine-1',
    name: 'Montagem e Fixação de Módulo Eletrônico',
    prompt: 'Pegue a carcaça de alumínio com a Garra, posicione na bancada de fixação, utilize o Apertador para travar os 4 parafusos com 8.5 Nm e faça inspeção fotônica final.',
    icon: 'Cpu'
  },
  {
    id: 'routine-2',
    name: 'Soldagem Automatizada de Chassi com Laser',
    prompt: 'Escaneie a junta metálica com o Sensor Fotônico 3D, acione a Tocha de Solda Laser para selar o cordão C-2 e valide a penetração térmica.',
    icon: 'Flame'
  },
  {
    id: 'routine-3',
    name: 'Triagem Óptica e Paletização por Sucção',
    prompt: 'Inspecione a superfície das placas na esteira com a Câmera 3D, descarte as com defeito e transporte as aprovadas para o Pallet B usando o Manipulador de Vácuo.',
    icon: 'PackageCheck'
  },
  {
    id: 'routine-4',
    name: 'Ciclo de Auto-Calibração das 6 Juntas',
    prompt: 'Execute calibração cinemática completa dos eixos J1 a J6, calcule offsets de torque e salve na memória do núcleo.',
    icon: 'Activity'
  }
];
