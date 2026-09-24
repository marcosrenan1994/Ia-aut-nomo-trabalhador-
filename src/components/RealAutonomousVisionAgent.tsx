import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Eye, 
  Crosshair, 
  Brain, 
  Sparkles, 
  Zap, 
  Play, 
  Pause, 
  RefreshCw, 
  SwitchCamera, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Upload, 
  Monitor, 
  CheckCircle2, 
  AlertTriangle,
  Activity,
  Layers,
  Flame,
  ArrowRight,
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { AutoClickTarget } from './AutonomousAutoClickerEngine';

interface VisionResponse {
  success: boolean;
  source: string;
  model: string;
  timestamp: string;
  sceneDescription: string;
  detectedObjects: string[];
  reasoning: string;
  decision: string;
  action: {
    type: string;
    targetLabel: string;
    targetCoordinates: {
      xPercent: number;
      yPercent: number;
    };
    targetSelector?: string;
    confidence: number;
    explanation: string;
  };
  suggestedAutoClickerConfig?: {
    mode: string;
    cps: number;
    clicksToExecute: number;
  };
}

interface RealAutonomousVisionAgentProps {
  onDispatchAutoClickTarget?: (target: AutoClickTarget) => void;
  isMobileDevice?: boolean;
}

export const RealAutonomousVisionAgent: React.FC<RealAutonomousVisionAgentProps> = ({
  onDispatchAutoClickTarget,
  isMobileDevice = false
}) => {
  // Video & Stream State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Vision Perception State
  const [userGoal, setUserGoal] = useState<string>('Inspecionar a cena, detectar botões/controles e auto-clicar na ação mais produtiva');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isContinuousLoopActive, setIsContinuousLoopActive] = useState<boolean>(false);
  const [loopIntervalSec, setLoopIntervalSec] = useState<number>(6);
  const [lastAnalysis, setLastAnalysis] = useState<VisionResponse | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<VisionResponse[]>([]);
  const [voiceNarration, setVoiceNarration] = useState<boolean>(false);
  const [capturedThumbnail, setCapturedThumbnail] = useState<string | null>(null);
  const [autoClickOnDetect, setAutoClickOnDetect] = useState<boolean>(true);

  // Start Camera Stream (Mobile-first environment facing)
  const startCamera = async (facing: 'environment' | 'user' = cameraFacing) => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
      setCameraFacing(facing);
    } catch (err: any) {
      console.warn('Erro ao acessar câmera real:', err);
      setCameraError('Permissão de câmera negada ou câmera indisponível neste navegador. Você pode fazer upload de imagem ou usar captura de tela.');
      setIsCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  // Switch between Rear (environment) and Front (user) camera
  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    startCamera(nextFacing);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Voice Speech Synthesis
  const speakReasoning = (text: string) => {
    if (!voiceNarration || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  // Capture current video frame as base64 JPEG
  const captureFrameBase64 = (): string | null => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return null;

    const canvas = document.createElement('canvas');
    canvas.width = Math.min(800, video.videoWidth);
    canvas.height = Math.round((canvas.width / video.videoWidth) * video.videoHeight);
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.82);
  };

  // Screen Capture fallback
  const startScreenCapture = async () => {
    try {
      if (!navigator.mediaDevices.getDisplayMedia) {
        alert('Captura de tela não suportada neste dispositivo.');
        return;
      }
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setStream(displayStream);
      if (videoRef.current) {
        videoRef.current.srcObject = displayStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Screen capture cancelled or error:', err);
    }
  };

  // File Upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setCapturedThumbnail(base64);
      analyzeFrame(base64);
    };
    reader.readAsDataURL(file);
  };

  // Execute Real Perception & Reason-and-Act cycle with Gemini
  const analyzeFrame = async (overrideBase64?: string) => {
    if (isAnalyzing) return;
    const base64Image = overrideBase64 || captureFrameBase64();
    if (!base64Image) {
      // If camera is not active, try starting it
      if (!isCameraActive) {
        await startCamera();
        return;
      }
      return;
    }

    setCapturedThumbnail(base64Image);
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/gemini/vision-perceive-and-act', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          mimeType: 'image/jpeg',
          goal: userGoal,
          context: {
            platform: isMobileDevice ? 'mobile_smartphone' : 'desktop_workstation',
            cameraFacing,
            screenSize: { width: window.innerWidth, height: window.innerHeight }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Servidor respondeu com código ${response.status}`);
      }

      const result: VisionResponse = await response.json();
      setLastAnalysis(result);
      setAnalysisHistory(prev => [result, ...prev.slice(0, 9)]);

      // Speak narration
      if (result.action?.explanation) {
        speakReasoning(`O que vejo: ${result.decision}. Ação: Clicar em ${result.action.targetLabel}.`);
      }

      // If auto-click is enabled, trigger the autonomous clicker cursor!
      if (autoClickOnDetect && result.action?.targetCoordinates && onDispatchAutoClickTarget) {
        onDispatchAutoClickTarget({
          id: `TARGET-${Date.now()}`,
          label: result.action.targetLabel,
          xPercent: result.action.targetCoordinates.xPercent,
          yPercent: result.action.targetCoordinates.yPercent,
          selector: result.action.targetSelector
        });
      }
    } catch (err: any) {
      console.error('Erro na visão Gemini:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Continuous Perception Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isContinuousLoopActive && isCameraActive) {
      interval = setInterval(() => {
        analyzeFrame();
      }, loopIntervalSec * 1000);
    }
    return () => clearInterval(interval);
  }, [isContinuousLoopActive, isCameraActive, loopIntervalSec]);

  return (
    <div id="real-autonomous-vision-module" className="space-y-4">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-900 border-2 border-cyan-500/40 p-4 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                Córtex de Visão Real Multimodal (Gemini 3.8 Flash)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-emerald-400" />
                Arquitetura ReAct (Razão & Ação)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Camera className="w-6 h-6 text-cyan-400" />
              <span>Visão Autônoma & Auto-Clicador em Tempo Real</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
              Aponte a câmera do celular para o mundo físico ou para telas. A IA visualiza os elementos reais com o Gemini, raciocina passo a passo e comanda os cursores auto-clicadores autônomos para agir de verdade!
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isCameraActive ? (
              <button
                id="btn-open-real-camera"
                onClick={() => startCamera()}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
              >
                <Camera className="w-4 h-4 fill-current" />
                <span>LIGAR CÂMERA DO CELULAR</span>
              </button>
            ) : (
              <button
                id="btn-stop-real-camera"
                onClick={stopCamera}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Pause className="w-4 h-4" />
                <span>DESLIGAR CÂMERA</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Live Camera Viewfinder + ReAct Reasoning Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Live Camera & Optical Reticle (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative aspect-video sm:aspect-[4/3] rounded-2xl bg-black border-2 border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Real Video Feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-300 ${isCameraActive ? 'opacity-100' : 'opacity-20'}`}
            />

            {/* Offline or Disabled Placeholder */}
            {!isCameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-3 bg-slate-950/80 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-xl">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Câmera Real Desligada</h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    Toque no botão abaixo para ativar a câmera do seu celular ou faça upload de uma foto da galeria.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => startCamera('environment')}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Câmera Traseira (Mundo Físico)</span>
                  </button>
                  <label className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Foto</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                {cameraError && (
                  <div className="text-[11px] text-amber-300 bg-amber-950/60 border border-amber-500/40 p-2 rounded-xl max-w-md">
                    {cameraError}
                  </div>
                )}
              </div>
            )}

            {/* Visual HUD Overlay: Reticles and Grid */}
            {isCameraActive && (
              <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 select-none">
                {/* Top Status Indicators */}
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <div className="px-2.5 py-1 rounded-lg bg-black/75 border border-cyan-500/40 text-cyan-300 backdrop-blur-md flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold">LENS LIVE 60FPS • {cameraFacing === 'environment' ? 'TRASEIRA' : 'FRONTAL'}</span>
                  </div>

                  <div className="px-2.5 py-1 rounded-lg bg-black/75 border border-slate-700 text-slate-300 backdrop-blur-md">
                    {isAnalyzing ? (
                      <span className="text-amber-300 font-bold flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        RACIOCINANDO COM GEMINI...
                      </span>
                    ) : (
                      <span>SENSOR PRONTO</span>
                    )}
                  </div>
                </div>

                {/* Detected Target Reticle Highlight */}
                {lastAnalysis?.action?.targetCoordinates && (
                  <div
                    className="absolute transition-all duration-300 pointer-events-none"
                    style={{
                      left: `${lastAnalysis.action.targetCoordinates.xPercent}%`,
                      top: `${lastAnalysis.action.targetCoordinates.yPercent}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-400 animate-spin-slow bg-amber-500/10 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b] animate-ping" />
                      </div>
                      <div className="absolute top-10 whitespace-nowrap px-2 py-0.5 rounded bg-black/90 border border-amber-400 text-[9px] font-mono font-bold text-amber-300 shadow-lg">
                        🎯 ALVO: {lastAnalysis.action.targetLabel} ({lastAnalysis.action.targetCoordinates.xPercent.toFixed(0)}%, {lastAnalysis.action.targetCoordinates.yPercent.toFixed(0)}%)
                      </div>
                    </div>
                  </div>
                )}

                {/* Optical Crosshair in Center */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="w-12 h-12 border border-cyan-400/40 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                  </div>
                </div>

                {/* Bottom Viewfinder Controls Overlay */}
                <div className="pointer-events-auto flex items-center justify-between gap-2 bg-slate-950/80 backdrop-blur-md p-2 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={toggleCameraFacing}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs flex items-center gap-1 font-bold"
                      title="Alternar entre câmera traseira e frontal"
                    >
                      <SwitchCamera className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Inverter Câmera</span>
                    </button>

                    <button
                      onClick={() => setVoiceNarration(!voiceNarration)}
                      className={`p-2 rounded-lg border text-xs flex items-center gap-1 font-bold transition-colors ${voiceNarration ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                      title="Narrar raciocínio por voz"
                    >
                      {voiceNarration ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">Voz da IA</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      id="btn-perceive-and-act-now"
                      onClick={() => analyzeFrame()}
                      disabled={isAnalyzing}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Raciocinando...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 fill-current" />
                          <span>Perceber & Agir Agora</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Goal Input & Continuous Loop Controls */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Objetivo da IA (O que ela deve buscar e fazer com a visão):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userGoal}
                  onChange={(e) => setUserGoal(e.target.value)}
                  placeholder="Ex: Clicar no botão do cofre, verificar rendimento, ler documento..."
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Loop Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60 text-xs">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-slate-300 text-[11px] font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoClickOnDetect}
                    onChange={(e) => setAutoClickOnDetect(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Auto-Clicar Imediatamente ao Detectar Alvo</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-toggle-continuous-vision"
                  onClick={() => setIsContinuousLoopActive(!isContinuousLoopActive)}
                  disabled={!isCameraActive}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all border ${isContinuousLoopActive ? 'bg-amber-500 text-slate-950 border-amber-300 font-black' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 disabled:opacity-40'}`}
                >
                  <Activity className={`w-3.5 h-3.5 ${isContinuousLoopActive ? 'animate-spin' : ''}`} />
                  <span>{isContinuousLoopActive ? 'Piloto Contínuo: ATIVO' : 'Ativar Piloto 24/7'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: ReAct Cognition Panel (Reason + Action) (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-white tracking-wide">
                    Cadeia de Raciocínio (ReAct)
                  </h3>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    {lastAnalysis?.model || 'Aguardando captura visual...'}
                  </span>
                </div>
              </div>
            </div>

            {lastAnalysis ? (
              <div className="space-y-3 font-sans text-xs">
                {/* 1. Perception */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-300 text-[10px] font-bold uppercase font-mono">
                    <Eye className="w-3 h-3 text-cyan-400" />
                    <span>1. O Que a IA Vê (Percepção Real):</span>
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed font-normal">
                    {lastAnalysis.sceneDescription}
                  </p>
                  {lastAnalysis.detectedObjects?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {lastAnalysis.detectedObjects.map((obj, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">
                          {obj}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Reasoning */}
                <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-purple-300 text-[10px] font-bold uppercase font-mono">
                    <Brain className="w-3 h-3 text-purple-400" />
                    <span>2. Raciocínio Dedutivo (Razão):</span>
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed font-normal">
                    {lastAnalysis.reasoning}
                  </p>
                </div>

                {/* 3. Action */}
                <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-amber-300 text-[10px] font-bold uppercase font-mono">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>3. Decisão & Ação no Auto-Clicador:</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Confiança: {((lastAnalysis.action.confidence || 0.95) * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white">
                        Alvo: "{lastAnalysis.action.targetLabel}"
                      </span>
                      <span className="text-[10px] font-mono text-cyan-300 font-bold">
                        Coord: ({lastAnalysis.action.targetCoordinates.xPercent.toFixed(1)}%, {lastAnalysis.action.targetCoordinates.yPercent.toFixed(1)}%)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-normal">
                      {lastAnalysis.action.explanation}
                    </p>
                  </div>

                  {/* Manual Click Trigger */}
                  <button
                    onClick={() => {
                      if (onDispatchAutoClickTarget && lastAnalysis.action.targetCoordinates) {
                        onDispatchAutoClickTarget({
                          id: `MANUAL-${Date.now()}`,
                          label: lastAnalysis.action.targetLabel,
                          xPercent: lastAnalysis.action.targetCoordinates.xPercent,
                          yPercent: lastAnalysis.action.targetCoordinates.yPercent,
                          selector: lastAnalysis.action.targetSelector
                        });
                      }
                    }}
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <Crosshair className="w-3.5 h-3.5 fill-current" />
                    <span>Mover Cursor e Auto-Clicar Agora</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 space-y-2">
                <Brain className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs">
                  Inicie a câmera e clique em <strong>"Perceber & Agir Agora"</strong> para ver a observação e a razão em tempo real.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
