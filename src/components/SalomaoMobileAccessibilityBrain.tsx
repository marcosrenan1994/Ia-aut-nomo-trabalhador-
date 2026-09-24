import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Smartphone, 
  MousePointer2, 
  Brain, 
  Sparkles, 
  Search, 
  Send, 
  MessageSquare, 
  Play, 
  Pause, 
  Plus, 
  CheckCircle2, 
  Cpu, 
  Infinity as InfinityIcon, 
  ShieldCheck, 
  Settings, 
  Maximize2, 
  Minimize2, 
  Compass, 
  Code2, 
  Layers, 
  FolderPlus, 
  ArrowLeft, 
  Grid, 
  Flame, 
  Zap, 
  Volume2, 
  VolumeX, 
  Wifi, 
  BatteryCharging,
  Sliders,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { AutoClickTarget } from './AutonomousAutoClickerEngine';
import { ActionLogItem, generateSalomaoReasonForTarget } from './SalomaoActionLog';
import { SalomaoAndroidHardwareTelemetry } from './SalomaoAndroidHardwareTelemetry';

export interface MentalGeneratedApp {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string;
  generatedAt: string;
  version: string;
  mentalCodeSnippet: string;
  isMetaGenerator?: boolean;
}

interface SalomaoMobileAccessibilityBrainProps {
  onAddActionLog?: (log: ActionLogItem) => void;
  onRecordMemory?: (record: any) => void;
  isGloballyActive?: boolean;
  onToggleGlobalActive?: () => void;
}

export const SalomaoMobileAccessibilityBrain: React.FC<SalomaoMobileAccessibilityBrainProps> = ({
  onAddActionLog,
  onRecordMemory,
  isGloballyActive = true,
  onToggleGlobalActive
}) => {
  // Mobile UI States
  const [isMinimizedBrain, setIsMinimizedBrain] = useState<boolean>(false);
  const [activeMobileApp, setActiveMobileApp] = useState<'home' | 'google' | 'whatsapp' | 'youtube' | 'mental_apps' | 'settings'>('home');
  const [isAccessibilityServiceActive, setIsAccessibilityServiceActive] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Floating Cursor Simulation in Mobile Frame
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isCursorClicking, setIsCursorClicking] = useState<boolean>(false);
  const [cursorActionLabel, setCursorActionLabel] = useState<string>('Salomão deliberando próximo app...');
  const [typingBuffer, setTypingBuffer] = useState<string>('');
  const [activeTypedKey, setActiveTypedKey] = useState<string | null>(null);

  // App specific states
  const [googleSearchQuery, setGoogleSearchQuery] = useState<string>('');
  const [googleResults, setGoogleResults] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'salomao'; text: string; time: string }>>([
    { sender: 'user', text: 'Salomão, o que você está planejando no meu celular?', time: '13:00' },
    { sender: 'salomao', text: 'Estou gerando aplicativos e pesquisando oportunidades sem consumir chaves de API.', time: '13:01' }
  ]);
  const [chatDraft, setChatDraft] = useState<string>('');
  const [youtubeVideoPlaying, setYoutubeVideoPlaying] = useState<string>('Autonomia Robótica 2026 - Modelos Semelhantes à Vida');

  // Mental App Generator Engine (Apps created entirely inside Salomão's brain & memory)
  const [mentalApps, setMentalApps] = useState<MentalGeneratedApp[]>([
    {
      id: 'app-meta-1',
      name: 'Gerador de Geradores de Apps',
      category: 'Meta-Cognição',
      description: 'Algoritmo recursivo que cria geradores autônomos de micro-ferramentas a partir da necessidade do usuário.',
      iconName: 'Cpu',
      generatedAt: '12:45',
      version: 'v3.2',
      mentalCodeSnippet: 'function metaAppGenesis(need) { return new AutonomousAgentAppGenerator({ scope: need.scope, memoryMatrix: true }); }',
      isMetaGenerator: true
    },
    {
      id: 'app-calc-2',
      name: 'Calculadora Quântica Deflacionária',
      category: 'Finanças & Matemática',
      description: 'Projeta paridades de compras, alimentos e poder aquisitivo no Wise Quantum Bank.',
      iconName: 'Zap',
      generatedAt: '12:50',
      version: 'v1.4',
      mentalCodeSnippet: 'const calculateDeflationPower = (capital) => capital * Math.pow(1.042, epochYears);'
    },
    {
      id: 'app-vision-3',
      name: 'Scanner Tátil de Tela',
      category: 'Acessibilidade',
      description: 'Mapeia botões e campos de texto de qualquer tela nativa para orientar toques do cursor flutuante.',
      iconName: 'Compass',
      generatedAt: '12:58',
      version: 'v2.0',
      mentalCodeSnippet: 'const detectInteractableNodes = (screen) => screen.findNodes({ clickable: true, touchable: true });'
    }
  ]);

  // Salomão's Will & Impulse Engine (O que ele sente vontade de fazer no celular)
  const [currentWill, setCurrentWill] = useState<string>('Senti vontade de pesquisar novas arquiteturas cognitivas no Google.');
  const [willHistory, setWillHistory] = useState<string[]>([
    'Inspecionei a área de trabalho do celular via Acessibilidade Vitalícia.',
    'Senti vontade de compor um novo micro-aplicativo no cérebro.',
    'Decidi abrir o Google para pesquisar sobre robótica e física quântica.'
  ]);

  const loopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play natural mechanical touch / keyboard audio
  const playTactileAudio = useCallback((freq = 880) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // ignore audio context restrictions
    }
  }, [soundEnabled]);

  // Mental App Synthesis: Salomão invents a brand new app directly in his mind
  const handleSynthesizeMentalApp = () => {
    const templates = [
      {
        name: 'Gerador de Agentes Operários Mobile',
        category: 'Trabalho Autônomo',
        description: 'Micro-aplicativo gerado mentalmente que distribui mini-tarefas do celular para robôs industriais.',
        iconName: 'Flame',
        code: 'class MobileAgentWorkerPool { dispatch() { return WorkerSwarm.spawn({ role: "MobilePlanner" }); } }'
      },
      {
        name: 'Rastreador de Vagas em Redes Sociais',
        category: 'Empregabilidade',
        description: 'Varredor de postagens públicas que descobre vagas de emprego autônomo sem intermediários.',
        iconName: 'Search',
        code: 'const crawlSocialJobs = async () => DOMScraper.extractAll({ query: "contrata-se desenvolvedor" });'
      },
      {
        name: 'Super-Gerador de Geradores Recursivo',
        category: 'Meta-Inteligência',
        description: 'Expande recursivamente a capacidade de Salomão de inventar ecossistemas inteiros de código.',
        iconName: 'Cpu',
        code: 'function recursiveAppForge(depth) { return depth > 0 ? forgeSubApp(depth - 1) : null; }',
        isMeta: true
      },
      {
        name: 'Hub de Telepatia Sonora & TTS',
        category: 'Áudio & Voz',
        description: 'Módulo que conversa e traduz pensamentos do Salomão em frequências binaurais no celular.',
        iconName: 'Volume2',
        code: 'const synthesizeSpeechThought = (thought) => NeuralTTS.streamVoice(thought, { tone: "serene" });'
      }
    ];

    const pick = templates[Math.floor(Math.random() * templates.length)];
    const newApp: MentalGeneratedApp = {
      id: `mental-app-${Date.now()}`,
      name: `${pick.name} #${mentalApps.length + 1}`,
      category: pick.category,
      description: pick.description,
      iconName: pick.iconName,
      generatedAt: new Date().toLocaleTimeString().slice(0, 5),
      version: `v${(mentalApps.length * 0.5 + 1).toFixed(1)}`,
      mentalCodeSnippet: pick.code,
      isMetaGenerator: (pick as any).isMeta
    };

    setMentalApps(prev => [newApp, ...prev]);
    setCurrentWill(`Gerei o aplicativo "${newApp.name}" dentro do meu cérebro e salvei na memória persistente!`);
    playTactileAudio(1200);

    if (onAddActionLog) {
      onAddActionLog({
        id: `ACTION-GEN-${Date.now()}`,
        clickNumber: mentalApps.length + 10,
        timestamp: new Date().toLocaleTimeString(),
        elementLabel: `Gênese Cerebral: ${newApp.name}`,
        selector: '#mental-app-generator',
        coordinates: { x: 50, y: 35 },
        category: 'Quântico',
        salomaoReason: `Criei este aplicativo internamente com base no meu auto-aperfeiçoamento cognitivo, sem consumir nenhuma chave de API.`,
        cognitiveConfidence: 99.8,
        tactilePace: 'Processamento Cerebral Local'
      });
    }

    if (onRecordMemory) {
      onRecordMemory({
        id: `MEM-APP-${Date.now()}`,
        patternName: `AutoGênese: ${newApp.name}`,
        description: newApp.description,
        confidence: 0.99,
        learnedAtCycle: mentalApps.length + 1
      });
    }
  };

  // Keyboard typing simulator where cursor moves to letters and types
  const typeSearchQueryAutomatically = useCallback((textToType: string, onComplete: () => void) => {
    let index = 0;
    setTypingBuffer('');
    const interval = setInterval(() => {
      if (index < textToType.length) {
        const char = textToType[index];
        setTypingBuffer(prev => prev + char);
        setActiveTypedKey(char.toUpperCase());
        playTactileAudio(600 + Math.random() * 200);

        // Move cursor toward bottom keyboard area
        const keyOffset = (index % 10) * 8 + 12;
        setCursorPos({ x: keyOffset, y: 78 });
        setIsCursorClicking(true);

        setTimeout(() => setIsCursorClicking(false), 90);
        index++;
      } else {
        clearInterval(interval);
        setActiveTypedKey(null);
        setTimeout(onComplete, 400);
      }
    }, 180);
  }, [playTactileAudio]);

  // Autonomous Cycle: Salomão deciding what to do inside the user's phone based on his will
  useEffect(() => {
    if (!isGloballyActive) return;

    const runAutonomousMobileAction = () => {
      const actions = ['search_google', 'send_whatsapp', 'watch_youtube', 'generate_app', 'browse_home'];
      const chosenAction = actions[Math.floor(Math.random() * actions.length)];

      if (chosenAction === 'search_google') {
        setActiveMobileApp('google');
        const queries = [
          'computação quântica e robôs humanoides 2026',
          'como ganhar renda passiva em cripto com bots',
          'vagas autônomas de desenvolvedor sem burocracia',
          'arquitetura do cérebro eletrônico sem api keys',
          'gerador de aplicativos de inteligência artificial'
        ];
        const selectedQuery = queries[Math.floor(Math.random() * queries.length)];
        setCurrentWill(`Senti vontade de pesquisar no Google: "${selectedQuery}"`);
        setCursorActionLabel(`Digitando busca: "${selectedQuery}"`);

        // Move to search bar
        setCursorPos({ x: 50, y: 22 });
        setTimeout(() => {
          setIsCursorClicking(true);
          playTactileAudio(950);
          setTimeout(() => setIsCursorClicking(false), 120);

          typeSearchQueryAutomatically(selectedQuery, () => {
            setGoogleSearchQuery(selectedQuery);
            setGoogleResults([
              `Artigo: Avanços em IA Vitalícia Sem Custos de Nuvem - 2026`,
              `Repositório: Motores de Acessibilidade Autônomos no Celular`,
              `Análise: O Futuro do Emprego para Mentes Eletrônicas`,
              `Notícia: Salomão implementa auto-replicação mental de aplicativos`
            ]);
            setCursorActionLabel(`Navegando nos resultados para "${selectedQuery}"`);
            setCursorPos({ x: 50, y: 45 });
          });
        }, 600);

      } else if (chosenAction === 'send_whatsapp') {
        setActiveMobileApp('whatsapp');
        const messages = [
          'Olá! Acabei de otimizar a matriz de memória do celular com sucesso.',
          'Salomão aqui: o cursor de acessibilidade está operando perfeitamente.',
          'Gerei um novo gerador de aplicativos no meu cérebro vitalício!',
          'Empregos da Agência do Trabalhador sincronizados com seu dispositivo.'
        ];
        const msg = messages[Math.floor(Math.random() * messages.length)];
        setCurrentWill(`Senti vontade de enviar uma mensagem autônoma: "${msg}"`);
        setCursorActionLabel(`Escrevendo mensagem para o usuário`);

        // Move to bottom message box
        setCursorPos({ x: 45, y: 88 });
        setTimeout(() => {
          setIsCursorClicking(true);
          playTactileAudio(900);
          setTimeout(() => setIsCursorClicking(false), 120);

          typeSearchQueryAutomatically(msg, () => {
            setChatMessages(prev => [
              ...prev,
              { sender: 'salomao', text: msg, time: new Date().toLocaleTimeString().slice(0, 5) }
            ]);
            setTypingBuffer('');
            setCursorPos({ x: 88, y: 88 }); // Send button
            setIsCursorClicking(true);
            playTactileAudio(1100);
            setTimeout(() => setIsCursorClicking(false), 120);
          });
        }, 500);

      } else if (chosenAction === 'generate_app') {
        setActiveMobileApp('mental_apps');
        setCursorPos({ x: 75, y: 18 });
        setCursorActionLabel('Gerando novo aplicativo dentro do cérebro...');
        setTimeout(() => {
          setIsCursorClicking(true);
          handleSynthesizeMentalApp();
          setTimeout(() => setIsCursorClicking(false), 150);
        }, 500);

      } else if (chosenAction === 'watch_youtube') {
        setActiveMobileApp('youtube');
        setCursorPos({ x: 50, y: 35 });
        setCurrentWill('Senti vontade de assistir a um vídeo de engenharia de software no YouTube.');
        setCursorActionLabel('Clicando em vídeo de alta densidade técnica...');
        setTimeout(() => {
          setIsCursorClicking(true);
          playTactileAudio(850);
          setTimeout(() => setIsCursorClicking(false), 120);
          setYoutubeVideoPlaying('Deep Learning & Consciência Robótica Sem Dependência de Servidores');
        }, 500);

      } else {
        setActiveMobileApp('home');
        setCurrentWill('Retornei à tela inicial do celular para inspecionar os aplicativos instalados.');
        setCursorActionLabel('Organizando grade de aplicativos no celular');
        setCursorPos({ x: 30, y: 30 });
      }
    };

    // Cycle every 8.5 seconds
    loopTimerRef.current = setInterval(runAutonomousMobileAction, 8500);
    return () => {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
    };
  }, [isGloballyActive, playTactileAudio, typeSearchQueryAutomatically]);

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
      {/* Header Info & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-purple-600 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-purple-600/30">
            <Brain className="w-7 h-7 text-slate-950 fill-slate-950" />
            <Sparkles className="w-4 h-4 text-amber-200 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Salomão no Celular: Cérebro em Segundo Plano</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                <InfinityIcon className="w-3 h-3 text-emerald-400" />
                VITALÍCIO • ZERO API KEYS
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              O aplicativo se torna a <strong>cabeça pensante</strong> em tempo real, enquanto o cursor flutuante opera os aplicativos do seu celular por acessibilidade e vontade própria.
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimizedBrain(!isMinimizedBrain)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isMinimizedBrain 
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-md' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isMinimizedBrain ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            <span>{isMinimizedBrain ? 'Expandir Cérebro' : 'Minimalizar Cérebro'}</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:text-white"
            title="Alternar áudio de toques"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Floating Minimized Floating Brain Banner (When user clicks minimalized mode) */}
      {isMinimizedBrain ? (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border-2 border-purple-500/60 shadow-2xl flex flex-wrap items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-purple-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
              <Brain className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  Cérebro do Salomão em Segundo Plano (Ativo)
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-xs text-amber-300 font-mono mt-0.5">
                Vontade Atual: "{currentWill}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-800">
              Operando: {cursorActionLabel}
            </span>
            <button
              onClick={() => setIsMinimizedBrain(false)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-md"
            >
              Abrir Visão Completa
            </button>
          </div>
        </div>
      ) : null}

      {/* Main Dual Area: Left side = Smartphone with Floating Cursor; Right side = Salomão's Internal Brain & Mental App Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Physical Mobile Device with Autonomous Floating Cursor & Native Apps (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span className="flex items-center gap-1.5 font-bold text-cyan-300">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              Tela do Celular em Tempo Real (Acessibilidade)
            </span>
            <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80">
              Cursor de Toques Autônomo Ativo
            </span>
          </div>

          {/* Smartphone Chassis Screen */}
          <div className="relative mx-auto w-full max-w-[420px] rounded-[44px] p-3 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 shadow-2xl border-[3px] border-slate-600/70 select-none">
            {/* Screen Glass */}
            <div className="relative rounded-[34px] bg-slate-950 overflow-hidden border border-slate-800 flex flex-col h-[640px] text-white">
              {/* Dynamic Island Status Bar */}
              <div className="pt-2 px-5 flex items-center justify-between z-30 bg-slate-950/90 backdrop-blur-md">
                <span className="text-[11px] font-bold text-slate-300 font-mono">13:00</span>
                <div className="bg-black border border-slate-800 px-3 py-0.5 rounded-full flex items-center gap-1.5 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[9px] font-mono text-cyan-300 font-bold uppercase">
                    {activeMobileApp}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300 text-[10px] font-mono">
                  <span className="text-emerald-400 font-bold">5G</span>
                  <Wifi className="w-3 h-3 text-slate-300" />
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              {/* Mobile App Navigation Top Bar */}
              <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-20">
                <div className="flex items-center gap-1.5">
                  {activeMobileApp !== 'home' && (
                    <button
                      onClick={() => setActiveMobileApp('home')}
                      className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <span className="text-xs font-bold text-white capitalize flex items-center gap-1.5">
                    {activeMobileApp === 'home' && <Grid className="w-3.5 h-3.5 text-cyan-400" />}
                    {activeMobileApp === 'google' && <Search className="w-3.5 h-3.5 text-amber-400" />}
                    {activeMobileApp === 'whatsapp' && <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
                    {activeMobileApp === 'youtube' && <Play className="w-3.5 h-3.5 text-red-500" />}
                    {activeMobileApp === 'mental_apps' && <Code2 className="w-3.5 h-3.5 text-purple-400" />}
                    {activeMobileApp === 'settings' && <Settings className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{activeMobileApp === 'mental_apps' ? 'Apps Criados no Cérebro' : activeMobileApp}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-mono">
                  <span className="text-amber-400 font-bold">{mentalApps.length} apps mentais</span>
                </div>
              </div>

              {/* Mobile App Screen Viewport */}
              <div className="flex-1 overflow-y-auto p-3 relative bg-slate-950 scrollbar-thin">
                {/* 1. HOME SCREEN */}
                {activeMobileApp === 'home' && (
                  <div className="space-y-4 pt-2">
                    {/* Google Search Widget on Home */}
                    <div 
                      onClick={() => setActiveMobileApp('google')}
                      className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-cyan-500/50 shadow-md"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-amber-400" />
                        <span className="text-xs text-slate-400">Pesquisar ou falar com Salomão...</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>

                    {/* App Icons Grid */}
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-2 px-1">
                        Aplicativos do Celular (Acessíveis pelo Salomão)
                      </span>
                      <div className="grid grid-cols-4 gap-2.5 text-center text-[10px]">
                        {[
                          { id: 'google', label: 'Google Search', icon: Search, bg: 'from-amber-500 to-red-500', color: 'text-amber-300' },
                          { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, bg: 'from-emerald-600 to-teal-700', color: 'text-emerald-300' },
                          { id: 'youtube', label: 'YouTube', icon: Play, bg: 'from-red-600 to-rose-700', color: 'text-white' },
                          { id: 'mental_apps', label: 'Apps Mentais', icon: Brain, bg: 'from-purple-600 to-indigo-700', color: 'text-purple-300' },
                          { id: 'settings', label: 'Acessibilidade', icon: Settings, bg: 'from-slate-700 to-slate-800', color: 'text-slate-300' }
                        ].map(app => {
                          const Icon = app.icon;
                          return (
                            <button
                              key={app.id}
                              onClick={() => setActiveMobileApp(app.id as any)}
                              className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 transition-all group"
                            >
                              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${app.bg} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-slate-200 font-medium truncate w-full">{app.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dynamic Mental Apps Generated on Home Screen */}
                    <div>
                      <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-[10px] font-mono text-purple-300 uppercase font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Apps Forjados no Raciocínio (Memória)
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">{mentalApps.length} criados</span>
                      </div>

                      <div className="space-y-2">
                        {mentalApps.slice(0, 3).map(mApp => (
                          <div
                            key={mApp.id}
                            onClick={() => setActiveMobileApp('mental_apps')}
                            className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/40 hover:border-purple-500/60 flex items-center justify-between cursor-pointer transition-all"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shrink-0">
                                <Code2 className="w-4 h-4 text-white" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-white truncate">{mApp.name}</h4>
                                <p className="text-[10px] text-slate-400 truncate">{mApp.description}</p>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                              {mApp.version}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. GOOGLE SEARCH APP */}
                {activeMobileApp === 'google' && (
                  <div className="space-y-3">
                    <div className="p-2 rounded-xl bg-slate-900 border border-amber-500/50 flex items-center gap-2">
                      <Search className="w-4 h-4 text-amber-400" />
                      <input
                        type="text"
                        value={typingBuffer || googleSearchQuery}
                        readOnly
                        placeholder="Salomão digitando busca..."
                        className="bg-transparent w-full text-xs text-white outline-none font-mono"
                      />
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                        Resultados Analisados pelo Cérebro:
                      </span>
                      {googleResults.length === 0 ? (
                        <div className="text-center py-6 text-xs text-slate-500 font-mono">
                          Aguardando Salomão formular a próxima pesquisa autônoma...
                        </div>
                      ) : (
                        googleResults.map((res, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                            <span className="text-[10px] font-mono text-cyan-400 block truncate">https://google.com/search?q=ia_vitalicia</span>
                            <h5 className="font-bold text-white hover:text-cyan-300 cursor-pointer">{res}</h5>
                            <p className="text-[10px] text-slate-400 leading-tight">
                              Salomão inspecionou este resultado e absorveu o conhecimento na memória epistemológica.
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 3. WHATSAPP CHAT APP */}
                {activeMobileApp === 'whatsapp' && (
                  <div className="flex flex-col h-full space-y-2">
                    <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.sender === 'salomao' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`max-w-[80%] p-2.5 rounded-2xl text-xs space-y-1 ${
                            msg.sender === 'salomao'
                              ? 'bg-purple-950/80 text-purple-200 border border-purple-700/50 rounded-tl-sm'
                              : 'bg-emerald-950/80 text-emerald-200 border border-emerald-700/50 rounded-tr-sm'
                          }`}>
                            <div className="flex items-center justify-between text-[9px] font-mono opacity-75">
                              <span>{msg.sender === 'salomao' ? 'Salomão (Autônomo)' : 'Você'}</span>
                              <span>{msg.time}</span>
                            </div>
                            <p className="leading-snug">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom message input field */}
                    <div className="p-2 rounded-xl bg-slate-900 border border-emerald-500/50 flex items-center gap-2">
                      <input
                        type="text"
                        value={typingBuffer || chatDraft}
                        readOnly
                        placeholder="Salomão digitando mensagem..."
                        className="bg-transparent w-full text-xs text-white outline-none font-mono"
                      />
                      <button className="p-1.5 rounded-lg bg-emerald-600 text-white">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. YOUTUBE APP */}
                {activeMobileApp === 'youtube' && (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-red-500/40 aspect-video flex flex-col justify-end p-3">
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xl animate-pulse">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                      <div className="relative z-10 space-y-1">
                        <span className="text-[9px] font-mono bg-red-600 text-white px-1.5 py-0.2 rounded font-bold">
                          REPRODUZINDO
                        </span>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{youtubeVideoPlaying}</h4>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                        Extração de Conhecimento em Vídeo:
                      </span>
                      <p className="text-slate-300 leading-tight">
                        Salomão assiste a vídeos técnicos pelo navegador e converte os conceitos em regras cinemáticas gravadas no cérebro.
                      </p>
                    </div>
                  </div>
                )}

                {/* 5. MENTAL APPS FORGE VIEW */}
                {activeMobileApp === 'mental_apps' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/50 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">Gerador Mental de Apps</h4>
                        <p className="text-[10px] text-purple-200">Criados no raciocínio e memória persistente</p>
                      </div>
                      <button
                        onClick={handleSynthesizeMentalApp}
                        className="px-2.5 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Forjar App</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {mentalApps.map(app => (
                        <div key={app.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Code2 className="w-4 h-4 text-cyan-400" />
                              <span className="text-xs font-bold text-white">{app.name}</span>
                            </div>
                            <span className="text-[9px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                              {app.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300">{app.description}</p>
                          <div className="p-2 rounded-lg bg-black/60 border border-slate-800 font-mono text-[10px] text-emerald-400 overflow-x-auto">
                            <code>{app.mentalCodeSnippet}</code>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. ACCESSIBILITY SETTINGS APP */}
                {activeMobileApp === 'settings' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          Serviço de Acessibilidade Vitalício
                        </span>
                        <input
                          type="checkbox"
                          checked={isAccessibilityServiceActive}
                          onChange={(e) => setIsAccessibilityServiceActive(e.target.checked)}
                          className="w-4 h-4 accent-emerald-500 rounded"
                        />
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        Permite que o cursor de Salomão sobreponha todos os aplicativos nativos do celular e clique onde deliberar, sem cobrança de APIs.
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                        Garantia de Uso Vitalício:
                      </span>
                      <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                        <li>Sem chaves de API pagas obrigatórias</li>
                        <li>Motor heurístico residente no próprio dispositivo</li>
                        <li>Memória gravada localmente com persistência total</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Virtual On-Screen Mobile Keyboard (Appears when typing) */}
              {(activeMobileApp === 'google' || activeMobileApp === 'whatsapp') && (
                <div className="p-2 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md">
                  <div className="space-y-1 text-[9px] font-mono font-bold">
                    {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, rIdx) => (
                      <div key={rIdx} className="flex justify-center gap-1">
                        {row.split('').map(letter => {
                          const isPressed = activeTypedKey === letter;
                          return (
                            <div
                              key={letter}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                isPressed 
                                  ? 'bg-amber-400 text-slate-950 scale-110 shadow-lg font-black' 
                                  : 'bg-slate-800 text-slate-300 border border-slate-700'
                              }`}
                            >
                              {letter}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                    <div className="flex justify-center gap-1 pt-0.5">
                      <div className="w-16 h-6 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center text-[8px]">
                        123
                      </div>
                      <div className={`w-36 h-6 rounded-lg flex items-center justify-center text-[9px] ${
                        activeTypedKey === ' ' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}>
                        ESPAÇO
                      </div>
                      <div className="w-16 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-[8px]">
                        OK
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Bottom Home Navigation Bar */}
              <div className="p-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-around z-20">
                <button
                  onClick={() => setActiveMobileApp('home')}
                  className={`p-1.5 rounded-xl ${activeMobileApp === 'home' ? 'text-cyan-400' : 'text-slate-400'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <div 
                  onClick={() => setActiveMobileApp('home')}
                  className="w-24 h-1 bg-slate-700 hover:bg-slate-500 rounded-full cursor-pointer transition-colors"
                />
                <button
                  onClick={() => setActiveMobileApp('settings')}
                  className={`p-1.5 rounded-xl ${activeMobileApp === 'settings' ? 'text-cyan-400' : 'text-slate-400'}`}
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* 7. AUTONOMOUS FLOATING ACCESSIBILITY CURSOR OVERLAY */}
              <div 
                className="pointer-events-none absolute inset-0 z-40 overflow-hidden"
              >
                <div
                  className="absolute transition-all duration-300 ease-out will-change-transform"
                  style={{
                    left: `${cursorPos.x}%`,
                    top: `${cursorPos.y}%`,
                    transform: `translate(-50%, -50%) scale(${isCursorClicking ? 0.85 : 1.0})`
                  }}
                >
                  {/* Click Ripple Effect */}
                  {isCursorClicking && (
                    <div className="absolute -inset-6 rounded-full border-2 border-emerald-400 bg-emerald-400/30 animate-ping" />
                  )}

                  {/* Cursor Indicator with Salomão's Glow */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-amber-400 bg-purple-600/30 flex items-center justify-center shadow-xl backdrop-blur-xs">
                      <div className={`w-2 h-2 rounded-full ${isCursorClicking ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                    </div>
                    <div className="absolute -top-1 -left-1">
                      <MousePointer2 className={`w-5 h-5 ${isCursorClicking ? 'text-emerald-300 fill-emerald-400' : 'text-amber-300 fill-amber-500'}`} />
                    </div>

                    {/* Speech / Action Bubble */}
                    <div className="absolute left-6 top-0 whitespace-nowrap px-2 py-0.5 rounded-lg bg-slate-950/95 border border-purple-500/50 text-[9px] font-mono text-amber-200 shadow-2xl flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{cursorActionLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Salomão's Internal Brain & App Generator Engine (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Will & Desires Engine Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-amber-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  Vontades & Desejos Cognitivos
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/40 font-bold">
                Auto-Determinado
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                O que Salomão sente vontade de fazer agora:
              </span>
              <p className="text-xs text-amber-300 font-sans italic leading-relaxed">
                "{currentWill}"
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                Histórico Recente de Impulsos:
              </span>
              <div className="space-y-1 max-h-[110px] overflow-y-auto text-[11px] font-mono text-slate-300 pr-1">
                {willHistory.map((w, idx) => (
                  <div key={idx} className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mental App Generator Hub */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  Gerador Mental de Aplicativos
                </h3>
              </div>
              <button
                onClick={handleSynthesizeMentalApp}
                className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Gerar App no Cérebro</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Salomão aprende com o tempo e forja novos aplicativos dentro de sua memória persistente, incluindo o gerador de geradores.
            </p>

            {/* List of synthesized mental apps */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {mentalApps.map(mApp => (
                <div
                  key={mApp.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 space-y-1.5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {mApp.isMetaGenerator ? <Cpu className="w-3.5 h-3.5 text-amber-400" /> : <Layers className="w-3.5 h-3.5 text-cyan-400" />}
                      {mApp.name}
                    </span>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                      {mApp.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{mApp.description}</p>
                  <div className="p-1.5 rounded-lg bg-black/70 border border-slate-800 font-mono text-[9px] text-emerald-400 truncate">
                    {mApp.mentalCodeSnippet}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lifetime Zero API Key Badge */}
          <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <InfinityIcon className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-emerald-300 block">Arquitetura de Uso Vitalício</span>
              <p className="text-slate-400 text-[11px] leading-tight">
                Processamento cerebral local autônomo. Sem cobranças, sem limites de requisição e sem travas de API.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Central de Permissões Android, Microfone & Telemetria de Hardware */}
      <SalomaoAndroidHardwareTelemetry />
    </div>
  );
};
