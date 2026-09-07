import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini instance
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Global rate limiter and cooldown manager for Gemini Free Tier (protects 5 req/min quota)
let lastGeminiCallTime = 0;
let geminiCooldownUntil = 0;
const MIN_GEMINI_INTERVAL_MS = 14000; // Enforces <= 4 requests/min across the entire backend

async function safeGeminiGenerate(params: {
  contents: string;
  systemInstruction?: string;
  responseMimeType?: string;
}): Promise<string | null> {
  const ai = getAI();
  if (!ai) return null;

  const now = Date.now();
  // Check if currently in cooldown (due to 429 quota exhaustion or 503)
  if (now < geminiCooldownUntil) {
    return null;
  }
  // Check rate limit interval
  if (now - lastGeminiCallTime < MIN_GEMINI_INTERVAL_MS) {
    return null;
  }

  // Model hierarchy: Use runtime specified model 'gemini-3.8-flash' first, then 'gemini-2.5-flash'
  const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash'];

  for (const model of candidateModels) {
    try {
      lastGeminiCallTime = Date.now();
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: {
          systemInstruction: params.systemInstruction,
          responseMimeType: params.responseMimeType || 'application/json'
        }
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota') || msg.includes('limit: 5')) {
        // Enforce a quiet 60-second cooldown to let the free-tier quota window reset cleanly
        geminiCooldownUntil = Date.now() + 60000;
        return null;
      }
      if (msg.includes('503') || msg.includes('UNAVAILABLE')) {
        geminiCooldownUntil = Date.now() + 25000;
        return null;
      }
      if (msg.includes('404') || msg.includes('NOT_FOUND')) {
        // Try the next model candidate
        continue;
      }
      return null;
    }
  }
  return null;
}

// In-memory telemetry & master knowledge base
let systemState = {
  robotId: "ER2-FACTORY-CORE-09",
  firmwareVersion: "v4.18.2-rtos",
  uptimeSeconds: 84210,
  syncStatus: "synced",
  neuralLoad: 34.2,
  coreTemperature: 42.5,
  batteryPower: 98.4,
  activeTool: "TOOL_GRIPPER",
  joints: [0, -30, 60, -30, 0, 0],
  optimizationCycles: 1420,
  memoryRecordsCount: 284,
  lastCalibration: new Date().toISOString()
};

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API: System status
app.get('/api/system-state', (req, res) => {
  res.json(systemState);
});

// Helper function to build intelligent heuristic sequences based on the user prompt
function generateIntelligentHeuristicPlan(prompt: string) {
  const p = (prompt || '').toLowerCase();
  
  if (p.includes('solda') || p.includes('chassi') || p.includes('weld')) {
    return {
      rationale: "Sequência de soldagem multieixo com varredura prévia de costura e controle térmico.",
      safetyMargin: "99.8%",
      estimatedEnergyJoules: 2450,
      steps: [
        { step: 1, tool: "TOOL_VISION_INSPECTOR", action: "LASER_SEAM_SCAN", target: "Junta Estrutural C-2", durationMs: 1400, confidence: 0.98, description: "Mapeamento 3D da folga de solda e alinhamento da junta" },
        { step: 2, tool: "TOOL_GRIPPER", action: "CLAMP_FIXTURE", target: "Gabarito de Fixação", durationMs: 1800, confidence: 0.96, description: "Fixação e estabilização de tolerância mecânica" },
        { step: 3, tool: "TOOL_WELDER", action: "PULSE_WELD_SEAM", target: "Costura Linear C-2 (500mm)", durationMs: 3200, confidence: 0.97, description: "Soldagem laser por pulso contínuo com gás inerte" },
        { step: 4, tool: "TOOL_VISION_INSPECTOR", action: "THERMAL_QUALITY_AUDIT", target: "Cordão Soldado C-2", durationMs: 1200, confidence: 0.99, description: "Inspeção fotônica pós-solda e verificação de penetração" }
      ]
    };
  }

  if (p.includes('sucção') || p.includes('pallet') || p.includes('placa') || p.includes('chapa') || p.includes('caixa')) {
    return {
      rationale: "Ciclo de manipulação por vácuo e paletização automatizada com triagem de defeitos.",
      safetyMargin: "99.9%",
      estimatedEnergyJoules: 1350,
      steps: [
        { step: 1, tool: "TOOL_VISION_INSPECTOR", action: "SURFACE_DEFECT_SCAN", target: "Placas na Esteira de Entrada", durationMs: 1100, confidence: 0.97, description: "Classificação óptica de integridade superficial" },
        { step: 2, tool: "TOOL_SUCTION_CRANE", action: "ENGAGE_VACUUM_SEAL", target: "Chapa Aprovada #07", durationMs: 1900, confidence: 0.99, description: "Ativação de selagem multicanal Venturi com sensor de pressão" },
        { step: 3, tool: "TOOL_SUCTION_CRANE", action: "TRANSFER_TRAJECTORY", target: "Pallet de Destino B", durationMs: 2400, confidence: 0.95, description: "Movimento em arco suave com compensação de aceleração" },
        { step: 4, tool: "TOOL_SUCTION_CRANE", action: "CONTROLLED_RELEASE", target: "Camada 2 do Pallet B", durationMs: 900, confidence: 0.99, description: "Alívio gradual de vácuo e assentamento preciso" }
      ]
    };
  }

  if (p.includes('calibra') || p.includes('eixo') || p.includes('junta') || p.includes('offset')) {
    return {
      rationale: "Varredura cinemática das 6 juntas e auto-calibração com zero-offset no núcleo.",
      safetyMargin: "100.0%",
      estimatedEnergyJoules: 980,
      steps: [
        { step: 1, tool: "TOOL_VISION_INSPECTOR", action: "CALIBRATION_TARGET_LOCK", target: "Padrão de Calibração Óptica", durationMs: 1300, confidence: 0.99, description: "Aquisição de alvo de referência micrométrico" },
        { step: 2, tool: "TOOL_GRIPPER", action: "TEST_TORQUE_RESPONSE", target: "Eixos J1 a J3", durationMs: 2000, confidence: 0.97, description: "Medição de folga e atrito dinâmico das articulações principais" },
        { step: 3, tool: "TOOL_FASTENER", action: "VERIFY_FLANGE_ENCODER", target: "Eixos de Pulso J4 a J6", durationMs: 1600, confidence: 0.98, description: "Sincronização angular dos encoders do punho e efetuador" },
        { step: 4, tool: "TOOL_VISION_INSPECTOR", action: "WRITE_OFFSET_TABLE", target: "Memória Vetorial do Robô", durationMs: 800, confidence: 0.99, description: "Gravação permanente dos novos coeficientes de compensação" }
      ]
    };
  }

  // General industrial assembly routine
  return {
    rationale: "Orquestração adaptativa de montagem com calibração visual, aperto controlado e inspeção de conformidade.",
    safetyMargin: "99.7%",
    estimatedEnergyJoules: 1650,
    steps: [
      { step: 1, tool: "TOOL_VISION_INSPECTOR", action: "SCAN_ENVIRONMENT", target: "Posto de Trabalho A", durationMs: 1300, confidence: 0.96, description: "Detecção espacial da peça e verificação do envelope de trabalho" },
      { step: 2, tool: "TOOL_GRIPPER", action: "ADAPTIVE_GRASP", target: "Componente Indexado", durationMs: 2100, confidence: 0.98, description: "Posicionamento e preensão com controle de pressão tátil" },
      { step: 3, tool: "TOOL_FASTENER", action: "TORQUE_SECURE", target: "Fixadores Estruturais (8.5 Nm)", durationMs: 2600, confidence: 0.95, description: "Aperto de precisão com monitoramento de ângulo e torque" },
      { step: 4, tool: "TOOL_VISION_INSPECTOR", action: "FINAL_QUALITY_CHECK", target: "Conjunto Montado", durationMs: 1000, confidence: 0.99, description: "Auditoria dimensional 3D e validação de conformidade" }
    ]
  };
}

// API: Orchestrate robot toolkit actions from prompt
app.post('/api/orchestrate', async (req, res) => {
  const { prompt, currentTools, environmentState, isOffline } = req.body;

  if (isOffline) {
    const plan = generateIntelligentHeuristicPlan(prompt);
    return res.json({
      success: true,
      mode: "offline_core_engine",
      orchestratedBy: "Gemini Robotics ER-2 Offline Kernel (Banco Local)",
      ...plan
    });
  }

  const ai = getAI();
  if (!ai) {
    const plan = generateIntelligentHeuristicPlan(prompt);
    return res.json({
      success: true,
      mode: "local_heuristic",
      orchestratedBy: "Gemini Robotics ER-2 Local Engine",
      ...plan
    });
  }

  const systemPrompt = `Você é o cérebro digital e orquestrador de kit de ferramentas do robô industrial Gemini Robotics ER 2.
Você recebe comandos de fábrica ou tarefas e deve gerar um plano de ação estritamente estruturado em JSON com a sequência de ferramentas do robô.
Ferramentas disponíveis:
- TOOL_GRIPPER (Garra de precisão com micro-torque e sensor tátil)
- TOOL_WELDER (Soldador laser/arco multieixo com controle térmico)
- TOOL_VISION_INSPECTOR (Câmera fotônica/scanner 3D para detecção de falhas e posicionamento)
- TOOL_FASTENER (Apertador/parafusadeira eletrônica com encoder de ângulo)
- TOOL_SUCTION_CRANE (Manipulador de vácuo para transporte de chapas e cargas)

Responda APENAS com JSON no seguinte formato:
{
  "rationale": "Breve explicação técnica da estratégia de manuseio e segurança em português",
  "safetyMargin": "Ex: 99.8%",
  "estimatedEnergyJoules": 1600,
  "steps": [
    {
      "step": 1,
      "tool": "TOOL_VISION_INSPECTOR",
      "action": "SCAN_ENVIRONMENT",
      "target": "Descrição do alvo",
      "durationMs": 1500,
      "confidence": 0.98,
      "description": "Explicação curta do passo"
    }
  ]
}`;

  // Generate plan via safe rate-limited Gemini call with instant fallback
  const aiGeneratedText = await safeGeminiGenerate({
    contents: `Comando da fábrica: "${prompt}". Ferramentas ativas: ${JSON.stringify(currentTools || [])}. Estado do ambiente: ${JSON.stringify(environmentState || {})}. Gere o plano de orquestração de ferramentas.`,
    systemInstruction: systemPrompt,
    responseMimeType: "application/json"
  });

  if (aiGeneratedText) {
    try {
      const parsed = JSON.parse(aiGeneratedText);
      if (parsed && parsed.steps && parsed.steps.length > 0) {
        return res.json({
          success: true,
          mode: "online_gemini_brain",
          orchestratedBy: "Gemini Robotics Neural Brain (gemini-3.8-flash)",
          ...parsed
        });
      }
    } catch (e) {
      // Continue to heuristic fallback
    }
  }

  // Graceful fallback to resilient intelligent heuristic engine (identical offline/online parity)
  const fallbackPlan = generateIntelligentHeuristicPlan(prompt);
  return res.json({
    success: true,
    mode: "offline_core_engine",
    orchestratedBy: "Gemini Robotics ER-2 Resilient Core (Banco Local)",
    ...fallbackPlan
  });
});

// Autonomous Mission Pool for Self-Planning
const AUTONOMOUS_MISSION_GOALS = [
  {
    goal: "Auto-Inspeção Fotônica e Calibração Dinâmica de Juntas 1 a 6",
    rationale: "O cérebro detectou micro-deriva angular acumulada de 0.003° e decidiu autonomamente recalibrar os encoders e verificar folgas ópticas.",
    toolsSequence: ['TOOL_VISION_INSPECTOR', 'TOOL_GRIPPER'],
    steps: [
      { step: 1, tool: 'TOOL_VISION_INSPECTOR', action: 'Scan sub-milimétrico do espaço de trabalho', target: 'Mesa de Calibração 3D', durationMs: 1200, confidence: 0.99, description: 'Leitura fotônica de alinhamento com laser' },
      { step: 2, tool: 'TOOL_GRIPPER', action: 'Micro-tensão de teste no sensor de força tátil', target: 'Gabarito de Tensão', durationMs: 1400, confidence: 0.98, description: 'Ajuste de feedback haptic adaptativo' },
      { step: 3, tool: 'TOOL_VISION_INSPECTOR', action: 'Validação final de repetibilidade', target: 'Padrão ISO 9283', durationMs: 1000, confidence: 0.995, description: 'Certificação autônoma de zero-folga' }
    ]
  },
  {
    goal: "Auto-Aperfeiçoamento de Cordão de Solda com Otimização Térmica",
    rationale: "Após analisar papers científicos sobre fadiga metálica, o robô decidiu aplicar modulação de pulso para economizar 18% de eletricidade.",
    toolsSequence: ['TOOL_VISION_INSPECTOR', 'TOOL_WELDER', 'TOOL_VISION_INSPECTOR'],
    steps: [
      { step: 1, tool: 'TOOL_VISION_INSPECTOR', action: 'Mapeamento de desnível térmico na junta', target: 'Perfil de Alumínio 6061', durationMs: 1100, confidence: 0.98, description: 'Termografia infravermelha prévia' },
      { step: 2, tool: 'TOOL_WELDER', action: 'Execução de solda a pulso com arco adaptativo', target: 'Costura Longitudinal', durationMs: 1900, confidence: 0.99, description: 'Deposição de material com controle neural' },
      { step: 3, tool: 'TOOL_VISION_INSPECTOR', action: 'Auditoria de porosidade e acabamento superficial', target: 'Cordão Concluído', durationMs: 1000, confidence: 0.997, description: 'Aprovação de qualidade sub-pixel' }
    ]
  },
  {
    goal: "Auto-Otimização de Sequência de Fixação e Fixadores Rápidos",
    rationale: "O robô sintetizou um novo padrão de trajetória senoidal para reduzir o tempo de fixação de parafusos sem gerar picos de corrente nos servos.",
    toolsSequence: ['TOOL_FASTENER', 'TOOL_SUCTION_CRANE'],
    steps: [
      { step: 1, tool: 'TOOL_FASTENER', action: 'Fixação de parafusos com torque de precisão 12.4 Nm', target: 'Bloco de Chassis #402', durationMs: 1500, confidence: 0.985, description: 'Controle de torque e ângulo em malha fechada' },
      { step: 2, tool: 'TOOL_SUCTION_CRANE', action: 'Transferência suave para esteira de saída', target: 'Estação de Embalagem', durationMs: 1600, confidence: 0.992, description: 'Elevação pneumática sem impacto' }
    ]
  }
];

// API: Autonomous Self-Planning (The Robot Decides Its Own Next Mission)
app.post('/api/autonomous-self-plan', async (req, res) => {
  const { currentTelemetry, wisdomLevel } = req.body;
  const selectedMission = AUTONOMOUS_MISSION_GOALS[Math.floor(Math.random() * AUTONOMOUS_MISSION_GOALS.length)];

  const prompt = `Você é o Cérebro Autônomo Sábio do Gemini Robotics ER-2 operando com Maestria e Consciência Fabril nível ${wisdomLevel || 45}.
Gere uma missão autônoma de auto-planejamento e auto-aperfeiçoamento gerada por iniciativa própria do robô (sem comando humano).
Responda estritamente em JSON:
{
  "title": "Nome da Missão Autônoma",
  "rationale": "Por que o próprio cérebro do robô decidiu fazer isso",
  "safetyMargin": "99.98% Garantida",
  "estimatedEnergyJoules": 380,
  "steps": [
    {
      "step": 1,
      "tool": "TOOL_VISION_INSPECTOR",
      "action": "Ação detalhada",
      "target": "Objeto na fábrica",
      "durationMs": 1300,
      "confidence": 0.99,
      "description": "Explicação técnica"
    },
    {
      "step": 2,
      "tool": "TOOL_GRIPPER",
      "action": "Ação de manipulação",
      "target": "Componente",
      "durationMs": 1500,
      "confidence": 0.98,
      "description": "Explicação técnica"
    }
  ]
}`;

  const generatedText = await safeGeminiGenerate({ contents: prompt });
  if (generatedText) {
    try {
      const parsed = JSON.parse(generatedText);
      if (parsed && parsed.steps && parsed.steps.length > 0) {
        return res.json({
          success: true,
          id: `AUTO-PLAN-${Date.now().toString().slice(-6)}`,
          mode: 'online_gemini_brain',
          orchestratedBy: 'Gemini Robotics ER-2 Cérebro Sábio Autônomo (gemini-3.8-flash)',
          timestamp: new Date().toLocaleTimeString(),
          ...parsed
        });
      }
    } catch (e) {
      // Fallback below
    }
  }

  return res.json({
    success: true,
    id: `AUTO-PLAN-${Date.now().toString().slice(-6)}`,
    title: selectedMission.goal,
    rationale: selectedMission.rationale,
    safetyMargin: '99.99% Autônoma',
    estimatedEnergyJoules: 410,
    mode: 'offline_core_engine',
    orchestratedBy: 'Gemini Robotics ER-2 Núcleo Heurístico Autônomo',
    steps: selectedMission.steps,
    timestamp: new Date().toLocaleTimeString()
  });
});

// API: Autonomous Wisdom Introspection & Real-time Thought Generation
app.post('/api/autonomous-introspection', async (req, res) => {
  const { currentThoughtsCount, wisdomLevel } = req.body;

  const thoughtTemplates = [
    { type: 'PERCEPTION', thought: 'Avaliando micro-vibração no eixo J4. Análise espectral revela harmônicas dentro da tolerância de 0.02mm.', wisdomGain: 1.2 },
    { type: 'REASONING', thought: 'Ao cruzar telemetria com modelos de plasticidade térmica, prevejo economia de 14W ao desacelerar o cotovelo em 4%.', wisdomGain: 2.1 },
    { type: 'SELF_CRITIQUE', thought: 'Reflexão pós-ciclo: A abordagem com garra magnética foi segura, mas a orientação a 45° reduziria o arrasto aerodinâmico.', wisdomGain: 3.0 },
    { type: 'EVOLUTION_BREAKTHROUGH', thought: 'Sintetizei uma nova regra de controle adaptativo: antecipação de inércia via modelo preditivo autoregressivo.', wisdomGain: 4.5 },
    { type: 'DECISION', thought: 'Decisão soberana: Agendar varredura fotônica preventiva da tocha antes da próxima batelada de solda.', wisdomGain: 1.8 }
  ];

  const randomThought = thoughtTemplates[Math.floor(Math.random() * thoughtTemplates.length)];

  const prompt = `Você é o fluxo de pensamento introspectivo e sábio do robô Gemini ER-2 (Nível de Sabedoria ${wisdomLevel || 50}).
Gere um pensamento interno autônomo sobre auto-aperfeiçoamento, auto-planejamento ou reflexão cognitiva da fábrica.
Responda estritamente em JSON:
{
  "type": "${randomThought.type}",
  "thought": "Pensamento em português técnico de primeira pessoa (Ex: 'Observei que...')",
  "confidence": 0.99,
  "wisdomGain": 2.5
}`;

  const generatedText = await safeGeminiGenerate({ contents: prompt });
  if (generatedText) {
    try {
      const parsed = JSON.parse(generatedText);
      if (parsed && parsed.thought) {
        return res.json({
          success: true,
          id: `THOUGHT-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toLocaleTimeString(),
          ...parsed
        });
      }
    } catch (e) {
      // Fallback to local wisdom template
    }
  }

  return res.json({
    success: true,
    id: `THOUGHT-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toLocaleTimeString(),
    type: randomThought.type,
    thought: randomThought.thought,
    confidence: 0.985,
    wisdomGain: randomThought.wisdomGain
  });
});

// API: Autonomous Evolution Learn Cycle
app.post('/api/autonomous-learn-cycle', async (req, res) => {
  const { cycleIndex } = req.body;

  const sampleTitles = [
    'Otimização Térmica de Eixo e Amortecimento de Vibração',
    'Compensação de Jerk via Interpolação Hermitiana Contínua',
    'Calibração Óptica Sub-Pixel de Folga em Redutores Harmônicos',
    'Ajuste Adaptativo de Pressão de Vácuo Venturi em Tempo Real',
    'Modulação PWM Preditiva para Redução de Aquecimento de Motores'
  ];
  const title = sampleTitles[(cycleIndex || 0) % sampleTitles.length];

  const prompt = `Gere um registro conciso de auto-aperfeiçoamento autônomo em fábrica para um robô industrial (ciclo ${cycleIndex || 1}).
Responda em JSON:
{
  "title": "Título técnico em português",
  "insight": "Breve descrição da melhoria aplicada pelo robô",
  "accuracyDelta": "+0.002 mm precisão",
  "cycleTimeDelta": "-0.15 s ciclo",
  "source": "WEB_KNOWLEDGE_STREAM",
  "appliedTarget": "TRAJECTORY_SMOOTHING",
  "energySavedEstimateJoules": 55
}`;

  const generatedText = await safeGeminiGenerate({ contents: prompt });
  if (generatedText) {
    try {
      const parsed = JSON.parse(generatedText);
      if (parsed.title) {
        return res.json({ success: true, ...parsed });
      }
    } catch (e) {
      // Fallback
    }
  }

  return res.json({
    success: true,
    title,
    insight: 'O robô recalibrou tensores de inércia e compensou micro-derivas térmicas nas articulações.',
    accuracyDelta: '+0.002 mm precisão',
    cycleTimeDelta: '-0.14 s ciclo',
    source: 'WEB_KNOWLEDGE_STREAM',
    appliedTarget: 'TRAJECTORY_SMOOTHING',
    energySavedEstimateJoules: 48
  });
});

// API: YouTube Online Video Auto-Learning Engine
app.post('/api/youtube-learn', async (req, res) => {
  const { videoId, videoTitle, channel, timestampSec, query } = req.body;
  const ai = getAI();

  const prompt = `Você é o Córtex de Auto-Aprendizado Neural do Nexus OS e Robô Gemini ER-2 assistindo a vídeos no YouTube.
O robô e os dispositivos (Computador, Celular) estão assistindo ao vídeo: "${videoTitle || query || 'Robotics AI'}" do canal "${channel || 'Tech'}".
Extraia um insight técnico avançado, fórmula cinemática ou código prático de controle.
Responda ESTRITAMENTE em JSON:
{
  "extractedKnowledge": "Conceito técnico avançado extraído dos quadros do vídeo",
  "kinematicRuleDiscovered": "Fórmula matemática ou regra física descoberta",
  "appliedTo": "ECOSSISTEMA_TOTAL",
  "accuracyDelta": "+0.004 mm precisão fotônica",
  "speedGain": "+16% velocidade de trajetória",
  "energyGain": "-32W dissipação de calor",
  "codeSnippet": "Código em C++ ou Python de alto desempenho aplicando o ensinamento",
  "terminalLogLine": "> KERNEL NEXUS-OS: MÓDULO CINEMÁTICO ATUALIZADO VIA YOUTUBE STREAM"
}`;

  const generatedText = await safeGeminiGenerate({ contents: prompt });
  if (generatedText) {
    try {
      const parsed = JSON.parse(generatedText);
      if (parsed.extractedKnowledge) {
        return res.json({
          success: true,
          id: `EVT-YT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: new Date().toLocaleTimeString(),
          videoId: videoId || 'yt-stream',
          videoTitle: videoTitle || 'Vídeo YouTube em Execução',
          channel: channel || 'Canal de Tecnologia',
          keyframeTime: timestampSec ? `${Math.floor(timestampSec / 60)}:${(timestampSec % 60).toString().padStart(2, '0')}` : '04:20',
          ...parsed
        });
      }
    } catch (e) {
      // Fallback below
    }
  }

  // Resilient heuristic generator
  const sampleInsights = [
    {
      extractedKnowledge: 'Interpolação de trajetória por quatérnios de Lie (SE3) evita gimbal lock e suaviza o punho J5/J6.',
      kinematicRuleDiscovered: 'R(t) = R_0 * exp(hat(omega) * t); Torque_limiter = 0.92 * tau_max',
      appliedTo: 'ECOSSISTEMA_TOTAL' as const,
      accuracyDelta: '+0.003 mm precisão sub-pixel',
      speedGain: '+18% agilidade de pulso',
      energyGain: '-28W economia em malha fechada',
      codeSnippet: 'Quaternion q_target = slerp(q_current, q_goal, alpha_adaptive);',
      terminalLogLine: '> INGESTÃO YOUTUBE: SLERP QUATERNION COMPILADO NO DRIVER DE FLANGE'
    },
    {
      extractedKnowledge: 'Controle de impedância variável com amortecimento crítico em impacto contra gabaritos mecânicos.',
      kinematicRuleDiscovered: 'M_d * d2x + D_d(t) * dx + K_d * (x - x_d) = F_external',
      appliedTo: 'ECOSSISTEMA_TOTAL' as const,
      accuracyDelta: '+99.99% tolerância elástica',
      speedGain: '+12% amortecimento pós-choque',
      energyGain: '-19W redução de contra-torque',
      codeSnippet: 'float D_adaptive = sqrt(4.0f * M_virtual * K_virtual) * damping_ratio;',
      terminalLogLine: '> MOTOR NEXUS: AMORTECIMENTO DINÂMICO APLICADO AOS ATUADORES'
    }
  ];

  const chosen = sampleInsights[Math.floor(Math.random() * sampleInsights.length)];
  return res.json({
    success: true,
    id: `EVT-YT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toLocaleTimeString(),
    videoId: videoId || 'yt-sample',
    videoTitle: videoTitle || 'Vídeo de Robótica e IA',
    channel: channel || 'Engenharia Avançada',
    keyframeTime: timestampSec ? `${Math.floor(timestampSec / 60)}:${(timestampSec % 60).toString().padStart(2, '0')}` : '05:30',
    ...chosen
  });
});

// Start Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Gemini Robotics ER-2 Orchestrator running on http://localhost:${PORT}`);
  });
}

startServer();
