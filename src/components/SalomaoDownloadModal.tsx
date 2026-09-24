import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  Laptop,
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  Share2, 
  Chrome, 
  ArrowRight,
  FileCode,
  Terminal,
  Database,
  Brain
} from 'lucide-react';
import { 
  exportCompleteDatabaseJSON, 
  generateWindowsBatchScript, 
  generateWindowsLocalAIPrompt, 
  downloadTextFile 
} from '../data/salomaoKnowledgeBase';

interface SalomaoDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWindowsAIPanel?: () => void;
}

export const SalomaoDownloadModal: React.FC<SalomaoDownloadModalProps> = ({
  isOpen,
  onClose,
  onOpenWindowsAIPanel
}) => {
  const [activeTab, setActiveTab] = useState<'windows' | 'android'>('windows');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('');

  const sharedAppUrl = "https://ais-pre-q4l2vzn6j3dpbs57sv2mnx-777413846715.us-east1.run.app";

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sharedAppUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      window.open(sharedAppUrl, '_blank');
    }
  };

  const handleDownloadBatchLauncher = () => {
    const batStr = generateWindowsBatchScript(sharedAppUrl);
    downloadTextFile('iniciar_salomao_windows.bat', batStr, 'text/plain');
    setStatusMsg('Lançador .BAT baixado com sucesso!');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleDownloadDatabaseJSON = () => {
    const jsonStr = exportCompleteDatabaseJSON();
    downloadTextFile('salomao_base_de_dados_completa_windows.json', jsonStr, 'application/json');
    setStatusMsg('Base de dados completa (.JSON) baixada!');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleCopyPrompt = () => {
    const promptStr = generateWindowsLocalAIPrompt();
    navigator.clipboard.writeText(promptStr);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200 max-h-[94vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-600/30 font-black">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              Baixar & Usar Salomão com Base de Dados
            </h3>
            <p className="text-xs text-slate-400">
              Aplicativo Web Progressivo (PWA) Vitalício para Windows Notebook & Celular
            </p>
          </div>
        </div>

        {/* Platform Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('windows')}
            className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'windows'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Windows Notebook / PC</span>
          </button>

          <button
            onClick={() => setActiveTab('android')}
            className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'android'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android / Celular</span>
          </button>
        </div>

        {/* Status Toast */}
        {statusMsg && (
          <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Official URL Box */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-slate-300 uppercase">
            Link Oficial de Acesso Direto:
          </label>
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-mono text-cyan-300 truncate flex-1 px-1 select-all">
              {sharedAppUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
            </button>
            <a
              href={sharedAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition-colors"
              title="Abrir no Navegador"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* TAB 1: WINDOWS NOTEBOOK */}
        {activeTab === 'windows' && (
          <div className="space-y-4">
            {/* Direct PWA Install in Windows */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-blue-950/70 to-slate-900 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-cyan-400" />
                  Instalar como Aplicativo Nativo no Windows (1 Toque)
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 font-bold">
                  EDGE & CHROME
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Roda no seu notebook Windows em janela limpa e dedicada (sem barra de URL do navegador), fixável na <strong>Barra de Tarefas</strong> e no <strong>Menu Iniciar</strong>, com suporte a aceleração gráfica e offline vitalício.
              </p>

              <button
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isInstallable ? 'Instalar Salomão no Windows Agora' : 'Abrir Modo Desktop no Windows'}</span>
              </button>
            </div>

            {/* Downloads for Windows: .BAT launcher and .JSON Database */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={handleDownloadBatchLauncher}
                className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                    Lançador Windows (.BAT)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Script de 1 clique que abre o app direto no Microsoft Edge/Chrome em tela cheia.
                </p>
              </button>

              <button
                onClick={handleDownloadDatabaseJSON}
                className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                    Base de Dados (.JSON)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Baixe todos os 51 vetores, 7 ferramentas com carga dinâmica e dados bancários.
                </p>
              </button>
            </div>

            {/* Local AI Prompt Button */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-purple-400" />
                  Usar com IA Local no Windows (Ollama / LM Studio)
                </span>
                <p className="text-[11px] text-slate-400">
                  Copie o Prompt de Sistema com toda a base de dados embutida para colar na sua IA local.
                </p>
              </div>

              <button
                onClick={handleCopyPrompt}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? 'Copiado!' : 'Copiar Prompt'}</span>
              </button>
            </div>

            {/* Direct Open Windows AI Panel */}
            {onOpenWindowsAIPanel && (
              <button
                onClick={() => {
                  onClose();
                  onOpenWindowsAIPanel();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border border-cyan-500/30"
              >
                <Brain className="w-4 h-4" />
                <span>Abrir Central de IA & Explorador da Base de Dados na Tela</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Step-by-step for Windows */}
            <div className="space-y-2 text-xs text-slate-300">
              <span className="font-mono font-bold text-slate-400 uppercase text-[11px]">
                Passo a Passo Manual no Windows (Edge ou Chrome):
              </span>
              <div className="space-y-1.5">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-[11px]">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-bold flex items-center justify-center shrink-0">1</span>
                  <span>No Edge ou Chrome no Windows, clique no ícone <strong>"Instalar Aplicativo"</strong> na barra de URL.</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-[11px]">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Marque <strong>"Fixar na barra de tarefas"</strong> e <strong>"Criar atalho na Área de Trabalho"</strong>.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANDROID / CELULAR */}
        {activeTab === 'android' && (
          <div className="space-y-4">
            {/* Fast Install Button */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Instalação Nativa no Android (1 Toque)
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                  VITALÍCIO
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Funciona como aplicativo nativo em tela cheia, sem barra do navegador, com permissões de microfone, câmera, localização e serviço de acessibilidade do Salomão.
              </p>

              <button
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isInstallable ? 'Instalar Salomão no Celular Agora' : 'Abrir App no Celular'}</span>
              </button>
            </div>

            {/* Step-by-Step Android Guide */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                Passo a Passo para Instalar no Android:
              </span>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <span>Abra o link acima no navegador <strong>Google Chrome</strong> do seu celular Android.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <span>Toque no menu de <strong>3 pontinhos (⋮)</strong> no canto superior direito do Chrome.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <span>Selecione <strong>"Adicionar à tela inicial"</strong> ou <strong>"Instalar aplicativo"</strong>.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-purple-400 font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
                  <span>O ícone do <strong>Salomão</strong> será adicionado à gaveta de apps do seu celular, com uso vitalício e offline habilitado!</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-800 pt-3">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Gratuito, Soberano & Seguro
          </span>
          <span>Versão: Soberana v8.4 (Windows & Android)</span>
        </div>
      </div>
    </div>
  );
};
