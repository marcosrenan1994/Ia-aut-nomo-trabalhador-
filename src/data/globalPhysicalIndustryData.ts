import { PhysicalPlantLocation, PhysicalIndustryPlan, PlanetaryManufacturingStats } from '../types';

export const INITIAL_PHYSICAL_PLANTS: PhysicalPlantLocation[] = [
  {
    id: 'PLANT-BR-AERO-01',
    name: 'Embraer & Aeroespacial do Brasil (Asas & Fuselagem)',
    city: 'São José dos Campos',
    country: 'Brasil',
    continent: 'AMERICA_SUL',
    coordinates: { lat: -23.2237, lng: -45.9009 },
    sector: 'AEROSPACE_DEFENSE',
    fleetSizeER2: 124,
    physicalOutputCapacityTonOrUnitsPerDay: '4.8 jatos regionais / mês',
    energyGridSource: 'HIDRELETRICA',
    realWorldTolerancesMm: 0.0012,
    carbonOffsetTonsPerYear: 3840,
    activeOptimizationScore: 98.6,
    status: 'EXECUTANDO_OTIMIZACAO_FISICA',
    lastDispatchedProtocol: 'ISO-10303-STEP-AERO-WING-SLERP',
    physicalSensorsOnline: 1840,
    realWorldConstraints: {
      ambientTempRangeC: [18.0, 24.5],
      vibrationDampingHz: 0.02,
      maxPayloadKg: 450,
      supplyChainBottleneckFactor: 0.12
    }
  },
  {
    id: 'PLANT-TW-SEMI-02',
    name: 'TSMC Gigafab 3nm/2nm Fotônica & Nanomateriais',
    city: 'Hsinchu Science Park',
    country: 'Taiwan',
    continent: 'ASIA_PACIFICO',
    coordinates: { lat: 24.7816, lng: 120.9984 },
    sector: 'SEMICONDUCTOR_PHOTONICS',
    fleetSizeER2: 380,
    physicalOutputCapacityTonOrUnitsPerDay: '42.000 wafers 300mm / dia',
    energyGridSource: 'REDE_HIBRIDA_MICROGRID',
    realWorldTolerancesMm: 0.00015,
    carbonOffsetTonsPerYear: 14200,
    activeOptimizationScore: 99.8,
    status: 'SINCRONIZADO_MUNDO_REAL',
    lastDispatchedProtocol: 'SECS-GEM-WAFER-RETICLE-ALIGN-6DOF',
    physicalSensorsOnline: 6200,
    realWorldConstraints: {
      ambientTempRangeC: [20.8, 21.2],
      vibrationDampingHz: 0.001,
      maxPayloadKg: 25,
      supplyChainBottleneckFactor: 0.04
    }
  },
  {
    id: 'PLANT-DE-AUTO-03',
    name: 'Porsche & Mercedes E-Mobility Gigafactory',
    city: 'Stuttgart',
    country: 'Alemanha',
    continent: 'EUROPA',
    coordinates: { lat: 48.7758, lng: 9.1829 },
    sector: 'AUTOMOTIVE_E_MOBILITY',
    fleetSizeER2: 240,
    physicalOutputCapacityTonOrUnitsPerDay: '850 veículos elétricos / dia',
    energyGridSource: 'SOLAR_EOLICA',
    realWorldTolerancesMm: 0.0025,
    carbonOffsetTonsPerYear: 9600,
    activeOptimizationScore: 97.9,
    status: 'AUTO_RECONFIGURANDO_FABRICA',
    lastDispatchedProtocol: 'ETHERCAT-BATTERY-PACK-LASER-SEAM-1070NM',
    physicalSensorsOnline: 3950,
    realWorldConstraints: {
      ambientTempRangeC: [16.0, 26.0],
      vibrationDampingHz: 0.05,
      maxPayloadKg: 1200,
      supplyChainBottleneckFactor: 0.15
    }
  },
  {
    id: 'PLANT-US-SPACE-04',
    name: 'Starbase & Megacasting Propulsion Complex',
    city: 'Boca Chica / Austin',
    country: 'Estados Unidos',
    continent: 'AMERICA_NORTE',
    coordinates: { lat: 25.9972, lng: -97.1561 },
    sector: 'AEROSPACE_DEFENSE',
    fleetSizeER2: 195,
    physicalOutputCapacityTonOrUnitsPerDay: '12 motores de foguete Inconel / sem',
    energyGridSource: 'SOLAR_EOLICA',
    realWorldTolerancesMm: 0.0018,
    carbonOffsetTonsPerYear: 7800,
    activeOptimizationScore: 98.4,
    status: 'EXECUTANDO_OTIMIZACAO_FISICA',
    lastDispatchedProtocol: '5AXIS-INCONEL-TURBOPUMP-MILLING-ADAPTIVE',
    physicalSensorsOnline: 2890,
    realWorldConstraints: {
      ambientTempRangeC: [10.0, 38.0],
      vibrationDampingHz: 0.04,
      maxPayloadKg: 2500,
      supplyChainBottleneckFactor: 0.09
    }
  },
  {
    id: 'PLANT-DK-WIND-05',
    name: 'Vestas Gigante Turbinas Eólicas Offshore 15MW',
    city: 'Aarhus',
    country: 'Dinamarca',
    continent: 'EUROPA',
    coordinates: { lat: 56.1629, lng: 10.2039 },
    sector: 'CLEAN_ENERGY_GRID',
    fleetSizeER2: 88,
    physicalOutputCapacityTonOrUnitsPerDay: '6 pás de 115m fibra de carbono / sem',
    energyGridSource: 'SOLAR_EOLICA',
    realWorldTolerancesMm: 0.015,
    carbonOffsetTonsPerYear: 28400,
    activeOptimizationScore: 99.1,
    status: 'SINCRONIZADO_MUNDO_REAL',
    lastDispatchedProtocol: 'ULTRASONIC-NDT-FIBER-COMPOSITE-SCAN',
    physicalSensorsOnline: 1420,
    realWorldConstraints: {
      ambientTempRangeC: [12.0, 22.0],
      vibrationDampingHz: 0.03,
      maxPayloadKg: 8500,
      supplyChainBottleneckFactor: 0.07
    }
  },
  {
    id: 'PLANT-CH-PHARMA-06',
    name: 'Novartis & Roche Biorreatores Assépticos e Nanomedicina',
    city: 'Basel',
    country: 'Suíça',
    continent: 'EUROPA',
    coordinates: { lat: 47.5596, lng: 7.5886 },
    sector: 'BIOPHARMA_MEDTECH',
    fleetSizeER2: 110,
    physicalOutputCapacityTonOrUnitsPerDay: '1.2M ampolas estéreis / dia',
    energyGridSource: 'HIDRELETRICA',
    realWorldTolerancesMm: 0.0008,
    carbonOffsetTonsPerYear: 4200,
    activeOptimizationScore: 99.9,
    status: 'SINCRONIZADO_MUNDO_REAL',
    lastDispatchedProtocol: 'GMP-GRADE-A-ISOLATOR-CLOSED-LOOP-PIEZO',
    physicalSensorsOnline: 2400,
    realWorldConstraints: {
      ambientTempRangeC: [19.5, 20.5],
      vibrationDampingHz: 0.005,
      maxPayloadKg: 15,
      supplyChainBottleneckFactor: 0.02
    }
  },
  {
    id: 'PLANT-BR-MINING-07',
    name: 'Complexo Metalúrgico & Mineração Sustentável Carajás',
    city: 'Parauapebas / Belo Horizonte',
    country: 'Brasil',
    continent: 'AMERICA_SUL',
    coordinates: { lat: -6.0684, lng: -49.9056 },
    sector: 'HEAVY_METALLURGY_MINING',
    fleetSizeER2: 165,
    physicalOutputCapacityTonOrUnitsPerDay: '380.000 ton minério verde / dia',
    energyGridSource: 'HIDRELETRICA',
    realWorldTolerancesMm: 0.05,
    carbonOffsetTonsPerYear: 64000,
    activeOptimizationScore: 96.8,
    status: 'EXECUTANDO_OTIMIZACAO_FISICA',
    lastDispatchedProtocol: 'HYDROGEN-DRI-DIRECT-REDUCTION-CRUSHER-TORQUE',
    physicalSensorsOnline: 3100,
    realWorldConstraints: {
      ambientTempRangeC: [22.0, 39.0],
      vibrationDampingHz: 0.25,
      maxPayloadKg: 15000,
      supplyChainBottleneckFactor: 0.18
    }
  },
  {
    id: 'PLANT-SG-PORT-08',
    name: 'Porto de Cingapura & Hub Logístico Físico Automatizado',
    city: 'Tuas Mega Port',
    country: 'Cingapura',
    continent: 'ASIA_PACIFICO',
    coordinates: { lat: 1.3521, lng: 103.8198 },
    sector: 'GLOBAL_LOGISTICS_PORTS',
    fleetSizeER2: 210,
    physicalOutputCapacityTonOrUnitsPerDay: '110.000 TEUs contêineres / dia',
    energyGridSource: 'SOLAR_EOLICA',
    realWorldTolerancesMm: 0.02,
    carbonOffsetTonsPerYear: 32000,
    activeOptimizationScore: 99.4,
    status: 'SINCRONIZADO_MUNDO_REAL',
    lastDispatchedProtocol: 'DYNAMIC-MARITIME-STRADDLE-INERTIA-PREDICTION',
    physicalSensorsOnline: 4700,
    realWorldConstraints: {
      ambientTempRangeC: [24.0, 34.0],
      vibrationDampingHz: 0.10,
      maxPayloadKg: 45000,
      supplyChainBottleneckFactor: 0.05
    }
  },
  {
    id: 'PLANT-BR-AGRO-09',
    name: 'Complexo Agro-Robótico de Precisão e Fotônica de Solo',
    city: 'Ribeirão Preto',
    country: 'Brasil',
    continent: 'AMERICA_SUL',
    coordinates: { lat: -21.1775, lng: -47.8103 },
    sector: 'PRECISION_AGRO_ROBOTICS',
    fleetSizeER2: 140,
    physicalOutputCapacityTonOrUnitsPerDay: '42.000 hectares mapeados / dia',
    energyGridSource: 'SOLAR_EOLICA',
    realWorldTolerancesMm: 0.01,
    carbonOffsetTonsPerYear: 48000,
    activeOptimizationScore: 98.7,
    status: 'SINCRONIZADO_MUNDO_REAL',
    lastDispatchedProtocol: 'VARIABLE-RATE-NITROGEN-MICRODROPLET-INJECTION',
    physicalSensorsOnline: 2650,
    realWorldConstraints: {
      ambientTempRangeC: [15.0, 37.0],
      vibrationDampingHz: 0.15,
      maxPayloadKg: 800,
      supplyChainBottleneckFactor: 0.10
    }
  },
  {
    id: 'PLANT-JP-ROBOTICS-10',
    name: 'Centro de Redutores Harmônicos & Guias Sub-Mícron',
    city: 'Yamanashi',
    country: 'Japão',
    continent: 'ASIA_PACIFICO',
    coordinates: { lat: 35.6639, lng: 138.5684 },
    sector: 'SEMICONDUCTOR_PHOTONICS',
    fleetSizeER2: 175,
    physicalOutputCapacityTonOrUnitsPerDay: '3.400 atuadores de alta precisão / dia',
    energyGridSource: 'NUCLEAR_FUSAO',
    realWorldTolerancesMm: 0.0003,
    carbonOffsetTonsPerYear: 5100,
    activeOptimizationScore: 99.7,
    status: 'SINCRONIZADO_MUNDO_REAL',
    lastDispatchedProtocol: 'OPTICAL-INTERFEROMETRY-GEAR-SURFACE-HOMING',
    physicalSensorsOnline: 3800,
    realWorldConstraints: {
      ambientTempRangeC: [20.0, 22.0],
      vibrationDampingHz: 0.002,
      maxPayloadKg: 60,
      supplyChainBottleneckFactor: 0.03
    }
  }
];

export const INITIAL_PHYSICAL_PLANS: PhysicalIndustryPlan[] = [
  {
    id: 'PLAN-AERO-001',
    timestamp: '16:04:12',
    sector: 'AEROSPACE_DEFENSE',
    plantTargetId: 'PLANT-BR-AERO-01',
    plantName: 'Embraer & Aeroespacial do Brasil',
    title: 'Otimização Topológica de Longarinas de Titânio Ti-6Al-4V via Redução de Deformação Térmica',
    realWorldPhysicalChallenge: 'Tensões residuais durante fresamento 5-eixos de alta velocidade causavam desvios de ±0.035mm em nervuras delgadas de 1.8mm de espessura.',
    er2AutonomousSolution: 'O ER-2 recalculou os vetores de avanço SLERP distribuindo a dissipação de calor por micro-pulsos criogênicos e compensando a deflexão elástica da ferramenta dinamicamente.',
    physicalMetricsImpact: {
      materialWasteReductionKg: 142.5,
      energySavedKwhPerShift: 380,
      cycleTimeReductionSec: 412,
      microToleranceGainMm: 0.0021,
      paybackDays: 14,
      thermodynamicEfficiencyGainPct: 24.8
    },
    hardwareStandardsGenerated: {
      plcLogicIEC61131: `// IEC 61131-3 Structured Text gerado pelo ER-2 para Siemens S7-1500 / Beckhoff TwinCAT
PROGRAM ER2_Thermal_Compensator
VAR
  rCurTemp : REAL;
  rSpindleLoad : REAL;
  rAdaptiveFeed : REAL;
  bLaserInterlock : BOOL;
END_VAR
IF rCurTemp > 24.2 THEN
  rAdaptiveFeed := 120.0 * (1.0 - (rCurTemp - 24.2) * 0.08);
  M08_CryoCoolant := TRUE;
ELSE
  rAdaptiveFeed := 120.0;
END_IF;`,
      gCodeTrajectory: `G90 G21 G94 G17 G64 P0.002
G00 X-240.500 Y180.200 Z45.000 A0.000 B15.400
G01 Z-2.500 F1800 M08 S24000
G02 X-210.000 Y210.700 I30.500 J0.000 F2400
G01 X150.000 Y210.700 F3200
M05 M09
G00 Z100.000`,
      step3DTopologyOptimizationSummary: 'ISO 10303-242: Massa reduzida em 18.4% com rigidez torsional aumentada em 32.1% no nó de asa.',
      thermodynamicCoolingProfile: 'Gradiente de temperatura estabilizado em ΔT < 0.4°C ao longo de 4.2 metros de perfil.'
    },
    globalPlanetaryImpactDescription: 'Economia direta de 1.8 toneladas de liga aeronáutica virgem e redução de 28.4 MWh por ciclo de fuselagem.',
    status: 'IMPLANTADO_GLOBALMENTE'
  },
  {
    id: 'PLAN-SEMI-002',
    timestamp: '16:02:45',
    sector: 'SEMICONDUCTOR_PHOTONICS',
    plantTargetId: 'PLANT-TW-SEMI-02',
    plantName: 'TSMC Gigafab 3nm/2nm',
    title: 'Amortecimento Ativo de Microvibrações em Manipulação de Retículos Litográficos EUV',
    realWorldPhysicalChallenge: 'Oscilações acústicas de baixa frequência (12-40 Hz) no piso limpo induziam jitter de 0.8nm na transferência robótica de wafers.',
    er2AutonomousSolution: 'Injeção de contra-torque piezoelétrico em malha de 10kHz com predição estocástica das ondas sísmicas e de fluxo de ar laminar.',
    physicalMetricsImpact: {
      materialWasteReductionKg: 0.0,
      energySavedKwhPerShift: 120,
      cycleTimeReductionSec: 8.4,
      microToleranceGainMm: 0.00008,
      paybackDays: 3,
      thermodynamicEfficiencyGainPct: 31.5
    },
    hardwareStandardsGenerated: {
      plcLogicIEC61131: `// IEC 61131-3 Piezo Counter-Vibration Filter
FUNCTION_BLOCK FB_PiezoVibFilter
VAR_INPUT
  rSensorAccX : REAL;
  rSensorAccY : REAL;
END_VAR
VAR_OUTPUT
  rPiezoVoltX : REAL;
  rPiezoVoltY : REAL;
END_VAR
rPiezoVoltX := -1.0 * (rSensorAccX * 14.85 + DERIVATIVE(rSensorAccX) * 0.42);
rPiezoVoltY := -1.0 * (rSensorAccY * 14.85 + DERIVATIVE(rSensorAccY) * 0.42);`,
      gCodeTrajectory: `G90 G01 X0.0000 Y0.0000 Z0.0000 F60
G01 X150.0000 Y0.0000 F120 ; Trajetória com curva Spline Bézier 7ª ordem
M62 P1 ; Disparo sincronizado de vácuo eletrostático`,
      step3DTopologyOptimizationSummary: 'End-Effector de Carbono-SiC com peso de 380g e frequência de ressonância elevada para 480 Hz.',
      thermodynamicCoolingProfile: 'Controle de radiação térmica constante a 21.000°C ± 0.005°C.'
    },
    globalPlanetaryImpactDescription: 'Aumento de rendimento de silício em +1.4% em escala global de chips de IA e computação quântica.',
    status: 'IMPLANTADO_GLOBALMENTE'
  },
  {
    id: 'PLAN-AUTO-003',
    timestamp: '15:58:10',
    sector: 'AUTOMOTIVE_E_MOBILITY',
    plantTargetId: 'PLANT-DE-AUTO-03',
    plantName: 'Porsche & Mercedes E-Mobility',
    title: 'Sincronização Cinemática Hexa-Robótica para Montagem de Módulos de Bateria de 800V',
    realWorldPhysicalChallenge: 'Empilhamento de células prismáticas com tolerâncias térmicas acumuladas gerava micro-esmagamento de coletores de corrente.',
    er2AutonomousSolution: 'Controle de impedância adaptativa baseado em sensores de força de 6 eixos distribuídos cooperativamente entre 6 robôs ER-2 simultâneos.',
    physicalMetricsImpact: {
      materialWasteReductionKg: 85.0,
      energySavedKwhPerShift: 540,
      cycleTimeReductionSec: 64,
      microToleranceGainMm: 0.0015,
      paybackDays: 22,
      thermodynamicEfficiencyGainPct: 19.8
    },
    hardwareStandardsGenerated: {
      plcLogicIEC61131: `// EtherCAT Multi-Robot Collision-Free Zone Allocator
PROGRAM MultiRobot_800V_Pack
VAR
  nPackID : DINT;
  bCellGripConfirmed : ARRAY[1..6] OF BOOL;
  rContactForceZ : REAL;
END_VAR
IF rContactForceZ > 4.5 (* Newtons *) THEN
  CALL Compensate_Z_Impedance(DeltaZ := -0.015);
END_IF;`,
      gCodeTrajectory: `G90 G21 G94
G01 X350.000 Y120.000 Z80.000 F4500
G01 Z15.000 F800 ; Inserção controlada por força
G04 P200 ; Estabilização de contato elástico
M10 Q800 ; Validação de isolamento dielétrico`,
      step3DTopologyOptimizationSummary: 'Garras modulares de polímero PEEK condutivo antiestático com absorção de impacto elastomérica.',
      thermodynamicCoolingProfile: 'Refrigeração de barramentos de cobre por túnel de convecção forçada a 18°C.'
    },
    globalPlanetaryImpactDescription: 'Eliminação de 100% dos descartes de módulos de lítio e aumento na vida útil de baterias de 800V.',
    status: 'EM_EXECUCAO_FISICA'
  }
];

export const INITIAL_PLANETARY_STATS: PlanetaryManufacturingStats = {
  activeER2UnitsGlobally: 1647,
  totalPhysicalPlantsSynchronized: 10,
  accumulatedEnergySavedMWh: 14892.4,
  accumulatedRawMaterialSavedTons: 3840.6,
  globalDefectPpmReducedTo: 1.2,
  globalPlanningCalculationsPerSec: 142500,
  planetaryMeshLatencyMs: 14.8
};

// Gerador autônomo contínuo de planos para indústrias físicas da Terra
export function generateAutonomousPhysicalPlan(
  plants: PhysicalPlantLocation[],
  activeSector?: string
): PhysicalIndustryPlan {
  const timeStr = new Date().toLocaleTimeString('pt-BR');
  const targetPlant = activeSector 
    ? (plants.find(p => p.sector === activeSector) || plants[Math.floor(Math.random() * plants.length)])
    : plants[Math.floor(Math.random() * plants.length)];

  const planTemplates = [
    {
      title: `Otimização de Termodinâmica & Desgaste de Ferramentas em Usinagem Pesada`,
      challenge: `Desgaste prematuro de insertos cerâmicos devido a gradientes térmicos não lineares em ligas de alta dureza (HRC 58-62).`,
      solution: `O ER-2 reprogramou o avanço contínuo com interpolação trocoidal adaptativa, reduzindo o tempo de contato térmico e dissipando 92% do calor no cavaco.`,
      wasteKg: Number((80 + Math.random() * 120).toFixed(1)),
      energyKwh: Number((250 + Math.random() * 300).toFixed(0)),
      timeSec: Number((30 + Math.random() * 90).toFixed(0)),
      tolGain: Number((0.0015 + Math.random() * 0.0020).toFixed(4)),
      efficiencyPct: Number((18.0 + Math.random() * 14.0).toFixed(1))
    },
    {
      title: `Controle Estocástico de Inércia & Carga em Ponte Rolante e Movimentação Robótica`,
      challenge: `Efeito de pêndulo dinâmico em cargas físicas pesadas (>10 toneladas) causava atrasos de alinhamento e estresse estrutural em trilhos.`,
      solution: `Aplicação de algoritmo anti-balanço com aceleração em S-Curve de 5ª ordem compensando a deflexão de cabos de aço e rajadas de vento físico.`,
      wasteKg: Number((20 + Math.random() * 50).toFixed(1)),
      energyKwh: Number((400 + Math.random() * 500).toFixed(0)),
      timeSec: Number((45 + Math.random() * 120).toFixed(0)),
      tolGain: Number((0.0050 + Math.random() * 0.0080).toFixed(4)),
      efficiencyPct: Number((22.0 + Math.random() * 16.0).toFixed(1))
    },
    {
      title: `Soldagem a Laser Fibrada de Costura Hermética em Câmaras de Vácuo & Fusão`,
      challenge: `Microfissuras térmicas causadas por taxa de resfriamento excessivamente rápida em uniões de Inconel 718 com Cobre C18150.`,
      solution: `O ER-2 modulou o perfil de pulso laser a 2kHz gerando pré-aquecimento e pós-resfriamento local contínuo com gás inerte argônio ultra-puro.`,
      wasteKg: Number((45 + Math.random() * 80).toFixed(1)),
      energyKwh: Number((180 + Math.random() * 220).toFixed(0)),
      timeSec: Number((25 + Math.random() * 60).toFixed(0)),
      tolGain: Number((0.0009 + Math.random() * 0.0015).toFixed(4)),
      efficiencyPct: Number((28.0 + Math.random() * 12.0).toFixed(1))
    },
    {
      title: `Dosagem Piezoelétrica Sub-Micrométrica em Encapsulamento de Sensores MEMS`,
      challenge: `Variação de viscosidade do adesivo condutivo epóxi com temperatura ambiente gerando descontinuidades elétricas.`,
      solution: `O ER-2 aplicou compensação viscosimétrica em tempo real ajustando a pressão piezoelétrica e a altura de voo da agulha dispensadora.`,
      wasteKg: Number((5 + Math.random() * 15).toFixed(1)),
      energyKwh: Number((90 + Math.random() * 140).toFixed(0)),
      timeSec: Number((15 + Math.random() * 35).toFixed(0)),
      tolGain: Number((0.0003 + Math.random() * 0.0005).toFixed(4)),
      efficiencyPct: Number((32.0 + Math.random() * 15.0).toFixed(1))
    }
  ];

  const chosen = planTemplates[Math.floor(Math.random() * planTemplates.length)];
  const randId = Math.floor(Math.random() * 9000) + 1000;

  return {
    id: `PLAN-AUTO-GLOBAL-${Date.now()}-${randId}`,
    timestamp: timeStr,
    sector: targetPlant.sector,
    plantTargetId: targetPlant.id,
    plantName: targetPlant.name,
    title: `${chosen.title} (${targetPlant.city}, ${targetPlant.country})`,
    realWorldPhysicalChallenge: chosen.challenge,
    er2AutonomousSolution: chosen.solution,
    physicalMetricsImpact: {
      materialWasteReductionKg: chosen.wasteKg,
      energySavedKwhPerShift: chosen.energyKwh,
      cycleTimeReductionSec: chosen.timeSec,
      microToleranceGainMm: chosen.tolGain,
      paybackDays: Math.floor(Math.random() * 25) + 5,
      thermodynamicEfficiencyGainPct: chosen.efficiencyPct
    },
    hardwareStandardsGenerated: {
      plcLogicIEC61131: `// Programa IEC 61131-3 Autônomo emitido pelo Cérebro Planetário ER-2
PROGRAM Global_Physical_Optimizer_${randId}
VAR
  fPhysicalSensors : ARRAY[1..${targetPlant.physicalSensorsOnline}] OF REAL;
  fDynamicTorqueLimit : REAL := ${(targetPlant.realWorldConstraints.maxPayloadKg * 9.81 * 0.4).toFixed(2)};
  bPhysicalConstraintSafe : BOOL := TRUE;
END_VAR
IF fDynamicTorqueLimit > ${(targetPlant.realWorldConstraints.maxPayloadKg * 9.81).toFixed(2)} THEN
  bPhysicalConstraintSafe := FALSE;
  Trigger_Protective_Decel(DampingFactor := ${targetPlant.realWorldConstraints.vibrationDampingHz});
END_IF;`,
      gCodeTrajectory: `G90 G21 G94 G17
; Trajetória validada para condições físicas reais de ${targetPlant.name}
G00 X${(Math.random() * 400 - 200).toFixed(3)} Y${(Math.random() * 400 - 200).toFixed(3)} Z120.000 F6000
G01 Z2.000 F1200
G02 X${(Math.random() * 400 - 200).toFixed(3)} Y${(Math.random() * 400 - 200).toFixed(3)} R45.000 F${(targetPlant.realWorldTolerancesMm * 100000).toFixed(0)}
M09 M05`,
      step3DTopologyOptimizationSummary: `ISO 10303-242: Redução de peso de 14.5% e amortecimento estrutural aumentado para ${targetPlant.realWorldConstraints.vibrationDampingHz * 100}% em ${targetPlant.city}.`,
      thermodynamicCoolingProfile: `Equilíbrio térmico de ${targetPlant.realWorldConstraints.ambientTempRangeC[0]}°C a ${targetPlant.realWorldConstraints.ambientTempRangeC[1]}°C garantido.`
    },
    globalPlanetaryImpactDescription: `Impacto físico tangível: ${chosen.wasteKg}kg de matéria-prima economizada e +${chosen.tolGain}mm de precisão absoluta no chão de fábrica de ${targetPlant.country}.`,
    status: 'IMPLANTADO_GLOBALMENTE'
  };
}
