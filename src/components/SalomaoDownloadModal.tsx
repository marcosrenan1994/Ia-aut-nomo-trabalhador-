import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
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
  FileCode
} from 'lucide-react';

interface SalomaoDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SalomaoDownloadModal: React.FC<SalomaoDownloadModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

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
      // Direct open or instructions
      window.open(sharedAppUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-600/30 font-black">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              Baixar e Instalar o Salomão
            </h3>
            <p className="text-xs text-slate-400">
              Aplicativo Web Progressivo (PWA) Vitalício para Android & Celular
            </p>
          </div>
        </div>

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

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-800 pt-3">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Gratuito & Seguro
          </span>
          <span>Versão: Soberana v8.0</span>
        </div>
      </div>
    </div>
  );
};
