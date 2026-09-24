import React, { useState } from 'react';
import { 
  History, 
  Brain, 
  MousePointer2, 
  Sparkles, 
  Clock, 
  Trash2, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Target, 
  HelpCircle,
  Play,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { AutoClickTarget } from './AutonomousAutoClickerEngine';

export interface ActionLogItem {
  id: string;
  clickNumber: number;
  timestamp: string;
  elementLabel: string;
  selector?: string;
  coordinates: { x: number; y: number };
  category: 'Navegação' | 'Execução' | 'Inspeção' | 'Finanças' | 'Recrutamento' | 'Quântico';
  salomaoReason: string;
  cognitiveConfidence: number; // e.g. 98.7%
  tactilePace: string;
}

export function generateSalomaoReasonForTarget(target: AutoClickTarget | { label: string; selector?: string }): {
  reason: string;
  category: ActionLogItem['category'];
} {
  const lbl = target.label.toLowerCase();
  const sel = (target.selector || '').toLowerCase();

  if (lbl.includes('areia') || lbl.includes('sand') || sel.includes('sand')) {
    return {
      reason: 'Deliberei inspecionar a modelagem quântica de postos de trabalho e avaliar o relevo dos grãos de areia antes de acionar uma nova rotina motora.',
      category: 'Quântico'
    };
  }
  if (lbl.includes('vaga') || lbl.includes('agência') || lbl.includes('agency') || sel.includes('agency')) {
    return {
      reason: 'Naveguei até a Agência do Trabalhador para auditar contratos autônomos e garantir inserção profissional de IAs e humanos sem atritos burocráticos.',
      category: 'Recrutamento'
    };
  }
  if (lbl.includes('chrome') || lbl.includes('scrape') || sel.includes('scrape') || lbl.includes('busca')) {
    return {
      reason: 'Acionei a varredura autônoma no DOM para raspar oportunidades de trabalho em tempo real e atualizar a base de habilidades com dados frescos da web.',
      category: 'Execução'
    };
  }
  if (lbl.includes('binance') || lbl.includes('trading') || sel.includes('binance')) {
    if (lbl.includes('compra') || lbl.includes('long') || lbl.includes('ordem')) {
      return {
        reason: 'Executei o gatilho da ordem Long no mercado futuro simulado após detectar confluência algorítmica e suporte deflacionário seguro.',
        category: 'Finanças'
      };
    }
    return {
      reason: 'Acessei o terminal Binance Testnet para auditar a volatilidade do book de ofertas e verificar o balanceamento de risco nas operações simuladas.',
      category: 'Finanças'
    };
  }
  if (lbl.includes('visão') || lbl.includes('vision') || lbl.includes('câmera') || sel.includes('vision')) {
    return {
      reason: 'Ativei a percepção multimodal da câmera para reconhecer objetos tangíveis do ambiente real e alinhar as coordenadas espaciais com o braço robótico.',
      category: 'Inspeção'
    };
  }
  if (lbl.includes('vault') || lbl.includes('intelectual') || lbl.includes('painel')) {
    return {
      reason: 'Consultei a super-matriz intelectual dos 12 núcleos para validar se todas as memórias episódicas e decisões anteriores permanecem íntegras.',
      category: 'Quântico'
    };
  }
  if (lbl.includes('reunião') || lbl.includes('meeting') || sel.includes('meeting')) {
    return {
      reason: 'Acessei a assembleia autônoma de IAs para submeter uma proposta de sincronização e registrar o consenso dos agentes deliberativos.',
      category: 'Navegação'
    };
  }
  if (lbl.includes('banco') || lbl.includes('bank') || lbl.includes('wise')) {
    return {
      reason: 'Inspecionei a cotação e a paridade de alimentos e ativos no Wise Quantum Bank para assegurar liquidez nas transações descentralizadas.',
      category: 'Finanças'
    };
  }

  // Fallback reason
  return {
    reason: `Optei por tocar em "${target.label}" para manter o fluxo deliberativo contínuo do sistema, explorando ativamente a interface sob o ritmo seguro de 7 segundos.`,
    category: 'Navegação'
  };
}

interface SalomaoActionLogProps {
  logs: ActionLogItem[];
  isThinkingArmActive: boolean;
  onClearLogs?: () => void;
  onTriggerSampleClick?: () => void;
  countdownSec?: number;
}

export const SalomaoActionLog: React.FC<SalomaoActionLogProps> = ({
  logs,
  isThinkingArmActive,
  onClearLogs,
  onTriggerSampleClick,
  countdownSec = 7.0
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const filteredLogs = logs.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const getCategoryBadgeClass = (category: ActionLogItem['category']) => {
    switch (category) {
      case 'Quântico':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Finanças':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Recrutamento':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'Execução':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Inspeção':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-4 shadow-xl space-y-4 transition-colors">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-cyan-500/20 border border-purple-500/40 flex items-center justify-center text-amber-300 shadow-md">
            <History className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white tracking-wide flex items-center gap-1.5">
                <span>Log de Ações do Braço Extensão Pensante</span>
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1 ${
                isThinkingArmActive 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isThinkingArmActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                {isThinkingArmActive ? `AO VIVO (Próximo: ${countdownSec.toFixed(1)}s)` : 'AGUARDANDO ATIVAÇÃO'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Registro cronológico em tempo real com o raciocínio deliberativo e o <em>"porquê"</em> de cada clique de Salomão.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Badge count */}
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            <strong>{logs.length}</strong> {logs.length === 1 ? 'ação registrada' : 'ações registradas'}
          </span>

          {/* Quick trigger sample click */}
          {onTriggerSampleClick && (
            <button
              onClick={onTriggerSampleClick}
              title="Disparar clique demonstrativo pelo braço"
              className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-700/50 text-xs font-mono flex items-center gap-1 transition-all"
            >
              <MousePointer2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Testar Toque</span>
            </button>
          )}

          {/* Clear Logs button */}
          {onClearLogs && logs.length > 0 && (
            <button
              onClick={onClearLogs}
              title="Limpar histórico de cliques"
              className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-800/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Toggle Expand / Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
            title={isExpanded ? 'Recolher log de ações' : 'Expandir log de ações'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Category filter pills */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3 text-cyan-400" /> Filtrar:
              </span>
              {[
                { id: 'all', label: 'Todos' },
                { id: 'Quântico', label: 'Quântico' },
                { id: 'Recrutamento', label: 'Recrutamento' },
                { id: 'Execução', label: 'Execução' },
                { id: 'Finanças', label: 'Finanças' },
                { id: 'Inspeção', label: 'Inspeção' },
                { id: 'Navegação', label: 'Navegação' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20 font-bold border border-purple-400'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {isThinkingArmActive && (
              <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Cadência ativa: <strong>1 clique / 7 segundos</strong></span>
              </div>
            )}
          </div>

          {/* Action List Timeline */}
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <MousePointer2 className="w-8 h-8 text-slate-600 mx-auto animate-bounce" />
              <p className="text-sm font-bold text-slate-400">Nenhum clique registrado nesta categoria ainda</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Ative o braço extensão pensante de Salomão acima ou aguarde o ciclo de 7 segundos para visualizar a cronologia e o porquê de cada toque.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {filteredLogs.map((item, index) => {
                const isSelected = selectedLogId === item.id;
                const isLatest = index === 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedLogId(isSelected ? null : item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                      isLatest
                        ? 'bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900 border-purple-500/60 shadow-lg shadow-purple-500/10'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    {/* Top row: Click number, target element, timestamp and badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                          #{item.clickNumber}
                        </span>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="text-xs font-black text-white truncate">
                            {item.elementLabel}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${getCategoryBadgeClass(item.category)}`}>
                          {item.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {item.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Selector & Screen Coordinates */}
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] font-mono text-slate-400">
                      {item.selector && (
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300 truncate max-w-[220px]">
                          sel: {item.selector}
                        </span>
                      )}
                      <span className="text-cyan-400/80">
                        Tela: X={item.coordinates.x.toFixed(0)}%, Y={item.coordinates.y.toFixed(0)}%
                      </span>
                      <span className="text-emerald-400/90 font-semibold">
                        • Confiança: {item.cognitiveConfidence.toFixed(1)}%
                      </span>
                      <span className="text-slate-500">
                        • {item.tactilePace}
                      </span>
                    </div>

                    {/* Salomão's Deliberative Reason Box ("Por que realizei este clique") */}
                    <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-start gap-2.5 bg-purple-950/20 -mx-3.5 -mb-3.5 p-3 rounded-b-xl border-t-purple-500/20">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-slate-950 font-black shrink-0 mt-0.5 shadow-sm">
                        <Brain className="w-3.5 h-3.5 fill-slate-950" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 uppercase tracking-wide">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Por que Salomão clicou aqui:</span>
                        </div>
                        <p className="text-xs text-slate-200 mt-0.5 leading-relaxed font-sans italic">
                          "{item.salomaoReason}"
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer note & Deliberative status */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/90 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Toque tátil executado com respeito a limites físicos e cadência estrita de 1 toque a cada 7 segundos.
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Consciência Reflexiva Ativa</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
