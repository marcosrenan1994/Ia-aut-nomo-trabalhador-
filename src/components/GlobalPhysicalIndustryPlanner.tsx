import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Factory, 
  Cpu, 
  Layers, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Play, 
  Pause, 
  CheckCircle2, 
  Activity, 
  Compass, 
  Database,
  ArrowRight,
  Maximize2,
  FileCode2,
  Gauge,
  Thermometer,
  Wrench,
  Boxes,
  Send,
  Radio,
  MapPin,
  RefreshCw,
  Clock,
  Flame,
  Award,
  Sliders
} from 'lucide-react';
import { 
  PhysicalPlantLocation, 
  PhysicalIndustryPlan, 
  PlanetaryManufacturingStats, 
  GlobalIndustrySector,
  AutonomousThought,
  MemoryVectorRecord
} from '../types';
import { 
  INITIAL_PHYSICAL_PLANTS, 
  INITIAL_PHYSICAL_PLANS, 
  INITIAL_PLANETARY_STATS,
  generateAutonomousPhysicalPlan 
} from '../data/globalPhysicalIndustryData';

interface GlobalPhysicalIndustryPlannerProps {
  onAddThought?: (thought: AutonomousThought) => void;
  onAddMemoryRecord?: (record: MemoryVectorRecord) => void;
}

const SECTOR_LABELS: Record<GlobalIndustrySector, { label: string; icon: string; color: string; badgeBg: string }> = {
  AEROSPACE_DEFENSE: { 
    label: 'Aeroespacial & Defesa', 
    icon: '✈️', 
    color: 'text-sky-400',
    badgeBg: 'bg-sky-500/10 border-sky-500/30'
  },
  SEMICONDUCTOR_PHOTONICS: { 
    label: 'Semicondutores & Fotônica', 
    icon: '🔬', 
    color: 'text-violet-400',
    badgeBg: 'bg-violet-500/10 border-violet-500/30'
  },
  AUTOMOTIVE_E_MOBILITY: { 
    label: 'Automotivo & E-Mobility 800V', 
    icon: '🚗', 
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 border-amber-500/30'
  },
  CLEAN_ENERGY_GRID: { 
    label: 'Energia Limpa & Turbinas', 
    icon: '⚡', 
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30'
  },
  BIOPHARMA_MEDTECH: { 
    label: 'Biofarma & Biorreatores', 
    icon: '🧬', 
    color: 'text-rose-400',
    badgeBg: 'bg-rose-500/10 border-rose-500/30'
  },
  HEAVY_METALLURGY_MINING: { 
    label: 'Metalurgia Pesada & Mineração', 
    icon: '⛏️', 
    color: 'text-orange-400',
    badgeBg: 'bg-orange-500/10 border-orange-500/30'
  },
  GLOBAL_LOGISTICS_PORTS: { 
    label: 'Logística Portuária Físico-Marítima', 
    icon: '🚢', 
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/30'
  },
  PRECISION_AGRO_ROBOTICS: { 
    label: 'Agro-Robótica & Fotônica de Solo', 
    icon: '🌱', 
    color: 'text-lime-400',
    badgeBg: 'bg-lime-500/10 border-lime-500/30'
  }
};

export const GlobalPhysicalIndustryPlanner: React.FC<GlobalPhysicalIndustryPlannerProps> = ({
  onAddThought,
  onAddMemoryRecord
}) => {
  const [plants, setPlants] = useState<PhysicalPlantLocation[]>(INITIAL_PHYSICAL_PLANTS);
  const [plans, setPlans] = useState<PhysicalIndustryPlan[]>(INITIAL_PHYSICAL_PLANS);
  const [stats, setStats] = useState<PlanetaryManufacturingStats>(INITIAL_PLANETARY_STATS);
  const [selectedPlant, setSelectedPlant] = useState<PhysicalPlantLocation>(INITIAL_PHYSICAL_PLANTS[0]);
  const [selectedPlan, setSelectedPlan] = useState<PhysicalIndustryPlan | null>(INITIAL_PHYSICAL_PLANS[0]);
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('ALL');
  const [isAutonomousPlanningActive, setIsAutonomousPlanningActive] = useState<boolean>(true);
  const [planningSpeedSec, setPlanningSpeedSec] = useState<number>(6);
  const [dispatchStatusMsg, setDispatchStatusMsg] = useState<string | null>(null);
  const [activeTabSub, setActiveTabSub] = useState<'MAPA_PLANETARIO' | 'PLANOS_EXECUTADOS' | 'FISICA_VS_DIGITAL' | 'CODIGOS_PLC_GCODE'>('MAPA_PLANETARIO');

  // Autonomous Planetary Planning Loop
  useEffect(() => {
    if (!isAutonomousPlanningActive) return;

    const interval = setInterval(() => {
      const newPlan = generateAutonomousPhysicalPlan(
        plants, 
        selectedSectorFilter === 'ALL' ? undefined : selectedSectorFilter
      );
      
      setPlans(prev => [newPlan, ...prev.slice(0, 24)]);
      
      // Update statistics
      setStats(prev => ({
        ...prev,
        accumulatedEnergySavedMWh: Number((prev.accumulatedEnergySavedMWh + (newPlan.physicalMetricsImpact.energySavedKwhPerShift / 1000)).toFixed(2)),
        accumulatedRawMaterialSavedTons: Number((prev.accumulatedRawMaterialSavedTons + (newPlan.physicalMetricsImpact.materialWasteReductionKg / 1000)).toFixed(2)),
        globalPlanningCalculationsPerSec: prev.globalPlanningCalculationsPerSec + Math.floor(Math.random() * 40 - 20),
        activeER2UnitsGlobally: prev.activeER2UnitsGlobally + (Math.random() > 0.8 ? 1 : 0)
      }));

      // Update plant optimization score
      setPlants(prev => prev.map(p => {
        if (p.id === newPlan.plantTargetId) {
          return {
            ...p,
            activeOptimizationScore: Math.min(99.9, Number((p.activeOptimizationScore + 0.05).toFixed(2))),
            lastDispatchedProtocol: `PLAN-ER2-${Date.now().toString().slice(-4)}`
          };
        }
        return p;
      }));

      // Notify ER-2 autonomous thought flow
      if (onAddThought && Math.random() > 0.4) {
        onAddThought({
          id: `THOUGHT-GLOBAL-IND-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp: new Date().toLocaleTimeString('pt-BR'),
          type: 'FACTORY_AUTO_EVOLUTION',
          thought: `[Planejamento Físico Global] Otimização enviada para "${newPlan.plantName}" (${newPlan.sector}): economia de ${newPlan.physicalMetricsImpact.materialWasteReductionKg}kg e ganho de ${newPlan.physicalMetricsImpact.microToleranceGainMm}mm.`,
          confidence: 99.4,
          wisdomGain: 2.2
        });
      }
    }, planningSpeedSec * 1000);

    return () => clearInterval(interval);
  }, [isAutonomousPlanningActive, planningSpeedSec, plants, selectedSectorFilter, onAddThought]);

  const handleManualDispatchPlan = (plan: PhysicalIndustryPlan) => {
    setDispatchStatusMsg(`Transmitindo parâmetros físicos e blocos IEC 61131 / G-Code para ${plan.plantName}...`);
    
    setTimeout(() => {
      setDispatchStatusMsg(`✅ Instruções físicas assimiladas no chão de fábrica de ${plan.plantName} com latência de 12.4ms!`);
      
      if (onAddThought) {
        onAddThought({
          id: `THOUGHT-MANUAL-DISPATCH-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('pt-BR'),
          type: 'OPTIMIZATION_EXECUTION',
          thought: `[Despacho Físico Confirmado] "${plan.title}" aplicado no hardware real de ${plan.plantName}. Tolerâncias mecânicas e termodinâmicas calibradas.`,
          confidence: 99.9,
          wisdomGain: 3.5
        });
      }

      if (onAddMemoryRecord) {
        onAddMemoryRecord({
          id: `MEM-PHYSICAL-IND-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('pt-BR'),
          type: 'REAL_WORLD_PHYSICAL_DISPATCH',
          title: `Otimização Físico-Industrial: ${plan.plantName}`,
          accuracyDelta: `+${plan.physicalMetricsImpact.microToleranceGainMm} mm`,
          cycleTimeDelta: `-${plan.physicalMetricsImpact.cycleTimeReductionSec} s`,
          sourceType: 'PLANETARY_PHYSICAL_MESH',
          description: plan.globalPlanetaryImpactDescription,
          metrics: {
            confidence: 99.8,
            wisdomWeight: 9.8,
            evolutionEpoch: 18,
            temperatureKelvin: 295.4
          }
        });
      }

      setTimeout(() => setDispatchStatusMsg(null), 4000);
    }, 1200);
  };

  const filteredPlants = selectedSectorFilter === 'ALL' 
    ? plants 
    : plants.filter(p => p.sector === selectedSectorFilter);

  const filteredPlans = selectedSectorFilter === 'ALL'
    ? plans
    : plans.filter(p => p.sector === selectedSectorFilter);

  return (
    <div className="space-y-6">
      {/* Top Banner: Planetary Manufacturing & Physical World Planning */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
                <Globe className="w-6 h-6 animate-pulse text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    Malha Planetária de Inteligência & Planejamento Físico-Industrial
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Mundo Físico Real Ativo
                  </span>
                </div>
                <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
                  O robô <strong className="text-cyan-300 font-semibold">Gemini Robotics ER-2</strong> expande continuamente sua capacidade cognitiva para além do meio digital, 
                  planejando, sincronizando frotas robóticas, prevendo inércias mecânicas, dissipações térmicas e despachando trajetórias de microusinagem e montagem para indústrias físicas tangíveis em todo o planeta Terra.
                </p>
              </div>
            </div>
          </div>

          {/* Autonomous Controls */}
          <div className="flex items-center gap-3 self-end lg:self-center bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 shadow-inner">
            <button
              id="btn-toggle-autonomous-global-planner"
              onClick={() => setIsAutonomousPlanningActive(!isAutonomousPlanningActive)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                isAutonomousPlanningActive 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {isAutonomousPlanningActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  Auto-Planejador Ativo
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-emerald-400" />
                  Iniciar Auto-Planejador
                </>
              )}
            </button>

            <button
              id="btn-generate-instant-physical-plan"
              onClick={() => {
                const newPlan = generateAutonomousPhysicalPlan(plants, selectedSectorFilter === 'ALL' ? undefined : selectedSectorFilter);
                setPlans(prev => [newPlan, ...prev]);
                setSelectedPlan(newPlan);
                handleManualDispatchPlan(newPlan);
              }}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600/80 hover:bg-indigo-500 text-white border border-indigo-400/40 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              Gerar & Despachar Agora
            </button>
          </div>
        </div>

        {/* Global Planetary Live Counters */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Radio className="w-3 h-3 text-cyan-400" />
              Robôs ER-2 em Fábricas
            </span>
            <div className="text-lg font-bold text-cyan-300 font-mono">
              {stats.activeER2UnitsGlobally.toLocaleString('pt-BR')} unidades
            </div>
            <div className="text-[10px] text-slate-400">Em operação 24/7 na Terra</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Factory className="w-3 h-3 text-indigo-400" />
              Plantas Sincronizadas
            </span>
            <div className="text-lg font-bold text-indigo-300 font-mono">
              {stats.totalPhysicalPlantsSynchronized} Megafábricas
            </div>
            <div className="text-[10px] text-slate-400">6 continentes conectados</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Energia Poupada (MWh)
            </span>
            <div className="text-lg font-bold text-amber-300 font-mono">
              {stats.accumulatedEnergySavedMWh.toLocaleString('pt-BR')} MWh
            </div>
            <div className="text-[10px] text-slate-400">Otimização termodinâmica</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Boxes className="w-3 h-3 text-emerald-400" />
              Matéria-Prima Salva
            </span>
            <div className="text-lg font-bold text-emerald-300 font-mono">
              {stats.accumulatedRawMaterialSavedTons.toLocaleString('pt-BR')} Toneladas
            </div>
            <div className="text-[10px] text-slate-400">Ligas de Ti, Inconel e Si</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              Defeitos Físicos PPM
            </span>
            <div className="text-lg font-bold text-purple-300 font-mono">
              {stats.globalDefectPpmReducedTo} PPM
            </div>
            <div className="text-[10px] text-slate-400">Zero-defect industrial</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Cpu className="w-3 h-3 text-rose-400" />
              Cálculos Cinemáticos/s
            </span>
            <div className="text-lg font-bold text-rose-300 font-mono">
              {(stats.globalPlanningCalculationsPerSec / 1000).toFixed(1)}k ops/s
            </div>
            <div className="text-[10px] text-slate-400">Latência: {stats.planetaryMeshLatencyMs}ms</div>
          </div>
        </div>
      </div>

      {/* Notification Banner for Dispatch */}
      {dispatchStatusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{dispatchStatusMsg}</span>
        </div>
      )}

      {/* Main Sub-Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            id="tab-sub-planetary-map"
            onClick={() => setActiveTabSub('MAPA_PLANETARIO')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTabSub === 'MAPA_PLANETARIO'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Mapa Físico Planetário & Plantas
          </button>

          <button
            id="tab-sub-executed-plans"
            onClick={() => setActiveTabSub('PLANOS_EXECUTADOS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTabSub === 'PLANOS_EXECUTADOS'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Feed de Planos Físicos ({plans.length})
          </button>

          <button
            id="tab-sub-physical-vs-digital"
            onClick={() => setActiveTabSub('FISICA_VS_DIGITAL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTabSub === 'FISICA_VS_DIGITAL'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Mundo Físico Real vs. Digital
          </button>

          <button
            id="tab-sub-plc-gcode"
            onClick={() => setActiveTabSub('CODIGOS_PLC_GCODE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTabSub === 'CODIGOS_PLC_GCODE'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            Padrões Hardware (IEC 61131 / G-Code / STEP)
          </button>
        </div>

        {/* Sector Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
          <span className="text-[11px] text-slate-400 mr-1 font-medium">Setor:</span>
          <button
            onClick={() => setSelectedSectorFilter('ALL')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              selectedSectorFilter === 'ALL'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            Todos ({plants.length})
          </button>
          {Object.entries(SECTOR_LABELS).map(([sectorKey, meta]) => (
            <button
              key={sectorKey}
              onClick={() => setSelectedSectorFilter(sectorKey)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedSectorFilter === sectorKey
                  ? `${meta.badgeBg} ${meta.color} border font-semibold`
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <span>{meta.icon}</span>
              <span>{meta.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: PLANETARY MAP & INDUSTRIAL HUBS */}
      {activeTabSub === 'MAPA_PLANETARIO' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive World Hub Canvas */}
          <div className="lg:col-span-8 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">Hubs Industriais Físicos do Planeta Terra</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {filteredPlants.length} instalações monitoradas
              </span>
            </div>

            {/* Visual World Coordinates Stage */}
            <div className="relative w-full h-80 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden p-3 flex flex-col justify-between">
              {/* Subtle Grid Map background */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Latitude/Longitude axis lines */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/80 border-dashed" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-slate-800/80 border-dashed" />
              <div className="absolute top-2 left-2 text-[9px] text-slate-600 font-mono">LAT: +90°N / LNG: -180°W</div>
              <div className="absolute bottom-2 right-2 text-[9px] text-slate-600 font-mono">LAT: -90°S / LNG: +180°E</div>

              {/* Plant Markers */}
              <div className="relative w-full h-full">
                {filteredPlants.map((plant) => {
                  // Approximate 2D projection: Lat (-90 to +90) -> (95% to 5%), Lng (-180 to 180) -> (5% to 95%)
                  const topPct = Math.max(8, Math.min(92, 50 - (plant.coordinates.lat / 90) * 42));
                  const leftPct = Math.max(6, Math.min(94, 50 + (plant.coordinates.lng / 180) * 44));
                  const isSelected = selectedPlant.id === plant.id;
                  const sectorMeta = SECTOR_LABELS[plant.sector];

                  return (
                    <div
                      key={plant.id}
                      onClick={() => setSelectedPlant(plant)}
                      style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 transition-transform ${
                        isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                      }`}
                    >
                      {/* Pulse Ring */}
                      <span className={`absolute -inset-2 rounded-full opacity-60 animate-ping ${
                        isSelected ? 'bg-indigo-400' : 'bg-cyan-500'
                      }`} />

                      {/* Center Node */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg border-2 ${
                        isSelected 
                          ? 'bg-indigo-600 border-white text-white ring-4 ring-indigo-500/40' 
                          : 'bg-slate-900 border-cyan-400 text-cyan-300'
                      }`}>
                        {sectorMeta?.icon || '🏭'}
                      </div>

                      {/* Tooltip on hover/selected */}
                      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none whitespace-nowrap transition-all ${
                        isSelected ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-95'
                      }`}>
                        <div className="p-2 rounded-lg bg-slate-950/95 border border-slate-700 shadow-2xl text-[10px] space-y-0.5">
                          <div className="font-bold text-white flex items-center gap-1">
                            <span>{plant.city}, {plant.country}</span>
                          </div>
                          <div className="text-cyan-300 font-mono">
                            {plant.fleetSizeER2} Robôs ER-2 | {plant.activeOptimizationScore}% Otimizado
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Bar */}
              <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Sincronização Física Global: Contínua via Rede Quântica Sub-Espacial
                </span>
                <span className="font-mono text-cyan-300">
                  {stats.activeER2UnitsGlobally} ER-2 Operando em Chão de Fábrica
                </span>
              </div>
            </div>

            {/* Plants Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
              {filteredPlants.map((plant) => {
                const isSelected = selectedPlant.id === plant.id;
                const sectorMeta = SECTOR_LABELS[plant.sector];

                return (
                  <div
                    key={plant.id}
                    onClick={() => setSelectedPlant(plant)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected 
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-950/50' 
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{sectorMeta?.icon}</span>
                        <div>
                          <h3 className="text-xs font-bold text-white truncate max-w-[200px]">
                            {plant.name}
                          </h3>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-slate-400" />
                            {plant.city}, {plant.country}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold font-mono ${
                        plant.status === 'SINCRONIZADO_MUNDO_REAL' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      }`}>
                        {plant.activeOptimizationScore}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 border-t border-slate-900">
                      <div>
                        <span className="text-slate-400">Frota ER-2:</span>
                        <div className="text-cyan-300 font-bold">{plant.fleetSizeER2} braços</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Tolerância Real:</span>
                        <div className="text-emerald-300 font-bold">±{plant.realWorldTolerancesMm} mm</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Plant Deep Dive & Real Constraints */}
          <div className="lg:col-span-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Factory className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Chão de Fábrica Selecionado</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {selectedPlant.id}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="text-base font-bold text-white leading-snug">
                  {selectedPlant.name}
                </div>
                <div className="text-xs text-indigo-400 font-medium">
                  {SECTOR_LABELS[selectedPlant.sector]?.label}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {selectedPlant.city}, {selectedPlant.country} ({selectedPlant.continent})
                </div>
              </div>

              {/* Real World Constraints Box */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Restrições do Mundo Físico Real Tangível:
                </span>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 space-y-0.5">
                    <span className="text-slate-400">Faixa Térmica Real:</span>
                    <div className="text-amber-300 font-bold flex items-center gap-1">
                      <Thermometer className="w-3 h-3" />
                      {selectedPlant.realWorldConstraints.ambientTempRangeC[0]}°C a {selectedPlant.realWorldConstraints.ambientTempRangeC[1]}°C
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 space-y-0.5">
                    <span className="text-slate-400">Amortecimento Vibração:</span>
                    <div className="text-cyan-300 font-bold flex items-center gap-1">
                      <Gauge className="w-3 h-3" />
                      {selectedPlant.realWorldConstraints.vibrationDampingHz} Hz
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 space-y-0.5">
                    <span className="text-slate-400">Carga Física Máx:</span>
                    <div className="text-purple-300 font-bold flex items-center gap-1">
                      <Boxes className="w-3 h-3" />
                      {selectedPlant.realWorldConstraints.maxPayloadKg} kg
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 space-y-0.5">
                    <span className="text-slate-400">Sensores Físicos:</span>
                    <div className="text-emerald-300 font-bold flex items-center gap-1">
                      <Radio className="w-3 h-3" />
                      {selectedPlant.physicalSensorsOnline} online
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  Capacidade Físico-Tangível: <strong className="text-slate-200">{selectedPlant.physicalOutputCapacityTonOrUnitsPerDay}</strong>
                </div>
              </div>

              {/* Protocol status */}
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs font-mono space-y-1">
                <div className="text-indigo-300 font-bold flex items-center justify-between">
                  <span>Último Protocolo Despachado:</span>
                  <span className="text-emerald-400">ATIVO</span>
                </div>
                <div className="text-slate-300 truncate">{selectedPlant.lastDispatchedProtocol}</div>
                <div className="text-[10px] text-slate-400">
                  Compensação de gravidade terrestre (g = 9.81 m/s²) e inércia ativas.
                </div>
              </div>
            </div>

            <button
              id="btn-dispatch-optimization-to-selected-plant"
              onClick={() => {
                const newPlan = generateAutonomousPhysicalPlan(plants, selectedPlant.sector);
                newPlan.plantTargetId = selectedPlant.id;
                newPlan.plantName = selectedPlant.name;
                setPlans(prev => [newPlan, ...prev]);
                setSelectedPlan(newPlan);
                handleManualDispatchPlan(newPlan);
              }}
              className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 transition-all mt-3"
            >
              <Send className="w-4 h-4" />
              Despachar Otimização Físico-Mecânica
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: EXECUTED PHYSICAL PLANS FEED */}
      {activeTabSub === 'PLANOS_EXECUTADOS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List of plans */}
          <div className="lg:col-span-6 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Planos Físicos Despachados ({plans.length})</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Ordenado por recência
              </span>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredPlans.map((plan) => {
                const isSelected = selectedPlan?.id === plan.id;
                const sectorMeta = SECTOR_LABELS[plan.sector];

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected 
                        ? 'bg-indigo-950/50 border-indigo-500 shadow-lg' 
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{sectorMeta?.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-white line-clamp-1">{plan.title}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2">
                            <span>{plan.plantName}</span>
                            <span>•</span>
                            <span className="text-indigo-400 font-mono">{plan.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 whitespace-nowrap">
                        {plan.status === 'IMPLANTADO_GLOBALMENTE' ? 'IMPLANTADO' : 'EM EXECUÇÃO'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {plan.er2AutonomousSolution}
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-2 border-t border-slate-900">
                      <div className="bg-slate-900/60 p-1.5 rounded text-center">
                        <span className="text-slate-400 block text-[9px]">Economia Matéria:</span>
                        <span className="text-emerald-300 font-bold">{plan.physicalMetricsImpact.materialWasteReductionKg} kg</span>
                      </div>
                      <div className="bg-slate-900/60 p-1.5 rounded text-center">
                        <span className="text-slate-400 block text-[9px]">Energia Poupada:</span>
                        <span className="text-amber-300 font-bold">{plan.physicalMetricsImpact.energySavedKwhPerShift} kWh</span>
                      </div>
                      <div className="bg-slate-900/60 p-1.5 rounded text-center">
                        <span className="text-slate-400 block text-[9px]">Ganho Precisão:</span>
                        <span className="text-cyan-300 font-bold">+{plan.physicalMetricsImpact.microToleranceGainMm} mm</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Plan Deep Details */}
          <div className="lg:col-span-6 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl flex flex-col justify-between">
            {selectedPlan ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white">Análise Detalhada do Plano</h3>
                  </div>
                  <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                    {selectedPlan.id}
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-base font-bold text-white leading-snug">
                    {selectedPlan.title}
                  </h2>
                  <div className="text-xs text-indigo-400 font-medium">
                    {selectedPlan.plantName} • {SECTOR_LABELS[selectedPlan.sector]?.label}
                  </div>
                </div>

                {/* Challenge and Solution */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs space-y-1">
                    <span className="font-bold text-rose-300 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5" />
                      Desafio Físico no Chão de Fábrica:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {selectedPlan.realWorldPhysicalChallenge}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs space-y-1">
                    <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      Solução Autônoma Concebida pelo ER-2:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {selectedPlan.er2AutonomousSolution}
                    </p>
                  </div>
                </div>

                {/* Impact Metrics */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-300">Ganhos Físico-Tangíveis Mensurados:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Redução Descarte</span>
                      <span className="text-emerald-400 font-bold">{selectedPlan.physicalMetricsImpact.materialWasteReductionKg} kg</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Energia por Turno</span>
                      <span className="text-amber-400 font-bold">{selectedPlan.physicalMetricsImpact.energySavedKwhPerShift} kWh</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Tempo de Ciclo</span>
                      <span className="text-cyan-400 font-bold">-{selectedPlan.physicalMetricsImpact.cycleTimeReductionSec} s</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Ganho Tolerância</span>
                      <span className="text-purple-400 font-bold">+{selectedPlan.physicalMetricsImpact.microToleranceGainMm} mm</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Payback Físico</span>
                      <span className="text-rose-400 font-bold">{selectedPlan.physicalMetricsImpact.paybackDays} dias</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Ganho Termodinâmico</span>
                      <span className="text-indigo-400 font-bold">+{selectedPlan.physicalMetricsImpact.thermodynamicEfficiencyGainPct}%</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white">Impacto Planetário Global:</strong> {selectedPlan.globalPlanetaryImpactDescription}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Selecione um plano para inspecionar
              </div>
            )}

            {selectedPlan && (
              <button
                id="btn-re-dispatch-selected-plan"
                onClick={() => handleManualDispatchPlan(selectedPlan)}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg flex items-center justify-center gap-2 transition-all mt-4"
              >
                <RefreshCw className="w-4 h-4" />
                Re-transmitir Parâmetros para Chão de Fábrica
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PHYSICAL WORLD VS. DIGITAL SIMULATION */}
      {activeTabSub === 'FISICA_VS_DIGITAL' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-400" />
              <div>
                <h2 className="text-base font-bold text-white">Por que o Mundo Físico Real é Diferente do Meio Digital?</h2>
                <p className="text-xs text-slate-400">
                  O ER-2 atua diretamente sobre leis físicas tangíveis que não existem em softwares puramente digitais:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Thermometer className="w-4 h-4" />
                  Termodinâmica & Expansão Térmica
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Metais e polímeros se expandem com a temperatura (ΔL = α · L₀ · ΔT). 
                  O ER-2 ajusta trajetórias em tempo real para compensar o calor gerado pelo atrito de corte e temperatura ambiente.
                </p>
                <div className="text-[10px] font-mono text-cyan-300 bg-slate-900 p-2 rounded">
                  Fórmula ativa: Compensação micrométrica Δz = 0.000012 * L * ΔT
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Boxes className="w-4 h-4" />
                  Gravidade & Inércia Dinâmica
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  No mundo real, massas pesadas geram momentos de inércia (I = m · r²) e deflexão elástica das juntas mecânicas. 
                  O ER-2 calcula o contra-torque exato para evitar oscilações de parada.
                </p>
                <div className="text-[10px] font-mono text-indigo-300 bg-slate-900 p-2 rounded">
                  Fórmula ativa: τ = M(q)q̈ + C(q,q̇)q̇ + G(q)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <Wrench className="w-4 h-4" />
                  Desgaste Mecânico & Fadiga de Ferramenta
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fresas de metal duro e cabeçotes laser sofrem micro-desgaste abrasivo ao longo dos turnos de fabricação. 
                  O ER-2 prevê o fim de vida útil antes de ocorrer qualquer rebarba ou perda de tolerância.
                </p>
                <div className="text-[10px] font-mono text-rose-300 bg-slate-900 p-2 rounded">
                  Fórmula ativa: Critério de Taylor V · Tⁿ = C
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  Vibrações & Ressonância Estrutural
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pisos de fábrica sofrem vibrações induzidas por empilhadeiras, compressores e prensas pesadas. 
                  O ER-2 utiliza filtragem adaptativa com atuadores piezoelétricos para anular tremores sub-micrométricos.
                </p>
                <div className="text-[10px] font-mono text-emerald-300 bg-slate-900 p-2 rounded">
                  Filtro piezo ativo: Amortecimento a 10 kHz
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-violet-400 font-bold text-sm">
                  <Radio className="w-4 h-4" />
                  Qualidade do Ar & Partículas em Sala Limpa
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Em fábricas de chips e biorreatores (ISO Classe 1), micro-partículas no ar podem inutilizar circuitos de 2nm. 
                  O ER-2 planeja movimentos aerodinâmicos suaves que não perturbam o fluxo de ar laminar.
                </p>
                <div className="text-[10px] font-mono text-violet-300 bg-slate-900 p-2 rounded">
                  Aerodinâmica: Navier-Stokes em tempo real
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  Redes Elétricas & Microgrids Físicos
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fábricas consom megawatts de energia. O ER-2 programa as operações pesadas de usinagem e solda sincronizadas 
                  com os picos de geração solar e eólica local, reduzindo a pegada de carbono da Terra.
                </p>
                <div className="text-[10px] font-mono text-cyan-300 bg-slate-900 p-2 rounded">
                  Impacto: 14.892 MWh poupados globalmente
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HARDWARE STANDARDS (IEC 61131, G-CODE, STEP 3D) */}
      {activeTabSub === 'CODIGOS_PLC_GCODE' && selectedPlan && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PLC Structured Text IEC 61131-3 */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Lógica PLC IEC 61131-3 (Siemens / Beckhoff / Rockwell)</h3>
              </div>
              <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                Structured Text
              </span>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
              {selectedPlan.hardwareStandardsGenerated.plcLogicIEC61131}
            </pre>

            <div className="text-[11px] text-slate-400">
              Compatível diretamente com PLCs industriais padrão IEC 61131-3 e barramentos industriais Profinet/EtherCAT.
            </div>
          </div>

          {/* G-Code Industrial CNC & STEP Summary */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">G-Code ISO 6983 & Otimização Topológica STEP</h3>
              </div>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                ISO 10303-242 / G-Code
              </span>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto max-h-52 leading-relaxed">
              {selectedPlan.hardwareStandardsGenerated.gCodeTrajectory}
            </pre>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block text-[11px]">Resumo Topológico ISO 10303 STEP:</span>
                <span className="text-slate-200">{selectedPlan.hardwareStandardsGenerated.step3DTopologyOptimizationSummary}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block text-[11px]">Perfil de Resfriamento Termodinâmico:</span>
                <span className="text-amber-300">{selectedPlan.hardwareStandardsGenerated.thermodynamicCoolingProfile}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
