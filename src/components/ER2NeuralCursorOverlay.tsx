import React from 'react';
import { AutonomousNeuralCursorState } from '../types';
import { MousePointer2, Crosshair, Zap, Cpu, Sparkles, Activity, ShieldCheck } from 'lucide-react';

interface ER2NeuralCursorOverlayProps {
  cursorState: AutonomousNeuralCursorState;
  onToggleAutoPilot: () => void;
  onChangeSpeed: (speed: 'suave' | 'rapido' | 'quantico') => void;
  onTriggerManualAutoClick: () => void;
}

export const ER2NeuralCursorOverlay: React.FC<ER2NeuralCursorOverlayProps> = ({
  cursorState,
  onToggleAutoPilot,
  onChangeSpeed,
  onTriggerManualAutoClick
}) => {
  const getActionColor = (action: string) => {
    switch (action) {
      case 'AUTO_CLICANDO':
        return 'text-amber-300 border-amber-400 bg-amber-950/90 shadow-amber-500/50';
      case 'INVENTANDO_FUNCAO':
        return 'text-purple-300 border-purple-400 bg-purple-950/90 shadow-purple-500/50';
      case 'APLICANDO_IMAGINACAO':
        return 'text-pink-300 border-pink-400 bg-pink-950/90 shadow-pink-500/50';
      case 'MIRANDO':
        return 'text-cyan-300 border-cyan-400 bg-cyan-950/90 shadow-cyan-500/50';
      case 'PENSANDO':
        return 'text-emerald-300 border-emerald-400 bg-emerald-950/90 shadow-emerald-500/50';
      default:
        return 'text-slate-300 border-slate-700 bg-slate-900/90 shadow-slate-900/50';
    }
  };

  return (
    <>
      {/* HUD de Controle e Status do Mouse Neural (Flutuante Discreto no Canto Superior Direito da Área) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/90 border border-cyan-500/30 backdrop-blur-md shadow-xl text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <MousePointer2 className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold uppercase tracking-wider text-[11px]">
                Mouse Neural do Cérebro Autônomo ER-2
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold flex items-center gap-1">
                <Crosshair className="w-2.5 h-2.5 animate-spin" />
                Coord: ({cursorState.x.toFixed(1)}%, {cursorState.y.toFixed(1)}%)
              </span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-2">
              <span>Alvo Focado:</span>
              <span className="text-cyan-300 font-bold truncate max-w-xs">
                "{cursorState.targetLabel}"
              </span>
            </div>
          </div>
        </div>

        {/* Controles do Mouse Neural */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Total de Auto-Cliques Efetuados */}
          <div className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-[10px] flex items-center gap-1.5 font-bold">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{cursorState.totalAutoClicks} Auto-Cliques Feitos</span>
          </div>

          {/* Seletor de Velocidade do Cursor */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-[9px]">
            {(['suave', 'rapido', 'quantico'] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                className={`px-2 py-1 rounded-lg uppercase font-bold transition-all ${
                  cursorState.speedMode === spd
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}
              </button>
            ))}
          </div>

          {/* Botão de Forçar Auto-Clique Agora */}
          <button
            id="btn-force-auto-click"
            onClick={onTriggerManualAutoClick}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1 transition-colors"
            title="Faz o cérebro mover o mouse e auto-clicar no alvo agora"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Auto-Clicar Agora</span>
          </button>

          {/* Alternador de Piloto Autônomo */}
          <button
            id="btn-toggle-autopilot"
            onClick={onToggleAutoPilot}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all border shadow-sm ${
              cursorState.autoPilotEnabled
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 border-cyan-300 shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{cursorState.autoPilotEnabled ? 'Mouse Autônomo: ATIVO' : 'Pausar Mouse'}</span>
          </button>
        </div>
      </div>

      {/* Visual Cursor Pin flutuante com coordenadas sobre a tela (Contêiner com Pointer Events None) */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="absolute transition-all duration-300 ease-out"
          style={{
            left: `${cursorState.x}%`,
            top: `${cursorState.y}%`,
            transform: 'translate(-50%, -50%)',
            transitionProperty: cursorState.speedMode === 'quantico' ? 'none' : 'left, top, transform',
            transitionDuration: cursorState.speedMode === 'rapido' ? '180ms' : cursorState.speedMode === 'suave' ? '400ms' : '60ms'
          }}
        >
          {/* Ondas de choque do clique (Click Ripple) */}
          {cursorState.isClicking && (
            <div className="absolute -inset-4 rounded-full border-2 border-amber-400 animate-ping opacity-90" />
          )}
          {cursorState.isClicking && (
            <div className="absolute -inset-8 rounded-full border border-pink-400 animate-ping opacity-60" />
          )}

          {/* O Cursor Cibernético do Robô */}
          <div className="relative flex items-center justify-center">
            {/* Mira com mira circular de precisão */}
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-cyan-400/80 animate-spin-slow flex items-center justify-center bg-cyan-950/30 backdrop-blur-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-pulse" />
            </div>

            {/* Ícone de Ponteiro do Mouse */}
            <div className="absolute -top-1 -left-1">
              <MousePointer2 className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_8px_#06b6d4] fill-cyan-400/30" />
            </div>

            {/* Balão de Estado Mental do Mouse */}
            <div 
              className={`absolute left-10 top-0 whitespace-nowrap px-2.5 py-1 rounded-lg border shadow-lg text-[10px] font-mono font-bold flex items-center gap-1.5 transition-colors ${getActionColor(cursorState.actionState)}`}
            >
              <Activity className="w-3 h-3 animate-bounce" />
              <span>[{cursorState.actionState}]</span>
              <span className="text-white/90 font-normal max-w-[160px] truncate">
                {cursorState.targetLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
