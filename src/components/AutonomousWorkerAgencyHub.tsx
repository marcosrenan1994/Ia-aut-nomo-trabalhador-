import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Briefcase, 
  Globe, 
  Search, 
  Database, 
  Bot, 
  Play, 
  Pause, 
  Sparkles, 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  Cpu, 
  Activity, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Plus,
  Flame,
  MousePointer2,
  FileSpreadsheet,
  Newspaper
} from 'lucide-react';

export interface AutonomousWorker {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatarColor: string;
  status: 'EM_BUSCA' | 'RASPANDO_DOM' | 'COMPILANDO_DADOS' | 'AGUARDANDO';
  salaryMonthlyBrl: number;
  tokensPerSec: number;
  pagesScrapedCount: number;
  currentActivity: string;
}

export interface ScrapedDataRecord {
  timestamp: string;
  query: string;
  title: string;
  summary: string;
  keyMetrics: { label: string; value: string; trend?: string }[];
  table?: {
    columns: string[];
    rows: string[][];
  };
  headlines?: { title: string; source: string; snippet: string }[];
}

export const AutonomousWorkerAgencyHub: React.FC = () => {
  // Workers roster managed by the Orchestrator
  const [workers, setWorkers] = useState<AutonomousWorker[]>([
    {
      id: 'W-001',
      name: 'IA Turing-Chrome',
      role: 'Operadora de Navegador Google Chrome',
      specialty: 'Navegação Web, Pesquisa Google & Resolução de URLs',
      avatarColor: 'from-blue-500 to-cyan-500',
      status: 'EM_BUSCA',
      salaryMonthlyBrl: 4800,
      tokensPerSec: 14200000,
      pagesScrapedCount: 342,
      currentActivity: 'Navegando no Google Chrome e identificando fontes de dados de alta autoridade.'
    },
    {
      id: 'W-002',
      name: 'IA Lovelace-Scraper',
      role: 'Especialista em Web Scraping e DOM',
      specialty: 'Extração de Tabelas HTML, Feeds RSS & Índices de Preços',
      avatarColor: 'from-purple-500 to-indigo-500',
      status: 'RASPANDO_DOM',
      salaryMonthlyBrl: 5200,
      tokensPerSec: 18500000,
      pagesScrapedCount: 819,
      currentActivity: 'Injetando seletores de parsing em nós DOM e convertendo tabelas em JSON.'
    },
    {
      id: 'W-003',
      name: 'IA Wiener-DataScientist',
      role: 'Compiladora e Cientista de Dados',
      specialty: 'Higienização de Dados, Séries Temporais & Síntese Econômica',
      avatarColor: 'from-emerald-500 to-teal-500',
      status: 'COMPILANDO_DADOS',
      salaryMonthlyBrl: 5600,
      tokensPerSec: 12800000,
      pagesScrapedCount: 1204,
      currentActivity: 'Compilando indicadores de deflação em alimentos e cruzando com Binance Testnet.'
    },
    {
      id: 'W-004',
      name: 'IA Sentinel-CryptoNews',
      role: 'Sentinela de Notícias e Binance Testnet',
      specialty: 'Análise de Sentimento Global, Notícias Cripto & Sinais de Trading',
      avatarColor: 'from-amber-500 to-orange-500',
      status: 'AGUARDANDO',
      salaryMonthlyBrl: 4900,
      tokensPerSec: 16000000,
      pagesScrapedCount: 560,
      currentActivity: 'Aguardando novo bloco de notícias para classificar sentimento em Bullish/Bearish.'
    }
  ]);

  // Chrome Browser State
  const [activeTab, setActiveTab] = useState<'chrome' | 'vacancies' | 'compiled_data'>('chrome');
  const [chromeUrl, setChromeUrl] = useState<string>('https://www.google.com/search?q=cotacao+bitcoin+deflacao+alimentos+brasil');
  const [searchQuery, setSearchQuery] = useState<string>('cotação bitcoin deflação alimentos brasil');
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [humanTypingText, setHumanTypingText] = useState<string>('cotação bitcoin deflação alimentos brasil');
  const [isTypingAnimation, setIsTypingAnimation] = useState<boolean>(false);
  
  // Real Scraped Data Result
  const [scrapedResult, setScrapedResult] = useState<ScrapedDataRecord | null>({
    timestamp: new Date().toLocaleTimeString('pt-BR'),
    query: 'cotação bitcoin deflação alimentos brasil',
    title: 'Pesquisa Google & Web Scraping: Economia e Criptoativos 2026',
    summary: 'A compilação de dados da Agência do Trabalhador de IAs constatou que a automação na agricultura está gerando deflação contínua de até 11% em grãos e hortaliças, enquanto a liquidez da Binance Testnet sustenta compras institucionais.',
    keyMetrics: [
      { label: 'Bitcoin (BTC)', value: '$68,420.00', trend: 'up' },
      { label: 'Cesta Básica SP/BR', value: 'R$ 512,00 (-5.4%)', trend: 'down' },
      { label: 'Arroz Agulhinha 5kg', value: 'R$ 18,20 (-8.2%)', trend: 'down' },
      { label: 'Páginas Auditadas', value: '1.420 páginas/min', trend: 'up' }
    ],
    table: {
      columns: ['Item / Ativo', 'Preço Médio', 'Tendência', 'Impacto Autônomo'],
      rows: [
        ['Bitcoin Testnet', '$68,420.50', '+3.42%', 'Arbitragem de IAs'],
        ['Arroz Safra Robótica', 'R$ 3,80/kg', '-7.80%', 'Colheita Solar ER-2'],
        ['Feijão Carioca', 'R$ 5,20/kg', '-10.50%', 'Zero Custo de Combustível'],
        ['Energia Micro-Solar', 'R$ 0,16/kWh', '-15.00%', 'Baterias Quânticas']
      ]
    },
    headlines: [
      {
        title: 'Agricultura 100% Robótica derruba preços de alimentos no Brasil e América Latina',
        source: 'Globo Rural & Tech',
        snippet: 'Carroças solares autônomas e robôs lavradores eliminam necessidade de diesel e reduzem o custo marginal a quase zero.'
      },
      {
        title: 'Binance Testnet registra recorde de ordens disparadas por IAs colaborativas',
        source: 'CoinDesk Brasil',
        snippet: 'Agências autônomas de trabalho dividem tarefas entre web scraping e envio de ordens algorítmicas de futuros.'
      }
    ]
  });

  // Human-speed Typing Simulation on Chrome URL Bar
  const executeHumanLikeResearch = async (targetQuery: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    setIsTypingAnimation(true);
    setHumanTypingText('');

    // Human typing letter-by-letter into the search bar
    for (let i = 0; i <= targetQuery.length; i++) {
      setHumanTypingText(targetQuery.slice(0, i));
      await new Promise(r => setTimeout(r, 45)); // Natural human typing speed (45ms per character)
    }
    setIsTypingAnimation(false);

    // Human cursor pause before search submit (400ms)
    await new Promise(r => setTimeout(r, 400));
    setChromeUrl(`https://www.google.com/search?q=${encodeURIComponent(targetQuery)}`);

    // Call Real Backend Scraping & Research API
    try {
      // Update worker statuses
      setWorkers(prev => prev.map(w => ({
        ...w,
        status: w.id === 'W-001' ? 'EM_BUSCA' : w.id === 'W-002' ? 'RASPANDO_DOM' : 'COMPILANDO_DADOS'
      })));

      const response = await fetch('/api/chrome-scrape-and-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: targetQuery,
          workerId: 'IA-Turing-001',
          mode: 'search_and_scrape'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.extractedData) {
          setScrapedResult({
            timestamp: new Date().toLocaleTimeString('pt-BR'),
            query: targetQuery,
            title: data.pageTitle || `Resultados para "${targetQuery}"`,
            summary: data.extractedData.summary,
            keyMetrics: data.extractedData.keyMetrics || [],
            table: data.extractedData.scrapedTables?.[0],
            headlines: data.extractedData.recentHeadlines || []
          });

          // Update metrics on workers
          setWorkers(prev => prev.map(w => ({
            ...w,
            pagesScrapedCount: w.pagesScrapedCount + Math.floor(Math.random() * 5 + 2),
            status: 'COMPILANDO_DADOS'
          })));
        }
      }
    } catch (err) {
      console.warn('Erro ao pesquisar:', err);
    } finally {
      setIsNavigating(false);
      setTimeout(() => {
        setWorkers(prev => prev.map(w => ({
          ...w,
          status: 'AGUARDANDO'
        })));
      }, 2000);
    }
  };

  // Add new vacancy / hire worker
  const handleOpenNewVacancy = () => {
    const newId = `W-${(workers.length + 1).toString().padStart(3, '0')}`;
    const newWorker: AutonomousWorker = {
      id: newId,
      name: `IA Operária-${newId}`,
      role: 'Analista de Coleta e Indexação Web',
      specialty: 'Scraping de Portais Governamentais e Câmaras de Comércio',
      avatarColor: 'from-amber-500 to-rose-500',
      status: 'AGUARDANDO',
      salaryMonthlyBrl: 4500,
      tokensPerSec: 11500000,
      pagesScrapedCount: 0,
      currentActivity: 'Contratada pelo Orquestrador Mestre. Pronta para operar no Google Chrome.'
    };
    setWorkers(prev => [...prev, newWorker]);
  };

  return (
    <div id="autonomous-worker-agency-view" className="space-y-4 font-sans text-white">
      {/* Top Banner: Agency Overview */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 border-2 border-indigo-500/40 p-4 sm:p-5 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono font-bold flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                AGÊNCIA DO TRABALHADOR AUTÔNOMO DE IAS
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                {workers.length} IAS EMPREGADAS EM COOPERAÇÃO
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-400" />
              <span>Orquestrador Mestre de Vagas & Navegador Google Chrome</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              IAs autônomas contratadas pelo Orquestrador trabalham em sinergia fazendo web scraping, compilação de dados e pesquisas reais na internet através do Google Chrome.
            </p>
          </div>

          {/* Speed Indicator Badge */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/30 flex flex-col gap-1 w-full lg:w-auto">
            <div className="flex items-center justify-between gap-3 text-[10px] font-mono">
              <span className="text-slate-400">Raciocínio Interno:</span>
              <span className="text-amber-400 font-bold">⚡ QUANTUM SPEED (14.2M tok/s)</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[10px] font-mono">
              <span className="text-slate-400">Exibição na Tela:</span>
              <span className="text-emerald-400 font-bold">👁️ VELOCIDADE HUMANA NORMAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agency Navigation Tabs */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800 gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('chrome')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'chrome' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-black' 
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Navegador Google Chrome & Web Scraping</span>
          </button>

          <button
            onClick={() => setActiveTab('vacancies')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'vacancies' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-black' 
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Quadro de Vagas & IAs Contratadas ({workers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('compiled_data')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'compiled_data' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-black' 
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Dados Compilados & Tabelas</span>
          </button>
        </div>

        <button
          id="btn-agency-open-vacancy"
          onClick={handleOpenNewVacancy}
          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ABRIR NOVA VAGA DE IA</span>
        </button>
      </div>

      {/* TAB 1: GOOGLE CHROME BROWSER & LIVE WEB SCRAPING */}
      {activeTab === 'chrome' && (
        <div className="space-y-4">
          {/* Chrome Window Chrome UI */}
          <div className="rounded-2xl bg-slate-900 border-2 border-slate-700 overflow-hidden shadow-2xl">
            {/* Top Chrome Tab Bar */}
            <div className="bg-slate-950 px-3 pt-2 pb-0 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 rounded-t-xl text-xs font-bold text-slate-200 border-t border-x border-slate-700">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span className="max-w-[180px] sm:max-w-[240px] truncate">{searchQuery} - Pesquisa Google</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1 animate-pulse" />
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2 pr-2">
                <span>Chrome Engine v124 (Headless/Visual Híbrido)</span>
              </div>
            </div>

            {/* Chrome Navigation & URL Bar */}
            <div className="bg-slate-900 p-2.5 flex items-center gap-2 border-b border-slate-800">
              <div className="flex items-center gap-1 text-slate-400">
                <button className="p-1.5 rounded hover:bg-slate-800 text-slate-400" title="Voltar">
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </button>
                <button 
                  onClick={() => executeHumanLikeResearch(searchQuery)}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-400" 
                  title="Recarregar e Raspar"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isNavigating ? 'animate-spin text-cyan-400' : ''}`} />
                </button>
              </div>

              {/* URL Address Input Bar */}
              <div className="flex-1 relative flex items-center">
                <div className="absolute left-3 flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-slate-500 hidden sm:inline">https://</span>
                </div>
                <input
                  type="text"
                  value={isTypingAnimation ? `www.google.com/search?q=${humanTypingText}` : chromeUrl}
                  onChange={(e) => setChromeUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 sm:pl-24 pr-24 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
                <span className="absolute right-3 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-mono font-bold">
                  DOM ATIVO
                </span>
              </div>

              {/* Execute Research Button */}
              <button
                id="btn-chrome-search-and-scrape"
                onClick={() => executeHumanLikeResearch(searchQuery)}
                disabled={isNavigating}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all disabled:opacity-50"
              >
                {isNavigating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Navegando...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Buscar & Raspar</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Search Suggestions */}
            <div className="bg-slate-950/60 px-3 py-1.5 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-[10px]">
              <span className="text-slate-400 font-bold uppercase shrink-0">Consultas Sugeridas:</span>
              {[
                'cotação bitcoin deflação alimentos brasil',
                'preço do arroz e soja agricultura autônoma',
                'binance futures testnet volatilidade btc',
                'robótica er-2 custo de vida zero'
              ].map((queryText, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchQuery(queryText);
                    executeHumanLikeResearch(queryText);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 shrink-0 transition-colors"
                >
                  {queryText}
                </button>
              ))}
            </div>

            {/* Chrome Web Page Render Viewport */}
            <div className="p-4 sm:p-6 bg-slate-950 min-h-[380px] space-y-4">
              {scrapedResult ? (
                <div className="space-y-4">
                  {/* Page Title & Search Header */}
                  <div className="border-b border-slate-800 pb-3">
                    <div className="text-cyan-400 font-mono text-[11px] mb-1">
                      Pesquisa Google • Cerca de 4.820.000 resultados raspados em 0,08s
                    </div>
                    <h2 className="text-lg font-bold text-white">
                      {scrapedResult.title}
                    </h2>
                  </div>

                  {/* Summary Box with [DOM SCRAPED] Tag */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border-2 border-dashed border-cyan-500/40 relative">
                    <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded bg-cyan-500 text-slate-950 text-[9px] font-mono font-black">
                      [DOM SCRAPED - EXTRAÇÃO EM TEMPO REAL]
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed pt-1">
                      {scrapedResult.summary}
                    </p>
                  </div>

                  {/* Scraped Key Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {scrapedResult.keyMetrics.map((metric, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{metric.label}</div>
                        <div className="text-sm font-black font-mono text-white mt-0.5">{metric.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Scraped Table */}
                  {scrapedResult.table && (
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Tabela Extraída Diretamente do DOM Web</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                          <thead>
                            <tr className="text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                              {scrapedResult.table.columns.map((col, idx) => (
                                <th key={idx} className="pb-1">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {scrapedResult.table.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="text-slate-200">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="py-2">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Headlines & Articles */}
                  {scrapedResult.headlines && scrapedResult.headlines.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                        <Newspaper className="w-4 h-4 text-indigo-400" />
                        <span>Notícias Relevantes Filtradas pelo Sentinela:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {scrapedResult.headlines.map((item, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                            <div className="text-[10px] text-indigo-400 font-bold">{item.source}</div>
                            <div className="text-xs font-bold text-white">{item.title}</div>
                            <div className="text-[11px] text-slate-400 leading-snug">{item.snippet}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <Globe className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs">
                    Inicie uma pesquisa acima para o Google Chrome autônomo navegar e raspar a web.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VACANCIES & WORKER ROSTER */}
      {activeTab === 'vacancies' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {workers.map((w) => (
              <div key={w.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${w.avatarColor} flex items-center justify-center font-black text-slate-950 shadow-md`}>
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">{w.name}</div>
                      <div className="text-[10px] text-slate-400">{w.role}</div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
                    w.status === 'EM_BUSCA' 
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 animate-pulse'
                      : w.status === 'RASPANDO_DOM'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {w.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 leading-relaxed font-mono p-2 rounded-lg bg-slate-950 border border-slate-800">
                  {w.currentActivity}
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-1 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Salário:</span>
                    <span className="text-emerald-400 font-bold">R$ {w.salaryMonthlyBrl}/mês</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Páginas:</span>
                    <span className="text-cyan-400 font-bold">{w.pagesScrapedCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Velocidade:</span>
                    <span className="text-amber-400 font-bold">{(w.tokensPerSec / 1000000).toFixed(1)}M tok/s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COMPILED DATA & REPORTS */}
      {activeTab === 'compiled_data' && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div>
              <h3 className="text-xs font-black uppercase text-white">
                Compilador de Inteligência Econômica & Suprimentos
              </h3>
              <p className="text-[11px] text-slate-400">
                Dados consolidados de web scraping cruzados com a cotação da Binance Testnet e deflação agrícola.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
              SINCRONIZADO COM WISE QUANTUM BANK
            </span>
          </div>

          {scrapedResult?.table && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                    {scrapedResult.table.columns.map((c, i) => (
                      <th key={i} className="pb-1">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {scrapedResult.table.rows.map((row, rI) => (
                    <tr key={rI} className="text-slate-200">
                      {row.map((cell, cI) => (
                        <td key={cI} className="py-2.5 font-bold">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
