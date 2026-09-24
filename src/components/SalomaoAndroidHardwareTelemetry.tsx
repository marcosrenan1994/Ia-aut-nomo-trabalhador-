import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Camera, 
  MapPin, 
  Battery, 
  BatteryCharging, 
  HardDrive, 
  Cpu, 
  ShieldCheck, 
  AlertCircle, 
  FileCode, 
  Copy, 
  Check, 
  Eye, 
  Activity, 
  Smartphone, 
  Layers, 
  RefreshCw, 
  Volume2, 
  Sliders, 
  Wifi, 
  Radio
} from 'lucide-react';

export interface MobileVisualizationRecord {
  id: string;
  timestamp: string;
  screenTarget: string;
  appSource: string;
  visualizedData: string;
  salomaoCognitionSummary: string;
}

interface SalomaoAndroidHardwareTelemetryProps {
  onMicrophoneStateChange?: (isActive: boolean) => void;
  onVisualizedDataAdd?: (record: MobileVisualizationRecord) => void;
}

export const SalomaoAndroidHardwareTelemetry: React.FC<SalomaoAndroidHardwareTelemetryProps> = ({
  onMicrophoneStateChange,
  onVisualizedDataAdd
}) => {
  // Permission States
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isMicStreaming, setIsMicStreaming] = useState<boolean>(false);
  const [micAudioVolume, setMicAudioVolume] = useState<number>(0);
  const [micTranscription, setMicTranscription] = useState<string>('');

  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);

  // Hardware Telemetry States
  const [batteryStats, setBatteryStats] = useState<{ level: number; charging: boolean; chargingTime: number; dischargingTime: number }>({
    level: 92,
    charging: false,
    chargingTime: 0,
    dischargingTime: 14400
  });

  const [ramStats, setRamStats] = useState<{ deviceMemoryGb: number; heapUsedMb: number; heapTotalMb: number }>({
    deviceMemoryGb: 8,
    heapUsedMb: 68,
    heapTotalMb: 124
  });

  const [storageStats, setStorageStats] = useState<{ quotaGb: number; usageGb: number; percentUsed: number }>({
    quotaGb: 128,
    usageGb: 42.5,
    percentUsed: 33.2
  });

  // What Salomão visualized on the phone
  const [visualizedRecords, setVisualizedRecords] = useState<MobileVisualizationRecord[]>([
    {
      id: 'vis-1',
      timestamp: '13:05:12',
      screenTarget: 'Barra de Pesquisa Google',
      appSource: 'Google Chrome Mobile',
      visualizedData: 'Formulário de consulta: "robótica humanóide auto-suficiente"',
      salomaoCognitionSummary: 'Extraí as entidades conceituais para alimentar o banco de memória de longo prazo.'
    },
    {
      id: 'vis-2',
      timestamp: '13:04:45',
      screenTarget: 'Lista de Conversas & Status',
      appSource: 'WhatsApp Messenger',
      visualizedData: 'Notificações ativas de recrutamento da Agência do Trabalhador',
      salomaoCognitionSummary: 'Reconheci 2 mensagens prioritárias relacionadas à contratação de IA autônoma.'
    },
    {
      id: 'vis-3',
      timestamp: '13:04:10',
      screenTarget: 'Player de Vídeo & Miniaturas',
      appSource: 'YouTube Mobile',
      visualizedData: 'Quadro 1080p: braço robótico 6-DOF efetuando montagem mecânica',
      salomaoCognitionSummary: 'Mapeei a cinemática visual para reproduzir o padrão no playground de areia.'
    }
  ]);

  const [copiedManifest, setCopiedManifest] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'permissions' | 'telemetry' | 'visualizations' | 'manifest'>('permissions');

  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  // Read real hardware telemetry on mount (Battery, RAM, Storage)
  useEffect(() => {
    // 1. Battery Status API
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setBatteryStats({
            level: Math.round(battery.level * 100),
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
          });
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch(() => {
        // Fallback simulation
      });
    }

    // 2. Device Memory API & Performance Memory
    if ('deviceMemory' in navigator) {
      const ramGb = (navigator as any).deviceMemory || 8;
      const perfMem = (performance as any).memory;
      setRamStats({
        deviceMemoryGb: ramGb,
        heapUsedMb: perfMem ? Math.round(perfMem.usedJSHeapSize / (1024 * 1024)) : 74,
        heapTotalMb: perfMem ? Math.round(perfMem.totalJSHeapSize / (1024 * 1024)) : 138
      });
    }

    // 3. Storage API
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((estimate) => {
        const quotaGb = estimate.quota ? +(estimate.quota / (1024 * 1024 * 1024)).toFixed(1) : 128;
        const usageGb = estimate.usage ? +(estimate.usage / (1024 * 1024 * 1024)).toFixed(2) : 1.2;
        const percent = quotaGb > 0 ? +((usageGb / quotaGb) * 100).toFixed(1) : 1;
        setStorageStats({ quotaGb, usageGb, percentUsed: percent });
      }).catch(() => {});
    }
  }, []);

  // REAL MICROPHONE ACTIVATION: Captures real mic audio and runs real-time volume VU meter
  const handleToggleMicrophone = async () => {
    if (isMicStreaming) {
      // Stop mic
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(t => t.stop());
        micStreamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsMicStreaming(false);
      setMicAudioVolume(0);
      if (onMicrophoneStateChange) onMicrophoneStateChange(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setMicPermission('granted');
      setIsMicStreaming(true);
      if (onMicrophoneStateChange) onMicrophoneStateChange(true);

      // Web Audio API volume monitoring
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const buffer = new Uint8Array(analyser.frequencyBinCount);
      const checkVolume = () => {
        if (!analyserRef.current || !micStreamRef.current) return;
        analyserRef.current.getByteFrequencyData(buffer);
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) sum += buffer[i];
        const avg = sum / buffer.length;
        setMicAudioVolume(Math.min(100, Math.round((avg / 128) * 100)));
        requestAnimationFrame(checkVolume);
      };
      checkVolume();

      // Web Speech API for voice recognition if available in browser
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (event: any) => {
          let text = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          setMicTranscription(text);
        };
        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch (err) {
      console.warn('Microphone permission not granted or device unavailable:', err);
      setMicPermission('denied');
      setIsMicStreaming(false);
    }
  };

  // REAL CAMERA ACTIVATION: Requests webcam / front phone camera
  const handleToggleCamera = async () => {
    if (isCameraActive) {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(t => t.stop());
        cameraStreamRef.current = null;
      }
      setIsCameraActive(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      cameraStreamRef.current = stream;
      setCameraPermission('granted');
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera permission denied or device unavailable:', err);
      setCameraPermission('denied');
      setIsCameraActive(false);
    }
  };

  // REAL GEOLOCATION: Requests GPS coords from device
  const handleRequestLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationPermission('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationPermission('granted');
        setLocationCoords({
          lat: +pos.coords.latitude.toFixed(5),
          lng: +pos.coords.longitude.toFixed(5),
          accuracy: Math.round(pos.coords.accuracy)
        });
      },
      () => {
        setLocationPermission('denied');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Copy AndroidManifest.xml to clipboard
  const androidManifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="ai.salomao.autonomous.orchestrator">

    <!-- PERMISSÕES DE HARDWARE E SENSORES DO CELULAR -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.BATTERY_STATS" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- CURSOR FLUTUANTE E SERVIÇO DE ACESSIBILIDADE VITALÍCIO -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.BIND_ACCESSIBILITY_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_salomao_launcher"
        android:label="Salomão"
        android:roundIcon="@mipmap/ic_salomao_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Salomao.Dark">

        <!-- SERVIÇO DE ACESSIBILIDADE QUE PERMITE AO CURSOR CLICAR NO CELULAR -->
        <service
            android:name=".SalomaoAccessibilityService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/salomao_accessibility_config" />
        </service>
    </application>
</manifest>`;

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(androidManifestXml);
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2000);
  };

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-600/30">
            <Smartphone className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                Permissões Android & Telemetria de Hardware
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                ACESSO TOTAL AO CELULAR
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Microfone, Câmera, GPS, Bateria, RAM, Armazenamento e Registro de Visualizações do Salomão.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'permissions' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Permissões
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'telemetry' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Telemetria Hardware
          </button>
          <button
            onClick={() => setActiveTab('visualizations')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'visualizations' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Visualizações ({visualizedRecords.length})
          </button>
          <button
            onClick={() => setActiveTab('manifest')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'manifest' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            AndroidManifest.xml
          </button>
        </div>
      </div>

      {/* 1. PERMISSIONS TAB */}
      {activeTab === 'permissions' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Microphone Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isMicStreaming ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Mic className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white">Microfone do Celular</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                isMicStreaming ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
              }`}>
                {isMicStreaming ? 'GRAVANDO' : micPermission.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-snug">
              Permite que Salomão ouça sua voz diretamente pelo microfone do aparelho com visualizador de frequência.
            </p>

            {/* Live Volume VU Meter */}
            {isMicStreaming && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Volume da Voz:</span>
                  <span className="text-emerald-400 font-bold">{micAudioVolume}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-75"
                    style={{ width: `${micAudioVolume}%` }}
                  />
                </div>
                {micTranscription && (
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-cyan-300 font-mono italic">
                    "{micTranscription}"
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleToggleMicrophone}
              className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                isMicStreaming
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isMicStreaming ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isMicStreaming ? 'Desativar Microfone' : 'Ativar Microfone Real'}</span>
            </button>
          </div>

          {/* Camera Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isCameraActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Camera className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white">Câmera do Celular</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                isCameraActive ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-slate-800 text-slate-400'
              }`}>
                {isCameraActive ? 'ATIVA' : cameraPermission.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-snug">
              Alimenta os modelos de visão multimodal Gemini para inspeção do ambiente e leitura de telas.
            </p>

            {isCameraActive && (
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              </div>
            )}

            <button
              onClick={handleToggleCamera}
              className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                isCameraActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isCameraActive ? 'Parar Câmera' : 'Ativar Câmera Real'}</span>
            </button>
          </div>

          {/* Geolocation Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white">Localização (GPS)</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                locationCoords ? 'bg-purple-950 text-purple-400 border border-purple-800' : 'bg-slate-800 text-slate-400'
              }`}>
                {locationCoords ? 'GPS ATIVO' : locationPermission.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-snug">
              Localização para rotinas autônomas de logística, entregas e contextualização física.
            </p>

            {locationCoords ? (
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[10px] space-y-0.5 text-purple-300">
                <div>Lat: {locationCoords.lat}° | Lng: {locationCoords.lng}°</div>
                <div>Precisão: ±{locationCoords.accuracy} metros</div>
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-500">
                GPS aguardando concessão do usuário...
              </div>
            )}

            <button
              onClick={handleRequestLocation}
              className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Obter Localização Real</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. HARDWARE TELEMETRY TAB */}
      {activeTab === 'telemetry' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Battery Telemetry */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <BatteryCharging className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white">Bateria do Celular</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {batteryStats.level}%
              </span>
            </div>

            <div className="space-y-1">
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${batteryStats.level}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Estado: {batteryStats.charging ? 'Carregando' : 'Em uso'}</span>
                <span>Tempo Restante: ~{(batteryStats.dischargingTime / 3600).toFixed(1)}h</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              Salomão ajusta o ciclo de toques (7s) para economizar energia quando a bateria estiver abaixo de 20%.
            </div>
          </div>

          {/* Device RAM Telemetry */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white">Memória RAM</span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {ramStats.deviceMemoryGb} GB Total
              </span>
            </div>

            <div className="space-y-1">
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((ramStats.heapUsedMb / ramStats.heapTotalMb) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Heap JS: {ramStats.heapUsedMb} MB</span>
                <span>Alocado: {ramStats.heapTotalMb} MB</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              Mecanismo neural opera com garbage collection contínuo para nunca engasgar o celular.
            </div>
          </div>

          {/* Storage Telemetry */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <HardDrive className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white">Armazenamento</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">
                {storageStats.quotaGb} GB Quota
              </span>
            </div>

            <div className="space-y-1">
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${storageStats.percentUsed}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Ocupado: {storageStats.usageGb} GB</span>
                <span>Livre: {(storageStats.quotaGb - storageStats.usageGb).toFixed(1)} GB</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              Apps mentais gerados por Salomão são salvos em cache indexado persistente de alta velocidade.
            </div>
          </div>
        </div>
      )}

      {/* 3. VISUALIZATIONS TAB: WHAT SALOMÃO OBSERVED ON PHONE */}
      {activeTab === 'visualizations' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold">
              Telas, Campos e Conteúdos Visualizados por Salomão no Celular:
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              Acessibilidade Ativa
            </span>
          </div>

          <div className="space-y-2">
            {visualizedRecords.map(record => (
              <div key={record.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 space-y-1.5 transition-all">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">{record.screenTarget}</span>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.2 rounded border border-purple-800">
                      {record.appSource}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{record.timestamp}</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300">
                  <strong className="text-cyan-300 font-mono text-[11px]">Dados Inspecionados:</strong> {record.visualizedData}
                </div>

                <p className="text-[11px] text-amber-300/90 italic">
                  🧠 <strong>Raciocínio de Salomão:</strong> "{record.salomaoCognitionSummary}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ANDROID MANIFEST TAB */}
      {activeTab === 'manifest' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white">AndroidManifest.xml para Compilação Android</h4>
              <p className="text-[11px] text-slate-400">Contém todas as permissões exigidas pelo Google Android para uso de hardware e sobreposição de tela.</p>
            </div>

            <button
              onClick={handleCopyManifest}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              {copiedManifest ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedManifest ? 'Copiado!' : 'Copiar XML'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/90 border border-slate-800 overflow-x-auto max-h-[260px] scrollbar-thin">
            <pre className="text-[10px] font-mono text-emerald-400 whitespace-pre leading-relaxed">
              {androidManifestXml}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
