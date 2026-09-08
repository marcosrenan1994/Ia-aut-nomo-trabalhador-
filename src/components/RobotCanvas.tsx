import React, { useRef, useEffect } from 'react';
import { ToolId, JointState } from '../types';
import { Play, Pause, RotateCcw, AlertTriangle, ShieldCheck, Zap, Gauge } from 'lucide-react';

interface RobotCanvasProps {
  joints: JointState[];
  activeTool: ToolId;
  isExecuting: boolean;
  activeStepName?: string;
  emergencyStop: boolean;
  onToggleEstop: () => void;
  playbackSpeed: number;
  setPlaybackSpeed: (spd: number) => void;
}

export const RobotCanvas: React.FC<RobotCanvasProps> = ({
  joints,
  activeTool,
  isExecuting,
  activeStepName,
  emergencyStop,
  onToggleEstop,
  playbackSpeed,
  setPlaybackSpeed
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.03 * playbackSpeed;
      const width = canvas.width;
      const height = canvas.height;

      // Clear & Draw High-Tech Smart Factory Floor (inspired by Chinese Smart Factory video)
      ctx.clearRect(0, 0, width, height);

      // Metallic epoxy floor gradient
      const floorGrad = ctx.createLinearGradient(0, 0, 0, height);
      floorGrad.addColorStop(0, '#090d16');
      floorGrad.addColorStop(0.5, '#0f172a');
      floorGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, 0, width, height);

      // High-precision engineering grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Bright yellow safety demarcation lines (typical in modern smart factories)
      ctx.save();
      ctx.strokeStyle = emergencyStop ? 'rgba(239, 68, 68, 0.9)' : 'rgba(234, 179, 8, 0.75)';
      ctx.lineWidth = 3;
      ctx.setLineDash([12, 8]);
      ctx.strokeRect(30, 30, width - 60, height - 60);
      ctx.restore();

      // Overhead Gantry Lighting reflections
      ctx.fillStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.fillRect(width * 0.2, 0, width * 0.6, height);

      // Background Automated AGV Carts (moving back & forth)
      const agvPosX = (width * 0.25 + Math.sin(time * 0.5) * 80) % width;
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(agvPosX, 90, 70, 35);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(agvPosX + 10, 95, 50, 15);
      // AGV blinking LED status
      ctx.fillStyle = Math.floor(time * 4) % 2 === 0 ? '#10b981' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(agvPosX + 35, 102, 3, 0, Math.PI * 2);
      ctx.fill();

      // Background Humanoid Assistant Robot Silhouette (inspired by video)
      const humX = width * 0.78;
      const humY = 110;
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(humX, humY - 20, 8, 0, Math.PI * 2); // Head
      ctx.fill();
      ctx.fillRect(humX - 10, humY - 10, 20, 30); // Torso
      ctx.fillRect(humX - 12, humY + 20, 8, 25);  // Left leg
      ctx.fillRect(humX + 4, humY + 20, 8, 25);   // Right leg
      // Glowing chest core on humanoid assistant
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(humX, humY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Factory Pedestal Base / Workstation
      const baseX = width * 0.42;
      const baseY = height * 0.78;

      // Smart Conveyor & Work Tables with LED status strips
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(60, baseY + 15, 160, 45); // Table A (Input Conveyor)
      ctx.fillRect(width - 220, baseY + 15, 160, 45); // Table B (Output Sorting)

      // Conveyor LED accent strip
      ctx.fillStyle = '#0ea5e9';
      ctx.fillRect(60, baseY + 55, 160, 3);
      ctx.fillRect(width - 220, baseY + 55, 160, 3);

      // Conveyor rollers & moving packages
      ctx.fillStyle = '#475569';
      for (let i = 0; i < 5; i++) {
        const rollerOffset = (time * 15) % 30;
        ctx.fillRect(70 + i * 32 + (isExecuting ? rollerOffset : 0) % 32, baseY + 22, 16, 20);
        ctx.fillRect(width - 210 + i * 32, baseY + 22, 16, 20);
      }

      // Workstation Labels
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('ESTAÇÃO A: ALIMENTAÇÃO AGV', 65, baseY + 72);
      ctx.fillText('ESTAÇÃO B: CLASSIFICAÇÃO 24H', width - 215, baseY + 72);

      // Pallet Object on Table A (moving dynamically when executing)
      const packageOffset = isExecuting ? (Math.sin(time * 3) * 20) : 0;
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(110 + packageOffset, baseY - 2, 42, 22);
      ctx.strokeStyle = '#d97706';
      ctx.strokeRect(110 + packageOffset, baseY - 2, 42, 22);
      // QR Code on package
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(120 + packageOffset, baseY + 4, 10, 10);

      // Robotic Arm Heavy Heavy Pedestal Base
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(baseX - 55, baseY, 110, 40, [8, 8, 0, 0]);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Base Mounting Flange
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(baseX - 35, baseY - 12, 70, 12);

      // Status Ring on Base
      ctx.beginPath();
      ctx.arc(baseX, baseY - 6, 6, 0, Math.PI * 2);
      ctx.fillStyle = emergencyStop ? '#ef4444' : isExecuting ? '#10b981' : '#0ea5e9';
      ctx.fill();

      // Kinematic Link Calculation
      // 6 Joints Angles with slight breathing animation when executing
      const j1 = (joints[0]?.angle || 0) * (Math.PI / 180);
      const j2 = ((joints[1]?.angle || -25) + (isExecuting ? Math.sin(time * 2) * 4 : 0)) * (Math.PI / 180);
      const j3 = ((joints[2]?.angle || 55) + (isExecuting ? Math.cos(time * 2) * 5 : 0)) * (Math.PI / 180);
      const j4 = (joints[3]?.angle || -30) * (Math.PI / 180);
      const j5 = ((joints[4]?.angle || 10) + (isExecuting ? Math.sin(time * 3) * 3 : 0)) * (Math.PI / 180);
      const j6 = (joints[5]?.angle || 0) * (Math.PI / 180);

      // Link lengths
      const L1 = 45;  // Base vertical turret
      const L2 = 120; // Lower arm (Boom)
      const L3 = 100; // Upper arm (Forearm)
      const L4 = 55;  // Wrist assembly

      // Joint 1 Center (Turret top)
      const p0 = { x: baseX, y: baseY - 12 };
      const p1 = { x: p0.x, y: p0.y - L1 };

      // Joint 2 & Joint 3 Position
      const a2 = -Math.PI / 2 + j2;
      const p2 = {
        x: p1.x + Math.cos(a2) * L2,
        y: p1.y + Math.sin(a2) * L2
      };

      const a3 = a2 + j3;
      const p3 = {
        x: p2.x + Math.cos(a3) * L3,
        y: p2.y + Math.sin(a3) * L3
      };

      // Wrist / End-Effector Joint
      const a4 = a3 + j4;
      const p4 = {
        x: p3.x + Math.cos(a4) * L4,
        y: p3.y + Math.sin(a4) * L4
      };

      // Draw Arm Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(baseX + (p4.x - baseX) * 0.4, baseY + 20, 80, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      // Helper function to draw industrial robotic link
      const drawRoboticLink = (start: { x: number; y: number }, end: { x: number; y: number }, width: number, color: string) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        // High-tech internal core highlight
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.restore();
      };

      // Link 1: Base Turret
      drawRoboticLink(p0, p1, 28, '#1e293b');

      // Joint 1 Pivot Ring
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Link 2: Lower Arm (Carbon/Titanium chassis)
      drawRoboticLink(p1, p2, 22, '#334155');

      // Joint 2 Pivot Motor Hub
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(p2.x, p2.y, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(p2.x, p2.y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Link 3: Forearm
      drawRoboticLink(p2, p3, 16, '#334155');

      // Joint 3 Pivot Hub
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(p3.x, p3.y, 11, 0, Math.PI * 2);
      ctx.fill();

      // Link 4: Wrist
      drawRoboticLink(p3, p4, 12, '#64748b');

      // Tool Mount Flange (Tool Center Point - TCP)
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(p4.x, p4.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // END EFFECTOR RENDERING ACCORDING TO ACTIVE TOOL
      ctx.save();
      ctx.translate(p4.x, p4.y);
      ctx.rotate(a4);

      if (activeTool === 'TOOL_GRIPPER') {
        // Dual-finger precision gripper
        const gripGap = isExecuting ? 8 + Math.sin(time * 4) * 6 : 14;
        ctx.fillStyle = '#0ea5e9';
        ctx.fillRect(0, -10, 12, 20); // Gripper body

        // Left finger
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(12, -gripGap - 4, 18, 5);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(28, -gripGap - 4, 4, 8); // Tactile tip

        // Right finger
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(12, gripGap, 18, 5);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(28, gripGap - 4, 4, 8); // Tactile tip

        // Grip sensor force wave
        if (isExecuting) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(26, 0, 12, -Math.PI / 3, Math.PI / 3);
          ctx.stroke();
        }
      } else if (activeTool === 'TOOL_WELDER') {
        // Laser Arc Torch
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(0, -6, 20, 12);
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(20, -5);
        ctx.lineTo(35, 0);
        ctx.lineTo(20, 5);
        ctx.fill();

        // Laser beam & welding sparks
        if (isExecuting) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(35, 0);
          ctx.lineTo(85, 0);
          ctx.stroke();

          // Plasma glow & sparks
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(85, 0, 8 + Math.random() * 4, 0, Math.PI * 2);
          ctx.fill();

          for (let s = 0; s < 5; s++) {
            ctx.fillStyle = '#f97316';
            ctx.fillRect(85 + (Math.random() - 0.5) * 25, (Math.random() - 0.5) * 25, 2, 2);
          }
        }
      } else if (activeTool === 'TOOL_VISION_INSPECTOR') {
        // 3D Scanner & Photonic Lens
        ctx.fillStyle = '#10b981';
        ctx.fillRect(0, -12, 16, 24);
        ctx.fillStyle = '#047857';
        ctx.beginPath();
        ctx.arc(16, 0, 7, -Math.PI / 2, Math.PI / 2);
        ctx.fill();

        // Light Scanning Cone
        if (isExecuting) {
          const grad = ctx.createRadialGradient(16, 0, 5, 80, 0, 90);
          grad.addColorStop(0, 'rgba(16, 185, 129, 0.8)');
          grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(16, 0);
          ctx.lineTo(100, -45);
          ctx.lineTo(100, 45);
          ctx.closePath();
          ctx.fill();

          // Laser scan line
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 2;
          ctx.beginPath();
          const scanOffset = Math.sin(time * 5) * 35;
          ctx.moveTo(80, -35 + scanOffset);
          ctx.lineTo(80, 35 + scanOffset);
          ctx.stroke();
        }
      } else if (activeTool === 'TOOL_FASTENER') {
        // Electric Torque Screwdriver
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(0, -7, 18, 14);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(18, -3, 16, 6);

        if (isExecuting) {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(36, 0, 8, time * 6, time * 6 + Math.PI);
          ctx.stroke();
        }
      } else if (activeTool === 'TOOL_SUCTION_CRANE') {
        // Heavy Vacuum Pad
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(0, -16, 12, 32);
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(12, -18, 6, 36);

        // Suction cups
        ctx.fillStyle = '#818cf8';
        ctx.beginPath();
        ctx.arc(20, -10, 5, 0, Math.PI * 2);
        ctx.arc(20, 10, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // On-Canvas Telemetry Overlay Bar
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(16, 16, 260, 75, 6);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('GEMINI ROBOTICS ER-2 // TCP POSE', 26, 34);

      ctx.font = '10px monospace';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(`X: ${p4.x.toFixed(1)} mm  |  Y: ${(baseY - p4.y).toFixed(1)} mm`, 26, 52);
      ctx.fillText(`J1: ${joints[0]?.angle || 0}° | J2: ${joints[1]?.angle || 0}° | J3: ${joints[2]?.angle || 0}°`, 26, 68);
      ctx.fillText(`FERRAMENTA ATIVA: ${activeTool.replace('TOOL_', '')}`, 26, 82);

      // Loop animation
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [joints, activeTool, isExecuting, emergencyStop, playbackSpeed]);

  return (
    <div id="robot-canvas-container" className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Top Banner / HUD Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${emergencyStop ? 'bg-red-500 animate-ping' : isExecuting ? 'bg-emerald-400 animate-pulse' : 'bg-sky-400'}`} />
          <span className="font-semibold text-slate-200 tracking-wider">
            CINEMÁTICA 6-DOF // {activeStepName || (isExecuting ? 'EXECUTANDO SEQUÊNCIA' : 'AGUARDANDO COMANDO')}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Playback speed selector */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400 text-[11px]">Velocidade:</span>
            {[1, 2, 4].map((spd) => (
              <button
                key={spd}
                id={`speed-btn-${spd}x`}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${playbackSpeed === spd ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* E-Stop Button */}
          <button
            id="estop-toggle-btn"
            onClick={onToggleEstop}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold text-xs transition-all uppercase tracking-wider ${
              emergencyStop
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/50 animate-pulse'
                : 'bg-slate-800 hover:bg-red-950/60 text-red-400 border border-red-900/50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {emergencyStop ? 'E-STOP ATIVADO (CLIQUE P/ LIBERAR)' : 'E-STOP'}
          </button>
        </div>
      </div>

      {/* Interactive Simulation Canvas */}
      <canvas
        ref={canvasRef}
        width={780}
        height={420}
        className="w-full h-[360px] md:h-[420px] block cursor-crosshair bg-slate-950"
      />

      {/* Live Tooltip / Status Footer */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-slate-700/60 rounded-lg px-3 py-1.5 text-[11px] text-slate-300 font-mono">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Envelope Seguro Ativo // ISO 10218-1</span>
      </div>
    </div>
  );
};
