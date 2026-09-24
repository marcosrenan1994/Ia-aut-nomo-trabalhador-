import React, { useState } from 'react';
import { 
  getAllKnowledgeItems, 
  searchKnowledgeBase, 
  querySalomaoDatabaseAI, 
  exportCompleteDatabaseJSON, 
  generateWindowsBatchScript, 
  generateWindowsLocalAIPrompt, 
  downloadTextFile, 
  KnowledgeItem 
} from '../data/salomaoKnowledgeBase';
import { 
  Laptop, 
  Database, 
  Cpu, 
  Brain, 
  Send, 
  Search, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  Sparkles, 
  Layers, 
  Wrench, 
  Building2, 
  FileCode, 
  ExternalLink, 
  Flame, 
  ShieldCheck, 
  BookOpen, 
  HelpCircle,
  FolderDown,
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface SalomaoWindowsAIPanelProps {
  onClose?: () => void;
  onNavigateToTab?: (tab: string) => void;
  isStandaloneModal?: boolean;
}

export const SalomaoWindowsAIPanel: React.FC<SalomaoWindowsAIPanelProps> = ({
  onClose,
  onNavigateToTab,
  isStandaloneModal = false
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'explorer' | 'windows_setup' | 'exports'>('chat');
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'salomao';
    text: string;
    timestamp: string;
    category?: string;
    matchedRecords?: KnowledgeItem[];
  }>>([
    {
      id: 'init-win-msg',
      sender: 'salomao',
      text: 'Olá! Sou o Salomão conectado diretamente à base de dados do ecossistema para uso no seu notebook Windows. Você pode me fazer perguntas sobre os 51 registros da memória vetorial, as 7 ferramentas com seus limites de carga dinâmica, o Wise Quantum Bank, as indústrias globais ou exportar tudo para rodar no Ollama / LM Studio localmente.',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      category: 'Inicialização Windows RAG'
    }
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);

  // Database Explorer state
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<KnowledgeItem | null>(null);

  // Export notifications
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string>('');

  const sharedAppUrl = "https://ais-pre-q4l2vzn6j3dpbs57sv2mnx-777413846715.us-east1.run.app";

  // Handle AI Query
  const handleSendQuery = (textToQuery?: string) => {
    const query = textToQuery || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user' as const,
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToQuery) setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      const result = querySalomaoDatabaseAI(query);
      const salomaoMsg = {
        id: `salomao-${Date.now()}`,
        sender: 'salomao' as const,
        text: result.answer,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        category: result.category,
        matchedRecords: result.matchedRecords
      };

      setChatMessages(prev => [...prev, salomaoMsg]);
      setIsThinking(false);
    }, 600);
  };

  // Quick prompt buttons
  const quickPrompts = [
    'Quais os limites de carga dinâmica do Gripper e Welder?',
    'Como está a compensação de folga do eixo J3 na memória?',
    'Como funciona o cofre e alimentação no Wise Bank?',
    'Quais as resoluções da Sala de Reuniões Autônoma?',
    'Quais fábricas da Embraer e TSMC usam robôs ER-2?'
  ];

  // Filtered explorer items
  const explorerItems = searchKnowledgeBase(searchFilter, categoryFilter, 40);

  // Downloads
  const handleDownloadDatabaseJSON = () => {
    const jsonStr = exportCompleteDatabaseJSON();
    downloadTextFile('salomao_base_de_dados_completa_windows.json', jsonStr, 'application/json');
    setDownloadSuccessMessage('Base de dados completa (.JSON) baixada com sucesso!');
    setTimeout(() => setDownloadSuccessMessage(''), 3500);
  };

  const handleDownloadBatchLauncher = () => {
    const batStr = generateWindowsBatchScript(sharedAppUrl);
    downloadTextFile('iniciar_salomao_windows.bat', batStr, 'text/plain');
    setDownloadSuccessMessage('Lançador para Windows (.BAT) baixado! Dê dois cliques para abrir no Windows.');
    setTimeout(() => setDownloadSuccessMessage(''), 3500);
  };

  const handleCopyLocalAIPrompt = () => {
    const promptStr = generateWindowsLocalAIPrompt();
    navigator.clipboard.writeText(promptStr);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  const handleDownloadPythonRAG = () => {
    const pythonScript = `# Script de Consulta da Base de Dados Salomao no Windows
# Requisitos: Python 3.9+ (rode: pip install requests)
import json
import os

print("=== Carregando Base de Dados do Salomao no Windows Notebook ===")
try:
    with open("salomao_base_de_dados_completa_windows.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"Sucesso! Total de itens carregados: {len(data)}")
    print(f"Versao: {data.get('metadata', {}).get('version')}")
    print("\\nFerramentas Disponiveis com Carga Dinamica:")
    for tool in data.get("toolsAndDynamicLoads", []):
        load = tool.get("dynamicLoadConfig", {})
        print(f" - {tool.get('name')}: Max {load.get('maxDynamicLoadKg')}kg | Material: {load.get('materialType')}")
except FileNotFoundError:
    print("Arquivo 'salomao_base_de_dados_completa_windows.json' nao encontrado nesta pasta.")
    print("Coloque o arquivo baixado na mesma pasta deste script.")
`;
    downloadTextFile('salomao_rag_windows.py', pythonScript, 'text/x-python');
    setDownloadSuccessMessage('Script Python para Windows baixado com sucesso!');
    setTimeout(() => setDownloadSuccessMessage(''), 3500);
  };

  return (
    <div className="bg-slate-950/95 border border-cyan-500/30 rounded-3xl p-4 md:p-6 shadow-2xl flex flex-col h-full max-h-[92vh] text-slate-100 overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-600/30">
            <Laptop className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                Salomão IA • Windows Notebook & Base de Dados
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase tracking-wider">
                Windows 10/11 PWA
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Conexão direta com a base de dados vetorial, ferramentas de carga dinâmica e exportador local
            </p>
          </div>
        </div>

        {/* Success Banner */}
        {downloadSuccessMessage && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{downloadSuccessMessage}</span>
          </div>
        )}

        {/* Tab Switchers */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'chat'
                ? 'bg-cyan-600 text-slate-950 shadow-md shadow-cyan-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>IA & RAG na Base</span>
          </button>

          <button
            onClick={() => setActiveSubTab('explorer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'explorer'
                ? 'bg-cyan-600 text-slate-950 shadow-md shadow-cyan-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Explorar Base</span>
          </button>

          <button
            onClick={() => setActiveSubTab('windows_setup')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'windows_setup'
                ? 'bg-cyan-600 text-slate-950 shadow-md shadow-cyan-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Instalar no Windows</span>
          </button>

          <button
            onClick={() => setActiveSubTab('exports')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'exports'
                ? 'bg-cyan-600 text-slate-950 shadow-md shadow-cyan-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderDown className="w-3.5 h-3.5" />
            <span>Exportar Dados</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto mt-4 pr-1">
        {/* SUBTAB 1: CHAT WITH DATABASE */}
        {activeSubTab === 'chat' && (
          <div className="flex flex-col h-full gap-4">
            {/* Quick Questions Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Perguntas Rápidas sobre a Base de Dados:
              </span>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendQuery(p)}
                    className="text-xs px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/50 transition-all text-left cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Stream */}
            <div className="flex-1 overflow-y-auto space-y-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 min-h-[300px]">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-mono text-slate-400">
                      {msg.sender === 'user' ? 'Você (Windows Notebook)' : 'Salomão IA'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-600">• {msg.timestamp}</span>
                    {msg.category && (
                      <span className="text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.2 rounded font-bold">
                        {msg.category}
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl max-w-[90%] md:max-w-[80%] text-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-tr-none shadow-md'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                    }`}
                  >
                    {msg.text}

                    {/* Matched Records Cards inside message */}
                    {msg.matchedRecords && msg.matchedRecords.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1">
                          <Database className="w-3 h-3 text-cyan-400" />
                          Registros Oficiais Citados da Base:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.matchedRecords.map((rec) => (
                            <div
                              key={rec.id}
                              onClick={() => {
                                setSelectedRecordForDetail(rec);
                                setActiveSubTab('explorer');
                              }}
                              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-[11px] cursor-pointer transition-all"
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="font-bold text-cyan-300 truncate">{rec.title}</span>
                                <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-1 rounded shrink-0">
                                  {rec.categoryLabel}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 line-clamp-2">
                                {rec.summary}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex items-center gap-2 p-3 text-xs text-cyan-400 font-mono">
                  <Cpu className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Salomão consultando registros na base de dados...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Pergunte ao Salomão sobre qualquer dado (ex: limites de carga, folga J3, moedas Wise Bank)..."
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isThinking}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
                <span>Consultar</span>
              </button>
            </form>
          </div>
        )}

        {/* SUBTAB 2: DATABASE EXPLORER */}
        {activeSubTab === 'explorer' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Pesquisar por ID, título, junta J1-J6, ferramenta, material ou cidade..."
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'tool_load', label: 'Cargas & Ferramentas' },
                  { id: 'vector_memory', label: 'Memória Vetorial (51)' },
                  { id: 'quantum_bank', label: 'Wise Bank' },
                  { id: 'meeting_consensus', label: 'Reunião de IAs' },
                  { id: 'physical_industry', label: 'Indústrias' },
                  { id: 'heuristics_ai', label: 'Heurísticas' }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategoryFilter(c.id)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                      categoryFilter === c.id
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected record details modal / expandable box */}
            {selectedRecordForDetail && (
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/50 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                    Detalhes do Registro Selecionado:
                  </span>
                  <button
                    onClick={() => setSelectedRecordForDetail(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Fechar
                  </button>
                </div>
                <h3 className="text-sm font-black text-white">{selectedRecordForDetail.title}</h3>
                <p className="text-xs text-slate-300">{selectedRecordForDetail.summary}</p>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      handleSendQuery(`Me explique com detalhes o registro ${selectedRecordForDetail.id}: ${selectedRecordForDetail.title}`);
                      setActiveSubTab('chat');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    <span>Perguntar à IA sobre este dado</span>
                  </button>
                </div>
              </div>
            )}

            {/* List of records */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {explorerItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono bg-slate-800 text-cyan-300 px-2 py-0.5 rounded font-bold">
                        {item.id}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {item.categoryLabel}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
                    {item.subtitle && (
                      <p className="text-[11px] text-cyan-400/90 font-mono mb-1">{item.subtitle}</p>
                    )}
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-1">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.tags.slice(0, 3).join(', ')}
                    </span>
                    <button
                      onClick={() => {
                        handleSendQuery(`O que a base do Salomão sabe sobre ${item.title}?`);
                        setActiveSubTab('chat');
                      }}
                      className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>Analisar com IA</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 3: WINDOWS SETUP GUIDE */}
        {activeSubTab === 'windows_setup' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            {/* Direct 1-Click Launch Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-blue-950/80 to-slate-900 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-black text-white">
                    Como Rodar o Salomão como Aplicativo Nativo no Windows Notebook
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 font-bold">
                  MICROSOFT EDGE & CHROME
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Você pode transformar o Salomão em um aplicativo desktop no seu Windows (10 ou 11). Ele rodará em janela própria, sem a barra de endereços do navegador, com suporte a aceleração gráfica por GPU, atalho na Barra de Tarefas e no Menu Iniciar, e funcionamento offline.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleDownloadBatchLauncher}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Baixar Lançador Desktop (.BAT)</span>
                </button>

                <a
                  href={sharedAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir URL Oficial no Edge/Chrome</span>
                </a>
              </div>
            </div>

            {/* Step by step for Microsoft Edge & Chrome */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase">
                Passo a Passo para Instalar no Windows Notebook:
              </h3>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">1</span>
                  <div className="space-y-1">
                    <h5 className="font-bold text-white">Abra no Microsoft Edge ou Google Chrome</h5>
                    <p className="text-slate-400 text-[11px]">
                      Abra o link oficial do Salomão no navegador nativo do seu notebook Windows.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">2</span>
                  <div className="space-y-1">
                    <h5 className="font-bold text-white">Clique no Ícone de Instalação de Aplicativo</h5>
                    <p className="text-slate-400 text-[11px]">
                      No <strong>Microsoft Edge</strong>: clique no ícone de computador/aplicativo no lado direito da barra de endereços (ou menu <code className="bg-slate-800 px-1 rounded">... &gt; Aplicativos &gt; Instalar este site como aplicativo</code>).
                      <br />No <strong>Chrome</strong>: clique no ícone de download/instalação na barra de endereços.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">3</span>
                  <div className="space-y-1">
                    <h5 className="font-bold text-white">Marque as Opções do Windows</h5>
                    <p className="text-slate-400 text-[11px]">
                      Na janela de confirmação do Windows, selecione as caixas:
                      <br />✅ <strong>Fixar na barra de tarefas</strong>
                      <br />✅ <strong>Fixar na tela inicial / Menu Iniciar</strong>
                      <br />✅ <strong>Criar atalho na área de trabalho</strong>
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">4</span>
                  <div className="space-y-1">
                    <h5 className="font-bold text-white">Pronto! Use como um Software Nativo</h5>
                    <p className="text-slate-400 text-[11px]">
                      O Salomão agora abre em tela dedicada no seu Windows Notebook, com todos os módulos, braço 6-DOF, base vetorial e IA disponíveis mesmo sem conexão de internet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: EXPORT FOR LOCAL AI (OLLAMA / LM STUDIO / CLAUDE / CHATGPT) */}
        {activeSubTab === 'exports' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <FolderDown className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-black text-white">
                  Exportar a Base de Dados Completa do Salomão para o Windows
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Quer rodar o Salomão dentro de uma IA local no seu Windows Notebook (como <strong>Ollama</strong>, <strong>LM Studio</strong>, <strong>Jan.ai</strong>, <strong>LocalAI</strong>) ou no <strong>ChatGPT</strong> / <strong>Claude Desktop</strong>? Baixe a base de dados oficial completa ou copie o Prompt de Sistema com RAG embutido.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* JSON Download */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-cyan-400" />
                      Base de Dados Completa (.JSON)
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Arquivo JSON com todos os 51 registros vetoriais, calibrações de torque dinâmico, atas de reunião e finanças.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadDatabaseJSON}
                    className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar base_dados.json</span>
                  </button>
                </div>

                {/* Batch Launcher */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      Lançador Executável Windows (.BAT)
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Script em lote que abre diretamente no Microsoft Edge ou Chrome em modo janela de desktop.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadBatchLauncher}
                    className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar iniciar_salomao.bat</span>
                  </button>
                </div>

                {/* Local Python RAG */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-amber-400" />
                      Script Python de RAG para Windows
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Código Python pronto para carregar a base JSON e realizar consultas na linha de comando do Windows.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadPythonRAG}
                    className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar salomao_rag.py</span>
                  </button>
                </div>

                {/* Copy System Prompt for Ollama */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Copy className="w-4 h-4 text-purple-400" />
                      Prompt para Ollama / LM Studio
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Copie o System Prompt pronto com o contexto da base para colar no Ollama, Llama 3, LM Studio ou ChatGPT.
                    </p>
                  </div>
                  <button
                    onClick={handleCopyLocalAIPrompt}
                    className="w-full py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? 'Copiado para a Área de Transferência!' : 'Copiar Prompt para IA'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
