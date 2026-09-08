import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Cpu, 
  Activity, 
  Radio, 
  Video, 
  Mic, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Pause, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  HardDrive,
  Flame,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MeetingRoomAgent, AutonomousThought, MemoryVectorRecord } from '../types';
import { INITIAL_MEETING_AGENTS } from '../data/meetingRoomData';

interface Props {
  onAddThought?: (thought: AutonomousThought) => void;
  onAddMemoryRecord?: (record: MemoryVectorRecord) => void;
}

export const QuantumAutonomousMeetingRoom: React.FC<Props> = ({
  onAddThought,
  onAddMemoryRecord
}) => {
  const [agents, setAgents] = useState<MeetingRoomAgent[]>(INITIAL_MEETING_AGENTS);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [autoAddQuantumAgents, setAutoAddQuantumAgents] = useState<boolean>(true);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-structural-eng');
  const [filterDomain, setFilterDomain] = useState<string>('ALL');
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({
    'agent-structural-eng': true,
    'agent-logistics-strat': false,
    'agent-material-sci': false,
    'agent-kinematics-dyn': false,
    'agent-thermal-analyst': false,
    'agent-bio-ergonomics': false,
  });

  // Autonomous addition of Quantum Speed professionals ("miriades de miriades adicionando autonomamente")
  useEffect(() => {
    if (!autoAddQuantumAgents || !isSimulating) return;

    const autoSpawnInterval = setInterval(() => {
      setAgents((prev) => {
        const nextCount = prev.length + 1;
        const specializations = [
          { name: 'Dr. Quântico - Cinemática SO(3)', role: 'Especialista em Tensor Rotacional', domain: 'Cinemática' },
          { name: 'Dra. Quântica - Síntese LCAO', role: 'Engenheira de Orbitais e Nanofabricação', domain: 'Materiais' },
          { name: 'Dr. Quântico - Logística Ultra-Rápida', role: 'Otimizador de Rotas Urbanas', domain: 'Logística' },
          { name: 'Dra. Quântica - Segurança & Ergonomia', role: 'Validadora de Interação Humana', domain: 'Ergonomia' },
          { name: 'Dr. Quântico - Termodinâmica a Laser', role: 'Físico Térmico de Precisão', domain: 'Termodinâmica' },
          { name: 'Dra. Quântica - Topologia Diferencial', role: 'Geômetra de Espaços Multidimensionais', domain: 'Geometria' },
          { name: 'Dr. Quântico - Malha Sináptica ER-2', role: 'Arquiteto de Redes Neurais Distribuídas', domain: 'Redes Neurais' },
          { name: 'Dra. Quântica - Conformidade Tátil', role: 'Controle de Impedância Mecânica', domain: 'Biomecânica' },
        ];
        const spec = specializations[prev.length % specializations.length];
        const newAgent: MeetingRoomAgent = {
          id: `agent-quantum-auto-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          name: `${spec.name} #${nextCount}`,
          role: spec.role,
          specialization: `${spec.domain} & Computação Quântica Recursiva`,
          avatarSeed: `QA-${nextCount}`,
          colorScheme: (['purple', 'cyan', 'emerald', 'amber', 'rose'] as const)[nextCount % 5],
          status: 'ACTIVE_REASONING',
          telemetry: {
            computeLoadPercent: Math.floor(52 + Math.random() * 42),
            memoryBandwidthGbps: Number((210 + Math.random() * 75).toFixed(1)),
            inferenceLatencyMs: Number((0.7 + Math.random() * 1.6).toFixed(1)),
            confidenceScore: Number((0.992 + Math.random() * 0.007).toFixed(4)),
            quantumCyclesSec: Math.floor(2800000 + Math.random() * 1400000),
          },
          activeTask: {
            title: `Otimização Quântica Autônoma (${spec.domain})`,
            description: `Interligação de nós multidimensionais com atuadores robóticos em velocidade quântica.`,
            progress: Math.floor(15 + Math.random() * 70),
            domain: spec.domain,
            priority: 'HIGH',
          },
          reasoningProcess: {
            hypothesis: `Nós em velocidade quântica estabilizam o sistema ER-2 sob regimes estocásticos.`,
            internalDebate: `Testando convergência numérica com números irracionais (π, e, φ, √2, √3, √5).`,
            deducedAction: `Distribuir computação quântica por malha densa autônoma sem limitações.`,
            consensusContribution: `Expansão da rede coletiva de cognição proporcional à miríade de nós.`,
          },
          synthesisBuffer: {
            audioBufferMs: 100,
            audioSampleRateKHz: 48,
            audioBitrateKbps: 320,
            audioWaveform: Array.from({ length: 8 }, () => Math.floor(30 + Math.random() * 60)),
            videoBufferFrames: 60,
            videoFps: 60,
            videoResolution: '3840x2160 (4K)',
            throughputMbSec: Number((22 + Math.random() * 12).toFixed(1)),
            synthesisStatus: 'STREAMING',
          },
          recentInsights: [
            `Instância #${nextCount} conectada à malha quântica sem restrições.`,
            `Otimização recursiva de ${spec.domain} sincronizada com atuadores ER-2.`
          ],
        };

        return [...prev, newAgent];
      });
    }, 5000);

    return () => clearInterval(autoSpawnInterval);
  }, [autoAddQuantumAgents, isSimulating]);

  // Real-time telemetry oscillation loop to reflect active internal reasoning
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setAgents((prevAgents) =>
        prevAgents.map((agent) => {
          const loadDelta = (Math.random() - 0.5) * 4;
          const latencyDelta = (Math.random() - 0.5) * 0.4;
          const newLoad = Math.min(99, Math.max(30, Number((agent.telemetry.computeLoadPercent + loadDelta).toFixed(1))));
          const newLatency = Math.min(10, Math.max(1.2, Number((agent.telemetry.inferenceLatencyMs + latencyDelta).toFixed(1))));
          
          // Randomly fluctuate waveform bars
          const updatedWaveform = agent.synthesisBuffer.audioWaveform.map((val) => {
            const delta = (Math.random() - 0.5) * 20;
            return Math.min(100, Math.max(15, Math.round(val + delta)));
          });

          return {
            ...agent,
            telemetry: {
              ...agent.telemetry,
              computeLoadPercent: newLoad,
              inferenceLatencyMs: newLatency,
              quantumCyclesSec: agent.telemetry.quantumCyclesSec + Math.floor(Math.random() * 5000),
            },
            synthesisBuffer: {
              ...agent.synthesisBuffer,
              audioWaveform: updatedWaveform,
              throughputMbSec: Number((agent.synthesisBuffer.throughputMbSec + (Math.random() - 0.5) * 3).toFixed(1)),
            },
          };
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Handle manual consensus sync trigger
  const handleTriggerConsensus = () => {
    setAgents((prev) =>
      prev.map((ag) => ({
        ...ag,
        status: 'COLLABORATING',
        activeTask: {
          ...ag.activeTask,
          progress: Math.min(100, ag.activeTask.progress + 5),
        },
      }))
    );

    if (onAddThought) {
      onAddThought({
        id: `MEETING-CONSENSUS-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        thought: `[Quantum Meeting Room] Sincronização coletiva realizada entre ${agents.length} agentes especialistas. Alinhamento de tolerâncias estruturais, térmicas e de segurança humana concluído com 99.4% de consenso.`,
        type: 'DECISION',
        confidence: 0.994,
        wisdomGain: 85,
      });
    }
  };

  const toggleReasoning = (id: string) => {
    setExpandedReasoning((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddQuantumAgent = () => {
    const specializations = [
      { name: 'Dr. Quântico - Cinemática SO(3)', role: 'Especialista em Tensor Rotacional', domain: 'Cinemática' },
      { name: 'Dra. Quântica - Síntese LCAO', role: 'Engenheira de Orbitais e Nanofabricação', domain: 'Materiais' },
      { name: 'Dr. Quântico - Logística Ultra-Rápida', role: 'Otimizador de Rotas Urbanas', domain: 'Logística' },
      { name: 'Dra. Quântica - Segurança & Ergonomia', role: 'Validadora de Interação Humana', domain: 'Ergonomia' },
      { name: 'Dr. Quântico - Termodinâmica a Laser', role: 'Físico Térmico de Precisão', domain: 'Termodinâmica' }
    ];
    const spec = specializations[agents.length % specializations.length];
    const newId = `agent-quantum-${Date.now()}`;
    const newAgent: MeetingRoomAgent = {
      id: newId,
      name: `${spec.name} #${agents.length + 1}`,
      role: spec.role,
      specialization: `${spec.domain} & Computação Quântica Aplicada`,
      avatarSeed: `QA-${agents.length + 1}`,
      colorScheme: 'purple',
      status: 'ACTIVE_REASONING',
      telemetry: {
        computeLoadPercent: Math.floor(45 + Math.random() * 40),
        memoryBandwidthGbps: 210.5,
        inferenceLatencyMs: Number((1.1 + Math.random() * 2).toFixed(1)),
        confidenceScore: 0.992,
        quantumCyclesSec: Math.floor(1800000 + Math.random() * 400000)
      },
      activeTask: {
        title: `Otimização Contínua (${spec.domain})`,
        description: `Modelagem estocástica e controle vetorial aplicada à manufatura do Gemini ER-2`,
        progress: Math.floor(20 + Math.random() * 60),
        domain: spec.domain,
        priority: 'HIGH'
      },
      reasoningProcess: {
        hypothesis: `Matrizes de estado em velocidade quântica estabilizam o atuador em milissegundos.`,
        internalDebate: `Testando convergência numérica sob constantes irracionais finitas π e φ.`,
        deducedAction: `Sincronizar barramento de comandos cinemáticos com o ecossistema.`,
        consensusContribution: `Valida parâmetros de precisão operacional e eficiência energética.`
      },
      synthesisBuffer: {
        audioBufferMs: 120,
        audioSampleRateKHz: 48,
        audioBitrateKbps: 320,
        audioWaveform: [40, 60, 80, 50, 70, 90, 45, 65],
        videoBufferFrames: 45,
        videoFps: 60,
        videoResolution: '3840x2160 (4K)',
        throughputMbSec: Number((18 + Math.random() * 10).toFixed(1)),
        synthesisStatus: 'STREAMING'
      },
      recentInsights: [
        `Computação em velocidade quântica operando em regime estável.`,
        `Integração direta com o Gemini ER-2 concluída.`
      ]
    };
    setAgents(prev => [...prev, newAgent]);
    setSelectedAgentId(newId);
  };

  const filteredAgents = filterDomain === 'ALL'
    ? agents
    : agents.filter((ag) => ag.activeTask.domain.toLowerCase().includes(filterDomain.toLowerCase()));

  // Calculate collective stats
  const totalQuantumCycles = agents.reduce((acc, a) => acc + a.telemetry.quantumCyclesSec, 0);
  const avgConfidence = (agents.reduce((acc, a) => acc + a.telemetry.confidenceScore, 0) / agents.length * 100).toFixed(1);
  const totalThroughput = agents.reduce((acc, a) => acc + a.synthesisBuffer.throughputMbSec, 0).toFixed(1);

  return (
    <div id="quantum-autonomous-meeting-room" className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border border-slate-800 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                Sala de Reunião Autônoma de Especialistas IA
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Telemetria & Síntese em Tempo Real
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Cpu className="w-8 h-8 text-indigo-400" />
              <span>Câmara Coletiva de Engenharia & Estratégia Autônoma</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed font-normal max-w-3xl">
              Instâncias autônomas de inteligência artificial de alta especialização técnica (Engenharia Estrutural, Logística, Ciência dos Materiais, Cinemática, Termodinâmica e Ergonomia) colaborando em regime contínuo para otimização da manufatura e serviço humano.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="meeting-room-toggle-sim-btn"
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                isSimulating
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
              }`}
            >
              {isSimulating ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
              <span>{isSimulating ? 'Pausar Telemetria' : 'Retomar Telemetria'}</span>
            </button>

            <button
              id="meeting-room-toggle-auto-add-btn"
              onClick={() => setAutoAddQuantumAgents(!autoAddQuantumAgents)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                autoAddQuantumAgents
                  ? 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
              }`}
            >
              <Cpu className={`w-4 h-4 ${autoAddQuantumAgents ? 'text-cyan-400 animate-spin' : 'text-slate-500'}`} style={autoAddQuantumAgents ? { animationDuration: '8s' } : undefined} />
              <span>{autoAddQuantumAgents ? 'Expansão Autônoma: Ativa' : 'Expansão Autônoma: Pausada'}</span>
            </button>

            <button
              id="meeting-room-add-agent-btn"
              onClick={handleAddQuantumAgent}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
            >
              <Users className="w-4 h-4 text-purple-200" />
              <span>+ Adicionar Especialista Quantum</span>
            </button>

            <button
              id="meeting-room-trigger-consensus-btn"
              onClick={handleTriggerConsensus}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Sincronizar Consenso Coletivo</span>
            </button>
          </div>
        </div>

        {/* Collective Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Especialistas Ativos:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-black text-white">{agents.length} Agentes</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Taxa de Consenso Coletivo:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-black text-emerald-400">{avgConfidence}%</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Throughput de Síntese:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-black text-sky-400">{totalThroughput} MB/s</span>
              <Video className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Ciclos Quânticos / Seg:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-black text-indigo-400">{(totalQuantumCycles / 1000000).toFixed(2)} M/s</span>
              <Activity className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Domain Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span>Filtrar por Domínio Técnico:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'Estrutural', 'Logística', 'Materiais', 'Cinemática', 'Termodinâmica', 'Ergonomia'].map((dom) => (
            <button
              key={dom}
              id={`filter-domain-${dom.toLowerCase()}-btn`}
              onClick={() => setFilterDomain(dom)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterDomain === dom
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {dom === 'ALL' ? 'Todos os Especialistas' : dom}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout of Professional AI Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => {
          const isSelected = selectedAgentId === agent.id;
          const isReasoningOpen = !!expandedReasoning[agent.id];

          return (
            <div
              key={agent.id}
              id={`agent-card-${agent.id}`}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`flex flex-col justify-between rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900/95 border-indigo-500/80 shadow-xl shadow-indigo-950/40 ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div className="p-5 space-y-4">
                {/* Agent Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono font-bold">
                        {agent.avatarSeed}
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {agent.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">{agent.role}</p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border ${
                      agent.status === 'ACTIVE_REASONING'
                        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                        : agent.status === 'COLLABORATING'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {agent.status === 'ACTIVE_REASONING' ? 'Raciocinando' : agent.status === 'COLLABORATING' ? 'Colaborando' : 'Sintetizando'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 font-sans leading-relaxed">
                  <span className="font-semibold text-slate-400">Especialização: </span>
                  {agent.specialization}
                </div>

                {/* Telemetry Strip */}
                <div className="grid grid-cols-3 gap-2 font-mono text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Carga CPU</span>
                    <span className="font-bold text-white">{agent.telemetry.computeLoadPercent}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Latência</span>
                    <span className="font-bold text-emerald-400">{agent.telemetry.inferenceLatencyMs} ms</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Confiança</span>
                    <span className="font-bold text-sky-400">{(agent.telemetry.confidenceScore * 100).toFixed(1)}%</span>
                  </div>
                </div>

                {/* Active Self-Generated Task */}
                <div className="space-y-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      {agent.activeTask.title}
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">{agent.activeTask.progress}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug font-normal">
                    {agent.activeTask.description}
                  </p>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${agent.activeTask.progress}%` }}
                    />
                  </div>
                </div>

                {/* Video / Audio Synthesis Buffers */}
                <div className="space-y-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Mic className="w-3 h-3 text-purple-400" />
                      Buffer de Síntese Acústica & Visual
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {agent.synthesisBuffer.videoResolution} | {agent.synthesisBuffer.videoFps} fps
                    </span>
                  </div>

                  {/* Audio Waveform Live Display */}
                  <div className="flex items-end justify-between gap-1 h-8 px-2 bg-slate-900/80 rounded-lg border border-slate-800/80">
                    {agent.synthesisBuffer.audioWaveform.map((height, i) => (
                      <div
                        key={i}
                        className="w-full bg-indigo-500/70 rounded-t transition-all duration-300"
                        style={{ height: `${Math.max(15, height)}%` }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-indigo-400" />
                      {agent.synthesisBuffer.audioBitrateKbps} kbps ({agent.synthesisBuffer.audioSampleRateKHz} kHz)
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {agent.synthesisBuffer.throughputMbSec} MB/s
                    </span>
                  </div>
                </div>

                {/* Internal Reasoning Process Accordion */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReasoning(agent.id);
                    }}
                    className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-950/50 hover:bg-slate-950 text-xs font-semibold text-slate-300 border border-slate-800/80 transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      Trilha de Raciocínio Interno
                    </span>
                    {isReasoningOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {isReasoningOpen && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 font-mono text-[9px] uppercase block">Hipótese Técnica:</span>
                        <p className="text-slate-300">{agent.reasoningProcess.hypothesis}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-mono text-[9px] uppercase block">Debate Interno:</span>
                        <p className="text-slate-400 italic">{agent.reasoningProcess.internalDebate}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-mono text-[9px] uppercase block">Ação Deduzida:</span>
                        <p className="text-emerald-300 font-medium">{agent.reasoningProcess.deducedAction}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-mono text-[9px] uppercase block">Contribuição ao Consenso:</span>
                        <p className="text-indigo-300">{agent.reasoningProcess.consensusContribution}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onAddThought) {
                      onAddThought({
                        id: `AGENT-THOUGHT-${agent.id}-${Date.now()}`,
                        timestamp: new Date().toLocaleTimeString('pt-BR'),
                        thought: `[${agent.name}] ${agent.recentInsights[0]}`,
                        type: 'PERCEPTION',
                        confidence: agent.telemetry.confidenceScore,
                        wisdomGain: 35,
                      });
                    }
                  }}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700/80 transition-all"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Transmitir Insight ao Núcleo do Robô</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
