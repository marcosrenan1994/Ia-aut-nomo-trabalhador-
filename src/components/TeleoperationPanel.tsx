import React from 'react';
import { JointState, ToolId } from '../types';
import { Sliders, RotateCcw, AlertTriangle, Play, Sparkles, Thermometer, Shield } from 'lucide-react';

interface TeleoperationPanelProps {
  joints: JointState[];
  onJointChange: (jointId: number, newAngle: number) => void;
  onResetJoints: () => void;
  activeTool: ToolId;
  onTestToolTrigger: () => void;
  isTestingTool: boolean;
  emergencyStop: boolean;
}

export const TeleoperationPanel: React.FC<TeleoperationPanelProps> = ({
  joints,
  onJointChange,
  onResetJoints,
  activeTool,
  onTestToolTrigger,
  isTestingTool,
  emergencyStop
}) => {
  return (
    <div id="teleoperation-jog-module" className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-400" />
          <h2 className="text-base font-bold text-white">
            Teleoperação Manual & Ajuste Cinemático das 6 Juntas
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="reset-joints-btn"
            onClick={onResetJoints}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Posição Home
          </button>
        </div>
      </div>

      {/* Joint Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {joints.map((joint) => (
          <div
            key={joint.id}
            id={`joint-control-${joint.id}`}
            className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs"
          >
            <div className="flex items-center justify-between mb-1.5 font-mono">
              <span className="font-bold text-slate-300">
                J{joint.id}: {joint.name}
              </span>
              <span className="text-sky-400 font-bold">{joint.angle}°</span>
            </div>

            <input
              type="range"
              min={joint.minAngle}
              max={joint.maxAngle}
              value={joint.angle}
              disabled={emergencyStop}
              onChange={(e) => onJointChange(joint.id, parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500 disabled:opacity-40"
            />

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>{joint.minAngle}°</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Thermometer className="w-2.5 h-2.5 text-amber-500" />
                {joint.temperature}°C
              </span>
              <span>{joint.maxAngle}°</span>
            </div>
          </div>
        ))}
      </div>

      {/* Manual End-Effector Testing Trigger */}
      <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-slate-200 block font-mono">
            TESTE DE ACIONAMENTO DA FERRAMENTA [{activeTool.replace('TOOL_', '')}]
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Dispara pulso de validação de torque, foco óptico ou arco de teste no efetuador ativo
          </p>
        </div>

        <button
          id="manual-tool-test-btn"
          onClick={onTestToolTrigger}
          disabled={emergencyStop || isTestingTool}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white shadow-md transition-all"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isTestingTool ? 'animate-spin' : ''}`} />
          {isTestingTool ? 'Disparando Pulso de Teste...' : 'Disparar Teste de Ferramenta'}
        </button>
      </div>
    </div>
  );
};
