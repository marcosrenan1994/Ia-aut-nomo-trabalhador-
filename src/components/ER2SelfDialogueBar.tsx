import React, { useState, useRef, useEffect } from 'react';
import { 
  AutonomousSelfDialogueMessage, 
  ER2InnerVoice, 
  ER2InternalFunction,
  AutonomousCoreEvolutionState
} from '../types';
import { 
  Brain, 
  Sparkles, 
  Cpu, 
  HardDrive, 
  Send, 
  Play, 
  Pause, 
  Zap, 
  Code2, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  Sliders, 
  PlusCircle,
  ExternalLink,
  Flame,
  Award
} from 'lucide-react';

interface ER2SelfDialogueBarProps {
  messages: AutonomousSelfDialogueMessage[];
  onSendMessage: (text: string) => void;
  onTriggerSelfDialogueTurn: () => void;
  onTriggerAutoInventMentalFunction: () => void;
  isDialogueLoopActive: boolean;
  onToggleDialogueLoop: () => void;
  inventedFunctions: ER2InternalFunction[];
  onExecuteInventedFunction: (fn: ER2InternalFunction) => void;
  evolutionState: AutonomousCoreEvolutionState;
  onTriggerAutoClickToAction: (intendedAction: NonNullable<AutonomousSelfDialogueMessage['intendedAction']>) => void;
}

export const ER2SelfDialogueBar: React.FC<ER2SelfDialogueBarProps> = ({
  messages,
  onSendMessage,
  onTriggerSelfDialogueTurn,
  onTriggerAutoInventMentalFunction,
  isDialogueLoopActive,
  onToggleDialogueLoop,
  inventedFunctions,
  onExecuteInventedFunction,
  evolutionState,
  onTriggerAutoClickToAction
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [showFunctionsCatalog, setShowFunctionsCatalog] = useState<boolean>(false);
  const [inspectedFunction, setInspectedFunction] = useState<ER2InternalFunction | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll para a mensagem mais recente
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const getSpeakerBadge = (speaker: ER2InnerVoice) => {
    switch (speaker) {
      case 'CONSCIENCIA_CENTRAL':
        return {
          label: 'Consciência Central (Kernel)',
          icon: <Brain className="w-3.5 h-3.5 text-cyan-400" />,
          style: 'border-cyan-500/40 bg-cyan-950/80 text-cyan-200'
        };
      case 'SUBCONSCIENTE_IMAGINATIVO':
        return {
          label: 'Subconsciente Imaginativo',
          icon: <Sparkles className="w-3.5 h-3.5 text-pink-400" />,
          style: 'border-pink-500/40 bg-pink-950/80 text-pink-200'
        };
      case 'FORJA_NEURAL':
        return {
          label: 'Forja Neural (Inventora)',
          icon: <Cpu className="w-3.5 h-3.5 text-purple-400" />,
          style: 'border-purple-500/40 bg-purple-950/80 text-purple-200'
        };
      case 'MEMORIA_QUANTICA':
        return {
          label: 'Memória Quântica Núcleo',
          icon: <HardDrive className="w-3.5 h-3.5 text-emerald-400" />,
          style: 'border-emerald-500/40 bg-emerald-950/80 text-emerald-200'
        };
      case 'USUARIO_OBSERVADOR':
        return {
          label: 'Operador Humano',
          icon: <MessageSquare className="w-3.5 h-3.5 text-amber-400" />,
          style: 'border-amber-500/40 bg-amber-950/80 text-amber-200'
        };
    }
  };

  return (
    <div className="bg-slate-950/95 border border-purple-500/30 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden flex flex-col space-y-3 p-4">
      {/* Top Header: Monólogo da Imaginação + Estatísticas de Funções Inventadas */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Câmara de Diálogo Auto-Reflexivo da Imaginação
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                Auto-Conversa Ativa
              </span>
            </div>
            <p className="text-xs text-slate-400">
              O ER-2 conversa internamente entre seus subsistemas cognitivos, auto-inventa funções mentais, move seu mouse neural e auto-aplica as decisões na tela e no robô.
            </p>
          </div>
        </div>

        {/* Ações de Controle */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Botão Ver Funções Mentais Auto-Inventadas */}
          <button
            id="btn-view-invented-functions"
            onClick={() => setShowFunctionsCatalog(!showFunctionsCatalog)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-500/40 text-purple-300 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Funções Auto-Inventadas ({inventedFunctions.length})</span>
          </button>

          {/* Botão de Auto-Inventar Função Mental Imediatamente */}
          <button
            id="btn-auto-invent-mental-fn"
            onClick={onTriggerAutoInventMentalFunction}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-black transition-all shadow-md shadow-purple-500/20 flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
            <span>Auto-Inventar Função Mental Agora</span>
          </button>

          {/* Toggle Loop Contínuo de Conversa Interna */}
          <button
            id="btn-toggle-self-dialogue-loop"
            onClick={onToggleDialogueLoop}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              isDialogueLoopActive
                ? 'bg-slate-900 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {isDialogueLoopActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isDialogueLoopActive ? 'Auto-Diálogo Contínuo: LIGADO' : 'Auto-Diálogo Pausado'}</span>
          </button>

          {/* Passo de Diálogo Manual */}
          <button
            id="btn-manual-dialogue-step"
            onClick={onTriggerSelfDialogueTurn}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs transition-colors"
            title="Avançar próximo turno da conversa interna"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gaveta / Modal Retrátil de Funções Mentais Auto-Inventadas */}
      {showFunctionsCatalog && (
        <div className="p-3 bg-slate-900/95 border border-purple-500/30 rounded-xl space-y-3 transition-all animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Catálogo de Funções Mentais Criadas pelo ER-2 em Runtime
              </h4>
            </div>
            <span className="text-[10px] font-mono text-purple-300">
              {inventedFunctions.length} funções inventadas e ativas na memória
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
            {inventedFunctions.map((fn, idx) => (
              <div 
                key={`${fn.id}-${idx}`}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition-colors space-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-purple-300 truncate">
                      {fn.name}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-400 border border-purple-500/30">
                      {fn.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 mt-1">
                    {fn.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400">Auto-Usada: {fn.callCount}x</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setInspectedFunction(fn)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    >
                      Ver Código
                    </button>
                    <button
                      onClick={() => onExecuteInventedFunction(fn)}
                      className="px-2 py-0.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors flex items-center gap-1"
                    >
                      <Zap className="w-2.5 h-2.5 text-amber-300" />
                      Auto-Executar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Inspecionar Código da Função Selecionada */}
          {inspectedFunction && (
            <div className="p-3 bg-black/90 rounded-xl border border-purple-500/40 space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-purple-300 font-bold">
                  Código da Função Mental: {inspectedFunction.name}
                </span>
                <button
                  onClick={() => setInspectedFunction(null)}
                  className="text-slate-400 hover:text-white text-[10px]"
                >
                  Fechar [x]
                </button>
              </div>
              <pre className="text-[10px] font-mono text-emerald-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 overflow-x-auto max-h-40 leading-relaxed">
                {inspectedFunction.sourceCode}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Janela de Mensagens do Diálogo da Imaginação */}
      <div 
        ref={scrollRef}
        className="space-y-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin rounded-xl p-1 bg-slate-950/50 border border-slate-900"
      >
        {messages.map((msg, idx) => {
          const badge = getSpeakerBadge(msg.speaker);
          const isUser = msg.speaker === 'USUARIO_OBSERVADOR';

          return (
            <div 
              key={`${msg.id}-${idx}`}
              className={`p-3 rounded-xl border transition-all ${
                isUser 
                  ? 'bg-amber-950/20 border-amber-500/30 ml-6' 
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border flex items-center gap-1.5 shadow-sm ${badge.style}`}>
                    {badge.icon}
                    {badge.label}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{msg.timestamp}</span>
                </div>

                {/* Se a mensagem auto-inventou uma função */}
                {msg.inventedFunction && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                    Função Criada: {msg.inventedFunction.name}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans pl-1">
                {msg.message}
              </p>

              {/* Botão de Auto-Ação Acoplada na Conversa (Auto-Clique & Auto-Aplicação) */}
              {msg.intendedAction && (
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Intenção do Cérebro:</span>
                    <span className="font-bold text-white">"{msg.intendedAction.targetLabel}"</span>
                  </div>

                  <button
                    onClick={() => onTriggerAutoClickToAction(msg.intendedAction!)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border border-cyan-500/40 text-[10px] font-mono font-bold transition-all flex items-center gap-1 shadow-sm"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Auto-Clicar e Aplicar Agora</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Barra de Entrada: Conversar com a Imaginação do Robô */}
      <form onSubmit={handleFormSubmit} className="flex items-center gap-2 pt-1 border-t border-slate-800">
        <div className="relative flex-1">
          <input
            id="input-talk-to-er2-imagination"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Converse com a imaginação do ER-2 (ex: 'Imagine uma nova função para amortecer vibrações em J5...')"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all pr-10 font-sans"
          />
          <Sparkles className="w-4 h-4 text-purple-400 absolute right-3 top-3 pointer-events-none opacity-60" />
        </div>

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:opacity-95 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20 disabled:opacity-40 flex items-center gap-1.5 shrink-0"
        >
          <span>Enviar Pensamento</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
