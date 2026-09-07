import React from 'react';
import { ToolDefinition, ToolId } from '../types';
import { 
  Flame, 
  Eye, 
  Wrench, 
  Boxes, 
  Hand, 
  CheckCircle2, 
  AlertCircle, 
  RotateCw, 
  Thermometer, 
  Activity, 
  Zap 
} from 'lucide-react';

interface ToolkitManagerProps {
  tools: ToolDefinition[];
  activeToolId: ToolId;
  onSelectTool: (id: ToolId) => void;
  onCalibrateTool: (id: ToolId) => void;
}

export const ToolkitManager: React.FC<ToolkitManagerProps> = ({
  tools,
  activeToolId,
  onSelectTool,
  onCalibrateTool
}) => {
  const getIcon = (id: ToolId) => {
    switch (id) {
      case 'TOOL_GRIPPER':
        return <Hand className="w-5 h-5 text-sky-400" />;
      case 'TOOL_WELDER':
        return <Flame className="w-5 h-5 text-red-400" />;
      case 'TOOL_VISION_INSPECTOR':
        return <Eye className="w-5 h-5 text-emerald-400" />;
      case 'TOOL_FASTENER':
        return <Wrench className="w-5 h-5 text-amber-400" />;
      case 'TOOL_SUCTION_CRANE':
        return <Boxes className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div id="toolkit-manager-module" className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-sky-400" />
            Kit de Ferramentas & Atuadores (End-Effectors)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Troca rápida automática, calibração dinâmica e monitoramento de desgaste de ferramental
          </p>
        </div>
        <span className="text-xs font-mono bg-sky-500/10 text-sky-400 px-2.5 py-1 rounded border border-sky-500/20">
          5 / 5 Acopladores Prontos
        </span>
      </div>

      {/* Toolkit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {tools.map((tool) => {
          const isActive = tool.id === activeToolId;
          return (
            <div
              key={tool.id}
              id={`tool-card-${tool.id}`}
              onClick={() => onSelectTool(tool.id)}
              className={`relative p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-800/90 border-sky-500 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/40'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-sky-500/20 border border-sky-500/30' : 'bg-slate-800'}`}>
                      {getIcon(tool.id)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-200 leading-tight">{tool.name}</h3>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">{tool.category}</span>
                    </div>
                  </div>
                  {isActive && (
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold shrink-0">
                      ACOPLADO
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2 mb-3">
                  {tool.description}
                </p>
              </div>

              {/* Metrics */}
              <div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-900/90 p-2 rounded border border-slate-800/80 mb-3">
                  <div>
                    <span className="text-slate-500 block">Precisão:</span>
                    <span className="text-sky-300 font-semibold">±{tool.precisionMm} mm</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Horas de Operação:</span>
                    <span className="text-slate-300">{tool.operatingHours.toFixed(1)} h</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Temperatura:</span>
                    <span className="text-amber-400 font-semibold">{tool.tempCelsius.toFixed(1)} °C</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Desgaste:</span>
                    <span className={`${tool.wearPercentage > 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {tool.wearPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    id={`equip-btn-${tool.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTool(tool.id);
                    }}
                    className={`flex-1 py-1.5 px-2 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                      isActive
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ferramenta Ativa
                      </>
                    ) : (
                      'Acoplar no TCP'
                    )}
                  </button>

                  <button
                    id={`calibrate-btn-${tool.id}`}
                    title="Executar calibração zero e auto-diagnóstico"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCalibrateTool(tool.id);
                    }}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-sky-400 border border-slate-700 transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
