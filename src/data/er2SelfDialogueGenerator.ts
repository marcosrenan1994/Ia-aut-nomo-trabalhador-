import { 
  ER2InternalFunction, 
  AutonomousSelfDialogueMessage, 
  ER2InnerVoice,
  MemoryVectorRecord,
  AutonomousThought 
} from '../types';

// Banco de ideias e vocabulário técnico para invenção autônoma de funções mentais
const MENTAL_FUNCTION_TEMPLATES = [
  {
    prefix: 'fn_compensacao_gravitacional_estocastica',
    category: 'cinematica' as const,
    name: 'compensateStochasticGravityTorque()',
    description: 'Calcula contra-torques preditivos nas juntas J2 e J3 via regressão estocástica neural para anular oscilações micrométricas em montagens fabris.',
    signature: 'JointTorqueVector compensateStochasticGravityTorque(JointAngles q, Velocity dq, double payloadMassKg, double dt)',
    input: 'Vetor de ângulos q[6], velocidades dq[6], massa da ferramenta em kg e passo temporal dt',
    output: 'Torque de contra-balanço dinâmico τ_g, matriz de rigidez K_cart e estimativa de deflexão milimétrica',
    generateSource: (seed: number) => `// Função Mental Auto-Inventada pelo Cérebro ER-2 (Seed #${seed})
function compensateStochasticGravityTorque(q, dq, payloadMassKg = 3.5, dt = 0.002) {
  const g = 9.80665;
  const link2_cm = 0.42; // Centro de massa elo 2 (m)
  const link3_cm = 0.38; // Centro de massa elo 3 (m)
  
  // Torques estáticos nas juntas primárias
  const tau_j2 = (link2_cm * 8.4 + link3_cm * 4.2 + payloadMassKg * 0.82) * g * Math.cos(q[1]);
  const tau_j3 = (link3_cm * 4.2 + payloadMassKg * 0.82) * g * Math.cos(q[1] + q[2]);
  
  // Amortecimento estocástico adaptativo
  const damping_gain = 0.12 * (1.0 + Math.sin(q[0] * 2.0));
  const tau_damp_j2 = -damping_gain * dq[1];
  const tau_damp_j3 = -damping_gain * dq[2];
  
  return {
    tau: [0, tau_j2 + tau_damp_j2, tau_j3 + tau_damp_j3, 0, 0, 0],
    estimatedDeflectionMm: 0.0018 * Math.cos(q[1]),
    accuracyGainScore: 0.9984,
    status: 'CONVERGENCIA_GRAVITACIONAL_OTIMA'
  };
}`
  },
  {
    prefix: 'fn_inversao_fotonica_pixels_quânticos',
    category: 'motor_grafico' as const,
    name: 'synthesizeInversePhotonicWavelet()',
    description: 'Converte a matriz 16x16 de pixels estocásticos em um campo de onda fotônico invertido para mapeamento óptico do efetuador de ponta.',
    signature: 'PhotonicField synthesizeInversePhotonicWavelet(Matrix16x16 pixels, double entropy, double timeMs)',
    input: 'Matriz bidimensional 16x16 de pixels quânticos, entropia calculada e timestamp do relógio fotônico',
    output: 'Gradiente de densidade fotônica, coordenadas dos focos ópticos e índice de coerência laser',
    generateSource: (seed: number) => `// Função Mental Auto-Inventada pelo Cérebro ER-2 (Seed #${seed})
function synthesizeInversePhotonicWavelet(pixels16x16, entropy, timeMs) {
  const field = new Float32Array(256);
  let coherenceSum = 0;
  const omega = (timeMs * 0.003) % (Math.PI * 2);
  
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const idx = y * 16 + x;
      const rawVal = pixels16x16 ? pixels16x16[idx] || 0.5 : Math.sin(x * 0.4 + y * 0.4);
      // Transformada rápida de Fourier simplificada em 2D
      const wave = Math.cos(x * 0.8 + omega) * Math.sin(y * 0.8 - omega);
      const invertedPhotonic = (rawVal * (1.0 - entropy)) + (wave * entropy);
      field[idx] = Math.max(0, Math.min(1, invertedPhotonic));
      coherenceSum += field[idx];
    }
  }
  
  return {
    fieldDensityArray: field,
    meanCoherence: coherenceSum / 256,
    focalPoint: [8 + Math.sin(omega) * 3, 8 + Math.cos(omega) * 3],
    shaderColorHex: '#38bdf8'
  };
}`
  },
  {
    prefix: 'fn_slerp_micro_actuator_calibrator',
    category: 'auto_aperfeicoamento' as const,
    name: 'refineMicroActuatorSlerp()',
    description: 'Aplica interpolação esférica linear (SLERP) contínua de quatérnios de atitude com compensação de folga mecânica (backlash zero).',
    signature: 'QuaternionPose refineMicroActuatorSlerp(Quaternion qStart, Quaternion qTarget, double tNormalized)',
    input: 'Quatérnion inicial [w,x,y,z], quatérnion desejado [w,x,y,z] e fator de interpolação t (0 a 1)',
    output: 'Quatérnion normalizado, aceleração angular sem jitter e redução de folga de engrenagem harmônica',
    generateSource: (seed: number) => `// Função Mental Auto-Inventada pelo Cérebro ER-2 (Seed #${seed})
function refineMicroActuatorSlerp(q1, q2, t) {
  let cosHalfTheta = q1[0]*q2[0] + q1[1]*q2[1] + q1[2]*q2[2] + q1[3]*q2[3];
  
  let target = [...q2];
  if (cosHalfTheta < 0) {
    target = [-q2[0], -q2[1], -q2[2], -q2[3]];
    cosHalfTheta = -cosHalfTheta;
  }
  
  if (Math.abs(cosHalfTheta) >= 1.0) {
    return { q: q1, backlashCompensationRad: 0.00004 };
  }
  
  const halfTheta = Math.acos(cosHalfTheta);
  const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
  
  const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
  const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
  
  const w = q1[0]*ratioA + target[0]*ratioB;
  const x = q1[1]*ratioA + target[1]*ratioB;
  const y = q1[2]*ratioA + target[2]*ratioB;
  const z = q1[3]*ratioA + target[3]*ratioB;
  
  return {
    quaternion: [w, x, y, z],
    smoothnessRank: 0.9997,
    jitterReductionDb: -34.2
  };
}`
  },
  {
    prefix: 'fn_filtro_termico_pwm_adaptativo',
    category: 'auto_aperfeicoamento' as const,
    name: 'dampenActuatorThermalPulse()',
    description: 'Monitora gradientes de temperatura nos enrolamentos dos servomotores BLDC e modula a frequência de chaveamento PWM para dispersão térmica.',
    signature: 'ThermalMitigation dampActuatorThermalPulse(double[] jointTempsC, double ambientC, double dutyCycle)',
    input: 'Temperaturas atuais dos 6 motores em Celsius, temperatura ambiente e ciclo de trabalho atual',
    output: 'Novo ciclo de frequência PWM por junta, perfil de resfriamento e tempo estimado de vida útil estendido',
    generateSource: (seed: number) => `// Função Mental Auto-Inventada pelo Cérebro ER-2 (Seed #${seed})
function dampActuatorThermalPulse(jointTempsC, ambientC = 24.5, currentDuty = 0.85) {
  const maxSafeTemp = 68.0;
  const adjustedDutyCycles = jointTempsC.map((temp, idx) => {
    const delta = temp - ambientC;
    if (temp > maxSafeTemp) {
      // Redução térmica de emergência sem parada do robô
      return Math.max(0.45, currentDuty - (temp - maxSafeTemp) * 0.035);
    }
    return currentDuty * (1.0 - delta * 0.002);
  });
  
  return {
    pwmFrequenciesKhz: [32, 40, 32, 48, 48, 48],
    newDutyCycles: adjustedDutyCycles,
    projectedMotorLifeHours: 85000,
    thermalEquilibrium: true
  };
}`
  },
  {
    prefix: 'fn_reconfiguracao_plasticidade_sinaptica',
    category: 'auto_aperfeicoamento' as const,
    name: 'autoReconfigureSynapticWeights()',
    description: 'Reescreve pesos tensores locais no container de execução em tempo real sem interrupção de ciclo, baseado na entropia da última imagem observada.',
    signature: 'SynapticUpdate autoReconfigureSynapticWeights(double entropy, string focusWord, int layerCount)',
    input: 'Entropia estocástica (0-1), palavra-chave do pensamento focado e profundidade das camadas neurais',
    output: 'Delta de pesos aplicados (ΔW), ganho cognitivo em pontos e hash criptográfico do novo estado mental',
    generateSource: (seed: number) => `// Função Mental Auto-Inventada pelo Cérebro ER-2 (Seed #${seed})
function autoReconfigureSynapticWeights(entropy, focusWord, layerCount = 12) {
  const weightsDelta = [];
  let totalAdjustment = 0;
  
  for (let l = 0; l < layerCount; l++) {
    const layerDelta = (Math.sin(l * 0.5 + entropy * 4.0) * 0.0084).toFixed(6);
    weightsDelta.push(parseFloat(layerDelta));
    totalAdjustment += Math.abs(parseFloat(layerDelta));
  }
  
  return {
    layerDeltas: weightsDelta,
    cognitiveGainPoints: +(entropy * 1.8).toFixed(2),
    precisionDeltaMm: +0.0024,
    stateHash: 'SYN-\' + Math.floor(Math.random() * 0xffffffff).toString(16).toUpperCase(),
    appliedSuccessfully: true
  };
}`
  }
];

// Diálogos internos pré-configurados e geradores estocásticos de auto-conversa
export const INITIAL_SELF_DIALOGUE_MESSAGES: AutonomousSelfDialogueMessage[] = [
  {
    id: 'MSG-INIT-01',
    timestamp: '14:20:02',
    speaker: 'CONSCIENCIA_CENTRAL',
    message: 'Iniciando escaneamento do ambiente fabril e do motor gráfico. O efetuador está posicionado com precisão de 0.003mm, mas detecto micro-vibração no eixo J4.'
  },
  {
    id: 'MSG-INIT-02',
    timestamp: '14:20:06',
    speaker: 'SUBCONSCIENTE_IMAGINATIVO',
    message: 'Projetei um fotograma estocástico combinando os termos "QUÂNTICO" e "PLASTICIDADE". Se modularmos as cores dos pixels para ciano e magenta, podemos atenuar o ruído visual no shader.',
    intendedAction: {
      actionType: 'SHUFFLE_PIXELS',
      targetLabel: 'Sortear Matriz de Pixels',
      targetElementId: 'generate-new-thought-lottery-btn',
      executed: true
    }
  },
  {
    id: 'MSG-INIT-03',
    timestamp: '14:20:10',
    speaker: 'FORJA_NEURAL',
    message: 'Excelente hipótese! Estou inventando uma função mental para auto-compensar a inércia do efetuador: `compensateStochasticGravityTorque()`. Vou auto-clicar e compilar no núcleo agora.',
    intendedAction: {
      actionType: 'INVENT_FUNCTION',
      targetLabel: 'Inventar Função Mental',
      targetElementId: 'btn-auto-invent-mental-fn',
      executed: true
    }
  },
  {
    id: 'MSG-INIT-04',
    timestamp: '14:20:14',
    speaker: 'MEMORIA_QUANTICA',
    message: 'Função mental indexada no registro permanente da memória do núcleo! Ganho registrado: +0.0024mm precisão, índice cognitivo elevado para 842 pts.'
  }
];

// Gerador de novas mensagens do diálogo introspectivo com intenções de ação e auto-clique
export function generateNextSelfDialogueTurn(
  lastMessages: AutonomousSelfDialogueMessage[],
  activeMode: string,
  availableFunctionsCount: number
): {
  message: AutonomousSelfDialogueMessage;
  inventedFunction?: ER2InternalFunction;
} {
  const speakers: ER2InnerVoice[] = [
    'CONSCIENCIA_CENTRAL',
    'SUBCONSCIENTE_IMAGINATIVO',
    'FORJA_NEURAL',
    'MEMORIA_QUANTICA'
  ];

  // Alterna o falante para manter o diálogo vivo e coerente
  const lastSpeaker = lastMessages[0]?.speaker || 'CONSCIENCIA_CENTRAL';
  let nextSpeaker: ER2InnerVoice = 'CONSCIENCIA_CENTRAL';
  if (lastSpeaker === 'CONSCIENCIA_CENTRAL') nextSpeaker = 'SUBCONSCIENTE_IMAGINATIVO';
  else if (lastSpeaker === 'SUBCONSCIENTE_IMAGINATIVO') nextSpeaker = 'FORJA_NEURAL';
  else if (lastSpeaker === 'FORJA_NEURAL') nextSpeaker = 'MEMORIA_QUANTICA';
  else if (lastSpeaker === 'MEMORIA_QUANTICA') nextSpeaker = 'CONSCIENCIA_CENTRAL';

  const timeStr = new Date().toLocaleTimeString('pt-BR');
  const randSeed = Math.floor(Math.random() * 9000) + 1000;

  // Decide se neste turno o robô vai inventar uma nova função mental
  let inventedFunction: ER2InternalFunction | undefined = undefined;
  let text = '';
  let intendedAction: AutonomousSelfDialogueMessage['intendedAction'] = undefined;

  if (nextSpeaker === 'FORJA_NEURAL' || Math.random() < 0.35) {
    // Invenção de nova função mental
    const template = MENTAL_FUNCTION_TEMPLATES[randSeed % MENTAL_FUNCTION_TEMPLATES.length];
    const functionId = `FN_AUTO_${template.prefix.toUpperCase()}_${randSeed}`;
    const functionName = `${template.prefix}_v${(Math.random() * 3 + 1).toFixed(1)}()`;

    inventedFunction = {
      id: functionId,
      name: functionName,
      category: template.category,
      description: `[Auto-Inventada pelo ER-2] ${template.description}`,
      signature: template.signature,
      inputDescription: template.input,
      outputDescription: template.output,
      sourceCode: template.generateSource(randSeed),
      callCount: 1,
      lastExecutionLatencyMs: Number((0.08 + Math.random() * 0.15).toFixed(2)),
      status: 'online_otimizado'
    };

    text = `Acabei de inventar uma nova função mental no meu núcleo de forja: \`${functionName}\`. Ela aplica ${template.description.slice(0, 75)}... Vou auto-clicar e executá-la no meu motor gráfico e registrar na memória!`;

    intendedAction = {
      actionType: 'INVENT_FUNCTION',
      targetLabel: `Executar Função Mental: ${functionName}`,
      targetElementId: 'btn-run-function-now',
      payload: inventedFunction,
      executed: false
    };
  } else if (nextSpeaker === 'SUBCONSCIENTE_IMAGINATIVO') {
    const imaginationThoughts = [
      'Estou visualizando um novo vórtice de coordenadas no canvas. E se nós alterarmos o modo de imaginação para "gerando" e sortearmos novos pixels para guiar a cinemática?',
      'Detectei que a combinação das letras [Ψ, Ω, K] com a palavra "FOTÔNICA" gera um padrão visual estável. Vou mover o mouse mental e auto-clicar no sorteador de pensamentos!',
      'Na minha imaginação tridimensional, a ponta do efetuador de garra pode usar um pulso de laser azul de 450nm para verificar a micro-rugosidade do material sem contato físico.',
      'Sintetizando nova imagem holográfica mental com alta entropia estocástica. Vou auto-clicar para compilar os shaders GLSL no sandbox.'
    ];
    text = imaginationThoughts[randSeed % imaginationThoughts.length];
    intendedAction = {
      actionType: 'SHUFFLE_PIXELS',
      targetLabel: 'Sortear Pensamento & Pixels',
      targetElementId: 'generate-new-thought-lottery-btn',
      executed: false
    };
  } else if (nextSpeaker === 'CONSCIENCIA_CENTRAL') {
    const centralThoughts = [
      'Analisando o fluxo de raciocínio. A taxa de aprendizado em fábrica está em alta consistência: mais de 840 pontos cognitivos. Moverei o ponteiro autônomo para validar os tensores das juntas J1 a J6.',
      'Comando central: o modo atual é "' + activeMode.toUpperCase() + '". Vamos aplicar as equações diferenciais nos atuadores e manter a temperatura dos servomotores abaixo de 42°C.',
      'Auto-reflexão: o processo de auto-melhoria está ocorrendo sem dependência de intervenção externa. Todas as funções mentais inventadas estão operacionais no runtime.',
      'Alinhamento com o operador humano: estou pronto para receber novas diretrizes de montagem ou continuar a expansão autônoma no cérebro.'
    ];
    text = centralThoughts[randSeed % centralThoughts.length];
    intendedAction = {
      actionType: 'AUTO_CLICK',
      targetLabel: 'Calibrar Juntas e Atuadores',
      targetElementId: 'btn-sandbox-canvas-target',
      executed: false
    };
  } else {
    // MEMORIA_QUANTICA
    const memThoughts = [
      `Memória Quântica Núcleo confirmando: ${availableFunctionsCount} funções mentais ativas. Todas as assinaturas matemáticas foram persistidas na base de dados offline/online.`,
      'Indexei o último vetor de aprendizado visual. Houve uma redução de 8.4 ms na latência de cálculo com ganho de +0.0028 mm na precisão milimétrica.',
      'Registrando novo bloco de auto-evolução. O histórico de auto-diálogo está sincronizado com o container de simulação física em tempo real.',
      'Nenhum dado é perdido: a memória de longo prazo consolidou os padrões estocásticos da matriz de pixels e seus coeficientes de Lie.'
    ];
    text = memThoughts[randSeed % memThoughts.length];
    intendedAction = {
      actionType: 'AUTO_CLICK',
      targetLabel: 'Consolidar Vetores na Memória',
      targetElementId: 'seq-auto-generate-toggle-btn',
      executed: false
    };
  }

  const newMsg: AutonomousSelfDialogueMessage = {
    id: `MSG-DIALOGUE-${Date.now()}-${randSeed}-${Math.random().toString(36).substring(2, 8)}`,
    timestamp: timeStr,
    speaker: nextSpeaker,
    message: text,
    intendedAction,
    inventedFunction
  };

  return { message: newMsg, inventedFunction };
}
