import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MousePointer2, 
  Crosshair, 
  Zap, 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Target,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  StopCircle,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export type AutoClickerPace = 'cadencia_7s' | 'cadencia_5s' | 'cadencia_10s';

export interface AutoClickTarget {
  id: string;
  label: string;
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  selector?: string;
}

export const BROAD_FULLSCREEN_TARGETS: AutoClickTarget[] = [
  { id: 'broad-sand-playground', label: 'Playground 6-DOF & Areia Salomão (Aba)', xPercent: 68, yPercent: 22, selector: '#tab-sand-playground-btn' },
  { id: 'broad-vault-tab', label: 'Painel Intelectual (Aba Direita)', xPercent: 88, yPercent: 22, selector: '#tab-intellectual-vault-btn' },
  { id: 'broad-agency-left', label: 'Vagas de IAs (Lateral Esquerda)', xPercent: 20, yPercent: 55, selector: '#tab-worker-agency-btn' },
  { id: 'broad-chrome-scrape', label: 'Busca & Scraping Chrome (Centro-Direito)', xPercent: 76, yPercent: 44, selector: '#btn-chrome-search-and-scrape' },
  { id: 'broad-binance-bot', label: 'Robô Trading Binance (Centro-Topo)', xPercent: 48, yPercent: 22, selector: '#tab-binance-bot-btn' },
  { id: 'broad-binance-action', label: 'Executar Compra Futuros (Inferior-Direito)', xPercent: 82, yPercent: 68, selector: '#btn-binance-buy-long' },
  { id: 'broad-real-vision', label: 'Câmera Celular Gemini (Direita)', xPercent: 68, yPercent: 22, selector: '#tab-real-vision-btn' },
  { id: 'broad-terminal-bottom', label: 'Agência: Ver Contratos (Inferior)', xPercent: 32, yPercent: 78, selector: '#worker-agency-stats' },
  { id: 'broad-agency-tab', label: 'Agência do Trabalhador (Aba Esquerda)', xPercent: 16, yPercent: 22, selector: '#tab-worker-agency-btn' }
];

export interface AutonomousAutoClickerProps {
  externalTarget?: AutoClickTarget | null;
  onAutoClickExecuted?: (target: AutoClickTarget, clickNumber: number) => void;
  onStopRequested?: () => void;
  isMobileDevice?: boolean;
  isActive?: boolean;
  onActiveChange?: (active: boolean) => void;
  onCountdownTick?: (sec: number) => void;
}

export const AutonomousAutoClickerEngine: React.FC<AutonomousAutoClickerProps> = ({
  externalTarget = null,
  onAutoClickExecuted,
  onStopRequested,
  isMobileDevice = false,
  isActive,
  onActiveChange,
  onCountdownTick
}) => {
  // Cursor coordinate state
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [targetPos, setTargetPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [activeTargetLabel, setActiveTargetLabel] = useState<string>('Nenhum alvo no momento');
  const [activeTargetSelector, setActiveTargetSelector] = useState<string | undefined>();
  
  // Execution Control & Safety State
  const [isSystemActive, setIsSystemActive] = useState<boolean>(false);
  const [isClickingVisual, setIsClickingVisual] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [pace, setPace] = useState<AutoClickerPace>('cadencia_7s');
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(true);
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(isMobileDevice);
  const [countdownSec, setCountdownSec] = useState<number>(7.0);
  const [currentThought, setCurrentThought] = useState<string>('Braço pensante do Salomão pronto. Extensão física para toque tátil na tela do celular e desktop.');
  const [lastActionStatus, setLastActionStatus] = useState<'IDLE' | 'MOVING' | 'HOVERING' | 'CLICKED' | 'STOPPED'>('IDLE');

  // Refs for bulletproof immediate cancellation & strict 7s rate limiting
  const isStoppedRef = useRef<boolean>(true);
  const animationFrameRef = useRef<number | null>(null);
  const activeTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  const internalCycleIndexRef = useRef<number>(0);
  const isActionInProgressRef = useRef<boolean>(false);

  // Helper to register timeouts so they can all be cleared on STOP
  const registerTimeout = (cb: () => void, delayMs: number) => {
    if (isStoppedRef.current) return;
    const t = setTimeout(() => {
      activeTimeoutsRef.current = activeTimeoutsRef.current.filter(item => item !== t);
      if (!isStoppedRef.current) cb();
    }, delayMs);
    activeTimeoutsRef.current.push(t);
    return t;
  };

  // IMMEDIATE AND COMPLETE STOP: Cancels all animations, timeouts and pending actions
  const stopAllImmediately = useCallback(() => {
    isStoppedRef.current = true;
    isActionInProgressRef.current = false;
    setIsSystemActive(false);
    setIsMoving(false);
    setIsClickingVisual(false);
    setLastActionStatus('STOPPED');
    setCountdownSec(7.0);

    // Clear all timeouts
    activeTimeoutsRef.current.forEach(t => clearTimeout(t));
    activeTimeoutsRef.current = [];

    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setCurrentThought('PARADA IMEDIATA EXECUTADA. Todos os cursores foram imobilizados e nenhum clique será efetuado.');
    
    // Notify parent to stop global exploration loop
    if (onStopRequested) {
      onStopRequested();
    }
    if (onActiveChange) {
      onActiveChange(false);
    }
  }, [onStopRequested, onActiveChange]);

  // Audio Click Feedback
  const playClickAudio = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1050, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.045);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch {
      // Audio fallback ignore
    }
  }, [soundEnabled]);

  // Execute Human-Like Physical DOM Click (strictly 1 click per 7 seconds)
  const executeHumanClickOnDom = useCallback((xPercent: number, yPercent: number, selector?: string, label?: string) => {
    if (isStoppedRef.current) return;

    // Strict 7-second cooldown guard (at least 6000ms between physical clicks)
    const now = Date.now();
    if (now - lastClickTimeRef.current < 6000) {
      console.log('Ignorando clique repetitivo: cadência de 7 segundos ativa.');
      return;
    }
    lastClickTimeRef.current = now;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const clientX = Math.round((xPercent / 100) * screenWidth);
    const clientY = Math.round((yPercent / 100) * screenHeight);

    let targetElement: Element | null = null;
    if (selector) {
      try {
        targetElement = document.querySelector(selector);
      } catch {
        // ignore selector error
      }
    }
    if (!targetElement) {
      targetElement = document.elementFromPoint(clientX, clientY);
    }

    // Step 1: Human Finger Press Down (Visual pulse)
    setIsClickingVisual(true);
    setLastActionStatus('CLICKED');
    playClickAudio();
    if (hapticsEnabled && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }

    // Dispatch formal DOM sequence with natural 120ms finger hold
    if (targetElement) {
      const mouseInit = {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX,
        clientY,
        screenX: clientX,
        screenY: clientY
      };

      try {
        targetElement.dispatchEvent(new PointerEvent('pointerdown', mouseInit));
        targetElement.dispatchEvent(new MouseEvent('mousedown', mouseInit));

        // Human hold duration (120ms) before release
        registerTimeout(() => {
          if (isStoppedRef.current) return;
          targetElement?.dispatchEvent(new PointerEvent('pointerup', mouseInit));
          targetElement?.dispatchEvent(new MouseEvent('mouseup', mouseInit));
          targetElement?.dispatchEvent(new MouseEvent('click', mouseInit));

          if (typeof (targetElement as HTMLElement)?.click === 'function') {
            (targetElement as HTMLElement).click();
          }

          setIsClickingVisual(false);
          setTotalClicks(prev => prev + 1);

          if (onAutoClickExecuted) {
            onAutoClickExecuted(
              {
                id: `CLICK-${Date.now()}`,
                label: label || activeTargetLabel,
                xPercent,
                yPercent,
                selector
              },
              totalClicks + 1
            );
          }
        }, 120);
      } catch (err) {
        console.warn('Click event dispatch notice:', err);
      }
    } else {
      registerTimeout(() => setIsClickingVisual(false), 120);
    }
  }, [activeTargetLabel, hapticsEnabled, onAutoClickExecuted, playClickAudio, totalClicks]);

  // Wide Full-Screen Natural Human Glide with Arc, Quintic Easing & Vertical Page Scrolling
  const moveCursorToTargetNaturally = useCallback((target: AutoClickTarget, onArrived: () => void) => {
    if (isStoppedRef.current) return;

    setIsMoving(true);
    setLastActionStatus('MOVING');
    setCurrentThought(`[Deslocamento & Rolagem - Ciclo 7s] Rolando página e movendo cursor até "${target.label}"...`);

    // Locate DOM element to lock onto real-time scrolling position
    let targetElement: HTMLElement | null = null;
    if (target.selector) {
      try {
        targetElement = document.querySelector(target.selector) as HTMLElement | null;
      } catch {
        // ignore selector error
      }
    }

    // 1. Trigger Smooth Vertical Page Scroll to bring option into comfortable view
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const isOutOfComfortZone = rect.top < 140 || rect.bottom > (window.innerHeight - 140);
      if (isOutOfComfortZone) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    } else {
      // Target based on document height
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 100) {
        if (target.yPercent > 50) {
          const desiredScroll = Math.min(maxScroll, (target.yPercent / 100) * document.documentElement.scrollHeight - (window.innerHeight * 0.4));
          window.scrollTo({
            top: Math.max(0, desiredScroll),
            behavior: 'smooth'
          });
        } else if (target.yPercent < 30 && window.scrollY > 150) {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }
    }

    // Movement duration: 2400ms for ample visual tracking across screen and vertical scroll
    const durationMs = pace === 'cadencia_5s' ? 1800 : pace === 'cadencia_10s' ? 3200 : 2400;
    const startX = cursorPos.x;
    const startY = cursorPos.y;
    const startTime = performance.now();

    // Human non-linear curved path with live scroll tracking
    const animate = (now: number) => {
      if (isStoppedRef.current) {
        setIsMoving(false);
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      // Smooth Quintic Ease-In-Out
      const ease = progress < 0.5 
        ? 16 * progress * progress * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 5) / 2;

      // Get updated real-time target coordinates if element moved due to smooth scroll
      let currentTargetX = target.xPercent;
      let currentTargetY = target.yPercent;

      if (targetElement) {
        const liveRect = targetElement.getBoundingClientRect();
        currentTargetX = Math.max(5, Math.min(95, ((liveRect.left + liveRect.width / 2) / window.innerWidth) * 100));
        currentTargetY = Math.max(5, Math.min(95, ((liveRect.top + liveRect.height / 2) / window.innerHeight) * 100));
      }

      const dx = currentTargetX - startX;
      const dy = currentTargetY - startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const arcAmplitude = Math.min(8, Math.max(3, distance * 0.08));
      const arcSign = (dx * dy >= 0) ? 1 : -1;
      const arcOffset = Math.sin(progress * Math.PI) * arcAmplitude * arcSign;

      setCursorPos({
        x: Math.max(2, Math.min(98, startX + (currentTargetX - startX) * ease + arcOffset)),
        y: Math.max(4, Math.min(96, startY + (currentTargetY - startY) * ease - (arcOffset * 0.6)))
      });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Final position lock
        if (targetElement) {
          const finalRect = targetElement.getBoundingClientRect();
          const finalX = Math.max(5, Math.min(95, ((finalRect.left + finalRect.width / 2) / window.innerWidth) * 100));
          const finalY = Math.max(5, Math.min(95, ((finalRect.top + finalRect.height / 2) / window.innerHeight) * 100));
          setCursorPos({ x: finalX, y: finalY });
        } else {
          setCursorPos({ x: currentTargetX, y: currentTargetY });
        }
        setIsMoving(false);
        setLastActionStatus('HOVERING');
        setCurrentThought(`[Foco & Hesitação Humana] Página posicionada e cursor sobre "${target.label}". Aguardando tempo de reação humana...`);
        onArrived();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [cursorPos, pace]);

  // Complete 7-Second Human Action Pipeline:
  // [0.0s - 2.4s: Deslocamento Amplo] -> [2.4s - 4.3s: Hover & Leitura] -> [4.3s: 1 Clique Único] -> [4.4s - 7.0s: Inspeção e Pausa]
  const dispatchHumanAction = useCallback((target: AutoClickTarget) => {
    if (isStoppedRef.current || isActionInProgressRef.current) return;
    isActionInProgressRef.current = true;

    setTargetPos({ x: target.xPercent, y: target.yPercent });
    setActiveTargetLabel(target.label);
    setActiveTargetSelector(target.selector);
    setCountdownSec(7.0);

    // 1. Deslocamento amplo pela tela (2400ms)
    moveCursorToTargetNaturally(target, () => {
      if (isStoppedRef.current) {
        isActionInProgressRef.current = false;
        return;
      }

      // 2. Pausa deliberada de observação/hesitação humana (1900ms)
      const hoverDuration = pace === 'cadencia_5s' ? 1400 : pace === 'cadencia_10s' ? 2600 : 1900;
      registerTimeout(() => {
        if (isStoppedRef.current) {
          isActionInProgressRef.current = false;
          return;
        }

        // 3. Execução de exatamente 1 clique
        setCurrentThought(`[Ação Física: 1 Clique] Clicando deliberadamente em "${target.label}".`);
        executeHumanClickOnDom(target.xPercent, target.yPercent, target.selector, target.label);

        // 4. Pausa de inspeção do resultado (2580ms) até completar o ciclo de 7 segundos
        const postClickWait = pace === 'cadencia_5s' ? 1680 : pace === 'cadencia_10s' ? 4080 : 2580;
        registerTimeout(() => {
          isActionInProgressRef.current = false;
          if (!isStoppedRef.current) {
            setLastActionStatus('IDLE');
            setCurrentThought(`[Ciclo 7s Concluído] 1 clique executado com sucesso em "${target.label}". Iniciando próximo deslocamento.`);
          }
        }, postClickWait);
      }, hoverDuration);
    });
  }, [executeHumanClickOnDom, moveCursorToTargetNaturally, pace]);

  // Live countdown timer for the 7-second cadence (ticks every 100ms)
  useEffect(() => {
    if (!isSystemActive || isStoppedRef.current) {
      setCountdownSec(7.0);
      onCountdownTick?.(7.0);
      return;
    }
    const timer = setInterval(() => {
      setCountdownSec(prev => {
        const nextVal = prev <= 0.1 ? 7.0 : Math.max(0, +(prev - 0.1).toFixed(1));
        onCountdownTick?.(nextVal);
        return nextVal;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [isSystemActive, onCountdownTick]);

  // Autonomous 7-Second Exploration Loop
  // If active and no external target is actively dictating, cycle through wide-screen targets every 7 seconds
  useEffect(() => {
    let loopTimer: NodeJS.Timeout;
    if (isSystemActive && !isStoppedRef.current) {
      // Execute first target immediately if standing still
      if (!isActionInProgressRef.current) {
        const nextTarget = BROAD_FULLSCREEN_TARGETS[internalCycleIndexRef.current % BROAD_FULLSCREEN_TARGETS.length];
        internalCycleIndexRef.current++;
        dispatchHumanAction(nextTarget);
      }

      const cycleInterval = pace === 'cadencia_5s' ? 5000 : pace === 'cadencia_10s' ? 10000 : 7000;
      loopTimer = setInterval(() => {
        if (isStoppedRef.current || isActionInProgressRef.current) return;
        const nextTarget = BROAD_FULLSCREEN_TARGETS[internalCycleIndexRef.current % BROAD_FULLSCREEN_TARGETS.length];
        internalCycleIndexRef.current++;
        dispatchHumanAction(nextTarget);
      }, cycleInterval);
    }
    return () => clearInterval(loopTimer);
  }, [isSystemActive, pace, dispatchHumanAction]);

  // Handle external target dispatch (from Gemini Vision or App.tsx) respecting the 7-second rule
  useEffect(() => {
    if (externalTarget && isSystemActive && !isStoppedRef.current && !isActionInProgressRef.current) {
      dispatchHumanAction(externalTarget);
    }
  }, [externalTarget, isSystemActive, dispatchHumanAction]);

  // User starts auto-clicker
  const handleStartAutoClicker = useCallback(() => {
    isStoppedRef.current = false;
    isActionInProgressRef.current = false;
    setIsSystemActive(true);
    setLastActionStatus('IDLE');
    setCountdownSec(7.0);
    setCurrentThought('Controle de Operação Ativado! Deslocamento amplo pela tela com 1 clique a cada 7 segundos.');
    if (onActiveChange) {
      onActiveChange(true);
    }
  }, [onActiveChange]);

  // Sync with external isActive prop if provided
  useEffect(() => {
    if (isActive !== undefined) {
      if (isActive && !isSystemActive && isStoppedRef.current) {
        handleStartAutoClicker();
      } else if (!isActive && isSystemActive) {
        stopAllImmediately();
      }
    }
  }, [isActive, isSystemActive, handleStartAutoClicker, stopAllImmediately]);

  return (
    <>
      {/* 1. VISIBLE HUMAN-LIKE CURSOR OVERLAY */}
      <div 
        className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="absolute transition-transform will-change-transform"
          style={{
            left: `${cursorPos.x}%`,
            top: `${cursorPos.y}%`,
            transform: `translate(-50%, -50%) scale(${isClickingVisual ? 0.85 : 1.0})`,
            transition: 'transform 0.08s ease-out'
          }}
        >
          {/* Subtle Ripple on Click */}
          {isClickingVisual && (
            <div className="absolute -inset-8 rounded-full border-2 border-emerald-400 bg-emerald-400/20 animate-ping opacity-80" />
          )}

          {/* Precision Reticle with Status Colors */}
          <div className="relative flex items-center justify-center">
            {/* Outer Ring */}
            <div className={`w-10 h-10 rounded-full border-2 ${
              isClickingVisual 
                ? 'border-emerald-400 bg-emerald-500/30' 
                : isMoving 
                  ? 'border-cyan-400 border-dashed animate-spin-slow' 
                  : isSystemActive 
                    ? 'border-amber-400' 
                    : 'border-slate-500'
            } flex items-center justify-center backdrop-blur-xs shadow-xl`}>
              <div className={`w-2 h-2 rounded-full ${
                isClickingVisual ? 'bg-emerald-300' : isSystemActive ? 'bg-amber-400' : 'bg-slate-400'
              }`} />
            </div>

            {/* Mouse Pointer Arrow */}
            <div className="absolute -top-2 -left-2 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              <MousePointer2 className={`w-6 h-6 ${
                isClickingVisual 
                  ? 'text-emerald-300 fill-emerald-400' 
                  : isSystemActive 
                    ? 'text-amber-300 fill-amber-500/50' 
                    : 'text-slate-300 fill-slate-700/50'
              }`} />
            </div>

            {/* Target Label & Status Tooltip */}
            <div className="absolute left-8 top-0 whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-950/95 border border-cyan-500/40 text-[10px] font-mono text-cyan-200 shadow-2xl flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                isClickingVisual ? 'bg-emerald-400 animate-ping' : isMoving ? 'bg-cyan-400' : 'bg-amber-400'
              }`} />
              <span className="text-white font-bold max-w-[160px] truncate">{activeTargetLabel}</span>
              <span className="text-slate-400 text-[9px]">({cursorPos.x.toFixed(0)}%, {cursorPos.y.toFixed(0)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FORMAL CONTROLLER HUD (Immediate Stop Guarantee) */}
      <div 
        id="autonomous-clicker-hud"
        className="fixed bottom-20 sm:bottom-6 right-2 sm:right-6 z-[9990] max-w-[calc(100vw-16px)] sm:max-w-md w-full bg-slate-950/95 border-2 border-cyan-500/50 rounded-2xl shadow-2xl backdrop-blur-xl text-white font-sans"
      >
        {/* Header Bar */}
        <div className="p-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-t-2xl border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-xl ${isSystemActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'} flex items-center justify-center font-black shadow-md`}>
              <MousePointer2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wide text-white uppercase">
                  Braço Extensão Pensante do Salomão
                </span>
                <span className={`px-2 py-0.2 rounded-full text-[9px] font-mono font-bold border ${
                  isSystemActive 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 animate-pulse' 
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}>
                  {isSystemActive ? 'OPERANDO (1 TOQUE / 7s)' : 'PARADO'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                <span>{totalClicks} toques na tela executados</span>
                <span className="text-cyan-400 font-bold">• 1 toque a cada 7s</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-lg border text-xs ${soundEnabled ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
              title="Alternar áudio de clique"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setIsHudCollapsed(!isHudCollapsed)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
            >
              {isHudCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Body Content */}
        {!isHudCollapsed && (
          <div className="p-3.5 space-y-3 text-xs max-h-[65vh] overflow-y-auto">
            {/* 7-Second Cadence Progress Bar & Live Countdown */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isSystemActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                  Ritmo: 1 Clique a cada 7 segundos
                </span>
                <span className="text-cyan-300 font-black">
                  {isSystemActive ? `Próximo clique em: ${countdownSec.toFixed(1)}s` : 'Aguardando Início'}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 transition-all duration-100 ease-linear rounded-full"
                  style={{
                    width: isSystemActive ? `${Math.min(100, Math.max(0, ((7.0 - countdownSec) / 7.0) * 100))}%` : '0%'
                  }}
                />
              </div>
            </div>

            {/* Thought Box */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-200 leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Estado da Operação (7s):</span>
                <span>{currentThought}</span>
              </div>
            </div>

            {/* Pace Selector */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Cadência Obrigatória de Cliques:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                {[
                  { id: 'cadencia_7s', label: 'Padrão 7s', desc: '1 clique / 7 segundos' },
                  { id: 'cadencia_5s', label: 'Ágil 5s', desc: '1 clique / 5 segundos' },
                  { id: 'cadencia_10s', label: 'Estendido 10s', desc: '1 clique / 10 segundos' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPace(p.id as AutoClickerPace)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      pace === p.id 
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-black shadow-md' 
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <div className="leading-tight">{p.label}</div>
                    <div className="text-[9px] opacity-75 font-normal">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Broad Full-Screen Targets for Testing */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Alvos com Amplo Deslocamento pela Tela:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Playground Areia 6-DOF', xPercent: 68, yPercent: 22, selector: '#tab-sand-playground-btn' },
                  { label: 'Direita-Extrema (Painel)', xPercent: 88, yPercent: 22, selector: '#tab-intellectual-vault-btn' },
                  { label: 'Centro-Direito (Chrome)', xPercent: 76, yPercent: 44, selector: '#btn-chrome-search-and-scrape' },
                  { label: 'Inferior-Direito (Binance)', xPercent: 82, yPercent: 68, selector: '#btn-binance-buy-long' }
                ].map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      isStoppedRef.current = false;
                      setIsSystemActive(true);
                      dispatchHumanAction({
                        id: `TEST-${idx}`,
                        label: t.label,
                        xPercent: t.xPercent,
                        yPercent: t.yPercent,
                        selector: t.selector
                      });
                    }}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-[10px] text-slate-300 flex items-center justify-between"
                  >
                    <span className="truncate">{t.label}</span>
                    <Target className="w-3 h-3 text-cyan-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS (Start & Guaranteed Emergency Stop) */}
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
              {/* START BUTTON */}
              {!isSystemActive ? (
                <button
                  id="btn-start-human-clicker"
                  onClick={handleStartAutoClicker}
                  className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>INICIAR CONTROLE DE OPERAÇÃO (1 CLIQUE / 7s)</span>
                </button>
              ) : (
                /* ABSOLUTE EMERGENCY STOP BUTTON */
                <button
                  id="btn-stop-human-clicker-guaranteed"
                  onClick={stopAllImmediately}
                  className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 active:scale-95 transition-all animate-pulse"
                >
                  <StopCircle className="w-5 h-5 fill-current" />
                  <span>PARAR IMEDIATAMENTE (CANCELAR TUDO)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
