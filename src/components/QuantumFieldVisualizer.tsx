import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  JointState, 
  AutonomousCoreEvolutionState, 
  AutonomousThought 
} from '../types';
import { 
  Sparkles, 
  RotateCw, 
  Maximize2, 
  Minimize2,
  Sliders, 
  Layers, 
  Activity, 
  Compass, 
  Play, 
  Pause, 
  Radio, 
  Cpu, 
  Zap, 
  Eye, 
  Hash, 
  Atom, 
  Info,
  Waves,
  Bot
} from 'lucide-react';

export interface IrrationalConstantInfo {
  symbol: string;
  name: string;
  expression: string;
  value: number;
  digits: string;
  description: string;
  jointCoupling: string;
  color: string;
}

export const IRRATIONAL_CONSTANTS: Record<string, IrrationalConstantInfo> = {
  pi: {
    symbol: 'π',
    name: 'Constante Circular de Arquimedes',
    expression: 'C / d = 3.1415926535...',
    value: Math.PI,
    digits: '31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679',
    description: 'Governa a rotação circular contínua dos atuadores de passo e coordenadas azimutais.',
    jointCoupling: 'J1 (Base) & J5 (Wrist Roll)',
    color: '#38bdf8' // sky-400
  },
  e: {
    symbol: 'e',
    name: 'Número de Euler',
    expression: 'lim (1 + 1/n)^n = 2.7182818284...',
    value: Math.E,
    digits: '27182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274',
    description: 'Modela dissipação térmica, decaimento inercial e convergência contínua de trajetória.',
    jointCoupling: 'J2 (Shoulder) & J3 (Elbow)',
    color: '#a855f7' // purple-500
  },
  phi: {
    symbol: 'φ',
    name: 'Proporção Áurea (Golden Ratio)',
    expression: '(1 + √5) / 2 = 1.6180339887...',
    value: (1 + Math.sqrt(5)) / 2,
    digits: '16180339887498948482045868343656381177203091798057628621354486227052604628189024497072072041893911374',
    description: 'Escalonamento harmônico fractal do comprimento dos elos biomecânicos e rigidez proporcional.',
    jointCoupling: 'Cinemática 6-DOF Unificada',
    color: '#f59e0b' // amber-500
  },
  sqrt2: {
    symbol: '√2',
    name: 'Constante de Pitágoras',
    expression: 'x² = 2 ⇒ 1.4142135623...',
    value: Math.SQRT2,
    digits: '14142135623730950488016887242096980785696718753769480731766797379907324784621070388503875343276415727',
    description: 'Tensor de cisalhamento diagonal nos eixos cartesianos da garra robótica.',
    jointCoupling: 'J4 (Wrist Pitch)',
    color: '#10b981' // emerald-500
  },
  sqrt3: {
    symbol: '√3',
    name: 'Constante de Teodoro',
    expression: 'x² = 3 ⇒ 1.7320508075...',
    value: Math.sqrt(3),
    digits: '17320508075688772935274463415058723669428052538103806280558069794519330169088000370811461867572485756',
    description: 'Norma euclidiana da diagonal tridimensional do espaço de trabalho (Work envelope).',
    jointCoupling: 'Volume 3D do Espaço Cartesiano',
    color: '#ec4899' // pink-500
  },
  sqrt5: {
    symbol: '√5',
    name: 'Raiz de 5 (Simetria Pentagonal)',
    expression: 'x² = 5 ⇒ 2.2360679774...',
    value: Math.sqrt(5),
    digits: '2236067977499789696409173668731276235440618359611525724270897245410520925637804899410178428249752560',
    description: 'Controle de conformidade e compressão elástica da pinça de preensão ER-2.',
    jointCoupling: 'J6 (Gripper Actuator)',
    color: '#06b6d4' // cyan-500
  },
  apery: {
    symbol: 'ζ(3)',
    name: 'Constante de Apéry',
    expression: '∑ (1/n³) = 1.2020569031...',
    value: 1.202056903159594,
    digits: '1202056903159594285399738161511449990764986292340498881792271555341838205786313097178768078234850787',
    description: 'Densidade espectral de fótons e relaxamento térmico subatômico em microchips quânticos.',
    jointCoupling: 'Sensores de Temperatura dos Motores',
    color: '#6366f1' // indigo-500
  },
  ln2: {
    symbol: 'ln(2)',
    name: 'Logaritmo Natural de 2',
    expression: 'ln(2) = 0.6931471805...',
    value: Math.LN2,
    digits: '0693147180559945309417232121458176568075500134360255254120680009493393621969694715605863326996418687',
    description: 'Gradiente de entropia informacional de Shannon nos tensores de inferência neural.',
    jointCoupling: 'Barramento Neural de Decisão',
    color: '#14b8a6' // teal-500
  }
};

const CONSTANT_KEYS = Object.keys(IRRATIONAL_CONSTANTS);

interface GridNode3D {
  id: string;
  i: number;
  j: number;
  k: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  constantKey: string;
  constant: IrrationalConstantInfo;
  curX: number;
  curY: number;
  curZ: number;
  // 2D Projected
  projX: number;
  projY: number;
  projZ: number;
  scale: number;
  localPotential: number;
  strain: number;
  activeDigitIndex: number;
}

interface GridEdge3D {
  id: string;
  sourceId: string;
  targetId: string;
  sourceNode: GridNode3D;
  targetNode: GridNode3D;
  axis: 'x' | 'y' | 'z';
  harmonicResonance: number;
}

interface QuantumFieldVisualizerProps {
  joints: JointState[];
  evolutionState?: AutonomousCoreEvolutionState;
  className?: string;
  onAddThought?: (thought: AutonomousThought) => void;
  onUpdateJointAngle?: (jointIndex: number, newAngle: number) => void;
}

export const QuantumFieldVisualizer: React.FC<QuantumFieldVisualizerProps> = ({
  joints,
  evolutionState,
  className = '',
  onAddThought,
  onUpdateJointAngle
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Configuration States
  const [gridDimension, setGridDimension] = useState<number>(4); // 4x4x4 = 64 nodes
  const [activeBasis, setActiveBasis] = useState<string>('all');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.006);
  const [fieldCouplingIntensity, setFieldCouplingIntensity] = useState<number>(1.2);
  const [showDigits, setShowDigits] = useState<boolean>(true);
  const [showGridEdges, setShowGridEdges] = useState<boolean>(true);
  const [showRobotArmGhost, setShowRobotArmGhost] = useState<boolean>(true);
  const [showJointJogDrawer, setShowJointJogDrawer] = useState<boolean>(false);
  const [autoHarmonicWave, setAutoHarmonicWave] = useState<boolean>(false);
  const [digitStreamSpeed, setDigitStreamSpeed] = useState<'normal' | 'fast' | 'warp'>('fast');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<GridNode3D | null>(null);

  // Local joints state to allow instant responsiveness even if parent update has latency
  const [localJoints, setLocalJoints] = useState<JointState[]>(joints);
  useEffect(() => {
    setLocalJoints(joints);
  }, [joints]);

  // Keep refs for fast animation access without recreating effect
  const localJointsRef = useRef(localJoints);
  localJointsRef.current = localJoints;
  const autoHarmonicWaveRef = useRef(autoHarmonicWave);
  autoHarmonicWaveRef.current = autoHarmonicWave;
  const digitStreamSpeedRef = useRef(digitStreamSpeed);
  digitStreamSpeedRef.current = digitStreamSpeed;
  const digitStreamOffsetRef = useRef<number>(0);

  // Camera angles & zoom
  const cameraRef = useRef<{
    yaw: number;
    pitch: number;
    distance: number;
    isDragging: boolean;
    lastMouseX: number;
    lastMouseY: number;
  }>({
    yaw: 0.45,
    pitch: 0.35,
    distance: 440,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0
  });

  const animFrameIdRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Build the 3D Lattice Nodes and Interconnecting Edges
  const latticeData = useMemo(() => {
    const nodes: GridNode3D[] = [];
    const edges: GridEdge3D[] = [];
    const nodeMap = new Map<string, GridNode3D>();
    const N = gridDimension;
    const spacing = 70; // 3D units spacing
    const half = (N - 1) / 2;

    let index = 0;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        for (let k = 0; k < N; k++) {
          const id = `node-${i}-${j}-${k}`;
          const constKey = CONSTANT_KEYS[(i * 3 + j * 5 + k * 7 + index) % CONSTANT_KEYS.length];
          const constant = IRRATIONAL_CONSTANTS[constKey];
          
          const baseX = (i - half) * spacing;
          const baseY = (j - half) * spacing;
          const baseZ = (k - half) * spacing;

          const node: GridNode3D = {
            id,
            i,
            j,
            k,
            baseX,
            baseY,
            baseZ,
            constantKey: constKey,
            constant,
            curX: baseX,
            curY: baseY,
            curZ: baseZ,
            projX: 0,
            projY: 0,
            projZ: 0,
            scale: 1,
            localPotential: 0,
            strain: 0,
            activeDigitIndex: 0
          };
          nodes.push(node);
          nodeMap.set(id, node);
          index++;
        }
      }
    }

    // Connect adjacent nodes along x, y, and z axes
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        for (let k = 0; k < N; k++) {
          const currentId = `node-${i}-${j}-${k}`;
          const current = nodeMap.get(currentId)!;

          // X connection
          if (i + 1 < N) {
            const nextX = nodeMap.get(`node-${i + 1}-${j}-${k}`)!;
            edges.push({
              id: `edge-x-${i}-${j}-${k}`,
              sourceId: currentId,
              targetId: nextX.id,
              sourceNode: current,
              targetNode: nextX,
              axis: 'x',
              harmonicResonance: 1
            });
          }
          // Y connection
          if (j + 1 < N) {
            const nextY = nodeMap.get(`node-${i}-${j + 1}-${k}`)!;
            edges.push({
              id: `edge-y-${i}-${j}-${k}`,
              sourceId: currentId,
              targetId: nextY.id,
              sourceNode: current,
              targetNode: nextY,
              axis: 'y',
              harmonicResonance: 1
            });
          }
          // Z connection
          if (k + 1 < N) {
            const nextZ = nodeMap.get(`node-${i}-${j}-${k + 1}`)!;
            edges.push({
              id: `edge-z-${i}-${j}-${k}`,
              sourceId: currentId,
              targetId: nextZ.id,
              sourceNode: current,
              targetNode: nextZ,
              axis: 'z',
              harmonicResonance: 1
            });
          }
        }
      }
    }

    return { nodes, edges, nodeMap };
  }, [gridDimension]);

  // Main 3D Projection and D3 Rendering Loop
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;

    // Define defs with gradients and glow filters once
    let defs = svg.select<SVGDefsElement>('defs');
    if (defs.empty()) {
      defs = svg.append('defs');

      // Glow filter
      const filter = defs.append('filter')
        .attr('id', 'quantum-glow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');

      filter.append('feGaussianBlur')
        .attr('stdDeviation', '4')
        .attr('result', 'coloredBlur');

      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

      // Radial gradient for quantum node core
      const radGrad = defs.append('radialGradient')
        .attr('id', 'node-radial-glow')
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');

      radGrad.append('stop').attr('offset', '0%').attr('stop-color', '#38bdf8').attr('stop-opacity', '1');
      radGrad.append('stop').attr('offset', '60%').attr('stop-color', '#818cf8').attr('stop-opacity', '0.7');
      radGrad.append('stop').attr('offset', '100%').attr('stop-color', '#0f172a').attr('stop-opacity', '0');
    }

    // Ensure layer groups exist
    let gridLayer = svg.select<SVGGElement>('g.grid-edges-layer');
    if (gridLayer.empty()) {
      gridLayer = svg.append('g').attr('class', 'grid-edges-layer');
    }

    let robotArmLayer = svg.select<SVGGElement>('g.robot-arm-layer');
    if (robotArmLayer.empty()) {
      robotArmLayer = svg.append('g').attr('class', 'robot-arm-layer');
    }

    let nodesLayer = svg.select<SVGGElement>('g.nodes-layer');
    if (nodesLayer.empty()) {
      nodesLayer = svg.append('g').attr('class', 'nodes-layer');
    }

    let hudLayer = svg.select<SVGGElement>('g.hud-layer');
    if (hudLayer.empty()) {
      hudLayer = svg.append('g').attr('class', 'hud-layer');
    }

    const renderFrame = () => {
      const width = container.clientWidth || 800;
      const height = container.clientHeight || 520;
      svg.attr('width', width).attr('height', height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Advance auto-rotation if active
      if (isAutoRotating && !cameraRef.current.isDragging) {
        cameraRef.current.yaw += rotationSpeed;
      }
      timeRef.current += 0.02;
      const t = timeRef.current;

      // Extract current joint angles in radians (checking for harmonic wave)
      let currentJoints = localJointsRef.current;
      if (autoHarmonicWaveRef.current) {
        const waveJ1 = Math.sin(t * 0.6) * 45;
        const waveJ2 = Math.sin(t * 0.8) * 35;
        const waveJ3 = Math.cos(t * 0.7) * 40;
        const waveJ4 = Math.sin(t * 1.1) * 30;
        const waveJ5 = Math.cos(t * 1.3) * 60;
        const waveJ6 = 50 + Math.sin(t * 1.6) * 45;
        currentJoints = [
          { ...(currentJoints[0] || { id: 'j1', name: 'J1', angle: 0, min: -180, max: 180, velocity: 0, torque: 0, temperature: 35 }), angle: waveJ1 },
          { ...(currentJoints[1] || { id: 'j2', name: 'J2', angle: 0, min: -90, max: 90, velocity: 0, torque: 0, temperature: 35 }), angle: waveJ2 },
          { ...(currentJoints[2] || { id: 'j3', name: 'J3', angle: 0, min: -150, max: 150, velocity: 0, torque: 0, temperature: 35 }), angle: waveJ3 },
          { ...(currentJoints[3] || { id: 'j4', name: 'J4', angle: 0, min: -110, max: 110, velocity: 0, torque: 0, temperature: 35 }), angle: waveJ4 },
          { ...(currentJoints[4] || { id: 'j5', name: 'J5', angle: 0, min: -180, max: 180, velocity: 0, torque: 0, temperature: 35 }), angle: waveJ5 },
          { ...(currentJoints[5] || { id: 'j6', name: 'J6', angle: 50, min: 0, max: 100, velocity: 0, torque: 0, temperature: 35 }), angle: waveJ6 }
        ];
      }

      const j1 = ((currentJoints[0]?.angle ?? 0) * Math.PI) / 180; // Base azimuth (pi)
      const j2 = ((currentJoints[1]?.angle ?? 0) * Math.PI) / 180; // Shoulder elevation (e)
      const j3 = ((currentJoints[2]?.angle ?? 0) * Math.PI) / 180; // Elbow harmonic (phi)
      const j4 = ((currentJoints[3]?.angle ?? 0) * Math.PI) / 180; // Wrist pitch shear (sqrt2)
      const j5 = ((currentJoints[4]?.angle ?? 0) * Math.PI) / 180; // Wrist roll spin (sqrt3)
      const j6 = ((currentJoints[5]?.angle ?? 50)) / 100;          // Gripper compression (sqrt5)

      // Advance streaming irrational digits index
      const speedMult = digitStreamSpeedRef.current === 'warp' ? 2.5 : digitStreamSpeedRef.current === 'fast' ? 0.9 : 0.3;
      digitStreamOffsetRef.current = (digitStreamOffsetRef.current + speedMult) % 75;

      const yaw = cameraRef.current.yaw;
      const pitch = cameraRef.current.pitch;
      const fovDistance = cameraRef.current.distance;

      const cosYaw = Math.cos(yaw);
      const sinYaw = Math.sin(yaw);
      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);

      // Helper to project any 3D coordinate point to 2D screen coordinates
      const project3D = (pt: { x: number; y: number; z: number }) => {
        const x1 = pt.x * cosYaw - pt.z * sinYaw;
        const z1 = pt.x * sinYaw + pt.z * cosYaw;
        const y2 = pt.y * cosPitch - z1 * sinPitch;
        const z2 = pt.y * sinPitch + z1 * cosPitch;
        const effectiveDist = fovDistance + z2;
        const scale = effectiveDist > 10 ? fovDistance / effectiveDist : 0.01;
        return {
          projX: centerX + x1 * scale,
          projY: centerY + y2 * scale,
          projZ: z2,
          scale: Math.max(0.2, Math.min(2.5, scale))
        };
      };

      // Compute 3D Robot Arm Forward Kinematics Chain
      const baseElevation = (gridDimension - 1) * 36;
      const link1Len = 65;
      const link2Len = 58;
      const link3Len = 42;
      const tcpLen = 28;

      const pBase = { x: 0, y: baseElevation, z: 0 };
      const pShoulder = { x: 0, y: baseElevation - 28, z: 0 };

      // Shoulder to elbow: rotated by j1 around Y, tilted by j2 around X
      const pElbow = {
        x: pShoulder.x + Math.sin(j2) * Math.sin(j1) * link1Len,
        y: pShoulder.y - Math.cos(j2) * link1Len,
        z: pShoulder.z + Math.sin(j2) * Math.cos(j1) * link1Len
      };

      // Elbow to wrist
      const elbowPitch = j2 + j3;
      const pWrist = {
        x: pElbow.x + Math.sin(elbowPitch) * Math.sin(j1) * link2Len,
        y: pElbow.y - Math.cos(elbowPitch) * link2Len,
        z: pElbow.z + Math.sin(elbowPitch) * Math.cos(j1) * link2Len
      };

      // Wrist to TCP (Tool Center Point)
      const wristPitch = j2 + j3 + j4;
      const pTCP = {
        x: pWrist.x + Math.sin(wristPitch) * Math.sin(j1) * (link3Len + tcpLen),
        y: pWrist.y - Math.cos(wristPitch) * (link3Len + tcpLen),
        z: pWrist.z + Math.sin(wristPitch) * Math.cos(j1) * (link3Len + tcpLen)
      };

      // 1. Warp each node position according to its irrational number and the robotic joint states
      latticeData.nodes.forEach((node) => {
        const cVal = node.constant.value;
        const distFromCenter = Math.sqrt(node.baseX * node.baseX + node.baseY * node.baseY + node.baseZ * node.baseZ) / 100;
        
        // Quantum phase distortion formula
        // J1 modulates yaw phase with pi
        // J2 modulates vertical curvature with e
        // J3 modulates harmonic wave with phi
        // J4 modulates diagonal shear with sqrt(2)
        // J5 modulates rotational spin with sqrt(3)
        // J6 modulates radial compression with sqrt(5)
        const intensity = fieldCouplingIntensity;
        const warpX = Math.sin(distFromCenter * cVal + j1 + t * 0.8) * Math.cos(j3) * 16 * intensity;
        const warpY = Math.cos(distFromCenter * Math.E + j2 + t * 0.6) * Math.sin(j4) * 14 * intensity;
        const warpZ = Math.sin(distFromCenter * ((1 + Math.sqrt(5)) / 2) + j5 + t * 0.7) * (0.8 + 0.4 * j6) * 15 * intensity;

        let x = node.baseX + warpX;
        let y = node.baseY + warpY;
        let z = node.baseZ + warpZ;

        // Kinematic perturbation from the Robot TCP Tool Center Point
        const dX = x - pTCP.x;
        const dY = y - pTCP.y;
        const dZ = z - pTCP.z;
        const distToTCP = Math.sqrt(dX * dX + dY * dY + dZ * dZ);
        let tcpStrain = 0;
        if (distToTCP < 85) {
          const repel = (85 - distToTCP) / 85;
          const push = Math.sin(t * 3.5) * 4 + 12 * repel;
          x += (dX / (distToTCP || 1)) * push;
          y += (dY / (distToTCP || 1)) * push;
          z += (dZ / (distToTCP || 1)) * push;
          tcpStrain = repel * 26;
        }

        node.curX = x;
        node.curY = y;
        node.curZ = z;

        // Calculate dynamic strain and potential
        const strainVal = Math.abs(warpX) + Math.abs(warpY) + Math.abs(warpZ) + tcpStrain;
        node.strain = strainVal;
        node.localPotential = (cVal * (j1 + 1) + Math.sin(j2 * 2) * Math.PI + Math.cos(j3) * Math.E) / (distFromCenter + 1);

        // Active digit index shifts with joint motion and stream speed
        const nodeDigitSeed = Math.floor(digitStreamOffsetRef.current + node.i * 6 + node.j * 8 + node.k * 10);
        node.activeDigitIndex = nodeDigitSeed % 70;

        // 2. Camera Rotation & Perspective Projection
        const proj = project3D({ x, y, z });
        node.projX = proj.projX;
        node.projY = proj.projY;
        node.projZ = proj.projZ;
        node.scale = proj.scale;
      });

      // Filter nodes based on active basis selection
      const filteredNodes = activeBasis === 'all' 
        ? latticeData.nodes 
        : latticeData.nodes.filter(n => n.constantKey === activeBasis);

      // Filtered nodes set for fast lookup
      const visibleNodeIds = new Set(filteredNodes.map(n => n.id));

      // Filter edges
      const visibleEdges = showGridEdges 
        ? latticeData.edges.filter(e => visibleNodeIds.has(e.sourceId) && visibleNodeIds.has(e.targetId))
        : [];

      // Sort nodes back-to-front (lowest projZ to highest projZ)
      const sortedNodes = [...filteredNodes].sort((a, b) => b.projZ - a.projZ);

      // 4. Render Edges with D3
      const edgeSelection = gridLayer.selectAll<SVGLineElement, GridEdge3D>('line.quantum-edge')
        .data(visibleEdges, (d: any) => d.id);

      edgeSelection.exit().remove();

      const edgeEnter = edgeSelection.enter()
        .append('line')
        .attr('class', 'quantum-edge')
        .attr('stroke-linecap', 'round');

      edgeSelection.merge(edgeEnter as any)
        .attr('x1', (d: any) => d.sourceNode.projX)
        .attr('y1', (d: any) => d.sourceNode.projY)
        .attr('x2', (d: any) => d.targetNode.projX)
        .attr('y2', (d: any) => d.targetNode.projY)
        .attr('stroke', (d: any) => {
          if (d.axis === 'x') return '#38bdf8'; // cyan
          if (d.axis === 'y') return '#a855f7'; // purple
          return '#10b981'; // emerald
        })
        .attr('stroke-width', (d: any) => {
          const avgScale = (d.sourceNode.scale + d.targetNode.scale) / 2;
          return Math.max(0.5, avgScale * 1.3);
        })
        .attr('stroke-opacity', (d: any) => {
          const avgScale = (d.sourceNode.scale + d.targetNode.scale) / 2;
          // Deeper nodes are dimmer
          return Math.max(0.12, Math.min(0.75, (avgScale - 0.4) * 0.9));
        })
        .attr('stroke-dasharray', (d: any) => {
          const combinedStrain = d.sourceNode.strain + d.targetNode.strain;
          return combinedStrain > 35 ? '3,3' : 'none';
        });

      // 5. Render Nodes with D3
      const nodeSelection = nodesLayer.selectAll<SVGGElement, GridNode3D>('g.quantum-node')
        .data(sortedNodes, (d: any) => d.id);

      nodeSelection.exit().remove();

      const nodeEnter = nodeSelection.enter()
        .append('g')
        .attr('class', 'quantum-node cursor-pointer')
        .on('click', (_, d: any) => {
          setSelectedNode(d);
        });

      // Append glowing outer circle
      nodeEnter.append('circle')
        .attr('class', 'node-glow')
        .attr('fill', 'none');

      // Append core circle
      nodeEnter.append('circle')
        .attr('class', 'node-core');

      // Append symbol text
      nodeEnter.append('text')
        .attr('class', 'node-symbol font-mono font-black')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central');

      // Append dynamic digit snippet text
      nodeEnter.append('text')
        .attr('class', 'node-digits font-mono')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'hanging');

      const nodeMerged = nodeSelection.merge(nodeEnter as any);

      nodeMerged
        .attr('transform', (d: any) => `translate(${d.projX}, ${d.projY})`)
        .attr('opacity', (d: any) => Math.max(0.25, Math.min(1, (d.scale - 0.3) * 1.2)));

      // Update glow circle
      nodeMerged.select<SVGCircleElement>('circle.node-glow')
        .attr('r', (d: any) => Math.max(4, d.scale * (12 + (d.strain > 25 ? 4 : 0))))
        .attr('stroke', (d: any) => d.constant.color)
        .attr('stroke-width', (d: any) => Math.max(1, d.scale * 1.5))
        .attr('stroke-opacity', (d: any) => (d.strain > 25 ? 0.8 : 0.3));

      // Update core circle
      nodeMerged.select<SVGCircleElement>('circle.node-core')
        .attr('r', (d: any) => Math.max(3, d.scale * 7))
        .attr('fill', (d: any) => d.constant.color)
        .attr('fill-opacity', (d: any) => (selectedNode?.id === d.id ? 1 : 0.85));

      // Update symbol text
      nodeMerged.select<SVGTextElement>('text.node-symbol')
        .text((d: any) => d.constant.symbol)
        .attr('font-size', (d: any) => Math.max(9, Math.round(d.scale * 9)) + 'px')
        .attr('fill', '#ffffff')
        .attr('y', 0);

      // Update digit string text
      nodeMerged.select<SVGTextElement>('text.node-digits')
        .text((d: any) => {
          if (!showDigits || d.scale < 0.8) return '';
          const slice = d.constant.digits.substring(d.activeDigitIndex, d.activeDigitIndex + 4);
          return `.${slice}…`;
        })
        .attr('y', (d: any) => Math.max(6, d.scale * 9) + 2)
        .attr('font-size', (d: any) => Math.max(7, Math.round(d.scale * 7.5)) + 'px')
        .attr('fill', (d: any) => d.constant.color)
        .attr('opacity', 0.85);

      // 6. Render 3D Robot Arm Kinematic Chain Ghost in D3
      robotArmLayer.selectAll('*').remove();
      if (showRobotArmGhost) {
        const projBase = project3D(pBase);
        const projShoulder = project3D(pShoulder);
        const projElbow = project3D(pElbow);
        const projWrist = project3D(pWrist);
        const projTCP = project3D(pTCP);

        const armBones = [
          { p1: projBase, p2: projShoulder, color: '#38bdf8' },
          { p1: projShoulder, p2: projElbow, color: '#a855f7' },
          { p1: projElbow, p2: projWrist, color: '#f59e0b' },
          { p1: projWrist, p2: projTCP, color: '#10b981' }
        ];

        // Draw kinematic links / bones
        armBones.forEach((bone) => {
          robotArmLayer.append('line')
            .attr('x1', bone.p1.projX)
            .attr('y1', bone.p1.projY)
            .attr('x2', bone.p2.projX)
            .attr('y2', bone.p2.projY)
            .attr('stroke', bone.color)
            .attr('stroke-width', Math.max(3, 4.5 * bone.p1.scale))
            .attr('stroke-linecap', 'round')
            .attr('stroke-opacity', 0.85);

          // Thin inner core beam
          robotArmLayer.append('line')
            .attr('x1', bone.p1.projX)
            .attr('y1', bone.p1.projY)
            .attr('x2', bone.p2.projX)
            .attr('y2', bone.p2.projY)
            .attr('stroke', '#ffffff')
            .attr('stroke-width', Math.max(1, 1.5 * bone.p1.scale))
            .attr('stroke-linecap', 'round')
            .attr('stroke-opacity', 0.9);
        });

        const armJointsList = [
          { pt: projBase, symbol: 'O', name: 'Base', color: '#64748b' },
          { pt: projShoulder, symbol: 'π', name: 'J1 / J2 (π, e)', color: '#38bdf8' },
          { pt: projElbow, symbol: 'φ', name: 'J3 (φ)', color: '#f59e0b' },
          { pt: projWrist, symbol: '√2', name: 'J4 / J5 (√2, √3)', color: '#10b981' },
          { pt: projTCP, symbol: '√5', name: 'TCP (√5)', color: '#ec4899' }
        ];

        armJointsList.forEach((jnt) => {
          const r = Math.max(6, 11 * jnt.pt.scale);
          const g = robotArmLayer.append('g')
            .attr('transform', `translate(${jnt.pt.projX}, ${jnt.pt.projY})`);

          // Rotating outer ring
          g.append('circle')
            .attr('r', r + 4)
            .attr('fill', 'none')
            .attr('stroke', jnt.color)
            .attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '4,2')
            .attr('opacity', 0.85);

          // Joint core
          g.append('circle')
            .attr('r', r)
            .attr('fill', jnt.color)
            .attr('fill-opacity', 0.95);

          // Symbol text
          g.append('text')
            .text(jnt.symbol)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('font-size', Math.max(8, Math.round(10 * jnt.pt.scale)) + 'px')
            .attr('font-weight', '900')
            .attr('fill', '#070b14');
        });

        // Pulsating shockwave ripple at TCP
        const tcpWaveR = ((t * 30) % 40) * projTCP.scale;
        robotArmLayer.append('circle')
          .attr('cx', projTCP.projX)
          .attr('cy', projTCP.projY)
          .attr('r', Math.max(2, tcpWaveR))
          .attr('fill', 'none')
          .attr('stroke', '#ec4899')
          .attr('stroke-width', 2)
          .attr('opacity', Math.max(0, 1 - tcpWaveR / (40 * projTCP.scale)));
      }

      // 7. Draw HUD overlays / End-Effector Target Line
      hudLayer.selectAll('*').remove();

      // Draw coordinate crosshair at center
      hudLayer.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', 3)
        .attr('fill', '#38bdf8')
        .attr('opacity', 0.5);

      // Next frame
      animFrameIdRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [latticeData, activeBasis, isAutoRotating, rotationSpeed, fieldCouplingIntensity, showDigits, showGridEdges, showRobotArmGhost, selectedNode]);

  // Mouse & Touch Drag Interaction for 3D Camera Rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    cameraRef.current.isDragging = true;
    cameraRef.current.lastMouseX = e.clientX;
    cameraRef.current.lastMouseY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cameraRef.current.isDragging) return;
    const dx = e.clientX - cameraRef.current.lastMouseX;
    const dy = e.clientY - cameraRef.current.lastMouseY;
    cameraRef.current.lastMouseX = e.clientX;
    cameraRef.current.lastMouseY = e.clientY;

    cameraRef.current.yaw += dx * 0.007;
    cameraRef.current.pitch = Math.max(-1.4, Math.min(1.4, cameraRef.current.pitch + dy * 0.007));
  };

  const handleMouseUp = () => {
    cameraRef.current.isDragging = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 30 : -30;
    cameraRef.current.distance = Math.max(220, Math.min(850, cameraRef.current.distance + delta));
  };

  // Trigger Quantum Harmonic Pulse to Robot Core
  const handleSynthesizeQuantumPulse = () => {
    const activeConst = activeBasis === 'all' ? IRRATIONAL_CONSTANTS.phi : IRRATIONAL_CONSTANTS[activeBasis];
    const avgJointAngle = (joints.reduce((acc, j) => acc + Math.abs(j.angle), 0) / (joints.length || 1)).toFixed(1);
    
    if (onAddThought) {
      onAddThought({
        id: `QUANTUM-FIELD-PULSE-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        thought: `[Campo Quântico D3] Pulso de ressonância harmônica emitido: malha de números irracionais (${activeConst.name} - ${activeConst.symbol}) acoplada aos 6 eixos robóticos. Ângulo médio: ${avgJointAngle}°. Tensores geométricos reajustados para dissipação vibracional zero.`,
        type: 'INSIGHT',
        confidence: 0.998,
        wisdomGain: 120
      });
    }
  };

  const resetCamera = () => {
    cameraRef.current.yaw = 0.45;
    cameraRef.current.pitch = 0.35;
    cameraRef.current.distance = 440;
  };

  const handleJointSlider = (index: number, angle: number) => {
    setLocalJoints((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], angle };
      }
      return copy;
    });
    if (onUpdateJointAngle) {
      onUpdateJointAngle(index, angle);
    }
  };

  const applyJointPreset = (presetName: 'zero' | 'golden' | 'quantum_pi') => {
    let presetAngles = [0, 0, 0, 0, 0, 50];
    if (presetName === 'golden') {
      presetAngles = [34, 55, 21, -34, 55, 62];
    } else if (presetName === 'quantum_pi') {
      presetAngles = [0, 45, -60, 30, 90, 85];
    }
    setLocalJoints((prev) =>
      prev.map((j, idx) => ({ ...j, angle: presetAngles[idx] ?? j.angle }))
    );
    presetAngles.forEach((val, idx) => {
      if (onUpdateJointAngle) {
        onUpdateJointAngle(idx, val);
      }
    });
  };

  return (
    <div 
      id="quantum-field-visualizer" 
      className={
        isFullscreen 
          ? `fixed inset-0 z-50 p-4 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between overflow-y-auto ${className}`
          : `relative flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl ${className}`
      }
    >
      {/* Visualizer Top Header */}
      <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/30 border border-cyan-500/40 flex items-center justify-center shadow-inner">
            <Atom className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white tracking-wide flex items-center gap-1.5">
                <span>Campo Quântico Tridimensional D3.js</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold">
                Números Irracionais Infinitos
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">
              Acoplamento cinemático 6-DOF de tensores matemáticos: π, e, φ, √2, √3, √5, ζ(3), ln(2)
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 3D Robot Arm Ghost Toggle */}
          <button
            id="btn-toggle-robot-arm"
            onClick={() => setShowRobotArmGhost(!showRobotArmGhost)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              showRobotArmGhost
                ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-sm'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={showRobotArmGhost ? 'Ocultar Braço Robótico 3D (D3)' : 'Exibir Braço Robótico 3D (D3)'}
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>Braço 6-DOF</span>
          </button>

          {/* Auto Harmonic Wave Toggle */}
          <button
            id="btn-toggle-harmonic-wave"
            onClick={() => setAutoHarmonicWave(!autoHarmonicWave)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              autoHarmonicWave
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm shadow-amber-500/20'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Oscilação Harmônica Automática dos Atuadores"
          >
            <Waves className={`w-3.5 h-3.5 ${autoHarmonicWave ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
            <span>Onda Harmônica</span>
          </button>

          {/* 6-DOF Joint Jog Drawer Toggle */}
          <button
            id="btn-toggle-jog-drawer"
            onClick={() => setShowJointJogDrawer(!showJointJogDrawer)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              showJointJogDrawer
                ? 'bg-purple-500/20 border-purple-500/60 text-purple-300 shadow-sm'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Abrir Painel de Atuadores 6-DOF"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>Atuadores</span>
          </button>

          {/* Digit Streaming Speed Cycle Button */}
          <button
            id="btn-toggle-digit-speed"
            onClick={() => {
              setDigitStreamSpeed((prev) => (prev === 'normal' ? 'fast' : prev === 'fast' ? 'warp' : 'normal'));
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-mono font-bold transition-all flex items-center gap-1"
            title="Velocidade do Fluxo Decimal de Números Irracionais"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Fluxo: {digitStreamSpeed === 'normal' ? '1x' : digitStreamSpeed === 'fast' ? '3x' : '10x'}</span>
          </button>

          {/* Emit Quantum Pulse Button */}
          <button
            id="btn-quantum-pulse-trigger"
            onClick={handleSynthesizeQuantumPulse}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition-all"
            title="Emitir Pulso de Ressonância aos Atuadores"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pulso</span>
          </button>

          {/* Auto Rotation Toggle */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all ${
              isAutoRotating
                ? 'bg-indigo-600/30 border-indigo-500/60 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={isAutoRotating ? 'Pausar Auto-Rotação' : 'Ativar Auto-Rotação'}
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5 text-indigo-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* Reset Camera */}
          <button
            onClick={resetCamera}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition-all"
            title="Recentrar Câmera 3D"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            id="btn-toggle-fullscreen"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition-all"
            title={isFullscreen ? 'Reduzir Visor' : 'Expandir em Tela Cheia'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-cyan-400" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 6-DOF Robotic Actuators & Harmonic Coupling Drawer */}
      {showJointJogDrawer && (
        <div className="p-3.5 bg-slate-900/95 border-b border-slate-800 font-mono text-xs z-20 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white text-xs">JOG DIRETO DOS ATUADORES 6-DOF (MODULAÇÃO TENSORIAL)</span>
              <span className="text-[10px] text-slate-400">Arraste para deformar o campo quântico e o braço 3D</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400">Predefinições:</span>
              <button
                onClick={() => applyJointPreset('zero')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
              >
                Repouso (0°)
              </button>
              <button
                onClick={() => applyJointPreset('golden')}
                className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold"
              >
                Áurea (φ)
              </button>
              <button
                onClick={() => applyJointPreset('quantum_pi')}
                className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold"
              >
                Singular (π)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {localJoints.map((jnt, idx) => {
              const couplingConst = [
                { symbol: 'π', name: 'Arquimedes', color: '#38bdf8' },
                { symbol: 'e', name: 'Euler', color: '#a855f7' },
                { symbol: 'φ', name: 'Áurea', color: '#f59e0b' },
                { symbol: '√2', name: 'Pitágoras', color: '#10b981' },
                { symbol: '√3', name: 'Teodoro', color: '#ec4899' },
                { symbol: '√5', name: 'Penta', color: '#06b6d4' }
              ][idx] || { symbol: 'Ψ', name: 'Quântico', color: '#ffffff' };

              return (
                <div key={jnt.id || idx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded flex items-center justify-center font-bold text-slate-950 text-[10px]" style={{ backgroundColor: couplingConst.color }}>
                        {couplingConst.symbol}
                      </span>
                      <span className="font-bold text-slate-200">{jnt.name}</span>
                      <span className="text-[9px] text-slate-500">({couplingConst.name})</span>
                    </div>
                    <span className="font-bold font-mono" style={{ color: couplingConst.color }}>
                      {jnt.angle.toFixed(1)}{idx === 5 ? '%' : '°'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={jnt.min}
                    max={jnt.max}
                    step={idx === 5 ? 1 : 0.5}
                    value={jnt.angle}
                    onChange={(e) => handleJointSlider(idx, parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>{jnt.min}{idx === 5 ? '%' : '°'}</span>
                    <span>{jnt.max}{idx === 5 ? '%' : '°'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Basis Filter & Dimension Controls Bar */}
      <div className="px-3.5 py-2 bg-slate-900/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
        {/* Irrational Basis Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" />
            Base:
          </span>
          <button
            onClick={() => setActiveBasis('all')}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
              activeBasis === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Superposição (Todos)
          </button>
          {CONSTANT_KEYS.map((k) => {
            const info = IRRATIONAL_CONSTANTS[k];
            return (
              <button
                key={k}
                onClick={() => setActiveBasis(k)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold transition-all flex items-center gap-1 ${
                  activeBasis === k
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/60 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <span style={{ color: info.color }}>{info.symbol}</span>
                <span>{info.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Dimension & Edge Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px] font-mono">
            <span className="text-slate-400 px-1">Malha:</span>
            {[3, 4, 5].map((dim) => (
              <button
                key={dim}
                onClick={() => setGridDimension(dim)}
                className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                  gridDimension === dim ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {dim}³ ({dim * dim * dim})
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowDigits(!showDigits)}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${
              showDigits 
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300' 
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
            title="Exibir Dígitos Infinitos Flutuantes"
          >
            <Hash className="w-3 h-3" />
            <span>Dígitos</span>
          </button>

          <button
            onClick={() => setShowGridEdges(!showGridEdges)}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${
              showGridEdges 
                ? 'bg-purple-950/60 border-purple-500/50 text-purple-300' 
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
            title="Exibir Linhas do Reticulado 3D"
          >
            <Activity className="w-3 h-3" />
            <span>Reticulado</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div 
        ref={containerRef}
        className={`relative w-full ${isFullscreen ? 'h-[calc(100vh-250px)] min-h-[500px]' : 'h-[500px]'} bg-gradient-to-b from-slate-950 via-[#070b14] to-slate-950 cursor-grab active:cursor-grabbing select-none overflow-hidden`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Real D3 SVG Element */}
        <svg 
          ref={svgRef} 
          className="w-full h-full block"
        />

        {/* Top-Left Live HUD Telemetry */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none bg-slate-950/85 border border-slate-800/90 rounded-xl p-2.5 font-mono text-[10px] text-cyan-300 space-y-1 backdrop-blur-md shadow-xl max-w-xs">
          <div className="text-white font-bold flex items-center gap-1.5 pb-1 border-b border-slate-800">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>TELEMETRIA QUÂNTICA EM TEMPO REAL</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>NODOS TENSORIAIS:</span>
            <span className="text-white font-bold">{latticeData.nodes.length} Nódulos</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>LINHAS ISOMÉTRICAS:</span>
            <span className="text-purple-400 font-bold">{latticeData.edges.length} Linhas</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>VELOCIDADE DE ROTAÇÃO:</span>
            <span className="text-amber-400 font-bold">{isAutoRotating ? `${(rotationSpeed * 1000).toFixed(0)} rad/s` : 'Pausado'}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>INTENSIDADE DE ACOPLAMENTO:</span>
            <span className="text-emerald-400 font-bold">{fieldCouplingIntensity.toFixed(1)}x</span>
          </div>
        </div>

        {/* Top-Right 6-DOF Robotic Joint Influence Badges */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none flex flex-col gap-1 items-end">
          <div className="bg-slate-950/85 border border-slate-800/90 rounded-xl p-2 font-mono text-[9px] text-slate-300 backdrop-blur-md shadow-xl space-y-1">
            <div className="text-cyan-400 font-bold flex items-center gap-1 justify-end">
              <Cpu className="w-3 h-3" />
              <span>VÍNCULOS COM ATUADORES ER-2</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-right">
              <div><span className="text-slate-500">J1 (π):</span> <span className="text-sky-300 font-bold">{(localJoints[0]?.angle ?? 0).toFixed(0)}°</span></div>
              <div><span className="text-slate-500">J2 (e):</span> <span className="text-purple-300 font-bold">{(localJoints[1]?.angle ?? 0).toFixed(0)}°</span></div>
              <div><span className="text-slate-500">J3 (φ):</span> <span className="text-amber-300 font-bold">{(localJoints[2]?.angle ?? 0).toFixed(0)}°</span></div>
              <div><span className="text-slate-500">J4 (√2):</span> <span className="text-emerald-300 font-bold">{(localJoints[3]?.angle ?? 0).toFixed(0)}°</span></div>
              <div><span className="text-slate-500">J5 (√3):</span> <span className="text-pink-300 font-bold">{(localJoints[4]?.angle ?? 0).toFixed(0)}°</span></div>
              <div><span className="text-slate-500">J6 (√5):</span> <span className="text-cyan-300 font-bold">{(localJoints[5]?.angle ?? 0).toFixed(0)}%</span></div>
            </div>
          </div>
        </div>

        {/* Bottom Floating Hint */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none flex items-center gap-2 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] text-slate-400 font-mono backdrop-blur-sm">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Arraste com o mouse para orbitar em 3D • Scroll para zoom • Clique em um nodo para inspecionar</span>
        </div>

        {/* Interactive Node Inspection Flyout (When a node is clicked) */}
        {selectedNode && (
          <div className="absolute bottom-3 right-3 z-30 bg-slate-950/95 border border-cyan-500/60 rounded-xl p-3 max-w-sm shadow-2xl backdrop-blur-md space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-slate-950 font-mono text-xs" style={{ backgroundColor: selectedNode.constant.color }}>
                  {selectedNode.constant.symbol}
                </span>
                <span className="font-bold text-white text-xs">{selectedNode.constant.name}</span>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 font-mono text-[11px]">
              <div className="text-slate-400">
                Expressão Exata: <span className="text-cyan-300">{selectedNode.constant.expression}</span>
              </div>
              <div className="text-slate-400">
                Coordenadas Reticulado: <span className="text-white font-bold">({selectedNode.i}, {selectedNode.j}, {selectedNode.k})</span>
              </div>
              <div className="text-slate-400">
                Posição Espacial 3D: <span className="text-purple-300">{selectedNode.curX.toFixed(1)}, {selectedNode.curY.toFixed(1)}, {selectedNode.curZ.toFixed(1)}</span>
              </div>
              <div className="text-slate-400">
                Acoplamento Robótico: <span className="text-amber-300 font-bold">{selectedNode.constant.jointCoupling}</span>
              </div>
              <div className="text-slate-400">
                Potencial Local Ψ: <span className="text-emerald-300 font-bold">{selectedNode.localPotential.toFixed(4)}</span>
              </div>
              <div className="text-slate-400">
                Deformação Tensional: <span className="text-rose-300 font-bold">{selectedNode.strain.toFixed(2)}</span>
              </div>
            </div>

            {/* Decimal Stream Preview */}
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 font-mono text-[10px] break-all">
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Fluxo Contínuo de Dígitos Decimais:</span>
              <span className="text-slate-400">...{selectedNode.constant.digits.substring(0, selectedNode.activeDigitIndex)}</span>
              <span className="text-cyan-300 font-black bg-cyan-950/80 px-0.5 rounded underline">
                {selectedNode.constant.digits.substring(selectedNode.activeDigitIndex, selectedNode.activeDigitIndex + 6)}
              </span>
              <span className="text-slate-500">{selectedNode.constant.digits.substring(selectedNode.activeDigitIndex + 6, selectedNode.activeDigitIndex + 20)}...</span>
            </div>

            <p className="text-[10px] text-slate-300 leading-tight">
              {selectedNode.constant.description}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Mathematical Spectrum Legend */}
      <div className="p-3 bg-slate-900/80 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 font-mono text-[10px]">
        {CONSTANT_KEYS.map((key) => {
          const item = IRRATIONAL_CONSTANTS[key];
          return (
            <div 
              key={key} 
              onClick={() => setActiveBasis(key)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                activeBasis === key 
                  ? 'bg-slate-800 border-cyan-500/80 shadow-md' 
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-xs" style={{ color: item.color }}>{item.symbol}</span>
                <span className="text-[9px] text-slate-500">{item.value.toFixed(4)}</span>
              </div>
              <div className="text-[9px] text-slate-300 truncate font-sans font-bold">{item.name.split(' ')[0]}</div>
              <div className="text-[8px] text-slate-500 truncate">{item.jointCoupling.split(' ')[0]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
