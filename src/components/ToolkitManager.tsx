import React, { useState, useMemo } from 'react';
import { ToolDefinition, ToolId, DynamicLoadConfig, ProcessedMaterialType } from '../types';
import { 
  Flame, 
  Eye, 
  Wrench, 
  Boxes, 
  Hand, 
  CheckCircle2, 
  AlertCircle, 
  RotateCw, 
  Thermometer, 
  Activity, 
  Zap,
  Minimize2,
  Maximize2,
  Droplet,
  Sparkles,
  Scale,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  Save,
  Info,
  ChevronRight,
  Settings2,
  Cpu,
  Layers,
  ArrowRightLeft
} from 'lucide-react';

interface ToolkitManagerProps {
  tools: ToolDefinition[];
  activeToolId: ToolId;
  onSelectTool: (id: ToolId) => void;
  onCalibrateTool: (id: ToolId) => void;
  onUpdateTools?: (tools: ToolDefinition[]) => void;
}

const MATERIAL_PRESETS: Record<ProcessedMaterialType, { label: string; density: number; desc: string; defaultTorqueFactor: number; badgeColor: string }> = {
  ACO_CARBONO: {
    label: 'Aço Carbono / Inox 316L',
    density: 7.98,
    desc: 'Alta densidade e inércia elevada. Requer máxima rigidez e torque corretivo em J2/J3.',
    defaultTorqueFactor: 5.2,
    badgeColor: 'bg-slate-700 text-slate-200 border-slate-600'
  },
  ALUMINIO_7075: {
    label: 'Alumínio Aeroespacial 7075-T6',
    density: 2.81,
    desc: 'Carga média-leve com excelente condutividade térmica e resposta dinâmica ágil.',
    defaultTorqueFactor: 3.8,
    badgeColor: 'bg-sky-950 text-sky-300 border-sky-700'
  },
  TITANIO_GR5: {
    label: 'Titânio Grau 5 (Ti-6Al-4V)',
    density: 4.43,
    desc: 'Ultra-resistência mecânica. Dinâmica de alta rigidez para fixações e usinagem crítica.',
    defaultTorqueFactor: 4.6,
    badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-700'
  },
  FIBRA_CARBONO: {
    label: 'Fibra de Carbono Compósito 3K',
    density: 1.55,
    desc: 'Baixa densidade volumétrica com alta rigidez axial. Ótima velocidade de avanço.',
    defaultTorqueFactor: 2.4,
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-700'
  },
  POLIMERO_UHMW: {
    label: 'Polímero UHMW / PEEK Industrial',
    density: 1.30,
    desc: 'Material leve e viscoelástico. Amortecimento natural contra vibrações harmônicas.',
    defaultTorqueFactor: 2.1,
    badgeColor: 'bg-teal-950 text-teal-300 border-teal-700'
  },
  AREIA_FUNDICAO: {
    label: 'Areia de Sílica / Molde de Fundição',
    density: 1.60,
    desc: 'Material granular abrasivo com centro de gravidade variável durante desbaste.',
    defaultTorqueFactor: 4.4,
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-700'
  },
  VIDRO_QUARTZO: {
    label: 'Vidro Óptico / Quartzo Fundido',
    density: 2.20,
    desc: 'Frágil e ultra-preciso. Requer micro-compensação de torque com zero overshoot.',
    defaultTorqueFactor: 2.8,
    badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-700'
  },
  COBRE_ELETROLITICO: {
    label: 'Cobre Eletrolítico Puro (Cu-ETP)',
    density: 8.96,
    desc: 'Altíssima densidade e condutividade para forjaria e soldagem laser concentrada.',
    defaultTorqueFactor: 5.6,
    badgeColor: 'bg-orange-950 text-orange-300 border-orange-700'
  },
  PERSONALIZADO: {
    label: 'Material Customizado pelo Operador',
    density: 3.50,
    desc: 'Parâmetros definidos manualmente para insumos específicos da célula de trabalho.',
    defaultTorqueFactor: 3.5,
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-700'
  }
};

const DEFAULT_LOAD_CONFIGS: Record<ToolId, DynamicLoadConfig> = {
  TOOL_GRIPPER: {
    maxDynamicLoadKg: 15.0,
    minDynamicLoadKg: 0.05,
    ratedPayloadKg: 8.0,
    currentMaterialWeightKg: 2.4,
    materialType: 'ALUMINIO_7075',
    materialDensityGcm3: 2.81,
    autoTorqueCompensation: true,
    torqueGainFactorNmPerKg: 3.8,
    inertiaCompensationRatio: 85,
    leverArmLengthMeters: 0.35,
    dampingRatio: 0.92,
    maxTorqueOffsetLimitNm: 55.0,
    safetyEnvelopeStatus: 'OPTIMAL'
  },
  TOOL_WELDER: {
    maxDynamicLoadKg: 8.0,
    minDynamicLoadKg: 0.1,
    ratedPayloadKg: 5.0,
    currentMaterialWeightKg: 1.8,
    materialType: 'ACO_CARBONO',
    materialDensityGcm3: 7.98,
    autoTorqueCompensation: true,
    torqueGainFactorNmPerKg: 4.2,
    inertiaCompensationRatio: 90,
    leverArmLengthMeters: 0.42,
    dampingRatio: 0.95,
    maxTorqueOffsetLimitNm: 40.0,
    safetyEnvelopeStatus: 'OPTIMAL'
  },
  TOOL_VISION_INSPECTOR: {
    maxDynamicLoadKg: 4.0,
    minDynamicLoadKg: 0.01,
    ratedPayloadKg: 2.5,
    currentMaterialWeightKg: 0.35,
    materialType: 'VIDRO_QUARTZO',
    materialDensityGcm3: 2.20,
    autoTorqueCompensation: true,
    torqueGainFactorNmPerKg: 2.1,
    inertiaCompensationRatio: 95,
    leverArmLengthMeters: 0.28,
    dampingRatio: 0.99,
    maxTorqueOffsetLimitNm: 20.0,
    safetyEnvelopeStatus: 'OPTIMAL'
  },
  TOOL_FASTENER: {
    maxDynamicLoadKg: 25.0,
    minDynamicLoadKg: 0.2,
    ratedPayloadKg: 16.0,
    currentMaterialWeightKg: 6.5,
    materialType: 'TITANIO_GR5',
    materialDensityGcm3: 4.43,
    autoTorqueCompensation: true,
    torqueGainFactorNmPerKg: 5.5,
    inertiaCompensationRatio: 80,
    leverArmLengthMeters: 0.38,
    dampingRatio: 0.88,
    maxTorqueOffsetLimitNm: 135.0,
    safetyEnvelopeStatus: 'OPTIMAL'
  },
  TOOL_SUCTION_CRANE: {
    maxDynamicLoadKg: 45.0,
    minDynamicLoadKg: 0.5,
    ratedPayloadKg: 30.0,
    currentMaterialWeightKg: 14.2,
    materialType: 'ACO_CARBONO',
    materialDensityGcm3: 7.98,
    autoTorqueCompensation: true,
    torqueGainFactorNmPerKg: 6.8,
    inertiaCompensationRatio: 75,
    leverArmLengthMeters: 0.52,
    dampingRatio: 0.85,
    maxTorqueOffsetLimitNm: 180.0,
    safetyEnvelopeStatus: 'OPTIMAL'
  },
  TOOL_DISPENSER: {
    maxDynamicLoadKg: 6.0,
    minDynamicLoadKg: 0.05,
    ratedPayloadKg: 3.5,
    currentMaterialWeightKg: 1.15,
    materialType: 'POLIMERO_UHMW',
    materialDensityGcm3: 1.30,
    autoTorqueCompensation: true,
    torqueGainFactorNmPerKg: 2.9,
    inertiaCompensationRatio: 92,
    leverArmLengthMeters: 0.30,
    dampingRatio: 0.94,
    maxTorqueOffsetLimitNm: 30.0,
    safetyEnvelopeStatus: 'OPTIMAL'
  },
  TOOL_DEBURRING: {
    maxDynamicLoadKg: 18.0,
    minDynamicLoadKg: 0.1,
    ratedPayloadKg: 10.0,
    currentMaterialWeightKg: 3.9,
    materialType: 'AREIA_FUNDICAO',
    materialDensityGcm3: 1.60,
    autoTorqueCompensation: true,
    torqueGainFactorNmPerKg: 4.6,
    inertiaCompensationRatio: 88,
    leverArmLengthMeters: 0.40,
    dampingRatio: 0.90,
    maxTorqueOffsetLimitNm: 85.0,
    safetyEnvelopeStatus: 'OPTIMAL'
  }
};

export const ToolkitManager: React.FC<ToolkitManagerProps> = ({
  tools,
  activeToolId,
  onSelectTool,
  onCalibrateTool,
  onUpdateTools
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'cards' | 'dynamic_load_panel'>('dynamic_load_panel');
  const [selectedToolIdForConfig, setSelectedToolIdForConfig] = useState<ToolId>(activeToolId);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Local state for tools to ensure instantaneous UI updates and responsiveness
  const [localTools, setLocalTools] = useState<ToolDefinition[]>(() => {
    return tools.map((t) => ({
      ...t,
      dynamicLoadConfig: t.dynamicLoadConfig || DEFAULT_LOAD_CONFIGS[t.id] || DEFAULT_LOAD_CONFIGS.TOOL_GRIPPER
    }));
  });

  // Keep localTools synchronized if incoming tools change
  React.useEffect(() => {
    setLocalTools((prev) => {
      return tools.map((t) => {
        const existing = prev.find((p) => p.id === t.id);
        return {
          ...t,
          dynamicLoadConfig: existing?.dynamicLoadConfig || t.dynamicLoadConfig || DEFAULT_LOAD_CONFIGS[t.id] || DEFAULT_LOAD_CONFIGS.TOOL_GRIPPER
        };
      });
    });
  }, [tools]);

  const currentToolForConfig = useMemo(() => {
    return localTools.find((t) => t.id === selectedToolIdForConfig) || localTools[0];
  }, [localTools, selectedToolIdForConfig]);

  const currentConfig: DynamicLoadConfig = useMemo(() => {
    return (
      currentToolForConfig?.dynamicLoadConfig ||
      DEFAULT_LOAD_CONFIGS[selectedToolIdForConfig] ||
      DEFAULT_LOAD_CONFIGS.TOOL_GRIPPER
    );
  }, [currentToolForConfig, selectedToolIdForConfig]);

  // Dynamic Torque Compensation Calculation Engine
  const compensationCalculations = useMemo(() => {
    const weight = currentConfig.currentMaterialWeightKg;
    const maxLimit = currentConfig.maxDynamicLoadKg;
    const rated = currentConfig.ratedPayloadKg;
    const minLimit = currentConfig.minDynamicLoadKg;
    const gainFactor = currentConfig.torqueGainFactorNmPerKg;
    const inertiaRatio = currentConfig.inertiaCompensationRatio / 100;
    const leverArm = currentConfig.leverArmLengthMeters;
    const isAutoActive = currentConfig.autoTorqueCompensation;

    // Safety Envelope Evaluation
    let envelopeStatus: 'OPTIMAL' | 'MODERATE' | 'NEAR_LIMIT' | 'OVERLOAD_PREVENTED' = 'OPTIMAL';
    let isOverloaded = false;

    if (weight > maxLimit) {
      envelopeStatus = 'OVERLOAD_PREVENTED';
      isOverloaded = true;
    } else if (weight > rated) {
      envelopeStatus = weight >= maxLimit * 0.9 ? 'NEAR_LIMIT' : 'MODERATE';
    } else if (weight < minLimit) {
      envelopeStatus = 'OPTIMAL';
    } else {
      envelopeStatus = 'OPTIMAL';
    }

    // Effective clamped weight for torque formula if safe or auto-limiting
    const effectiveWeightForTorque = isOverloaded ? maxLimit : weight;

    // Torque formula: tau_gravity = m * g * L_arm
    const g = 9.80665;
    const rawGravityTorqueNm = effectiveWeightForTorque * g * leverArm;
    
    // Additional Dynamic Torque Compensation: Delta_tau = weight * gainFactor * (1 + inertiaRatio * 0.5)
    let dynamicTorqueOffsetNm = isAutoActive 
      ? effectiveWeightForTorque * gainFactor * (1 + inertiaRatio * 0.45) 
      : 0;

    // Limit by tool's maximum safety torque offset
    if (dynamicTorqueOffsetNm > currentConfig.maxTorqueOffsetLimitNm) {
      dynamicTorqueOffsetNm = currentConfig.maxTorqueOffsetLimitNm;
    }

    // Estimated Base Torque without material (tare of end effector)
    const baseTorqueNm = currentToolForConfig.maxTorqueNm ? currentToolForConfig.maxTorqueNm * 0.22 : 12.0;
    const totalCompensatedTorqueNm = baseTorqueNm + dynamicTorqueOffsetNm;

    // Joint-by-joint torque adjustment breakdown (J1 to J6)
    const jointTorqueDeltas = [
      { joint: 'J1 - Base Yaw', deltaNm: dynamicTorqueOffsetNm * 0.18, role: 'Inércia Centrífuga & Azimute', baseline: 12.4 },
      { joint: 'J2 - Shoulder Pitch', deltaNm: dynamicTorqueOffsetNm * 0.82, role: 'Momento Fletor Gravítico Principal', baseline: 34.8 },
      { joint: 'J3 - Elbow Pitch', deltaNm: dynamicTorqueOffsetNm * 0.64, role: 'Sustentação do Antebraço & Carga', baseline: 28.1 },
      { joint: 'J4 - Wrist Roll', deltaNm: dynamicTorqueOffsetNm * 0.22, role: 'Torção Axial do Efetuador', baseline: 8.2 },
      { joint: 'J5 - Wrist Pitch', deltaNm: dynamicTorqueOffsetNm * 0.42, role: 'Inclinação e Vetor de Deflexão do TCP', baseline: 6.5 },
      { joint: 'J6 - Flange Yaw', deltaNm: dynamicTorqueOffsetNm * 0.12, role: 'Centragem Dinâmica & Inércia Rotativa', baseline: 4.1 },
    ];

    const loadPercentage = maxLimit > 0 ? Math.min(100, Math.round((weight / maxLimit) * 100)) : 0;

    return {
      weight,
      maxLimit,
      rated,
      minLimit,
      loadPercentage,
      envelopeStatus,
      isOverloaded,
      rawGravityTorqueNm,
      dynamicTorqueOffsetNm,
      totalCompensatedTorqueNm,
      jointTorqueDeltas,
      isAutoActive
    };
  }, [currentConfig, currentToolForConfig]);

  // Update Dynamic Load Config for the currently selected tool
  const handleUpdateConfig = (partial: Partial<DynamicLoadConfig>) => {
    setLocalTools((prev) => {
      const updated = prev.map((t) => {
        if (t.id === selectedToolIdForConfig) {
          const newConfig: DynamicLoadConfig = {
            ...(t.dynamicLoadConfig || DEFAULT_LOAD_CONFIGS[t.id] || DEFAULT_LOAD_CONFIGS.TOOL_GRIPPER),
            ...partial,
            lastAutoAdjustmentTimestamp: new Date().toLocaleTimeString()
          };
          return {
            ...t,
            dynamicLoadConfig: newConfig
          };
        }
        return t;
      });

      // Persist to localStorage
      try {
        localStorage.setItem('er2_tools', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }

      // Notify parent if prop available
      if (onUpdateTools) {
        onUpdateTools(updated);
      }

      return updated;
    });
  };

  // Change Material Preset
  const handleSelectMaterial = (material: ProcessedMaterialType) => {
    const preset = MATERIAL_PRESETS[material];
    handleUpdateConfig({
      materialType: material,
      materialDensityGcm3: preset.density,
      torqueGainFactorNmPerKg: preset.defaultTorqueFactor
    });
  };

  // Apply Quick Weight Test Preset
  const handleApplyWeightPreset = (weightKg: number) => {
    handleUpdateConfig({ currentMaterialWeightKg: weightKg });
  };

  // Save Confirmation Toast
  const handleSaveParameters = () => {
    try {
      localStorage.setItem('er2_tools', JSON.stringify(localTools));
      setSaveSuccessMessage(`Limites de carga e compensação de torque gravados no Firmware para ${currentToolForConfig.name}!`);
      setTimeout(() => setSaveSuccessMessage(null), 3500);
      if (onUpdateTools) {
        onUpdateTools(localTools);
      }
    } catch {
      setSaveSuccessMessage('Configuração aplicada com sucesso!');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    }
  };

  // Reset to Factory Engineering Defaults
  const handleResetDefaults = () => {
    const factory = DEFAULT_LOAD_CONFIGS[selectedToolIdForConfig] || DEFAULT_LOAD_CONFIGS.TOOL_GRIPPER;
    handleUpdateConfig({ ...factory });
    setSaveSuccessMessage(`Valores nominais de fábrica restaurados para ${currentToolForConfig.name}.`);
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  const getIcon = (id: ToolId) => {
    switch (id) {
      case 'TOOL_GRIPPER':
        return <Hand className="w-5 h-5 text-sky-400" />;
      case 'TOOL_WELDER':
        return <Flame className="w-5 h-5 text-red-400" />;
      case 'TOOL_VISION_INSPECTOR':
        return <Eye className="w-5 h-5 text-emerald-400" />;
      case 'TOOL_FASTENER':
        return <Wrench className="w-5 h-5 text-amber-400" />;
      case 'TOOL_SUCTION_CRANE':
        return <Boxes className="w-5 h-5 text-indigo-400" />;
      case 'TOOL_DISPENSER':
        return <Droplet className="w-5 h-5 text-teal-400" />;
      case 'TOOL_DEBURRING':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      default:
        return <Wrench className="w-5 h-5 text-sky-400" />;
    }
  };

  if (isMinimized) {
    const activeTool = localTools.find((t) => t.id === activeToolId);
    const activeCfg = activeTool?.dynamicLoadConfig || DEFAULT_LOAD_CONFIGS[activeToolId];
    return (
      <div id="toolkit-manager-module" className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 shrink-0">
            {getIcon(activeToolId)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white truncate">
                Ferramenta: <span className="text-sky-300">{activeTool?.name}</span>
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded border border-emerald-500/30">
                Acoplado
              </span>
              <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.2 rounded border border-indigo-500/30 hidden sm:inline-flex items-center gap-1">
                <Scale className="w-3 h-3" /> Carga: {activeCfg?.currentMaterialWeightKg ?? 2.0} kg
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">{activeTool?.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none">
            {localTools.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  onSelectTool(t.id);
                  setSelectedToolIdForConfig(t.id);
                }}
                className={`p-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                  t.id === activeToolId
                    ? 'bg-sky-500 text-slate-950 border-sky-400'
                    : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                }`}
                title={t.name}
              >
                {t.id.replace('TOOL_', '')}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 text-[10px] font-bold"
            title="Expandir Kit de Ferramentas"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Expandir Kit</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="toolkit-manager-module" className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-sm">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Kit de Ferramentas & Atuadores (End-Effectors)
                <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-500/30 uppercase tracking-wider">
                  7 / 7 Acopladores
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Defina limites de carga dinâmica (Dynamic Load Weight) para cada ferramenta e ajuste automaticamente a compensação de torque conforme o peso do material processado.
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher & Minimalize */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              id="btn-toolkit-view-config"
              onClick={() => setActiveTab('dynamic_load_panel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'dynamic_load_panel'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-cyan-300" />
              <span>Carga Dinâmica & Torque</span>
            </button>

            <button
              id="btn-toolkit-view-cards"
              onClick={() => setActiveTab('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'cards'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-300" />
              <span>Visão Geral das Ferramentas</span>
            </button>
          </div>

          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 flex items-center gap-1 text-xs transition-colors"
            title="Minimalizar Kit de Ferramentas"
          >
            <Minimize2 className="w-4 h-4" />
            <span className="hidden md:inline text-[11px]">Minimalizar</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert Banner */}
      {saveSuccessMessage && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400/80">Sincronizado</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: PAINEL DE CONFIGURAÇÃO DE CARGA DINÂMICA & COMPENSAÇÃO DE TORQUE   */}
      {/* ========================================================================= */}
      {activeTab === 'dynamic_load_panel' && (
        <div className="space-y-4">
          {/* Tool Selector Horizontal Strip */}
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-sky-400" />
                Selecione a Ferramenta para Configurar Limites de Carga:
              </span>
              <span className="text-[11px] font-mono text-sky-400">
                Ativa no Robô: <strong className="text-white">{tools.find((t) => t.id === activeToolId)?.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {localTools.map((t) => {
                const isSelected = t.id === selectedToolIdForConfig;
                const isEquipped = t.id === activeToolId;
                const cfg = t.dynamicLoadConfig || DEFAULT_LOAD_CONFIGS[t.id];

                return (
                  <button
                    key={t.id}
                    id={`btn-select-tool-load-${t.id}`}
                    onClick={() => setSelectedToolIdForConfig(t.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-400 text-white shadow-lg shadow-sky-500/10 ring-1 ring-sky-400/50'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {isEquipped && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Acoplada no TCP" />
                    )}
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-sky-500/30' : 'bg-slate-800'}`}>
                        {getIcon(t.id)}
                      </div>
                      <span className="text-[11px] font-bold truncate leading-tight">{t.name.split('(')[0]}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1 pt-1 border-t border-slate-800/60">
                      <span>Max: <strong className="text-slate-200">{cfg?.maxDynamicLoadKg}kg</strong></span>
                      <span className="text-sky-300">{cfg?.currentMaterialWeightKg}kg</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tool Dynamic Load Configuration Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column: Sliders, Material & Limit Controls (7 cols) */}
            <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-5">
              <div>
                {/* Tool Title & Auto Compensation Switch */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      {getIcon(currentToolForConfig.id)}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        {currentToolForConfig.name}
                        {currentToolForConfig.id === activeToolId && (
                          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                            ACOPLADO
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400">{currentToolForConfig.description}</p>
                    </div>
                  </div>

                  {/* Auto-Compensation Toggle */}
                  <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 shrink-0">
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-white block">Compensação de Torque</span>
                      <span className={`text-[10px] font-mono ${currentConfig.autoTorqueCompensation ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {currentConfig.autoTorqueCompensation ? 'ATIVA (AUTO-AJUSTE)' : 'DESATIVADA'}
                      </span>
                    </div>
                    <button
                      id="toggle-auto-torque-compensation"
                      onClick={() => handleUpdateConfig({ autoTorqueCompensation: !currentConfig.autoTorqueCompensation })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        currentConfig.autoTorqueCompensation ? 'bg-sky-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          currentConfig.autoTorqueCompensation ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Material Selection Grid */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-sky-400" />
                      Material Sendo Processado na Ferramenta:
                    </label>
                    <span className="text-[11px] font-mono text-slate-400">
                      Densidade: <strong className="text-sky-300">{currentConfig.materialDensityGcm3} g/cm³</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.keys(MATERIAL_PRESETS) as ProcessedMaterialType[]).slice(0, 8).map((matKey) => {
                      const preset = MATERIAL_PRESETS[matKey];
                      const isSelected = currentConfig.materialType === matKey;

                      return (
                        <button
                          key={matKey}
                          onClick={() => handleSelectMaterial(matKey)}
                          className={`p-2 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-slate-800 border-sky-400 text-white ring-1 ring-sky-400/40 shadow-sm'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="text-[11px] font-bold truncate leading-tight">{preset.label.split('/')[0]}</div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                            <span>{preset.density} g/cm³</span>
                            <span className="font-mono text-sky-400/80">x{preset.defaultTorqueFactor}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                    <Info className="w-3.5 h-3.5 text-sky-400 inline mr-1" />
                    {MATERIAL_PRESETS[currentConfig.materialType]?.desc || 'Ajuste dinâmico de torque calibrado para o material selecionado.'}
                  </p>
                </div>

                {/* Dynamic Material Weight Slider (Real-Time Material Processing Weight) */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 mb-5 shadow-inner">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-emerald-400" />
                      <label className="text-xs font-bold text-white">
                        Peso Dinâmico do Material em Processamento:
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                        {currentConfig.currentMaterialWeightKg.toFixed(2)} kg
                      </span>
                    </div>
                  </div>

                  {/* Interactive Weight Slider */}
                  <input
                    id="slider-material-weight"
                    type="range"
                    min="0.05"
                    max={Math.max(currentConfig.maxDynamicLoadKg * 1.3, 10).toFixed(1)}
                    step="0.05"
                    value={currentConfig.currentMaterialWeightKg}
                    onChange={(e) => handleUpdateConfig({ currentMaterialWeightKg: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none mb-2"
                  />

                  {/* Quick Preset Weight Chips */}
                  <div className="flex items-center justify-between gap-1 flex-wrap text-[10px]">
                    <span className="text-slate-400 font-mono">Testar cargas:</span>
                    <button
                      onClick={() => handleApplyWeightPreset(0.35)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                    >
                      Leve (0.35 kg)
                    </button>
                    <button
                      onClick={() => handleApplyWeightPreset(currentConfig.ratedPayloadKg * 0.5)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                    >
                      Nominal Médio ({(currentConfig.ratedPayloadKg * 0.5).toFixed(1)} kg)
                    </button>
                    <button
                      onClick={() => handleApplyWeightPreset(currentConfig.ratedPayloadKg)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700"
                    >
                      Nominal Max ({currentConfig.ratedPayloadKg.toFixed(1)} kg)
                    </button>
                    <button
                      onClick={() => handleApplyWeightPreset(currentConfig.maxDynamicLoadKg)}
                      className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold"
                    >
                      Teto Dinâmico ({currentConfig.maxDynamicLoadKg.toFixed(1)} kg)
                    </button>
                  </div>
                </div>

                {/* Configuration Inputs: Dynamic Load Weight Limits */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  {/* Max Dynamic Load Weight */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Limite Máximo de Carga (W_max):
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        id="input-max-dynamic-load"
                        type="number"
                        min="0.5"
                        max="100"
                        step="0.5"
                        value={currentConfig.maxDynamicLoadKg}
                        onChange={(e) => handleUpdateConfig({ maxDynamicLoadKg: Math.max(0.5, parseFloat(e.target.value) || 1) })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-sky-400"
                      />
                      <span className="text-xs font-mono text-slate-400">kg</span>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 block">Teto para corte de emergência</span>
                  </div>

                  {/* Rated Payload Weight */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Carga Nominal Recomendada:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        id="input-rated-payload"
                        type="number"
                        min="0.2"
                        max="80"
                        step="0.5"
                        value={currentConfig.ratedPayloadKg}
                        onChange={(e) => handleUpdateConfig({ ratedPayloadKg: Math.max(0.2, parseFloat(e.target.value) || 1) })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-sky-300 focus:outline-none focus:border-sky-400"
                      />
                      <span className="text-xs font-mono text-slate-400">kg</span>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 block">Envelope de ciclo contínuo</span>
                  </div>

                  {/* Min Dynamic Load Weight (Tare Threshold) */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Limite Mínimo de Sensibilidade:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        id="input-min-dynamic-load"
                        type="number"
                        min="0.001"
                        max="5"
                        step="0.05"
                        value={currentConfig.minDynamicLoadKg}
                        onChange={(e) => handleUpdateConfig({ minDynamicLoadKg: Math.max(0.001, parseFloat(e.target.value) || 0.01) })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-sky-400"
                      />
                      <span className="text-xs font-mono text-slate-400">kg</span>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 block">Limiar para filtragem de tara</span>
                  </div>
                </div>

                {/* Advanced Kinematic Parameters (Lever Arm & Torque Gain) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                  <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80">
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                      Braço de Alavanca Efetivo (TCP):
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0.1"
                        max="1.5"
                        step="0.02"
                        value={currentConfig.leverArmLengthMeters}
                        onChange={(e) => handleUpdateConfig({ leverArmLengthMeters: parseFloat(e.target.value) || 0.35 })}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded px-2 py-1 text-xs font-mono text-white"
                      />
                      <span className="text-xs font-mono text-slate-400">m</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80">
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                      Ganho de Compensação:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0.5"
                        max="20"
                        step="0.1"
                        value={currentConfig.torqueGainFactorNmPerKg}
                        onChange={(e) => handleUpdateConfig({ torqueGainFactorNmPerKg: parseFloat(e.target.value) || 3.0 })}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded px-2 py-1 text-xs font-mono text-sky-300"
                      />
                      <span className="text-xs font-mono text-slate-400">Nm/kg</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80">
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                      Compensação Inercial:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="10"
                        max="100"
                        step="5"
                        value={currentConfig.inertiaCompensationRatio}
                        onChange={(e) => handleUpdateConfig({ inertiaCompensationRatio: parseInt(e.target.value) || 80 })}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded px-2 py-1 text-xs font-mono text-emerald-300"
                      />
                      <span className="text-xs font-mono text-slate-400">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Save & Calibrate */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <button
                  id="btn-reset-tool-limits"
                  onClick={handleResetDefaults}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                  Restaurar Padrão
                </button>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-equip-tool-now"
                    onClick={() => onSelectTool(currentToolForConfig.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      currentToolForConfig.id === activeToolId
                        ? 'bg-slate-800 text-slate-400 border border-slate-700'
                        : 'bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30'
                    }`}
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    {currentToolForConfig.id === activeToolId ? 'Ferramenta Já Acoplada' : 'Acoplar no TCP Agora'}
                  </button>

                  <button
                    id="btn-save-tool-dynamic-limits"
                    onClick={handleSaveParameters}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Gravar no Firmware
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Live Torque Auto-Adjustment Display & Joint Breakdown (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Dynamic Status / Envelope Indicator */}
              <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    Auto-Ajuste de Torque em Tempo Real
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    τ = m·g·L + I·α
                  </span>
                </div>

                {/* Envelope Status Badge */}
                <div className={`p-3 rounded-xl border mb-3 flex items-start gap-2.5 ${
                  compensationCalculations.isOverloaded
                    ? 'bg-red-500/10 border-red-500/40 text-red-300'
                    : compensationCalculations.envelopeStatus === 'NEAR_LIMIT'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}>
                  {compensationCalculations.isOverloaded ? (
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-xs font-bold block">
                      {compensationCalculations.isOverloaded
                        ? 'Sobrecarga Dinâmica Prevenida (Corte Ativo)'
                        : compensationCalculations.envelopeStatus === 'NEAR_LIMIT'
                        ? 'Carga Elevada: Compensação de Torque Intensificada'
                        : 'Envelope Dinâmico Seguro & Compensação Ideal'}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {compensationCalculations.isOverloaded
                        ? `O peso do material (${compensationCalculations.weight.toFixed(2)} kg) ultrapassou o limite dinâmico de ${compensationCalculations.maxLimit} kg. O torque foi limitado em ${currentConfig.maxTorqueOffsetLimitNm} Nm para proteger redutores harmônicos.`
                        : `O robô aplicou automaticamente +${compensationCalculations.dynamicTorqueOffsetNm.toFixed(1)} Nm de compensação de torque proporcional à densidade de ${currentConfig.materialType}.`}
                    </p>
                  </div>
                </div>

                {/* Primary Torque Telemetry Meters */}
                <div className="grid grid-cols-2 gap-2 text-center mb-3">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Torque Compensado Adicional</span>
                    <span className="text-lg font-black font-mono text-cyan-400">
                      +{compensationCalculations.dynamicTorqueOffsetNm.toFixed(1)} <span className="text-xs font-normal">Nm</span>
                    </span>
                    <span className="text-[9px] text-slate-500 block">Δτ por carga do material</span>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Carga Atual vs Teto</span>
                    <span className={`text-lg font-black font-mono ${
                      compensationCalculations.isOverloaded ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {compensationCalculations.loadPercentage}%
                    </span>
                    <span className="text-[9px] text-slate-500 block">
                      {compensationCalculations.weight.toFixed(1)} / {compensationCalculations.maxLimit.toFixed(1)} kg
                    </span>
                  </div>
                </div>

                {/* Load Capacity Progress Bar */}
                <div className="space-y-1 mb-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Envelope de Carga:</span>
                    <span>{compensationCalculations.weight.toFixed(2)} kg</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        compensationCalculations.isOverloaded
                          ? 'bg-red-500'
                          : compensationCalculations.envelopeStatus === 'NEAR_LIMIT'
                          ? 'bg-amber-400'
                          : 'bg-gradient-to-r from-emerald-500 to-sky-400'
                      }`}
                      style={{ width: `${Math.min(100, compensationCalculations.loadPercentage)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 6-DOF Joint Torque Distribution Matrix */}
              <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Compensação por Articulação (J1 a J6)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Auto-Ajuste Ativo
                  </span>
                </div>

                <div className="space-y-2 text-[11px]">
                  {compensationCalculations.jointTorqueDeltas.map((joint) => {
                    const totalJointTorque = joint.baseline + joint.deltaNm;
                    return (
                      <div key={joint.joint} className="bg-slate-900/70 p-2 rounded-xl border border-slate-800/70 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="font-bold text-slate-200 block truncate">{joint.joint}</span>
                          <span className="text-[10px] text-slate-400 truncate block">{joint.role}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-cyan-300 block">
                            +{joint.deltaNm.toFixed(1)} Nm
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Total: {totalJointTorque.toFixed(1)} Nm
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 p-2 rounded-lg bg-sky-950/40 border border-sky-800/40 text-[10px] text-sky-300 leading-tight">
                  💡 <strong>Compensação Adaptativa:</strong> Os servomotores ajustam suas malhas de corrente para anular deflexão mecânica, mantendo a precisão de ±{currentToolForConfig.precisionMm} mm mesmo com o material em movimento acelerado.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: VISÃO GERAL DE CARDS DOS 7 ATUADORES & END-EFFECTORS               */}
      {/* ========================================================================= */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {localTools.map((tool) => {
            const isActive = tool.id === activeToolId;
            const loadConfig = tool.dynamicLoadConfig || DEFAULT_LOAD_CONFIGS[tool.id];

            return (
              <div
                key={tool.id}
                id={`tool-card-${tool.id}`}
                onClick={() => onSelectTool(tool.id)}
                className={`relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-800/90 border-sky-500 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2.5 rounded-xl ${isActive ? 'bg-sky-500/20 border border-sky-500/30' : 'bg-slate-800'}`}>
                        {getIcon(tool.id)}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-200 leading-tight">{tool.name}</h3>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">{tool.category}</span>
                      </div>
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold shrink-0">
                        ACOPLADO
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2 mb-3">
                    {tool.description}
                  </p>
                </div>

                {/* Metrics & Dynamic Load Limits Banner */}
                <div>
                  {/* Dynamic Load Weight Chip */}
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 mb-2.5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-sky-400" />
                      Carga Dinâmica:
                    </span>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-400">
                        {loadConfig?.currentMaterialWeightKg ?? 2.0} kg
                      </span>
                      <span className="text-[10px] text-slate-500 ml-1">
                        (Max: {loadConfig?.maxDynamicLoadKg ?? 15}kg)
                      </span>
                    </div>
                  </div>

                  {/* Standard Engineering Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-900/90 p-2 rounded border border-slate-800/80 mb-3">
                    <div>
                      <span className="text-slate-500 block">Precisão:</span>
                      <span className="text-sky-300 font-semibold">±{tool.precisionMm} mm</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Horas de Operação:</span>
                      <span className="text-slate-300">{tool.operatingHours.toFixed(1)} h</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Temperatura:</span>
                      <span className="text-amber-400 font-semibold">{tool.tempCelsius.toFixed(1)} °C</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Desgaste:</span>
                      <span className={`${tool.wearPercentage > 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {tool.wearPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      id={`equip-btn-${tool.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTool(tool.id);
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                        isActive
                          ? 'bg-sky-500 text-slate-950 font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Ferramenta Ativa
                        </>
                      ) : (
                        'Acoplar no TCP'
                      )}
                    </button>

                    <button
                      id={`btn-config-load-${tool.id}`}
                      title="Configurar limites de carga dinâmica e compensação de torque"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedToolIdForConfig(tool.id);
                        setActiveTab('dynamic_load_panel');
                      }}
                      className="p-1.5 px-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition-colors flex items-center gap-1 text-[11px] font-bold"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Carga</span>
                    </button>

                    <button
                      id={`calibrate-btn-${tool.id}`}
                      title="Executar calibração zero e auto-diagnóstico"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCalibrateTool(tool.id);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-sky-400 border border-slate-700 transition-colors"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
