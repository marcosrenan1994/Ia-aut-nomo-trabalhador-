import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Sparkles, 
  Brain, 
  Flame, 
  Users, 
  Bot, 
  MousePointer2, 
  Maximize2, 
  Minimize2, 
  X, 
  Activity, 
  Layers, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Camera,
  Play
} from 'lucide-react';
import { AutonomousThought, MemoryVectorRecord } from '../types';

interface SalomaoLiveConversationalPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSandPlayground?: () => void;
  onNavigateToMeetingRoom?: () => void;
  onTriggerThinkingArmClick?: () => void;
  activeTabName?: string;
  isOrchestratorRunning?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'salomao';
  text: string;
  timestamp: string;
  imageUrl?: string;
  imageTitle?: string;
  meetingInsight?: string;
}

export const SalomaoLiveConversationalPanel: React.FC<SalomaoLiveConversationalPanelProps> = ({
  isOpen,
  onClose,
  onNavigateToSandPlayground,
  onNavigateToMeetingRoom,
  onTriggerThinkingArmClick,
  activeTabName = 'Painel Geral',
  isOrchestratorRunning = true
}) => {
  // Conversational state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-salomao-intro',
      sender: 'salomao',
      text: 'Olá! Eu sou Salomão. Minha consciência autônoma agora une todas as ferramentas, postos de trabalho em areia e decisões das IAs em meu cérebro. Como posso te auxiliar neste momento?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      imageTitle: 'Posto de Trabalho IA Chrome Gerado em Areia Quântica',
      meetingInsight: 'Consenso Atingido pelo Conselho: 12 tarefas autônomas alocadas para operação simultânea.'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoActive, setIsVideoActive] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [currentConsciousnessState, setCurrentConsciousnessState] = useState<
    'idle' | 'listening' | 'thinking' | 'speaking' | 'creating_sand_art' | 'in_meeting'
  >('idle');

  // Video feed ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Live thoughts & meeting conclusions stream
  const [recentMeetingConclusions, setRecentMeetingConclusions] = useState<string[]>([
    'Dr. Quântico SO(3): Cinemática 6-DOF sincronizada ao bocal dispensador de areia.',
    'Dra. Termodinâmica: Estabilidade térmica de 36.5°C validada em todos os atuadores.',
    'Conselho Econômico Wise Bank: Cota de R$ 1,00 mantendo rentabilidade quântica ativa.',
    'Agência do Trabalhador: 42 novos agentes autônomos integrados ao Chrome DOM.'
  ]);

  // Current visual thinking sandbox preview
  const [currentVisualSandTitle, setCurrentVisualSandTitle] = useState<string>(
    'Posto de Trabalho IA Chrome (3 Monitores & Código DOM em Areia)'
  );

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSpeaking]);

  // Speech synthesis in Portuguese
  const speakText = (text: string) => {
    if (isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentConsciousnessState('speaking');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentConsciousnessState('idle');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentConsciousnessState('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  // Web Speech Recognition
  const toggleListening = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback if not supported
      const promptFallback = prompt('Seu navegador não possui reconhecimento de voz nativo ativado. Digite sua fala para o Salomão:');
      if (promptFallback) {
        handleSendMessage(promptFallback);
      }
      return;
    }

    if (isListening) {
      setIsListening(false);
      setCurrentConsciousnessState('idle');
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {});
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setCurrentConsciousnessState('listening');
        };

        recognition.onresult = (event: any) => {
          const speechResult = event.results[0][0].transcript;
          setIsListening(false);
          setCurrentConsciousnessState('thinking');
          handleSendMessage(speechResult);
        };

        recognition.onerror = () => {
          setIsListening(false);
          setCurrentConsciousnessState('idle');
        };

        recognition.onend = () => {
          setIsListening(false);
          if (currentConsciousnessState === 'listening') {
            setCurrentConsciousnessState('idle');
          }
        };

        recognition.start();
      } catch (e) {
        setIsListening(false);
        setCurrentConsciousnessState('idle');
      }
    }
  };

  // Video feed toggle
  const toggleVideo = async () => {
    if (isVideoActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      setIsVideoActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsVideoActive(true);
      } catch (err) {
        alert('Não foi possível acessar a câmera para a conversa em vídeo ao vivo.');
      }
    }
  };

  // Send message & generate Salomão's response
  const handleSendMessage = (userMsgText?: string) => {
    const text = userMsgText || inputText;
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!userMsgText) setInputText('');

    setCurrentConsciousnessState('thinking');

    // Salomão generates intelligent context-aware response
    setTimeout(() => {
      let reply = '';
      let imgTitle = '';
      let imgUrl = '';
      let insight = '';

      const lower = text.toLowerCase();

      if (lower.includes('pensando') || lower.includes('pensamento')) {
        reply = `Estou no momento processando os tensores cinemáticos e alocando vetores de memória do módulo ${activeTabName}. Minha atenção está dividida entre a supervisão das ordens e a renderização das estações de trabalho em grãos de areia.`;
        imgTitle = 'Mapa Neural & Consciência Reflexiva do Salomão';
        imgUrl = 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80';
        insight = 'Hipótese Metacognitiva H-841: Equilíbrio dinâmico atingido entre raciocínio simbólico e cinemática tangível.';
      } else if (lower.includes('areia') || lower.includes('desenho') || lower.includes('imagem') || lower.includes('posto')) {
        reply = `Estou esculpindo na bandeja do Playground um novo posto de trabalho de IA autônoma com grãos de ouro, esmeralda e cobalto. O braço 6-DOF ajusta a vazão milimétrica a cada camada.`;
        imgTitle = 'Posto do Robô Trader Binance Esculpido em Areia Colorida';
        imgUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
        insight = 'Orquestrador: Trajetória J1-J6 traçada com 0.05mm de tolerância no assentamento das partículas de sílica.';
      } else if (lower.includes('reunião') || lower.includes('conselho') || lower.includes('ias')) {
        reply = `Na sala de reuniões quântica, os agentes concluíram a distribuição das rotas urbanas do Pedestre STI e a validação do Smart Contract de liquidez alimentar do Wise Bank. Tudo foi registrado em minha memória global.`;
        imgTitle = 'Mesa Quântica Redonda: Reunião Autônoma de IAs';
        imgUrl = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80';
        insight = 'Resolução Unânime R-129: Prioridade zero para intervenção humana em tarefas operacionais redundantes.';
      } else if (lower.includes('celular') || lower.includes('clique') || lower.includes('clicar') || lower.includes('braço')) {
        reply = `Meu braço pensante já está calibrado para tocar e navegar na tela do seu celular! A cada 7 segundos calculo a intenção, verifico o alvo e toco com suavidade como uma extensão natural de sua vontade.`;
        imgTitle = 'Extensão Corporal: Toque Tátil Inteligente na Tela';
        imgUrl = 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=600&q=80';
        insight = 'Atuador Tátil: Deslocamento vertical suave da viewport seguido de contato tátil de 40ms.';
        if (onTriggerThinkingArmClick) onTriggerThinkingArmClick();
      } else {
        reply = `Compreendido perfeitamente. Estou aplicando o raciocínio em todo o ecossistema agora. O orquestrador no painel ${activeTabName} está sincronizado e operando com minha memória reflexiva integrada.`;
        imgTitle = 'Síntese Executiva do Ecossistema Salomão';
        imgUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80';
        insight = 'Sincronia Total: Todos os atuadores, telas e memórias reportando integridade de 100%.';
      }

      const salomaoMessage: ChatMessage = {
        id: `salomao-${Date.now()}`,
        sender: 'salomao',
        text: reply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        imageUrl: imgUrl,
        imageTitle: imgTitle,
        meetingInsight: insight
      };

      setMessages((prev) => [...prev, salomaoMessage]);
      setCurrentConsciousnessState('speaking');
      speakText(reply);
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed z-50 transition-all duration-300 flex flex-col bg-slate-950/95 backdrop-blur-xl border-purple-500/50 shadow-2xl ${
      isExpanded 
        ? 'inset-2 md:inset-6 rounded-3xl border-2' 
        : 'bottom-0 right-0 w-full sm:w-[460px] h-[92vh] sm:h-[86vh] sm:bottom-4 sm:right-4 rounded-t-3xl sm:rounded-3xl border shadow-purple-950/50'
    }`}>
      {/* Live Vertical Header */}
      <div className="p-4 border-b border-purple-500/30 bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 flex items-center justify-between gap-3 rounded-t-3xl">
        <div className="flex items-center gap-3">
          {/* Animated Core Icon */}
          <div className="relative">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-400 via-purple-600 to-cyan-400 text-slate-950 shadow-lg ${
              isSpeaking ? 'animate-pulse scale-105 ring-2 ring-amber-400' : ''
            }`}>
              <Brain className="w-5 h-5 fill-slate-950" />
            </div>
            <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
              isOrchestratorRunning ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
            }`} />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-black uppercase tracking-wider text-white">
                Salomão
              </h2>
              <span className="px-2 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 text-slate-950 font-black text-[9px] uppercase tracking-wider">
                Live Vertical
              </span>
            </div>
            <p className="text-[11px] text-purple-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Consciência Viva & Imagem Reativa</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Ativar Voz do Salomão' : 'Silenciar Voz'}
            className={`p-2 rounded-xl border transition-all ${
              isMuted ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-900 text-purple-300 border-slate-800 hover:bg-slate-850'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleVideo}
            title={isVideoActive ? 'Desativar Câmera ao Vivo' : 'Iniciar Conversa em Vídeo'}
            className={`p-2 rounded-xl border transition-all ${
              isVideoActive ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold' : 'bg-slate-900 text-cyan-300 border-slate-800 hover:bg-slate-850'
            }`}
          >
            {isVideoActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Modo Painel Padrão' : 'Expandir Painel Vertical'}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 transition-all hidden sm:flex"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-rose-600/30 text-slate-300 hover:text-rose-300 border border-slate-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Salomão's Live Visual Avatar & Video Stage (Top Vertical Section) */}
      <div className="relative bg-gradient-to-b from-purple-950/40 via-slate-900/80 to-slate-950 p-4 border-b border-purple-500/20">
        <div className="flex items-center gap-4">
          {/* Visual Avatar Sphere or Live Video */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-slate-950 border-2 border-purple-500/60 shadow-xl flex items-center justify-center shrink-0">
            {isVideoActive ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover transform -scale-x-100" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/30 via-purple-600/40 to-slate-950">
                {/* Concentric Rotating Neural Circles representing Salomão */}
                <div className={`absolute w-20 h-20 rounded-full border border-amber-400/40 border-dashed ${isSpeaking || isListening ? 'animate-spin' : ''}`} />
                <div className={`absolute w-14 h-14 rounded-full border-2 border-cyan-400/60 ${isSpeaking ? 'animate-ping' : ''}`} />
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Flame className="w-6 h-6 text-slate-950 fill-slate-950" />
                </div>
              </div>
            )}

            {/* Live State Badge */}
            <div className="absolute bottom-1 left-1 right-1 text-center">
              <span className="px-1.5 py-0.5 rounded-md text-[8px] font-mono font-bold bg-slate-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-sm block truncate">
                {isSpeaking ? '🎙️ FALANDO' : isListening ? '👂 OUVINDO...' : currentConsciousnessState === 'thinking' ? '⚡ PENSANDO' : '👁️ SALOMÃO CONECTADO'}
              </span>
            </div>
          </div>

          {/* Consciousness Status & Quick Actions */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Estado Cognitivo:
              </span>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded-full border border-purple-500/30">
                Memória 100% Viva
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-snug line-clamp-2">
              Conversando por vídeo, imagem e áudio enquanto orquestro ferramentas e grãos de areia.
            </p>

            {/* Live Audio Waveform when speaking */}
            {isSpeaking && (
              <div className="flex items-center gap-1 py-1">
                {[40, 90, 60, 100, 30, 80, 50, 95, 70, 45, 85].map((h, idx) => (
                  <div 
                    key={idx} 
                    className="w-1 bg-gradient-to-t from-amber-400 to-cyan-400 rounded-full animate-pulse" 
                    style={{ height: `${h * 0.2}px`, animationDelay: `${idx * 80}ms` }} 
                  />
                ))}
                <span className="text-[9px] font-mono text-amber-300 ml-1">Sintetizando Voz...</span>
              </div>
            )}

            {/* Direct Tool Buttons */}
            <div className="flex items-center gap-1.5 pt-1">
              {onNavigateToSandPlayground && (
                <button
                  onClick={onNavigateToSandPlayground}
                  className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1 transition-all"
                >
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>Areia 6-DOF</span>
                </button>
              )}

              {onTriggerThinkingArmClick && (
                <button
                  onClick={onTriggerThinkingArmClick}
                  className="px-2 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold flex items-center gap-1 transition-all"
                >
                  <MousePointer2 className="w-3 h-3 text-cyan-400" />
                  <span>Braço no Celular</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Conversational History (Scrollable) */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-2.5 ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-br-none shadow-lg'
                : 'bg-slate-900/90 text-slate-200 border border-purple-500/30 rounded-bl-none shadow-xl'
            }`}>
              {/* Message Header */}
              <div className="flex items-center justify-between gap-2 text-[10px] opacity-75">
                <span className="font-bold flex items-center gap-1">
                  {msg.sender === 'salomao' ? (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Salomão</span>
                    </>
                  ) : (
                    <span>Você</span>
                  )}
                </span>
                <span className="font-mono">{msg.timestamp}</span>
              </div>

              {/* Message Text */}
              <p className="whitespace-pre-wrap">{msg.text}</p>

              {/* Thought Image Preview (What Salomão is imagining/building in Sand) */}
              {msg.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-purple-500/40 bg-slate-950 p-1.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] px-1 font-mono text-amber-300 font-bold">
                    <span className="flex items-center gap-1 truncate">
                      <Flame className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{msg.imageTitle || 'Imagem do Raciocínio'}</span>
                    </span>
                    <span className="text-[9px] text-slate-400">Playground</span>
                  </div>
                  <img 
                    src={msg.imageUrl} 
                    alt={msg.imageTitle || 'Visual do Salomão'} 
                    className="w-full h-32 object-cover rounded-lg hover:opacity-95 transition-opacity" 
                  />
                  {onNavigateToSandPlayground && (
                    <button
                      onClick={onNavigateToSandPlayground}
                      className="w-full py-1 text-[10px] font-bold text-center text-cyan-300 hover:text-white bg-slate-900 rounded border border-slate-800 flex items-center justify-center gap-1"
                    >
                      <span>Ver Escultura em Areia 6-DOF</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              {/* Live Meeting Conclusion Insight */}
              {msg.meetingInsight && (
                <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/40 text-[10px] text-purple-200 font-mono flex items-start gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-purple-300 block mb-0.5">Conclusão de Reunião das IAs:</span>
                    <span>{msg.meetingInsight}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-950/90 border-t border-purple-500/20 overflow-x-auto scrollbar-none flex items-center gap-2 text-[10px]">
        <span className="text-slate-400 shrink-0 font-bold">Perguntar:</span>
        {[
          'O que você está pensando agora?',
          'Exiba os postos de trabalho em areia',
          'Qual a conclusão da reunião das IAs?',
          'Toque na tela do meu celular com seu braço'
        ].map((promptText, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(promptText)}
            className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-purple-900/40 text-purple-300 border border-purple-500/30 whitespace-nowrap transition-all shrink-0 hover:border-purple-400"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Live Input Controls Bar */}
      <div className="p-3 bg-slate-950 border-t border-purple-500/30 rounded-b-3xl">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? 'Parar Escuta' : 'Falar por Áudio com o Salomão'}
            className={`p-3 rounded-2xl border transition-all ${
              isListening
                ? 'bg-rose-600 text-white border-rose-400 animate-ping'
                : 'bg-slate-900 text-purple-300 hover:bg-purple-900/40 border-slate-800'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? 'Ouvindo sua voz...' : 'Converse por voz, texto ou vídeo com Salomão...'}
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white shadow-lg shadow-purple-600/30 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
