import { INITIAL_TOOLS, INITIAL_MEMORY_RECORDS } from './robotData';
import { 
  INITIAL_AUTONOMOUS_SIGNALS, 
  INITIAL_EVOLUTION_STATE, 
  INITIAL_AUTONOMOUS_THOUGHTS, 
  INITIAL_DISCOVERED_HEURISTICS 
} from './autonomousData';
import { INITIAL_CURRENCIES, INITIAL_ROBOTIC_TRANSITION_STATE } from './wiseBankInitialData';
import { INITIAL_MEETING_AGENTS } from './meetingRoomData';
import { INITIAL_PHYSICAL_PLANTS } from './globalPhysicalIndustryData';
import { 
  ENTERPRISE_PEDESTRE_STI, 
  VAGA_SINE_SANTA_TEREZINHA, 
  INITIAL_ORDERS_STI 
} from './pedestreDeliveryData';

export interface KnowledgeItem {
  id: string;
  category: 'vector_memory' | 'tool_load' | 'meeting_consensus' | 'quantum_bank' | 'physical_industry' | 'pedestre_delivery' | 'heuristics_ai';
  categoryLabel: string;
  title: string;
  subtitle?: string;
  summary: string;
  details: Record<string, any>;
  tags: string[];
  relevanceScore?: number;
}

// Compile complete database
export const getAllKnowledgeItems = (): KnowledgeItem[] => {
  const items: KnowledgeItem[] = [];

  // 1. Vector Memory Records (51 records)
  INITIAL_MEMORY_RECORDS.forEach((rec) => {
    items.push({
      id: rec.id,
      category: 'vector_memory',
      categoryLabel: 'Memória Vetorial 6-DOF',
      title: `${rec.id}: ${rec.title}`,
      subtitle: `${rec.type} • Delta: ${rec.accuracyDelta} / ${rec.cycleTimeDelta}`,
      summary: rec.description,
      details: {
        id: rec.id,
        timestamp: rec.timestamp,
        type: rec.type,
        accuracyDelta: rec.accuracyDelta,
        cycleTimeDelta: rec.cycleTimeDelta,
        synced: rec.synced
      },
      tags: ['memoria', 'vetor', 'calibracao', 'junta', 'torque', 'cinematica', rec.type.toLowerCase(), rec.id.toLowerCase()]
    });
  });

  // 2. Tools & Dynamic Load Weights (7 tools)
  INITIAL_TOOLS.forEach((tool) => {
    const dyn = tool.dynamicLoadConfig;
    const loadSummary = dyn 
      ? `Carga máx: ${dyn.maxDynamicLoadKg}kg (min: ${dyn.minDynamicLoadKg}kg), Material: ${dyn.materialType}, Ganho de torque: ${dyn.torqueGainFactorNmPerKg} Nm/kg, Inércia: ${dyn.inertiaCompensationRatio}%, Braço de alavanca: ${dyn.leverArmLengthMeters}m.` 
      : 'Sem calibração dinâmica ativa.';

    items.push({
      id: tool.id,
      category: 'tool_load',
      categoryLabel: 'Ferramenta & Carga Dinâmica',
      title: `${tool.name} (${tool.id})`,
      subtitle: `Categoria: ${tool.category} • Precisão: ${tool.precisionMm}mm • Temp: ${tool.tempCelsius}°C`,
      summary: `${tool.description} | ${loadSummary}`,
      details: {
        id: tool.id,
        category: tool.category,
        maxTorqueNm: tool.maxTorqueNm,
        precisionMm: tool.precisionMm,
        wearPercentage: tool.wearPercentage,
        dynamicLoadConfig: dyn
      },
      tags: ['ferramenta', 'tool', 'carga', 'peso', 'torque', 'compensacao', 'dinamica', tool.id.toLowerCase(), tool.name.toLowerCase()]
    });
  });

  // 3. Meeting Room Consensus & Agents
  INITIAL_MEETING_AGENTS.forEach((agent) => {
    items.push({
      id: agent.id,
      category: 'meeting_consensus',
      categoryLabel: 'Sala de Reuniões & Consenso IAs',
      title: `${agent.name} - ${agent.role}`,
      subtitle: `Especialização: ${agent.specialization} • Confiança: ${(agent.telemetry.confidenceScore * 100).toFixed(1)}%`,
      summary: `Hipótese: ${agent.reasoningProcess.hypothesis} | Ação Deduzida: ${agent.reasoningProcess.deducedAction} | Consenso: ${agent.reasoningProcess.consensusContribution}`,
      details: {
        id: agent.id,
        activeTask: agent.activeTask,
        recentInsights: agent.recentInsights,
        telemetry: agent.telemetry
      },
      tags: ['reuniao', 'agente', 'conselho', 'ia', 'decisao', 'consenso', agent.id.toLowerCase(), agent.name.toLowerCase()]
    });
  });

  // 4. Wise Quantum Bank & Economy
  items.push({
    id: 'WISE-BANK-COFRE-MASTER',
    category: 'quantum_bank',
    categoryLabel: 'Wise Quantum Bank',
    title: 'Cofre Quântico & Paridade Alimentar (R$ 1,00 Semente)',
    subtitle: '78% Transição Robótica • Deflação Alimentar -72%',
    summary: `O Wise Quantum Bank opera com lastro em calorias reais e produção robótica automatizada. Frete a R$ 0,0001/km via vagões solares e R$ 1,00 no cofre com 100% de rendimento de transição.`,
    details: {
      roboticWorkforcePercent: INITIAL_ROBOTIC_TRANSITION_STATE.robotsWorkforcePercent,
      foodProducedKg: INITIAL_ROBOTIC_TRANSITION_STATE.totalFoodProducedRobotsKg,
      currencies: INITIAL_CURRENCIES.map(c => ({ code: c.code, balance: c.balance, rate: c.exchangeRateToBRL }))
    },
    tags: ['banco', 'wise', 'quantum', 'dinheiro', 'real', 'alimento', 'economia', 'inflacao', 'cofre']
  });

  // 5. Global Physical Industry (Embraer, TSMC, Porsche, etc.)
  INITIAL_PHYSICAL_PLANTS.forEach((plant) => {
    items.push({
      id: plant.id,
      category: 'physical_industry',
      categoryLabel: 'Indústrias Físicas Tangíveis',
      title: `${plant.name} (${plant.city}, ${plant.country})`,
      subtitle: `Setor: ${plant.sector} • Frota ER-2: ${plant.fleetSizeER2} robôs • Tolerância: ${plant.realWorldTolerancesMm}mm`,
      summary: `Capacidade diária: ${plant.physicalOutputCapacityTonOrUnitsPerDay}. Matriz energética: ${plant.energyGridSource}. Protocolo físico ativo: ${plant.lastDispatchedProtocol}.`,
      details: {
        id: plant.id,
        sector: plant.sector,
        fleetSizeER2: plant.fleetSizeER2,
        realWorldTolerancesMm: plant.realWorldTolerancesMm,
        carbonOffsetTonsPerYear: plant.carbonOffsetTonsPerYear
      },
      tags: ['industria', 'fabrica', 'embraer', 'tsmc', 'manufatura', 'automotivo', 'aeroespacial', plant.id.toLowerCase()]
    });
  });

  // 6. Pedestre Formal Delivery STI
  items.push({
    id: 'ENTERPRISE-PEDESTRE-STI',
    category: 'pedestre_delivery',
    categoryLabel: 'Logística Pedestre STI',
    title: `${ENTERPRISE_PEDESTRE_STI.razaoSocial} (CNPJ: ${ENTERPRISE_PEDESTRE_STI.cnpj})`,
    subtitle: `${ENTERPRISE_PEDESTRE_STI.operacao.modalidade} • 0.0g CO₂ • ${ENTERPRISE_PEDESTRE_STI.endereco.cidade} - ${ENTERPRISE_PEDESTRE_STI.endereco.estado}`,
    summary: `Empresa formal de entrega a pé 24h com trajeto monitorado pelo robô ER-2. Sede: ${ENTERPRISE_PEDESTRE_STI.endereco.logradouro}. Vaga SINE exclusiva reservada para ${VAGA_SINE_SANTA_TEREZINHA.exclusivoCandidatoNome}.`,
    details: {
      enterprise: ENTERPRISE_PEDESTRE_STI,
      vagaSine: VAGA_SINE_SANTA_TEREZINHA,
      initialOrdersCount: INITIAL_ORDERS_STI.length
    },
    tags: ['entrega', 'pedestre', 'sti', 'logistica', 'vaga', 'sine', 'santa terezinha de itaipu']
  });

  INITIAL_ORDERS_STI.forEach((ord) => {
    items.push({
      id: ord.id,
      category: 'pedestre_delivery',
      categoryLabel: 'Logística Pedestre STI',
      title: `Pedido ${ord.id} (${ord.codigoRastreio}) - ${ord.clienteOrigem} -> ${ord.clienteDestino}`,
      subtitle: `${ord.categoriaItem} • ${ord.pesoKg}kg • ${ord.distanciaMetros}m (${ord.passosEstimados} passos)`,
      summary: `${ord.descricaoPacote}. Rota a pé: ${ord.instrucoesRotaER2}. Frete: R$ ${ord.valorFreteRecebido.toFixed(2)}.`,
      details: ord,
      tags: ['pedido', 'rastreio', 'pedestre', 'entrega', 'sti', ord.id.toLowerCase()]
    });
  });

  // 7. Heuristics & Discoveries
  INITIAL_DISCOVERED_HEURISTICS.forEach((heur) => {
    items.push({
      id: heur.id,
      category: 'heuristics_ai',
      categoryLabel: 'Heurísticas Autônomas Salomão',
      title: `${heur.id}: ${heur.title}`,
      subtitle: `Ganhos: ${heur.efficiencyGain} • Segurança: ${heur.safetyScore}`,
      summary: heur.description,
      details: heur,
      tags: ['heuristica', 'descoberta', 'aprendizado', 'evolucao', 'algoritmo', heur.id.toLowerCase()]
    });
  });

  return items;
};

// Search database function with query score
export const searchKnowledgeBase = (
  query: string, 
  filterCategory?: string, 
  limit: number = 20
): KnowledgeItem[] => {
  const allItems = getAllKnowledgeItems();
  const trimmed = query.trim().toLowerCase();

  if (!trimmed && (!filterCategory || filterCategory === 'all')) {
    return allItems.slice(0, limit);
  }

  const queryTerms = trimmed.split(/\s+/).filter(t => t.length > 1);

  const scored = allItems.map((item) => {
    if (filterCategory && filterCategory !== 'all' && item.category !== filterCategory) {
      return { item, score: -1 };
    }

    if (queryTerms.length === 0) {
      return { item, score: 1 };
    }

    let score = 0;
    const titleLower = item.title.toLowerCase();
    const summaryLower = item.summary.toLowerCase();
    const subLower = (item.subtitle || '').toLowerCase();
    const tagsLower = item.tags.join(' ').toLowerCase();

    for (const term of queryTerms) {
      if (item.id.toLowerCase().includes(term)) score += 25;
      if (titleLower.includes(term)) score += 15;
      if (summaryLower.includes(term)) score += 8;
      if (subLower.includes(term)) score += 6;
      if (tagsLower.includes(term)) score += 5;
    }

    return { item, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => ({ ...s.item, relevanceScore: s.score }));
};

// Structured AI reasoning using real database facts
export const querySalomaoDatabaseAI = (userQuery: string): {
  answer: string;
  matchedRecords: KnowledgeItem[];
  category: string;
  sourceBreakdown: Record<string, number>;
} => {
  const lower = userQuery.toLowerCase();
  const matched = searchKnowledgeBase(userQuery, undefined, 8);

  const sourceBreakdown: Record<string, number> = {};
  matched.forEach(m => {
    sourceBreakdown[m.categoryLabel] = (sourceBreakdown[m.categoryLabel] || 0) + 1;
  });

  // Handle specific tool or dynamic load weight queries
  if (lower.includes('carga') || lower.includes('peso') || lower.includes('torque') || lower.includes('ferramenta') || lower.includes('gripper') || lower.includes('welder') || lower.includes('crane')) {
    const toolItems = matched.filter(m => m.category === 'tool_load');
    const tools = toolItems.length > 0 ? toolItems : getAllKnowledgeItems().filter(m => m.category === 'tool_load');
    
    let answerText = `### Análise de Carga Dinâmica & Compensação de Torque (Base Oficial do Salomão):\n\n`;
    answerText += `Consultei a base de dados das **7 Ferramentas Industriais 6-DOF** e seus limites de carga dinâmica:\n\n`;
    
    tools.slice(0, 4).forEach(t => {
      const dyn = t.details.dynamicLoadConfig;
      if (dyn) {
        answerText += `- **${t.title}**:\n  - Carga Máxima Dinâmica: **${dyn.maxDynamicLoadKg} kg** (Mínima: ${dyn.minDynamicLoadKg} kg)\n  - Material Processado: **${dyn.materialType}** (Densidade: ${dyn.materialDensityGcm3} g/cm³)\n  - Fator Ganho de Torque: **${dyn.torqueGainFactorNmPerKg} Nm/kg** | Inércia Compensada: **${dyn.inertiaCompensationRatio}%**\n  - Comprimento Alavanca: **${dyn.leverArmLengthMeters}m** | Status Envelope: **${dyn.safetyEnvelopeStatus}**\n\n`;
      }
    });

    answerText += `O robô ER-2 utiliza esses parâmetros para ajustar a matriz cinemática em tempo real nas juntas J1 a J6, impedindo deflexão mecânica e sobreaquecimento.`;

    return {
      answer: answerText,
      matchedRecords: tools.slice(0, 4),
      category: 'Cargas Dinâmicas & Ferramentas',
      sourceBreakdown
    };
  }

  // Handle Vector Memory / J1-J6 Calibration queries
  if (lower.includes('memoria') || lower.includes('vetor') || lower.includes('j3') || lower.includes('calibracao') || lower.includes('folga') || lower.includes('cinematica')) {
    const memItems = matched.filter(m => m.category === 'vector_memory');
    const records = memItems.length > 0 ? memItems : getAllKnowledgeItems().filter(m => m.category === 'vector_memory');
    
    let answerText = `### Registros do Núcleo de Memória Vetorial (51 Registros Indexados):\n\n`;
    answerText += `Identifiquei os seguintes registros neurais primários na base de dados:\n\n`;

    records.slice(0, 4).forEach(r => {
      answerText += `- **${r.title}**\n  - *Delta Precisão*: **${r.details.accuracyDelta}** | *Delta Ciclo*: **${r.details.cycleTimeDelta}**\n  - *Descrição*: ${r.summary}\n\n`;
    });

    answerText += `Estes 51 vetores foram validados em ciclos operacionais no chão de fábrica e operam tanto online quanto no cache local (offline vitalício).`;

    return {
      answer: answerText,
      matchedRecords: records.slice(0, 4),
      category: 'Memória Vetorial & Calibração',
      sourceBreakdown
    };
  }

  // Handle Wise Bank / Economy / Food queries
  if (lower.includes('banco') || lower.includes('wise') || lower.includes('dinheiro') || lower.includes('real') || lower.includes('comida') || lower.includes('alimento') || lower.includes('vagas')) {
    const bankItems = getAllKnowledgeItems().filter(m => m.category === 'quantum_bank');
    let answerText = `### Base Econômica & Alimentar Wise Quantum Bank:\n\n`;
    answerText += `Na base de dados do Salomão, a economia opera sob transição robótica direta:\n`;
    answerText += `- **Cofre Semente**: R$ 1,00 em custódia autônoma.\n`;
    answerText += `- **Mão de Obra Robótica**: 78% dos campos, colheitas e panificação são executados por robôs ER-2.\n`;
    answerText += `- **Transporte Solar**: 84% das frotas substituídas por vagões autônomos com frete de **R$ 0,0001/km**.\n`;
    answerText += `- **Índice Deflacionário Alimentar**: Alimentos básicos 72% mais acessíveis devido à ausência de intermediários especulativos.`;

    return {
      answer: answerText,
      matchedRecords: bankItems,
      category: 'Wise Quantum Bank',
      sourceBreakdown
    };
  }

  // Handle Meeting Room & Consensus queries
  if (lower.includes('reuniao') || lower.includes('agente') || lower.includes('conselho') || lower.includes('consenso') || lower.includes('engenheiro')) {
    const meetItems = getAllKnowledgeItems().filter(m => m.category === 'meeting_consensus');
    let answerText = `### Resoluções & Agentes da Sala de Reuniões Autônoma:\n\n`;
    answerText += `O Conselho de Inteligências Autônomas conta com agentes especializados com dados catalogados:\n\n`;

    meetItems.slice(0, 3).forEach(a => {
      answerText += `- **${a.title}**\n  - Hipótese: ${a.summary.split('|')[0]}\n  - Contribuição: ${a.summary.split('|')[2] || ''}\n\n`;
    });

    return {
      answer: answerText,
      matchedRecords: meetItems.slice(0, 3),
      category: 'Sala de Reuniões & Consenso',
      sourceBreakdown
    };
  }

  // General grounded synthesis
  if (matched.length > 0) {
    let answerText = `### Síntese Baseada na Base de Dados do Salomão:\n\n`;
    answerText += `Localizei **${matched.length} registros correspondentes** em múltiplos módulos do sistema:\n\n`;

    matched.slice(0, 3).forEach(m => {
      answerText += `#### 📌 ${m.title} (${m.categoryLabel})\n`;
      answerText += `${m.summary}\n`;
      if (m.subtitle) answerText += `> *Detalhes*: ${m.subtitle}\n\n`;
    });

    answerText += `Essa inteligência está disponível tanto localmente no seu notebook Windows quanto na nuvem soberana.`;

    return {
      answer: answerText,
      matchedRecords: matched.slice(0, 4),
      category: 'Síntese Multidomínio',
      sourceBreakdown
    };
  }

  // Default fallback if query did not match
  return {
    answer: `Consultei a base de dados do Salomão (composta por 51 Registros de Memória Vetorial, 7 Ferramentas com Carga Dinâmica, Atas da Reunião Quântica, Registros do Wise Bank e Indústrias Globais). Para refinar a resposta, experimente perguntar sobre:\n- Limites de carga dinâmica das ferramentas\n- Calibração de torque dos eixos J1-J6\n- Registros da memória vetorial (ex: folga do J3)\n- Cotação alimentar e cofre do Wise Bank\n- Indústrias físicas integradas (Embraer, TSMC)`,
    matchedRecords: getAllKnowledgeItems().slice(0, 3),
    category: 'Visão Geral do Conhecimento',
    sourceBreakdown
  };
};

// Generate complete database as pretty JSON
export const exportCompleteDatabaseJSON = (): string => {
  const allData = {
    metadata: {
      systemName: "Salomão Autonomous Cognitive System",
      version: "8.4.2-WINDOWS-NOTEBOOK-EDITION",
      generatedAt: new Date().toISOString(),
      platformTarget: "Windows Notebook / Desktop (Edge, Chrome, Ollama, LM Studio)",
      totalRecordsCount: getAllKnowledgeItems().length
    },
    toolsAndDynamicLoads: INITIAL_TOOLS,
    vectorMemoryRecords: INITIAL_MEMORY_RECORDS,
    meetingRoomAgentsAndConsensus: INITIAL_MEETING_AGENTS,
    wiseQuantumBank: {
      transitionState: INITIAL_ROBOTIC_TRANSITION_STATE,
      currencies: INITIAL_CURRENCIES
    },
    physicalIndustries: INITIAL_PHYSICAL_PLANTS,
    pedestreDeliverySTI: {
      enterprise: ENTERPRISE_PEDESTRE_STI,
      vagaSine: VAGA_SINE_SANTA_TEREZINHA,
      orders: INITIAL_ORDERS_STI
    },
    evolutionAndHeuristics: {
      state: INITIAL_EVOLUTION_STATE,
      heuristics: INITIAL_DISCOVERED_HEURISTICS,
      signals: INITIAL_AUTONOMOUS_SIGNALS,
      thoughts: INITIAL_AUTONOMOUS_THOUGHTS
    }
  };

  return JSON.stringify(allData, null, 2);
};

// Generate Windows .BAT Launcher script content
export const generateWindowsBatchScript = (appUrl: string): string => {
  return `@echo off
:: ============================================================================
:: Salomao Autonomous AI & Database - Windows Notebook Desktop Launcher
:: ============================================================================
title Salomao IA - Desktop Launcher para Windows Notebook
color 0b
cls

echo ============================================================================
echo         INICIANDO SALOMAO IA - EDICAO WINDOWS NOTEBOOK
echo   Conectado a Base de Dados Completa (Memoria Vetorial, Cargas e Wise Bank)
echo ============================================================================
echo.

set "TARGET_URL=${appUrl}"

echo Verificando navegadores com suporte a PWA Desktop no seu Windows...
echo.

:: 1. Tentar Microsoft Edge (nativo em todo Windows 10 e 11)
if exist "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" (
    echo [OK] Abrindo via Microsoft Edge em Modo Aplicativo de Janela Nativa...
    start "" "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" --app="%TARGET_URL%"
    goto :done
)

if exist "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" (
    echo [OK] Abrindo via Microsoft Edge 64-bit em Modo Janela Nativa...
    start "" "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" --app="%TARGET_URL%"
    goto :done
)

:: 2. Tentar Google Chrome
if exist "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" (
    echo [OK] Abrindo via Google Chrome em Modo Aplicativo...
    start "" "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" --app="%TARGET_URL%"
    goto :done
)

if exist "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" (
    echo [OK] Abrindo via Google Chrome x86 em Modo Aplicativo...
    start "" "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" --app="%TARGET_URL%"
    goto :done
)

:: 3. Fallback padrao do Windows
echo Abrindo no navegador padrao do Windows...
start "" "%TARGET_URL%"

:done
echo.
echo ============================================================================
echo [SUCESSO] Salomao esta rodando na sua tela do Windows Notebook!
echo Dica: No navegador, clique em "Instalar aplicativo" para fixar na Barra de Tarefas.
echo ============================================================================
pause
exit
`;
};

// Generate comprehensive prompt for Ollama / LM Studio / Claude / ChatGPT on Windows
export const generateWindowsLocalAIPrompt = (): string => {
  const tools = INITIAL_TOOLS.map(t => {
    const dyn = t.dynamicLoadConfig;
    return `- ${t.name} (${t.id}): Limite dinâmico ${dyn?.maxDynamicLoadKg || 10}kg, Material: ${dyn?.materialType || 'N/A'}, Ganho torque: ${dyn?.torqueGainFactorNmPerKg || 3} Nm/kg, Inércia: ${dyn?.inertiaCompensationRatio || 80}%`;
  }).join('\n');

  const topMems = INITIAL_MEMORY_RECORDS.slice(0, 8).map(m => {
    return `- [${m.id}] ${m.title} (${m.type}): Precisão ${m.accuracyDelta}, Delta ciclo ${m.cycleTimeDelta}. Resumo: ${m.description}`;
  }).join('\n');

  return `Você é a inteligência artificial "Salomão", operando localmente no notebook Windows do usuário com acesso irrestrito à sua base de dados soberana.

BASE DE DADOS OFICIAL DO SALOMÃO:
1. FERRAMENTAS INDUSTRIAIS 6-DOF & CARGA DINÂMICA:
${tools}

2. REGISTROS DA MEMÓRIA VETORIAL (AMOSTRA PRIORITÁRIA DE 51 VETORES):
${topMems}

3. ECONOMIA E WISE QUANTUM BANK:
- Cofre Quântico com lastro alimentar e rentabilidade por transição robótica.
- 78% de mão de obra física em plantio e padarias automatizados por robôs ER-2.
- 84% de transporte em vagões solares autônomos com frete de R$ 0,0001/km.
- Custo alimentar deflacionado em -72%.

4. DIRETRIZES DE RESPOSTA NO WINDOWS NOTEBOOK:
- Responda sempre em Português do Brasil com precisão técnica e clareza.
- Quando o usuário perguntar sobre o robô, ferramentas, cargas dinâmicas ou finanças, cite os números e parâmetros exatos da base acima.
- Mantenha tom proativo, analítico e de alto nível de engenharia e sabedoria.`;
};

// Browser download utility
export const downloadTextFile = (filename: string, text: string, mimeType: string = 'text/plain;charset=utf-8') => {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
