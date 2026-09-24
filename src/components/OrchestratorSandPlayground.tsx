import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bot, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Layers, 
  Wand2, 
  ChevronRight, 
  ShieldAlert, 
  ShieldCheck, 
  Palette, 
  Cpu, 
  Briefcase, 
  Maximize2, 
  Flame, 
  Compass, 
  Eye, 
  Zap, 
  Download,
  Crosshair
} from 'lucide-react';
import { JointState, ToolId } from '../types';

export interface SandGrain {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  targetX: number;
  targetY: number;
  settled: boolean;
  size: number;
  alpha: number;
  layer: number;
}

export interface WorkstationPreset {
  id: string;
  employeeName: string;
  role: string;
  description: string;
  primaryColors: string[];
  theme: string;
  grainCount: number;
  // Matrix generator function
  generatePoints: (width: number, height: number) => { x: number; y: number; color: string }[];
}

// Pre-defined detailed workstations formed by multicolored sand grains
export const WORKSTATION_PRESETS: WorkstationPreset[] = [
  {
    id: 'chrome_operator',
    employeeName: 'IA Operador Chrome',
    role: 'Navegação Web & Web Scraping em Massa',
    description: 'Posto de trabalho com 3 monitores Chrome, terminal de extração do DOM, teclado e logotipo Google esculpido em areia.',
    primaryColors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#06B6D4'],
    theme: 'Google Chrome & Web Architecture',
    grainCount: 380,
    generatePoints: (w, h) => {
      const pts: { x: number; y: number; color: string }[] = [];
      const cx = w * 0.5;
      const cy = h * 0.55;

      // Desk Surface (Brown & Slate Sand)
      for (let x = cx - 180; x <= cx + 180; x += 12) {
        for (let y = cy + 50; y <= cy + 80; y += 8) {
          pts.push({ x, y, color: (x + y) % 2 === 0 ? '#94A3B8' : '#64748B' });
        }
      }

      // Center Monitor Frame (Chrome Blue & White Sand)
      for (let x = cx - 90; x <= cx + 90; x += 9) {
        for (let y = cy - 80; y <= cy + 40; y += 9) {
          const isBorder = x <= cx - 80 || x >= cx + 80 || y <= cy - 70 || y >= cy + 30;
          if (isBorder) {
            pts.push({ x, y, color: '#3B82F6' });
          } else {
            // Chrome Screen Content (Tabs & Code)
            const color = y < cy - 40 ? '#60A5FA' : (x % 18 === 0 ? '#34D399' : '#1E293B');
            pts.push({ x, y, color });
          }
        }
      }

      // Left Monitor (Google Colors)
      for (let x = cx - 180; x <= cx - 100; x += 9) {
        for (let y = cy - 60; y <= cy + 35; y += 9) {
          const isBorder = x <= cx - 170 || x >= cx - 110 || y <= cy - 50 || y >= cy + 25;
          pts.push({ x, y, color: isBorder ? '#EA4335' : '#FBBC05' });
        }
      }

      // Right Monitor (Terminal Matrix Green)
      for (let x = cx + 100; x <= cx + 180; x += 9) {
        for (let y = cy - 60; y <= cy + 35; y += 9) {
          const isBorder = x <= cx + 110 || x >= cx + 170 || y <= cy - 50 || y >= cy + 25;
          pts.push({ x, y, color: isBorder ? '#10B981' : '#064E3B' });
        }
      }

      // Google 4-Color Sand Emblem in Center Screen
      const googleColors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];
      for (let i = 0; i < 28; i++) {
        const ang = (i / 28) * Math.PI * 2;
        const rad = 25;
        pts.push({
          x: cx + Math.cos(ang) * rad,
          y: cy - 15 + Math.sin(ang) * rad,
          color: googleColors[i % 4]
        });
      }

      // Keyboard & Mouse Pad on Desk
      for (let x = cx - 60; x <= cx + 60; x += 8) {
        for (let y = cy + 55; y <= cy + 70; y += 6) {
          pts.push({ x, y, color: '#CBD5E1' });
        }
      }

      return pts;
    }
  },
  {
    id: 'binance_trader',
    employeeName: 'IA Robô Trader Binance',
    role: 'Scalping & Grid Trading Cripto de Alta Frequência',
    description: 'Posto de operações financeiras com velas candlesticks em areia verde e vermelha, livro de ofertas e cofre de USDT em ouro.',
    primaryColors: ['#F3BA2F', '#10B981', '#EF4444', '#F59E0B', '#0F172A'],
    theme: 'Binance Futures & High-Speed Market Making',
    grainCount: 420,
    generatePoints: (w, h) => {
      const pts: { x: number; y: number; color: string }[] = [];
      const cx = w * 0.5;
      const cy = h * 0.55;

      // Trading Desk Base
      for (let x = cx - 190; x <= cx + 190; x += 12) {
        for (let y = cy + 55; y <= cy + 85; y += 8) {
          pts.push({ x, y, color: '#1E293B' });
        }
      }

      // Multi-Chart Big Curved Terminal
      for (let x = cx - 160; x <= cx + 160; x += 10) {
        for (let y = cy - 85; y <= cy + 45; y += 10) {
          const isBorder = x <= cx - 150 || x >= cx + 150 || y <= cy - 75 || y >= cy + 35;
          if (isBorder) {
            pts.push({ x, y, color: '#F3BA2F' }); // Binance Gold Border
          } else {
            pts.push({ x, y, color: '#020617' }); // Deep black terminal
          }
        }
      }

      // Candlesticks (Green Bulls & Red Bears in vibrant sand grains)
      const candleOffsets = [-120, -90, -60, -30, 0, 30, 60, 90, 120];
      candleOffsets.forEach((ox, idx) => {
        const isGreen = idx % 3 !== 1;
        const color = isGreen ? '#10B981' : '#EF4444';
        const wickColor = isGreen ? '#34D399' : '#F87171';
        const height = 30 + (Math.sin(idx * 1.5) + 1) * 20;
        const topY = cy - 20 - (idx % 2 === 0 ? 15 : 0);

        // Candle Wick
        for (let y = topY - 15; y <= topY + height + 15; y += 5) {
          pts.push({ x: cx + ox, y, color: wickColor });
        }
        // Candle Body
        for (let x = cx + ox - 8; x <= cx + ox + 8; x += 4) {
          for (let y = topY; y <= topY + height; y += 5) {
            pts.push({ x, y, color });
          }
        }
      });

      // Binance Diamond Logo in Center Top
      const diamondPts = [
        { x: cx, y: cy - 70 },
        { x: cx - 18, y: cy - 50 },
        { x: cx + 18, y: cy - 50 },
        { x: cx, y: cy - 30 }
      ];
      diamondPts.forEach(p => {
        for (let r = 0; r < 6; r++) {
          pts.push({ x: p.x + (Math.random() - 0.5) * 8, y: p.y + (Math.random() - 0.5) * 8, color: '#F3BA2F' });
        }
      });

      // USDT Gold Stacks on Desk
      for (let x = cx + 120; x <= cx + 160; x += 6) {
        for (let y = cy + 45; y <= cy + 65; y += 5) {
          pts.push({ x, y, color: '#FBBF24' });
        }
      }

      return pts;
    }
  },
  {
    id: 'vision_agent',
    employeeName: 'IA Visão Real Gemini 3.8',
    role: 'Percepção de Imagem & Câmera em Tempo Real',
    description: 'Bancada óptica com sensor de câmera neural, feixes de laser LiDAR violeta e retículo ReAct esculpidos em areia holográfica.',
    primaryColors: ['#8B5CF6', '#A855F7', '#06B6D4', '#10B981', '#FFFFFF'],
    theme: 'Optical Bench & Gemini Multimodal Perception',
    grainCount: 400,
    generatePoints: (w, h) => {
      const pts: { x: number; y: number; color: string }[] = [];
      const cx = w * 0.5;
      const cy = h * 0.55;

      // Optical Bench Surface
      for (let x = cx - 180; x <= cx + 180; x += 10) {
        for (let y = cy + 50; y <= cy + 80; y += 8) {
          pts.push({ x, y, color: '#334155' });
        }
      }

      // Camera Lens Aperture Ring (Multilayer Sand Ring)
      for (let r = 15; r <= 65; r += 10) {
        const grainSteps = Math.floor(r * 1.8);
        const color = r < 35 ? '#06B6D4' : r < 50 ? '#8B5CF6' : '#C084FC';
        for (let i = 0; i < grainSteps; i++) {
          const ang = (i / grainSteps) * Math.PI * 2;
          pts.push({
            x: cx + Math.cos(ang) * r,
            y: cy - 20 + Math.sin(ang) * r,
            color
          });
        }
      }

      // Pupil / Sensor Center
      for (let x = cx - 10; x <= cx + 10; x += 4) {
        for (let y = cy - 30; y <= cy - 10; y += 4) {
          pts.push({ x, y, color: '#FFFFFF' });
        }
      }

      // LiDAR Light Beams radiating outwards
      for (let a = 0; a < 8; a++) {
        const ang = (a / 8) * Math.PI * 2;
        for (let dist = 75; dist <= 140; dist += 12) {
          pts.push({
            x: cx + Math.cos(ang) * dist,
            y: cy - 20 + Math.sin(ang) * dist,
            color: dist % 24 === 0 ? '#10B981' : '#38BDF8'
          });
        }
      }

      // ReAct HUD Target Box in Cyan Sand
      const boxSize = 130;
      for (let i = 0; i < 4; i++) {
        // 4 corner reticles
        const ox = (i % 2 === 0 ? -1 : 1) * boxSize * 0.5;
        const oy = (i < 2 ? -1 : 1) * boxSize * 0.5;
        for (let len = 0; len < 20; len += 4) {
          pts.push({ x: cx + ox + (ox < 0 ? len : -len), y: cy - 20 + oy, color: '#22D3EE' });
          pts.push({ x: cx + ox, y: cy - 20 + oy + (oy < 0 ? len : -len), color: '#22D3EE' });
        }
      }

      return pts;
    }
  },
  {
    id: 'er2_assembly',
    employeeName: 'IA Engenheiro Tangível ER-2',
    role: 'Manufatura Física, Cinemática 6-DOF & Células Industriais',
    description: 'Posto fabril com esteira rolante, braço robótico articulado, peças mecânicas e sinalizadores de segurança industrial.',
    primaryColors: ['#EA580C', '#94A3B8', '#FBBF24', '#0284C7', '#E2E8F0'],
    theme: 'Robotic Automation & Physical Hardware',
    grainCount: 410,
    generatePoints: (w, h) => {
      const pts: { x: number; y: number; color: string }[] = [];
      const cx = w * 0.5;
      const cy = h * 0.55;

      // Industrial Conveyor Belt (Esteira)
      for (let x = cx - 180; x <= cx + 180; x += 8) {
        for (let y = cy + 45; y <= cy + 75; y += 6) {
          const isRoller = x % 24 === 0;
          pts.push({ x, y, color: isRoller ? '#F97316' : '#475569' });
        }
      }

      // 6-DOF Robotic Arm Silhouette in Orange/Steel Sand
      // Base
      for (let x = cx - 35; x <= cx + 35; x += 5) {
        for (let y = cy + 20; y <= cy + 45; y += 5) {
          pts.push({ x, y, color: '#EA580C' });
        }
      }

      // Joint 1 & Shoulder Link
      for (let y = cy - 20; y <= cy + 20; y += 5) {
        for (let x = cx - 12; x <= cx + 12; x += 4) {
          pts.push({ x, y, color: '#CBD5E1' });
        }
      }

      // Elbow & Upper Arm at an angle
      for (let step = 0; step < 18; step++) {
        const x = cx - 10 + step * 4;
        const y = cy - 20 - step * 3;
        for (let th = -6; th <= 6; th += 3) {
          pts.push({ x, y: y + th, color: '#EA580C' });
        }
      }

      // Wrist & End-Effector Gripper
      const wristX = cx + 62;
      const wristY = cy - 74;
      for (let r = 0; r < 12; r += 3) {
        pts.push({ x: wristX + r, y: wristY, color: '#FBBF24' });
        pts.push({ x: wristX - r, y: wristY, color: '#FBBF24' });
      }
      // Gripper Fingers holding a gear
      for (let f = 0; f < 18; f += 3) {
        pts.push({ x: wristX - 10, y: wristY + f, color: '#0284C7' });
        pts.push({ x: wristX + 10, y: wristY + f, color: '#0284C7' });
      }
      // Workpiece in Gripper
      for (let gx = wristX - 6; gx <= wristX + 6; gx += 3) {
        for (let gy = wristY + 8; gy <= wristY + 20; gy += 3) {
          pts.push({ x: gx, y: gy, color: '#F59E0B' });
        }
      }

      // Safety Hazard Striping on Floor
      for (let x = cx - 180; x <= cx + 180; x += 14) {
        const isYellow = (Math.floor(x / 14)) % 2 === 0;
        pts.push({ x, y: cy + 85, color: isYellow ? '#FACC15' : '#0F172A' });
      }

      return pts;
    }
  },
  {
    id: 'quantum_bank',
    employeeName: 'IA Auditor Wise Quantum Bank',
    role: 'Gestão de Liquidez, Moedas Soberanas & Risco Financeiro',
    description: 'Mesa executiva bancária com terminal de liquidez multi-moedas, cofres blindados em ouro e matriz quântica de risco.',
    primaryColors: ['#16A34A', '#EAB308', '#1E3A8A', '#E2E8F0', '#059669'],
    theme: 'Decentralized Sovereign Reserve & Bank Auditing',
    grainCount: 390,
    generatePoints: (w, h) => {
      const pts: { x: number; y: number; color: string }[] = [];
      const cx = w * 0.5;
      const cy = h * 0.55;

      // Executive Polished Granite Desk
      for (let x = cx - 180; x <= cx + 180; x += 10) {
        for (let y = cy + 50; y <= cy + 80; y += 8) {
          pts.push({ x, y, color: '#0F172A' });
        }
      }

      // Vault Round Door Silhouette
      for (let r = 20; r <= 70; r += 10) {
        const steps = Math.floor(r * 1.6);
        for (let i = 0; i < steps; i++) {
          const ang = (i / steps) * Math.PI * 2;
          pts.push({
            x: cx + Math.cos(ang) * r,
            y: cy - 20 + Math.sin(ang) * r,
            color: r === 70 ? '#EAB308' : r === 40 ? '#10B981' : '#334155'
          });
        }
      }

      // Vault Wheel Spikes
      for (let s = 0; s < 6; s++) {
        const ang = (s / 6) * Math.PI * 2;
        for (let d = 25; d <= 65; d += 8) {
          pts.push({
            x: cx + Math.cos(ang) * d,
            y: cy - 20 + Math.sin(ang) * d,
            color: '#FACC15'
          });
        }
      }

      // Wise Green Cash & Gold Bars on Sides
      for (let x = cx - 160; x <= cx - 110; x += 8) {
        for (let y = cy + 40; y <= cy + 65; y += 6) {
          pts.push({ x, y, color: '#16A34A' });
        }
      }
      for (let x = cx + 110; x <= cx + 160; x += 8) {
        for (let y = cy + 40; y <= cy + 65; y += 6) {
          pts.push({ x, y, color: '#EAB308' });
        }
      }

      return pts;
    }
  }
];

interface OrchestratorSandPlaygroundProps {
  joints?: JointState[];
  playbackSpeed?: number;
  setPlaybackSpeed?: (spd: number) => void;
  onNavigateToWorkerAgency?: () => void;
}

export const OrchestratorSandPlayground: React.FC<OrchestratorSandPlaygroundProps> = ({
  joints = [
    { id: 'joint1', name: 'Base', angle: 0, minAngle: -180, maxAngle: 180, velocity: 0, current: 1.2, temperature: 34 },
    { id: 'joint2', name: 'Ombro', angle: 45, minAngle: -90, maxAngle: 135, velocity: 0, current: 2.1, temperature: 38 },
    { id: 'joint3', name: 'Cotovelo', angle: -60, minAngle: -150, maxAngle: 90, velocity: 0, current: 1.8, temperature: 36 },
    { id: 'joint4', name: 'Pulso 1', angle: 0, minAngle: -180, maxAngle: 180, velocity: 0, current: 0.9, temperature: 32 },
    { id: 'joint5', name: 'Pulso 2', angle: 30, minAngle: -120, maxAngle: 120, velocity: 0, current: 0.8, temperature: 31 },
    { id: 'joint6', name: 'Pulso 3', angle: 0, minAngle: -360, maxAngle: 360, velocity: 0, current: 0.6, temperature: 30 }
  ],
  playbackSpeed = 1.0,
  setPlaybackSpeed,
  onNavigateToWorkerAgency
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('chrome_operator');
  const [isPouringActive, setIsPouringActive] = useState<boolean>(true);
  const [pourRate, setPourRate] = useState<number>(180); // grains per second
  const [sandGrains, setSandGrains] = useState<SandGrain[]>([]);
  const [targetPositions, setTargetPositions] = useState<{ x: number; y: number; color: string }[]>([]);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState<boolean>(false);
  const [nozzlePos, setNozzlePos] = useState<{ x: number; y: number }>({ x: 400, y: 80 });
  const [simulatedArmAngles, setSimulatedArmAngles] = useState<number[]>([0, 45, -60, 0, 30, 0]);
  const [isEmergencyStopped, setIsEmergencyStopped] = useState<boolean>(false);
  const [activeLayerCount, setActiveLayerCount] = useState<number>(0);
  const [grainPalette, setGrainPalette] = useState<string>('multicor');
  const [manualPouring, setManualPouring] = useState<boolean>(false);

  const selectedPreset = WORKSTATION_PRESETS.find(p => p.id === selectedPresetId) || WORKSTATION_PRESETS[0];

  // Initialize workstation points when preset changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width || 800;
    const height = canvas.height || 500;
    const pts = selectedPreset.generatePoints(width, height);
    setTargetPositions(pts);
    setSandGrains([]); // reset sand bed
    setActiveLayerCount(0);
    setIsPouringActive(true);
  }, [selectedPresetId]);

  // Handle Freeform Manual Sand Pour on Mouse Drag
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    setNozzlePos({ x, y: Math.max(40, y - 60) });
    setManualPouring(true);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!manualPouring) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    setNozzlePos({ x, y: Math.max(40, y - 60) });
  };

  const handleCanvasMouseUp = () => {
    setManualPouring(false);
  };

  // Generate Custom Image from Orchestrator Prompt
  const handleGenerateCustomImage = () => {
    if (!customPrompt.trim()) return;
    setIsGeneratingCustom(true);

    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 800;
    const height = canvas ? canvas.height : 500;
    const cx = width * 0.5;
    const cy = height * 0.55;

    // Procedural sand palette based on prompt tokens
    const colors = ['#38BDF8', '#818CF8', '#C084FC', '#34D399', '#FBBF24', '#FB7185'];
    const customPoints: { x: number; y: number; color: string }[] = [];

    // Synthesize procedural workstation geometry
    const numBeds = 320;
    for (let i = 0; i < numBeds; i++) {
      const radius = 20 + Math.sqrt(i) * 9;
      const angle = i * 0.25;
      const x = cx + Math.cos(angle) * radius * 1.4;
      const y = cy + Math.sin(angle) * radius * 0.7;
      const color = colors[i % colors.length];
      customPoints.push({ x, y, color });
    }

    // Add desk foundation
    for (let x = cx - 180; x <= cx + 180; x += 12) {
      for (let y = cy + 50; y <= cy + 75; y += 8) {
        customPoints.push({ x, y, color: '#475569' });
      }
    }

    setTimeout(() => {
      setTargetPositions(customPoints);
      setSandGrains([]);
      setActiveLayerCount(0);
      setIsPouringActive(true);
      setIsGeneratingCustom(false);
    }, 450);
  };

  // Main Canvas Rendering & Physics Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let tick = 0;

    const render = () => {
      tick++;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear with Zen Dark Sandbox Bed
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, width, height);

      // 2. Sand Bed Texture & Wooden Tray Border
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.25)';
      ctx.lineWidth = 1;
      const grid = 28;
      for (let x = 0; x < width; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Wooden Zen Bed Outer Frame
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 6;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      // Bed Status Subtitle
      ctx.font = '10px monospace';
      ctx.fillStyle = '#64748B';
      ctx.fillText('BANDEJA ZEN // DISPENSER DE AREIA MULTICOR 6-DOF', 24, 30);
      ctx.fillText(`GRÃOS NA BANDEJA: ${sandGrains.length} • ALVO: ${targetPositions.length}`, width - 260, 30);

      // 3. Sand Generation / Pouring Logic (Continuous or Manual)
      if (!isEmergencyStopped && (isPouringActive || manualPouring)) {
        // Pick next target point to form
        if (targetPositions.length > 0 && sandGrains.length < targetPositions.length) {
          const spawnCount = Math.min(6, targetPositions.length - sandGrains.length);
          const newGrains: SandGrain[] = [];

          for (let s = 0; s < spawnCount; s++) {
            const pt = targetPositions[sandGrains.length + s];
            if (!pt) break;

            // Animate nozzle towards target x, y
            setNozzlePos(prev => ({
              x: prev.x + (pt.x - prev.x) * 0.08,
              y: Math.max(50, prev.y + (pt.y - 120 - prev.y) * 0.08)
            }));

            // Spawn sand grain falling from 6-DOF nozzle tip
            newGrains.push({
              x: nozzlePos.x + (Math.random() - 0.5) * 6,
              y: nozzlePos.y + 10,
              vx: (Math.random() - 0.5) * 1.5,
              vy: 2.5 + Math.random() * 2.0,
              color: pt.color,
              targetX: pt.x + (Math.random() - 0.5) * 2,
              targetY: pt.y + (Math.random() - 0.5) * 2,
              settled: false,
              size: 2.4 + Math.random() * 1.2,
              alpha: 0.95,
              layer: Math.floor(sandGrains.length / 50)
            });
          }

          if (newGrains.length > 0) {
            setSandGrains(prev => [...prev, ...newGrains]);
          }
        }
      }

      // 4. Update Sand Grains Physics & Draw Grains
      setSandGrains(prevGrains => {
        return prevGrains.map(grain => {
          if (grain.settled) return grain;

          // Physics gravity & trajectory towards target
          const dx = grain.targetX - grain.x;
          const dy = grain.targetY - grain.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let nextX = grain.x + grain.vx;
          let nextY = grain.y + grain.vy;
          let nextVy = grain.vy + 0.35; // gravity
          let isSettled = false;

          // Steer towards target point
          if (dist < 15) {
            nextX += dx * 0.35;
            nextY += dy * 0.35;
          }

          // Settled on target
          if (nextY >= grain.targetY || dist < 3.0) {
            nextX = grain.targetX;
            nextY = grain.targetY;
            isSettled = true;
          }

          return {
            ...grain,
            x: nextX,
            y: nextY,
            vy: nextVy,
            settled: isSettled
          };
        });
      });

      // Draw all sand grains
      sandGrains.forEach(g => {
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Subtle specular highlight on settled sand
        if (g.settled && g.size > 2.8) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fillRect(g.x - 0.5, g.y - 0.5, 1, 1);
        }
      });

      // 5. Draw 6-DOF Robotic Arm Manipulator above the Zen Sand Plate
      const baseJointX = width * 0.5;
      const baseJointY = 24;

      // Draw 6-DOF Robot Arm links
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Link 1: Base to Shoulder
      ctx.strokeStyle = '#1E293B';
      ctx.beginPath();
      ctx.moveTo(baseJointX, baseJointY);
      const shoulderX = baseJointX + Math.sin(tick * 0.02) * 20;
      const shoulderY = baseJointY + 35;
      ctx.lineTo(shoulderX, shoulderY);
      ctx.stroke();

      // Link 2: Shoulder to Elbow
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(shoulderX, shoulderY);
      const elbowX = (shoulderX + nozzlePos.x) * 0.5 - 25;
      const elbowY = (shoulderY + nozzlePos.y) * 0.5 - 15;
      ctx.lineTo(elbowX, elbowY);
      ctx.stroke();

      // Link 3: Elbow to Wrist
      ctx.strokeStyle = '#F97316'; // Robotic Orange
      ctx.beginPath();
      ctx.moveTo(elbowX, elbowY);
      ctx.lineTo(nozzlePos.x, nozzlePos.y);
      ctx.stroke();

      // Draw Rotary Joints
      [
        { x: baseJointX, y: baseJointY, r: 8, col: '#38BDF8' },
        { x: shoulderX, y: shoulderY, r: 7, col: '#F59E0B' },
        { x: elbowX, y: elbowY, r: 6, col: '#10B981' },
        { x: nozzlePos.x, y: nozzlePos.y, r: 5, col: '#EC4899' }
      ].forEach(j => {
        ctx.fillStyle = j.col;
        ctx.beginPath();
        ctx.arc(j.x, j.y, j.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // End-Effector Precision Nozzle
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(nozzlePos.x - 4, nozzlePos.y, 8, 14);

      // Sand Stream pouring out from nozzle
      if (isPouringActive || manualPouring) {
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(nozzlePos.x, nozzlePos.y + 14);
        ctx.lineTo(nozzlePos.x + (Math.sin(tick) * 2), nozzlePos.y + 45);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [isEmergencyStopped, isPouringActive, manualPouring, nozzlePos, sandGrains, targetPositions]);

  return (
    <div className="space-y-6">
      {/* Playground Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-cyan-500 p-0.5 shadow-xl shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Flame className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-wide uppercase">
                  Playground do Orquestrador // Cinemática 6-DOF & Areia Quântica
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  AREIA MULTICROMÁTICA
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                O Orquestrador utiliza o braço robótico de 6 graus de liberdade como um dispensador de alta precisão de grãos de areia colorida para esculpir fisicamente os postos de trabalho de cada empregado IA autônomo.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-sand-toggle-pour"
              onClick={() => setIsPouringActive(!isPouringActive)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                isPouringActive
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isPouringActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPouringActive ? 'PAUSAR DESPEJO' : 'DESPEJAR AREIA'}</span>
            </button>

            <button
              id="btn-sand-reset-tray"
              onClick={() => {
                setSandGrains([]);
                setIsPouringActive(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Alisar bandeja de areia para recomeçar"
            >
              <RotateCcw className="w-4 h-4" />
              <span>VIBRAR / LIMPAR BANDEJA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Sand Canvas & 6-DOF Sandbox Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: The Big Sand Bed (Canvas) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative rounded-3xl overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-2xl">
            <canvas
              ref={canvasRef}
              width={800}
              height={520}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              className="w-full h-auto cursor-crosshair block select-none"
              title="Clique e arraste para despejar grãos de areia manualmente em qualquer ponto"
            />

            {/* Canvas Floating Overlay Controls */}
            <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-cyan-300 backdrop-blur-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Posto Atual: {selectedPreset.employeeName}</span>
              </div>
            </div>

            {/* Hint Badge */}
            <div className="absolute bottom-4 right-4 pointer-events-none">
              <div className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-400 backdrop-blur-md">
                Arraste o mouse para mover o braço 6-DOF e despejar grãos livremente
              </div>
            </div>
          </div>

          {/* Prompt Generator Bar: "Gera o que quiser com Grãos de Areia" */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full relative">
              <input
                id="input-sand-custom-prompt"
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Peça ao Orquestrador: Ex: Estação Espacial de IA, Laboratório de Solda Submarina..."
                className="w-full py-2.5 pl-9 pr-4 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
              />
              <Wand2 className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
            </div>

            <button
              id="btn-generate-sand-custom"
              onClick={handleGenerateCustomImage}
              disabled={isGeneratingCustom}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 hover:opacity-95 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{isGeneratingCustom ? 'ESCULPINDO GRÃOS...' : 'GERAR IMAGEM EM AREIA'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Workstation Presets & 6-DOF Kinematics Status */}
        <div className="lg:col-span-4 space-y-4">
          {/* Workstations Selector */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                <span>Postos de Trabalho dos Empregados IA</span>
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">5 Postos Físicos</span>
            </div>

            <div className="space-y-2">
              {WORKSTATION_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`w-full p-3 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-slate-800 to-slate-900 border-amber-500 shadow-lg ring-1 ring-amber-400/40'
                        : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="flex gap-0.5">
                        {preset.primaryColors.slice(0, 3).map((col, idx) => (
                          <span
                            key={idx}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: col }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                          {preset.employeeName}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">
                          {preset.grainCount} grãos
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {preset.role}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6-DOF Robotic Arm Telemetry in Playground */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Cinemática 6-DOF (Bocal Dispensador)</span>
              </h2>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                CALIBRADO
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {joints.slice(0, 6).map((j, idx) => (
                <div key={j.id} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400 block font-mono">J{idx + 1} ({j.name})</span>
                  <span className="text-xs font-black text-cyan-300 font-mono">
                    {j.angle > 0 ? `+${j.angle}°` : `${j.angle}°`}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-mono">
              <span>Coordenadas do Bocal:</span>
              <span className="text-amber-300 font-bold">X: {nozzlePos.x.toFixed(0)}mm • Y: {nozzlePos.y.toFixed(0)}mm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
