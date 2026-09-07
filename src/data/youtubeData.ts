import { YouTubeVideoItem, YouTubeAutoLearnEvent } from '../types';

export const INITIAL_YOUTUBE_VIDEOS: YouTubeVideoItem[] = [
  {
    id: 'yt-deepmind-humanoid',
    title: 'DeepMind Robotics: Real-Time Humanoid Locomotion & Whole-Body Control 2026',
    channel: 'Google DeepMind Robotics',
    views: '1.4M visualizações',
    duration: '14:28',
    published: 'Há 2 dias',
    category: 'Robótica Humanóide',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
    summary: 'Apresentação dos novos modelos de controle de corpo inteiro baseados em redes neurais de difusão de trajetórias para robôs com atuadores de torque elétrico direto.',
    keyInsights: [
      'Amortecimento elástico adaptativo nos eixos principais J1-J3 reduz oscilações de carga em 38%',
      'Cálculo analítico do jacobiano transposto integrado com previsões autoregressivas em 240Hz',
      'Minimização do gasto de bateria usando controle de inércia passiva durante acelerações'
    ],
    simulatedVisuals: {
      targetMesh: 'Malha Esquelética 6-DOF // Torque Vetorial Ativo',
      jointDeltas: 'dθ1/dt: +1.4 rad/s | dθ2/dt: -0.8 rad/s | τ_est: 14.2 Nm',
      opticalFlow: 'Vetor de fluxo: [dx: 0.04, dy: -0.12] - Margem de estabilidade 99.9%'
    }
  },
  {
    id: 'yt-welding-neural',
    title: 'Soldagem Robotizada com Laser e Visão Computacional de Sub-Milímetro',
    channel: 'IEEE Robotics & Automation Society',
    views: '840K visualizações',
    duration: '09:45',
    published: 'Há 1 semana',
    category: 'Soldagem Neural',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
    summary: 'Como combinar câmeras de alta velocidade HDR com filtros passa-banda para rastreamento de poça de fusão em tempo real e controle de penetração da solda.',
    keyInsights: [
      'Modulação de frequência de arco a 50kHz reduz distorção térmica em perfis de alumínio e titânio',
      'Extração de contorno da junta soldada com rede convolucional leve processada em 5ms',
      'Auto-ajuste de vazão do gás de proteção conforme o gradiente de temperatura superficial'
    ],
    simulatedVisuals: {
      targetMesh: 'Detecção de Poça de Fusão // Termografia 1450°C',
      jointDeltas: 'Velocidade de avanço: 18.5 mm/s | Tensão do arco: 22.4V | Corrente: 135A',
      opticalFlow: 'Rastreamento de fresta: 0.12mm offset detectado e compensado em malha fechada'
    }
  },
  {
    id: 'yt-aloha-bimanual',
    title: 'Mobile ALOHA 2: Manipulação Bimanual Fina e Teleoperação Adaptativa',
    channel: 'Stanford Artificial Intelligence Lab',
    views: '2.1M visualizações',
    duration: '18:12',
    published: 'Há 3 semanas',
    category: 'Controle Cinemático',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    summary: 'Aprender habilidades complexas de montagem e manipulação por imitação a partir de poucas demonstrações usando modelos de difusão de ações (ACT).',
    keyInsights: [
      'Representação conjunta de espaço de juntas e espaço operacional cartesiano',
      'Fusão tátil-visual para preensão de peças frágeis sem deformação plástica',
      'Resolução de ambiguidades cinemáticas através de amostragem de fluxo probabilístico'
    ],
    simulatedVisuals: {
      targetMesh: 'Mapeamento de Garra Dupla // 12 Sensores Táteis Piezoelétricos',
      jointDeltas: 'Garra Esquerda: 82% clamp | Garra Direita: Orientação 35° pitch | Força: 4.8N',
      opticalFlow: 'Trajetória planejada interpolada por B-spline cúbica suave'
    }
  },
  {
    id: 'yt-gemini-vla',
    title: 'Gemini Robotics VLA: Da Instrução em Linguagem Natural ao Controle de Motores',
    channel: 'Google AI Research & Robotics',
    views: '3.6M visualizações',
    duration: '22:05',
    published: 'Há 5 dias',
    category: 'Auto-Programação',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    summary: 'Arquitetura unificada multimodal onde o modelo raciocina sobre objetos da fábrica, decompõe missões em passos primitivos e emite pacotes de torque diretamente.',
    keyInsights: [
      'Geração de código de controle em tempo de execução com verificação formal de limites de junta',
      'Recuperação autônoma de falhas quando um objeto escorrega da garra',
      'Auto-aprendizado contínuo através de inspeção de vídeos industriais abertos na Web'
    ],
    simulatedVisuals: {
      targetMesh: 'Segmentação Semântica // Máscara de Efetuador e Peça',
      jointDeltas: 'Tokenização de Ação: [MOVE_L, PULL_V, ROT_Z, TORQUE_CLAMP]',
      opticalFlow: 'Atenção visual focada no ponto de contato entre efetuador e alvo'
    }
  }
];

export const INITIAL_LEARN_EVENTS: YouTubeAutoLearnEvent[] = [
  {
    id: 'EVT-YT-001',
    timestamp: '13:02:10',
    videoId: 'yt-deepmind-humanoid',
    videoTitle: 'DeepMind Robotics: Real-Time Humanoid Locomotion',
    channel: 'Google DeepMind',
    keyframeTime: '04:18',
    extractedKnowledge: 'Compensação de amortecimento elástico dinâmico nos eixos principais J1-J3.',
    kinematicRuleDiscovered: 'Kd_adaptive = Kd_nominal * (1 + 0.38 * abs(d2theta/dt2))',
    appliedTo: 'ECOSSISTEMA_TOTAL',
    accuracyDelta: '+0.003 mm precisão cinemática',
    speedGain: '+14% velocidade de resposta',
    energyGain: '-24W dissipação térmica',
    codeSnippet: 'void applyElasticDamping(Joint &j) { j.kd = j.kd_base * 1.38; }'
  },
  {
    id: 'EVT-YT-002',
    timestamp: '13:05:44',
    videoId: 'yt-welding-neural',
    videoTitle: 'Soldagem Robotizada com Laser e Visão Computacional',
    channel: 'IEEE Robotics',
    keyframeTime: '07:22',
    extractedKnowledge: 'Modulação de arco em alta frequência e compensação de dilatação de junta.',
    kinematicRuleDiscovered: 'F_pwm = 50000 Hz; Duty_cycle = clamp(0.15, 0.85, heat_flow / k_therm)',
    appliedTo: 'COMPUTADOR',
    accuracyDelta: '+99.98% integridade de costura',
    speedGain: '+22% velocidade de avanço',
    energyGain: '-18% consumo elétrico do arco',
    codeSnippet: 'setPwmModulationFrequency(50000); setAdaptiveGasFlow(0.82);'
  }
];
