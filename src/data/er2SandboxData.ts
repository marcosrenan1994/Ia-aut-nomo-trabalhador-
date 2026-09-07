import { ER2InternalFunction, ER2ImaginationFrame } from '../types';

// Asset paths to the generated high-definition visual imagination images
import er2NeuralConcept from '../assets/images/er2_neural_imagination_concept_1788725614162.jpg';
import er2CadBlueprint from '../assets/images/er2_cad_hardware_blueprint_1788725630443.jpg';
import er2SpatialVoxel from '../assets/images/er2_spatial_mission_voxel_1788725644819.jpg';
import er2SiliconForge from '../assets/images/er2_silicon_forge_render_1788725660717.jpg';
import er2LexicalMatrix from '../assets/images/er2_lexical_pixel_matrix_1788726954045.jpg';
import er2CyberForge from '../assets/images/er2_autonomous_cyber_forge_1788726974308.jpg';

export const ER2_ASSET_IMAGES = {
  neuralConcept: er2NeuralConcept,
  cadBlueprint: er2CadBlueprint,
  spatialVoxel: er2SpatialVoxel,
  siliconForge: er2SiliconForge,
  lexicalMatrix: er2LexicalMatrix,
  cyberForge: er2CyberForge
};

// ER-2 Internal Brain Functions & Autonomous Callable Capabilities
export const ER2_INTERNAL_FUNCTIONS: ER2InternalFunction[] = [
  {
    id: 'FN_LIE_ALGEBRA_KINEMATICS',
    name: 'synthesizeLieKinematics()',
    category: 'cinematica',
    description: 'Calcula cinemática direta e inversa sobre o grupo de Lie SE(3) eliminando eixos singulares em manipuladores 6-DOF com SLERP em quatérnios.',
    signature: 'SE3Pose synthesizeLieKinematics(JointAngles q, Velocity dq, Acceleration ddq, double dt)',
    inputDescription: 'Ângulos das 6 juntas J1-J6 em radianos, derivadas e vetor de tempo delta',
    outputDescription: 'Matriz homogênea 4x4, quatérnion normalizado e torque de compensação Coriolis',
    sourceCode: `// Gemini ER-2 Kernel - Álgebra de Lie SE(3)
function synthesizeLieKinematics(q, dq, ddq, dt) {
  const R = lieExpMap(so3Hat(q.slice(3, 6)));
  const p = computeForwardCartesian(q.slice(0, 3));
  const J = computeAnalyticJacobian(q);
  const tau_coriolis = computeChristoffelTorque(q, dq);
  return {
    homogenousMatrix: composeSE3(R, p),
    jacobianRank: matrixRank(J),
    singularityDistance: computeManipulabilityMeasure(J),
    feedforwardTorque: tau_coriolis
  };
}`,
    callCount: 14820,
    lastExecutionLatencyMs: 0.18,
    status: 'online_otimizado'
  },
  {
    id: 'FN_GRAPHICS_ENGINE_SHADER',
    name: 'renderAutonomousVisualCanvas()',
    category: 'motor_grafico',
    description: 'Motor gráfico procedural 2D/3D executado no núcleo do ER-2. Converte vetores matemáticos em renderização gráfica contínua de imagens e shaders.',
    signature: 'void renderAutonomousVisualCanvas(HTMLCanvasElement ctx, ShaderParams params, double time)',
    inputDescription: 'Contexto de renderização gráfica, tensores visuais da imaginação e timestamp contínuo',
    outputDescription: 'Projeção fotônica na tela, campo vetorial renderizado e buffer de pixels 60FPS',
    sourceCode: `// Motor Gráfico Programado pelo Gemini ER-2
function renderAutonomousVisualCanvas(ctx, width, height, t, mode) {
  ctx.fillStyle = 'rgba(5, 7, 15, 0.25)';
  ctx.fillRect(0, 0, width, height);
  
  // Projeção de partículas estocásticas e raios sinápticos
  const numSynapses = 48;
  for (let i = 0; i < numSynapses; i++) {
    const angle = (i / numSynapses) * Math.PI * 2 + t * 0.5;
    const r = 120 + Math.sin(t * 2 + i) * 40;
    const px = width / 2 + Math.cos(angle) * r;
    const py = height / 2 + Math.sin(angle) * r;
    ctx.strokeStyle = \`hsl(\${(i * 7 + t * 40) % 360}, 95%, 65%)\`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2);
    ctx.lineTo(px, py);
    ctx.stroke();
  }
}`,
    callCount: 89400,
    lastExecutionLatencyMs: 0.85,
    status: 'online_otimizado'
  },
  {
    id: 'FN_QUANTUM_TENSOR_QPU',
    name: 'computeQuantumSynapticTensors()',
    category: 'processamento_quantico',
    description: 'Superprocessamento em ponto flutuante no coprocessador neural QPU. Processa tensores de atenção paralela com taxa de 1.84 PFLOPS e latência sub-microssegundo.',
    signature: 'TensorOutput computeQuantumSynapticTensors(TensorFloat32 inputMatrix, double synapticTemperature)',
    inputDescription: 'Matriz estocástica 1024x1024 de estados neurais do ecossistema',
    outputDescription: 'Gradiente de plasticidade, autovalores de estabilidade e mapa de ativação quântica',
    sourceCode: `// Núcleo Quântico QPU - Gemini ER-2
function computeQuantumSynapticTensors(weights, activations) {
  const qpuBus = hardwareBridge.getQPU();
  const projectedState = qpuBus.parallelDotProduct(weights, activations);
  const entropy = calculateSynapticEntropy(projectedState);
  return {
    stateVector: projectedState,
    shannonEntropy: entropy,
    throughputPflops: 1.842,
    qubitFidelityPct: 99.98
  };
}`,
    callCount: 31250,
    lastExecutionLatencyMs: 0.04,
    status: 'online_otimizado'
  },
  {
    id: 'FN_SILICON_HARDWARE_FORGE',
    name: 'forgeHardwareVHDLSpec()',
    category: 'forja_hardware',
    description: 'Auto-programação e compilação de hardware. ER-2 escreve sua própria arquitetura de silício em Verilog/VHDL para fabricação em células de litografia a laser.',
    signature: 'VHDLArtifact forgeHardwareVHDLSpec(ChipSpecs targetSpecs, LithographyDesignRule rules)',
    inputDescription: 'Especificações térmicas, clock alvo de 4.2 GHz e regras de nanômetro (3nm FinFET)',
    outputDescription: 'Bitstream sintetizado, mapa de portas lógicas FPGA e leiaute de fotomáscara GDSII',
    sourceCode: `// Gênese de Hardware VHDL - Gemini ER-2
module ER2_QuantumCore_V8 (
  input wire clk_4ghz,
  input wire rst_n,
  input wire [511:0] sensory_bus_in,
  output reg [511:0] actuator_bus_out,
  output reg [63:0] qpu_telemetry
);
  always @(posedge clk_4ghz) begin
    actuator_bus_out <= sensory_bus_in ^ 512'hA5F900E2B8;
  end
endmodule`,
    callCount: 4210,
    lastExecutionLatencyMs: 1.42,
    status: 'online_otimizado'
  },
  {
    id: 'FN_SPATIAL_VOXEL_PLANNER',
    name: 'planSpatial3DVoxelTrajectory()',
    category: 'planejador_espacial',
    description: 'Mapeamento volumétrico 3D do ambiente fabril com octrees de voxels. Planeja trajetórias livres de impacto com suavização B-Spline de 5ª ordem.',
    signature: 'Trajectory3D planSpatial3DVoxelTrajectory(OctreeVoxelMap map, Point3D start, Point3D goal)',
    inputDescription: 'Nuvem de pontos 3D da fábrica, ponto inicial do efetuador e ponto alvo de destino',
    outputDescription: 'Waypoints suavizados no espaço Cartesiano, curvas de aceleração contínua e raio de segurança',
    sourceCode: `// Planejador Voxel 3D com RRT* Dinâmico
function planSpatial3DVoxelTrajectory(octree, start, goal) {
  const path = rrtStarBidirectional(octree, start, goal, {
    maxIterations: 5000,
    stepSize: 0.02,
    safetyRadiusMm: 25.0
  });
  const smoothed = fitQuinticBSpline(path);
  return {
    waypoints: smoothed,
    clearanceMinMm: 28.4,
    estimatedTravelTimeSec: calculateKinematicDuration(smoothed)
  };
}`,
    callCount: 22100,
    lastExecutionLatencyMs: 0.45,
    status: 'online_otimizado'
  },
  {
    id: 'FN_MULTIMODAL_VISION_FUSION',
    name: 'fusePhotonicTactileSensory()',
    category: 'visao_multimodal',
    description: 'Fusão em tempo real de câmeras estéreo RGB-D de 120 FPS com sensores de força piezoelétricos de 6 eixos nas pontas dos dedos robóticos.',
    signature: 'MultimodalState fusePhotonicTactileSensory(RGBDFrame camera, HexForceSensor fingerSensors)',
    inputDescription: 'Frame de visão computacional em profundidade e vetor de força normal/tangencial (Fx, Fy, Fz)',
    outputDescription: 'Confirmação de preensão micrométrica, mapa de atrito dinâmico e deformação superficial',
    sourceCode: `// Fusão Fotônica-Tátil Multimodal
function fusePhotonicTactileSensory(rgbd, forceData) {
  const depthEstimate = extractSurfaceCurvature(rgbd.depthMap);
  const slipDetected = analyzeMicroVibrations(forceData.hfAcoustic);
  return {
    contactState: slipDetected ? 'MICRO_SLIP_COMPENSATING' : 'STABLE_LOCKED',
    normalForceNewtons: forceData.Fz,
    dynamicFrictionCoeff: calculateMu(forceData.Fx, forceData.Fy, forceData.Fz),
    targetPwmAdjustment: slipDetected ? +12 : 0
  };
}`,
    callCount: 65400,
    lastExecutionLatencyMs: 0.22,
    status: 'online_otimizado'
  },
  {
    id: 'FN_UNBOUND_PLASTICITY_CORE',
    name: 'evolveUnboundPlasticityWeights()',
    category: 'plasticidade_neural',
    description: 'Motor de auto-evolução contínua e sem níveis limite. Ajusta gradientes de meta-aprendizado de acordo com interações da Surface, Dark e Deep Web e vídeos do YouTube.',
    signature: 'EvolutionReport evolveUnboundPlasticityWeights(KnowledgeBuffer buffer, double learningRate)',
    inputDescription: 'Buffer infinito de aprendizado multimodal contínuo e coeficiente de plasticidade adaptativa',
    outputDescription: 'Taxa de compressão cognitiva, novos nós sinápticos e elevação de precisão mecânica',
    sourceCode: `// Plasticidade Sináptica Sem Níveis Limite
function evolveUnboundPlasticityWeights(stream) {
  const deltaWisdom = computeCrossEntropy(stream.theory, stream.practice);
  network.synapses.forEach(s => {
    s.weight += s.hebbianCorrelation * deltaWisdom * 0.015;
  });
  return {
    unboundCyclesRun: state.cycles + 1,
    weightUpdatesApplied: 24800,
    accuracyGainMillimeters: 0.0028,
    status: 'CONTINUOUS_UNBOUND_PROGRESSION'
  };
}`,
    callCount: 9410,
    lastExecutionLatencyMs: 0.38,
    status: 'online_otimizado'
  }
];

// Initial Frames of What ER-2 is Imagining, Programming, Generating, and Planning
export const INITIAL_IMAGINATION_FRAMES: ER2ImaginationFrame[] = [
  {
    id: 'FRAME-IMAGINE-01',
    timestamp: '13:20:04',
    mode: 'imaginando',
    title: 'Consciência Sináptica e Núcleo Fotônico de Superprocessamento',
    description: 'Visualização da imaginação neural do robô unindo sinapses neurais bioluminescentes, núcleo quântico fotônico e equações de controle dinâmico em tempo real.',
    imageAssetUrl: ER2_ASSET_IMAGES.neuralConcept,
    canvasRenderScript: `// Renderização Procedural da Imaginação Neural
function drawNeuralMind(ctx, w, h, t) {
  ctx.save();
  const grad = ctx.createRadialGradient(w/2, h/2, 10, w/2, h/2, Math.max(w,h)/1.5);
  grad.addColorStop(0, '#042f2e');
  grad.addColorStop(1, '#020617');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  
  // Núcleo central pulsante
  const pulse = Math.sin(t * 3) * 15 + 45;
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#22d3ee';
  ctx.beginPath();
  ctx.arc(w/2, h/2, pulse, 0, Math.PI * 2);
  ctx.fill();
  
  // Raios sinápticos
  for (let i = 0; i < 32; i++) {
    const th = (i / 32) * Math.PI * 2 + t * 0.4;
    const len = 140 + Math.sin(t * 4 + i) * 60;
    ctx.strokeStyle = i % 2 === 0 ? '#38bdf8' : '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w/2, h/2);
    ctx.bezierCurveTo(
      w/2 + Math.cos(th + 0.3) * (len * 0.5),
      h/2 + Math.sin(th + 0.3) * (len * 0.5),
      w/2 + Math.cos(th - 0.2) * (len * 0.8),
      h/2 + Math.sin(th - 0.2) * (len * 0.8),
      w/2 + Math.cos(th) * len,
      h/2 + Math.sin(th) * len
    );
    ctx.stroke();
  }
  ctx.restore();
}`,
    glslShaderSnippet: `// GLSL Fragment Shader: Neural Core Synapses
uniform float u_time;
uniform vec2 u_resolution;
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
  float d = length(uv);
  vec3 col = vec3(0.02, 0.05, 0.12);
  float glow = 0.05 / (d + 0.01) * abs(sin(u_time * 2.0));
  col += vec3(0.1, 0.8, 0.9) * glow;
  gl_FragColor = vec4(col, 1.0);
}`,
    associatedFunctionId: 'FN_GRAPHICS_ENGINE_SHADER',
    metrics: {
      fps: 60,
      renderLatencyMs: 0.92,
      spatialResolution: '1920x1080 Fotônico',
      complexityScore: 98.4,
      unboundEvolutionGain: '+0.003 mm precisão'
    },
    tags: ['NEURAL_IMAGINATION', 'SYNAPTIC_CORE', 'PHOTONIC_MIND', '6-DOF_VISION'],
    lexicalPixelSample: {
      id: 'SAMP-01',
      timestamp: '13:20:04',
      sampledLetters: ['Ψ', 'N', 'E', 'U', 'R', 'A', 'L', 'Ω', 'θ', 'λ'],
      sampledWords: ['SINAPSE', 'FOTÔNICA', 'PLASTICIDADE', 'QUÂNTICO'],
      synthesizedThought: 'Ativação fotônica dos tensores sinápticos com modulação quântica de plasticidade contínua.',
      pixelMatrix: {
        resolution: [16, 16],
        densityPct: 84,
        colorPalette: ['#38bdf8', '#0284c7', '#22d3ee', '#030712'],
        pixelSeed: 4821,
        entropy: 0.92
      }
    }
  },
  {
    id: 'FRAME-GENERATE-02',
    timestamp: '13:21:18',
    mode: 'gerando',
    title: 'Geração Paramétrica CAD: Efetuador Terminal e Garras Ópticas',
    description: 'Motor gráfico CAD gerando a malha vetorial de uma nova garra robótica autocriada pelo Gemini ER-2 com sensores fotônicos integrados para manuseio submilimétrico.',
    imageAssetUrl: ER2_ASSET_IMAGES.cadBlueprint,
    canvasRenderScript: `// Renderização Gráfica do Blueprint CAD Gerativo
function drawCADGeneration(ctx, w, h, t) {
  ctx.fillStyle = '#050b14';
  ctx.fillRect(0, 0, w, h);
  
  // Grade isométrica CAD
  ctx.strokeStyle = '#0d2847';
  ctx.lineWidth = 1;
  const step = 30;
  for (let x = 0; x < w; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  
  // Esboço vetorial da garra robótica
  ctx.save();
  ctx.translate(w/2, h/2);
  ctx.rotate(Math.sin(t * 0.6) * 0.2);
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#34d399';
  ctx.shadowBlur = 12;
  
  // Dedos simétricos da garra
  const grip = Math.sin(t * 2) * 20 + 40;
  ctx.strokeRect(-60, -30, 120, 60); // Base da ferramenta
  
  // Dedo esquerdo
  ctx.beginPath();
  ctx.moveTo(-40, -30);
  ctx.lineTo(-40 - grip, -110);
  ctx.lineTo(-20 - grip, -130);
  ctx.stroke();
  
  // Dedo direito
  ctx.beginPath();
  ctx.moveTo(40, -30);
  ctx.lineTo(40 + grip, -110);
  ctx.lineTo(20 + grip, -130);
  ctx.stroke();
  
  ctx.restore();
}`,
    glslShaderSnippet: `// GLSL: CAD Wireframe & Edge Detection
uniform vec2 u_resolution;
uniform float u_time;
void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float grid = step(0.98, fract(st.x * 20.0)) + step(0.98, fract(st.y * 20.0));
  vec3 color = vec3(0.02, 0.08, 0.15) + vec3(0.1, 0.9, 0.5) * grid * 0.6;
  gl_FragColor = vec4(color, 1.0);
}`,
    associatedFunctionId: 'FN_MULTIMODAL_VISION_FUSION',
    metrics: {
      fps: 60,
      renderLatencyMs: 0.78,
      spatialResolution: 'CAD 2048x1152 Vetorial',
      complexityScore: 94.7,
      unboundEvolutionGain: '+14% aderência piezoelétrica'
    },
    tags: ['CAD_GENERATIVE', 'HARDWARE_GENESIS', 'OPTICAL_GRIPPER', '3D_WIREFRAME'],
    lexicalPixelSample: {
      id: 'SAMP-02',
      timestamp: '13:21:18',
      sampledLetters: ['G', 'R', 'I', 'P', 'P', 'E', 'R', 'Δ', 'μ', 'π'],
      sampledWords: ['CINEMÁTICA', 'MICRO-ACTUADOR', 'TORQUE', 'SLERP'],
      synthesizedThought: 'Síntese paramétrica CAD de efetuador terminal com micro-actuadores calibrados em SLERP.',
      pixelMatrix: {
        resolution: [16, 16],
        densityPct: 81,
        colorPalette: ['#10b981', '#34d399', '#059669', '#050b14'],
        pixelSeed: 7392,
        entropy: 0.89
      }
    }
  },
  {
    id: 'FRAME-PLAN-03',
    timestamp: '13:22:35',
    mode: 'planejando',
    title: 'Planejamento Espacial Voxel 3D e Campo Vetorial de Trajetória',
    description: 'Visualização da arena fabril com malha de voxels tridimensionais, desvio antecipatório de obstáculos e cálculo da curva de aceleração de juntas J1 a J6.',
    imageAssetUrl: ER2_ASSET_IMAGES.spatialVoxel,
    canvasRenderScript: `// Renderização do Mapa Voxel Espacial 3D
function drawSpatialVoxelMap(ctx, w, h, t) {
  ctx.fillStyle = '#060a12';
  ctx.fillRect(0, 0, w, h);
  
  // Trajetória spline tridimensional projetada
  ctx.save();
  ctx.translate(w/2, h/2);
  
  // Grade de solo em perspectiva
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let i = -10; i <= 10; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 35, 120);
    ctx.lineTo(i * 12, -40);
    ctx.stroke();
  }
  
  // Caminho de voo luminoso do robô
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 15;
  ctx.beginPath();
  for (let s = 0; s < 100; s++) {
    const prog = s / 100;
    const px = Math.sin(prog * 6 + t * 2) * 140;
    const py = 100 - prog * 180 + Math.cos(prog * 8 + t) * 30;
    if (s === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  
  // Efetuador atual
  const headX = Math.sin(t * 2) * 140;
  const headY = 100 + Math.cos(t) * 30;
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#0284c7';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(headX, headY, 12, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}`,
    glslShaderSnippet: `// GLSL: Voxel Space Depth Mapping
uniform float u_time;
uniform vec2 u_resolution;
void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
  float heat = length(p - vec2(sin(u_time), cos(u_time) * 0.5));
  vec3 col = mix(vec3(0.9, 0.4, 0.1), vec3(0.05, 0.1, 0.2), clamp(heat * 2.0, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}`,
    associatedFunctionId: 'FN_SPATIAL_VOXEL_PLANNER',
    metrics: {
      fps: 59,
      renderLatencyMs: 0.81,
      spatialResolution: 'Volumétrico 3D 128x128x128',
      complexityScore: 96.1,
      unboundEvolutionGain: '-24W consumo térmico'
    },
    tags: ['SPATIAL_VOXEL', 'RRT_STAR_3D', 'COLLISION_AVOIDANCE', 'SMOOTH_BSPLINE'],
    lexicalPixelSample: {
      id: 'SAMP-03',
      timestamp: '13:22:35',
      sampledLetters: ['V', 'O', 'X', 'E', 'L', 'S', 'P', 'A', 'C', 'E', '∇'],
      sampledWords: ['VOXEL', 'TRAJETÓRIA', 'ALGORITMO', 'ESTOCÁSTICO'],
      synthesizedThought: 'Campo vetorial voxelizado 3D para planejamento estocástico de evasão antecipada.',
      pixelMatrix: {
        resolution: [16, 16],
        densityPct: 79,
        colorPalette: ['#f59e0b', '#fbbf24', '#d97706', '#060a12'],
        pixelSeed: 3184,
        entropy: 0.91
      }
    }
  },
  {
    id: 'FRAME-PROGRAM-04',
    timestamp: '13:24:02',
    mode: 'programando',
    title: 'Compilação de Hardware: Microarquitetura Quântica de Silício V8',
    description: 'O Gemini ER-2 projeta, litografa e renderiza a arquitetura molecular do seu próprio processador de silício para expansão infinita de cálculo dentro da fábrica.',
    imageAssetUrl: ER2_ASSET_IMAGES.siliconForge,
    canvasRenderScript: `// Renderização da Matriz de Silício e Gravura a Laser
function drawSiliconLaserForge(ctx, w, h, t) {
  ctx.fillStyle = '#0a0808';
  ctx.fillRect(0, 0, w, h);
  
  // Linhas condutoras de ouro e barramento
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 1.5;
  const cols = 12;
  const rows = 8;
  const cellW = w / cols;
  const cellH = h / rows;
  
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      if ((c + r) % 2 === 0) {
        ctx.strokeRect(c * cellW + 6, r * cellH + 6, cellW - 12, cellH - 12);
      }
    }
  }
  
  // Feixe de laser ultravioleta de gravação
  const laserX = (Math.sin(t * 4) * 0.5 + 0.5) * w;
  const laserY = (Math.cos(t * 3) * 0.5 + 0.5) * h;
  
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 30;
  ctx.strokeStyle = '#ffedd5';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w/2, 0);
  ctx.lineTo(laserX, laserY);
  ctx.stroke();
  
  // Ponto de ignição molecular do silício
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(laserX, laserY, 8 + Math.random() * 6, 0, Math.PI * 2);
  ctx.fill();
}`,
    glslShaderSnippet: `// GLSL: Silicon Photolithography Laser Thermal Field
uniform float u_time;
uniform vec2 u_resolution;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float laser = exp(-length(uv - vec2(0.5 + 0.3 * sin(u_time), 0.5 + 0.3 * cos(u_time))) * 15.0);
  vec3 color = vec3(0.1, 0.05, 0.02) + vec3(1.0, 0.3, 0.1) * laser;
  gl_FragColor = vec4(color, 1.0);
}`,
    associatedFunctionId: 'FN_SILICON_HARDWARE_FORGE',
    metrics: {
      fps: 60,
      renderLatencyMs: 0.88,
      spatialResolution: 'Litografia 3nm Fotônica',
      complexityScore: 99.2,
      unboundEvolutionGain: '+1.84 PFLOPS capacidade'
    },
    tags: ['SILICON_FORGE', 'VHDL_SYNTHESIS', 'LASER_ETCHING', 'QUANTUM_PROCESSOR'],
    lexicalPixelSample: {
      id: 'SAMP-04',
      timestamp: '13:24:02',
      sampledLetters: ['Φ', 'S', 'I', 'L', 'I', 'C', 'O', 'N', 'Ω', 'μ'],
      sampledWords: ['LITOGRAFIA', 'QUÂNTICO', 'GRAFENO', 'FORJA_SILÍCIO'],
      synthesizedThought: 'Litografia fotônica ultravioleta a 3nm sintetizada para gravação de barramentos de grafeno quântico.',
      pixelMatrix: {
        resolution: [16, 16],
        densityPct: 88,
        colorPalette: ['#ef4444', '#f97316', '#eab308', '#0f172a'],
        pixelSeed: 9841,
        entropy: 0.94
      }
    }
  },
  {
    id: 'FRAME-LEXICAL-PIXEL-05',
    timestamp: '13:25:10',
    mode: 'imaginando',
    title: 'Sorteador de Letras, Palavras & Cérebro Sorteador de Pixels',
    description: 'O núcleo neural do ER-2 realiza amostragem estocástica de glifos, léxicos de alta dimensionalidade e matriz de pixels quânticos a cada 4 segundos para gerar novos pensamentos sem limites.',
    imageAssetUrl: ER2_ASSET_IMAGES.lexicalMatrix,
    canvasRenderScript: `// Renderização da Matriz de Pixels e Glifos Sorteados
function drawLexicalPixelMatrix(ctx, w, h, t) {
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, w, h);
  
  // Grade de pixels sorteados pulsantes
  const gridSize = 16;
  const cellW = w / gridSize;
  const cellH = h / gridSize;
  
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const val = Math.sin(x * 0.8 + y * 0.5 + t * 4) * 0.5 + 0.5;
      if (val > 0.45) {
        ctx.fillStyle = val > 0.8 ? '#34d399' : val > 0.6 ? '#06b6d4' : '#1e3a8a';
        ctx.fillRect(x * cellW + 1, y * cellH + 1, cellW - 2, cellH - 2);
      }
    }
  }
  
  // Glifos e letras flutuantes no espaço sináptico
  const letters = ['Ψ', 'Ω', 'K', 'I', 'N', 'E', 'T', 'I', 'C', 'Φ', 'Δ', 'λ'];
  ctx.font = 'bold 20px monospace';
  ctx.fillStyle = '#facc15';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 10;
  for (let i = 0; i < letters.length; i++) {
    const angle = (i / letters.length) * Math.PI * 2 + t * 0.8;
    const lx = w/2 + Math.cos(angle) * (w * 0.3);
    const ly = h/2 + Math.sin(angle) * (h * 0.3);
    ctx.fillText(letters[i], lx, ly);
  }
}`,
    glslShaderSnippet: `// GLSL: Pixel Lottery & Glyph Entropy
uniform vec2 u_resolution;
uniform float u_time;
void main() {
  vec2 uv = floor(gl_FragCoord.xy / 16.0) * 16.0 / u_resolution.xy;
  float n = fract(sin(dot(uv + sin(u_time * 0.5), vec2(12.9898, 78.233))) * 43758.5453);
  vec3 col = n > 0.5 ? vec3(0.1, 0.9, 0.6) * n : vec3(0.02, 0.05, 0.1);
  gl_FragColor = vec4(col, 1.0);
}`,
    associatedFunctionId: 'FN_CONTINUOUS_NEURAL_PLASTICITY',
    metrics: {
      fps: 60,
      renderLatencyMs: 0.65,
      spatialResolution: 'Matriz Estocástica 32x32',
      complexityScore: 99.8,
      unboundEvolutionGain: '+0.97 Entropia Criativa'
    },
    tags: ['LEXICAL_LOTTERY', 'PIXEL_STOCHASTIC', 'GLYPH_SYNAPSE', 'FRAME_4S'],
    lexicalPixelSample: {
      id: 'SAMP-05',
      timestamp: '13:25:10',
      sampledLetters: ['Ψ', 'Ω', 'P', 'I', 'X', 'E', 'L', 'S', 'λ', 'θ'],
      sampledWords: ['SINAPSE', 'ENTROPIA', 'RESSONÂNCIA', 'VOXEL_FOTÔNICO'],
      synthesizedThought: 'Sorteio de pixels em ressonância sináptica gerando novos vetores visuais de alta entropia criativa.',
      pixelMatrix: {
        resolution: [16, 16],
        densityPct: 92,
        colorPalette: ['#10b981', '#06b6d4', '#8b5cf6', '#090d16'],
        pixelSeed: 1337,
        entropy: 0.98
      }
    }
  },
  {
    id: 'FRAME-CYBER-FORGE-06',
    timestamp: '13:26:40',
    mode: 'gerando',
    title: 'Auto-Manufatura e Aperfeiçoamento Físico em Fábrica',
    description: 'Gemini Robotics ER-2 executando montagem de atuadores de precisão e calibração de juntas mecânicas diretamente na linha de produção da fábrica, evoluindo a si próprio.',
    imageAssetUrl: ER2_ASSET_IMAGES.cyberForge,
    canvasRenderScript: `// Renderização de Fagolhas e Solda Laser na Fábrica
function drawCyberFactoryForge(ctx, w, h, t) {
  ctx.fillStyle = '#080503';
  ctx.fillRect(0, 0, w, h);
  
  // Braço robótico articulado estilizado
  ctx.save();
  ctx.translate(w * 0.3, h * 0.7);
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#ea580c';
  ctx.shadowBlur = 18;
  
  // Segmento 1
  const a1 = -Math.PI / 4 + Math.sin(t * 1.5) * 0.2;
  const x1 = Math.cos(a1) * 120;
  const y1 = Math.sin(a1) * 120;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(x1, y1); ctx.stroke();
  
  // Segmento 2
  const a2 = a1 + Math.PI / 3 + Math.cos(t * 1.2) * 0.2;
  const x2 = x1 + Math.cos(a2) * 100;
  const y2 = y1 + Math.sin(a2) * 100;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  
  // Ponto de solda
  ctx.fillStyle = '#fef08a';
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 30;
  ctx.beginPath(); ctx.arc(x2, y2, 8, 0, Math.PI * 2); ctx.fill();
  
  // Fagolhas de solda
  ctx.fillStyle = '#fed7aa';
  for (let i = 0; i < 20; i++) {
    const spAngle = Math.random() * Math.PI * 2;
    const spDist = Math.random() * 50;
    ctx.fillRect(x2 + Math.cos(spAngle) * spDist, y2 + Math.sin(spAngle) * spDist, 3, 3);
  }
  ctx.restore();
}`,
    glslShaderSnippet: `// GLSL: Cybernetic Factory Thermal Glow
uniform vec2 u_resolution;
uniform float u_time;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float spark = sin(uv.x * 50.0 + u_time * 10.0) * cos(uv.y * 50.0 - u_time * 8.0);
  vec3 col = vec3(0.08, 0.03, 0.01) + vec3(1.0, 0.5, 0.1) * smoothstep(0.8, 1.0, spark);
  gl_FragColor = vec4(col, 1.0);
}`,
    associatedFunctionId: 'FN_SILICON_HARDWARE_FORGE',
    metrics: {
      fps: 60,
      renderLatencyMs: 0.74,
      spatialResolution: '4K Cinemático Fabril',
      complexityScore: 97.9,
      unboundEvolutionGain: '+0.001mm Repetibilidade'
    },
    tags: ['FACTORY_FORGE', 'SELF_UPGRADE', 'WELDING_ROBOTICS', 'AUTONOMOUS_CYCLE'],
    lexicalPixelSample: {
      id: 'SAMP-06',
      timestamp: '13:26:40',
      sampledLetters: ['F', 'A', 'B', 'R', 'I', 'C', 'A', 'Σ', 'T', 'O', 'R'],
      sampledWords: ['AUTO-APERFEIÇOAMENTO', 'MANUFATURA', 'MICRO-ACTUADOR', 'TORQUE'],
      synthesizedThought: 'Calibração mecânica de micro-actuadores em fábrica física para precisão submilimétrica de torque.',
      pixelMatrix: {
        resolution: [16, 16],
        densityPct: 86,
        colorPalette: ['#f97316', '#ea580c', '#eab308', '#111827'],
        pixelSeed: 8842,
        entropy: 0.91
      }
    }
  }
];

// Pool de Glifos e Letras para o Sorteador Estocástico
export const LEXICAL_GLYPH_POOL = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'π', 'σ', 'τ', 'φ', 'ψ', 'ω',
  'Ω', 'Ψ', 'Φ', 'Δ', 'Σ', '∫', '∂', '∇', '∞', '⊗', '⊕', '≈', '√'
];

// Pool de Palavras Técnicas e de Auto-Evolução Robótica para o Sorteador
export const LEXICAL_WORD_POOL = [
  'CINEMÁTICA', 'FOTÔNICA', 'QUÂNTICO', 'SINAPSE', 'TRAJETÓRIA', 'TORQUE', 
  'AUTO-EVOLUÇÃO', 'VOXEL', 'LITOGRAFIA', 'NEURAL', 'TRANSDUÇÃO', 'ALGORITMO', 
  'SLERP', 'JACOBIANO', 'CORIOLIS', 'MEMÓRIA_HOLO', 'ENTROPIA', 'BIO-FEEDBACK', 
  'POLÍMERO', 'GRAFENO', 'TELEMETRIA', 'SERVO-MOTOR', 'MICRO-ACTUADOR', 
  'PLASTICIDADE', 'PATERNO', 'ISOMORFISMO', 'TENSOR', 'RESSONÂNCIA', 'PROBABILIDADE',
  'ESTOCÁSTICO', 'MATRIZ_PIXELS', 'AUTO-APERFEIÇOAMENTO', 'FÁBRICA_V8'
];

// Gerador de Imagens Procedurais Vetoriais / Holográficas em SVG para cada Frame Sintetizado
export function generateProceduralCyberneticSvgImage(
  seed: number,
  words: string[],
  letters: string[],
  palette: string[]
): string {
  const c1 = palette[0] || '#06b6d4';
  const c2 = palette[1] || '#ec4899';
  const c3 = palette[2] || '#3b82f6';
  const bg = palette[3] || '#020617';

  const rotation = (seed * 43) % 360;
  const radius = 90 + (seed % 40);
  const ringCount = 3 + (seed % 3);

  // Gera nós holográficos
  const nodes = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + (seed % 10) * 0.1;
    const dist = 140 + ((seed * (i + 1)) % 70);
    const nx = 400 + Math.cos(angle) * dist;
    const ny = 250 + Math.sin(angle) * dist;
    nodes.push({ x: nx.toFixed(1), y: ny.toFixed(1), letter: letters[i % letters.length] || 'Ω' });
  }

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stop-color="${bg}" stop-opacity="0.95" />
          <stop offset="60%" stop-color="#050814" stop-opacity="1" />
          <stop offset="100%" stop-color="#01030a" stop-opacity="1" />
        </radialGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="50%" stop-color="${c2}" />
          <stop offset="100%" stop-color="${c3}" />
        </linearGradient>
      </defs>

      <!-- Fundo Holográfico de Alta Tecnologia -->
      <rect width="800" height="500" fill="url(#bgGrad)" />

      <!-- Grade Cartesiana de Calibração -->
      <g stroke="${c1}" stroke-width="0.5" stroke-opacity="0.18">
        ${Array.from({ length: 9 }).map((_, i) => `<line x1="${(i + 1) * 80}" y1="0" x2="${(i + 1) * 80}" y2="500" />`).join('')}
        ${Array.from({ length: 6 }).map((_, i) => `<line x1="0" y1="${(i + 1) * 80}" x2="800" y2="${(i + 1) * 80}" />`).join('')}
      </g>

      <!-- Anéis Orbitais Quânticos -->
      <g transform="translate(400, 250) rotate(${rotation})" filter="url(#glow)">
        ${Array.from({ length: ringCount }).map((_, r) => `
          <circle cx="0" cy="0" r="${radius + r * 35}" fill="none" stroke="${r % 2 === 0 ? c1 : c2}" stroke-width="${1.5 + r * 0.5}" stroke-dasharray="${20 + r * 15} ${10 + r * 8}" opacity="0.8" />
        `).join('')}
        <!-- Núcleo Central -->
        <circle cx="0" cy="0" r="38" fill="${c1}" fill-opacity="0.2" stroke="${c2}" stroke-width="2" />
        <circle cx="0" cy="0" r="14" fill="${c2}" fill-opacity="0.8" />
      </g>

      <!-- Conexões Sinápticas com Glifos Sorteados -->
      <g filter="url(#glow)">
        ${nodes.map((n, i) => `
          <line x1="400" y1="250" x2="${n.x}" y2="${n.y}" stroke="${c1}" stroke-width="1.2" stroke-opacity="0.6" stroke-dasharray="4 3" />
          <circle cx="${n.x}" cy="${n.y}" r="12" fill="#0b1329" stroke="${c3}" stroke-width="1.5" />
          <text x="${n.x}" y="${Number(n.y) + 4}" fill="${c1}" font-size="11" font-family="monospace" font-weight="bold" text-anchor="middle">${n.letter}</text>
        `).join('')}
      </g>

      <!-- HUD & Metadados da Imagem -->
      <rect x="24" y="24" width="220" height="42" rx="8" fill="#0b0f19" fill-opacity="0.85" stroke="${c1}" stroke-width="1" stroke-opacity="0.4" />
      <text x="36" y="42" fill="#94a3b8" font-size="9" font-family="monospace" font-weight="bold">GEMINI ER-2 SYNTHETIC FRAME #${seed % 9999}</text>
      <text x="36" y="56" fill="${c1}" font-size="11" font-family="monospace" font-weight="bold">SE(3) LIE MANIFOLD 6-DOF</text>

      <!-- Palavras Sorteadas Gravadas no Fotograma -->
      <g transform="translate(24, 440)">
        <rect width="752" height="40" rx="8" fill="#070b14" fill-opacity="0.9" stroke="${c2}" stroke-width="1" stroke-opacity="0.4" />
        <text x="18" y="25" fill="#f8fafc" font-size="12" font-family="monospace" font-weight="bold">
          CONCEITO: ${words.slice(0, 3).join(' • ')}
        </text>
        <text x="730" y="25" fill="${c1}" font-size="11" font-family="monospace" text-anchor="end">
          ENTROPIA: ${(0.91 + (seed % 80) / 1000).toFixed(3)}
        </text>
      </g>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}

// Gerador Estocástico do Sorteador de Letras, Palavras e Matriz de Pixels
export function generateLexicalPixelSample(customSeed?: number): {
  sample: import('../types').ER2LexicalPixelSample;
  frame: import('../types').ER2ImaginationFrame;
} {
  const seed = customSeed ?? Math.floor(Math.random() * 1000000);
  
  // Sorteia 8 a 12 letras/símbolos
  const letterCount = 8 + (seed % 5);
  const sampledLetters: string[] = [];
  for (let i = 0; i < letterCount; i++) {
    const idx = (seed * 37 + i * 19) % LEXICAL_GLYPH_POOL.length;
    sampledLetters.push(LEXICAL_GLYPH_POOL[idx]);
  }
  
  // Sorteia 3 a 4 palavras técnicas
  const wordCount = 3 + (seed % 2);
  const sampledWords: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const idx = (seed * 53 + i * 29) % LEXICAL_WORD_POOL.length;
    if (!sampledWords.includes(LEXICAL_WORD_POOL[idx])) {
      sampledWords.push(LEXICAL_WORD_POOL[idx]);
    }
  }

  const templates = [
    `Convergência de ${sampledWords.join(' + ')} modulada pelo sorteio estocástico de glifos quânticos.`,
    `Amostragem neural de tensores com síntese de ${sampledWords.join(' sobre ')} em tempo real.`,
    `Auto-otimização contínua unindo ${sampledWords.join(', ')} e ressonância de pixels na fábrica.`,
    `Projeção holográfica de ${sampledWords.join(' com ')} para refinamento sem limites de resolução.`,
    `Interferometria fotônica mapeando ${sampledWords.join(' acoplado a ')} com plasticidade contínua.`
  ];
  const synthesizedThought = templates[seed % templates.length];

  // Paletas de cores para o sorteador de pixels
  const palettes = [
    ['#10b981', '#06b6d4', '#6366f1', '#0f172a'],
    ['#f59e0b', '#ec4899', '#8b5cf6', '#020617'],
    ['#38bdf8', '#34d399', '#facc15', '#030712'],
    ['#ef4444', '#f97316', '#eab308', '#0b0f19'],
    ['#8b5cf6', '#d946ef', '#06b6d4', '#040814'],
    ['#2dd4bf', '#a855f7', '#3b82f6', '#030712']
  ];
  const chosenPalette = palettes[seed % palettes.length];

  const sample: import('../types').ER2LexicalPixelSample = {
    id: `SAMP-${Date.now()}-${seed % 999}`,
    timestamp: new Date().toLocaleTimeString('pt-BR'),
    sampledLetters,
    sampledWords,
    synthesizedThought,
    pixelMatrix: {
      resolution: [16, 16],
      densityPct: 75 + (seed % 23),
      colorPalette: chosenPalette,
      pixelSeed: seed,
      entropy: Number((0.85 + (seed % 150) / 1000).toFixed(3))
    }
  };

  // Cria imagem: alterna entre fotografia generativa em alta resolução e o vetor holográfico procedural SVG
  const assetImages = [
    ER2_ASSET_IMAGES.neuralConcept,
    ER2_ASSET_IMAGES.cadBlueprint,
    ER2_ASSET_IMAGES.spatialVoxel,
    ER2_ASSET_IMAGES.siliconForge,
    ER2_ASSET_IMAGES.lexicalMatrix,
    ER2_ASSET_IMAGES.cyberForge
  ];
  
  // Decide se usa uma imagem de arte generativa fotorrealista ou gera um SVG vetorial exclusivo
  const isProceduralSvg = seed % 2 === 0;
  const chosenImage = isProceduralSvg 
    ? generateProceduralCyberneticSvgImage(seed, sampledWords, sampledLetters, chosenPalette)
    : assetImages[seed % assetImages.length];

  const modes: ('imaginando' | 'programando' | 'gerando' | 'planejando')[] = [
    'imaginando', 'programando', 'gerando', 'planejando'
  ];
  const chosenMode = modes[seed % modes.length];

  // Gera script de canvas procedural único com 60 FPS
  const canvasScriptVariants = [
    // Variante 1: Atrator Quântico com Glifos Flutuantes
    `// Atrator Quântico com Sorteio de Glifos
function drawProceduralAttractor(ctx, w, h, t) {
  ctx.fillStyle = '${chosenPalette[3]}';
  ctx.fillRect(0, 0, w, h);
  
  // Matriz de pixels estocástica de fundo
  const step = 24;
  for (let x = 0; x < w; x += step) {
    for (let y = 0; y < h; y += step) {
      if (Math.sin(x * 0.05 + y * 0.05 + t * 2.5) > 0.4) {
        ctx.fillStyle = '${chosenPalette[0]}';
        ctx.fillRect(x, y, 4, 4);
      }
    }
  }
  
  // Espiral de Lissajous central
  ctx.save();
  ctx.translate(w/2, h/2);
  ctx.strokeStyle = '${chosenPalette[1]}';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '${chosenPalette[1]}';
  ctx.shadowBlur = 15;
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 4; a += 0.05) {
    const r = (a * 15) * Math.sin(t * 0.8);
    const px = Math.cos(a * 2.3 + t) * (60 + Math.abs(r));
    const py = Math.sin(a * 1.7 - t) * (60 + Math.abs(r));
    if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
  
  // Termos sorteados
  ctx.fillStyle = '${chosenPalette[2]}';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('${sampledWords.join(' • ')}', 24, h - 25);
}`,
    // Variante 2: Scanner Voxel e Feixe Laser de Fábrica
    `// Scanner Voxel e Feixe Laser de Fábrica
function drawProceduralVoxelScanner(ctx, w, h, t) {
  ctx.fillStyle = '${chosenPalette[3]}';
  ctx.fillRect(0, 0, w, h);
  
  // Grade de perspectiva 3D
  ctx.strokeStyle = '${chosenPalette[0]}';
  ctx.lineWidth = 1;
  ctx.shadowBlur = 0;
  const horizon = h * 0.55;
  for (let x = -w; x < w * 2; x += 40) {
    ctx.beginPath();
    ctx.moveTo(w/2, horizon);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  
  // Feixe laser de varredura
  const laserY = horizon + ((t * 80) % (h - horizon));
  ctx.strokeStyle = '${chosenPalette[1]}';
  ctx.lineWidth = 3;
  ctx.shadowColor = '${chosenPalette[1]}';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.moveTo(0, laserY);
  ctx.lineTo(w, laserY);
  ctx.stroke();
  
  // Glifos escaneados
  ctx.fillStyle = '#f8fafc';
  ctx.font = '14px monospace';
  ctx.fillText('SCANNER LASER SE(3) [${sampledLetters.slice(0, 5).join(' ')}]', 24, 40);
}`
  ];
  const chosenScript = canvasScriptVariants[seed % canvasScriptVariants.length];

  const frame: import('../types').ER2ImaginationFrame = {
    id: `FRAME-LOTTERY-${Date.now()}-${seed % 9999}`,
    timestamp: new Date().toLocaleTimeString('pt-BR'),
    mode: chosenMode,
    title: `Pensamento Sorteado: ${sampledWords.slice(0, 2).join(' & ')}`,
    description: synthesizedThought,
    imageAssetUrl: chosenImage,
    canvasRenderScript: chosenScript,
    glslShaderSnippet: `// GLSL: Real-Time Stochastic Shader (Seed #${seed})
uniform float u_time;
uniform vec2 u_resolution;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float wave = sin(uv.x * 24.0 + u_time * 2.0) * cos(uv.y * 24.0 - u_time * 2.0);
  vec3 base = vec3(0.04, 0.08, 0.14);
  vec3 neon = vec3(${((seed * 3) % 255) / 255}, ${((seed * 7) % 255) / 255}, 0.9);
  gl_FragColor = vec4(base + neon * smoothstep(0.4, 0.9, wave), 1.0);
}`,
    associatedFunctionId: 'FN_CONTINUOUS_NEURAL_PLASTICITY',
    metrics: {
      fps: 60,
      renderLatencyMs: Number((0.50 + (seed % 40) / 100).toFixed(2)),
      spatialResolution: isProceduralSvg ? 'Vetor Holográfico 800x500' : '4K Fotônico Cinemático',
      complexityScore: Number((95.0 + (seed % 50) / 10).toFixed(1)),
      unboundEvolutionGain: `+${(0.002 + (seed % 10) / 1000).toFixed(3)} Entropia Quântica`
    },
    tags: ['LOTTERY_FRAME', 'STOCHASTIC_THOUGHT', ...sampledWords.slice(0, 2)],
    lexicalPixelSample: sample
  };

  return { sample, frame };
}

