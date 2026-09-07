import React, { useState, useEffect } from 'react';
import { 
  ENTERPRISE_PEDESTRE_STI, 
  VAGA_SINE_SANTA_TEREZINHA, 
  INITIAL_ORDERS_STI, 
  INITIAL_COURIER_METRICS,
  generateNewDeliveryOrderSTI
} from '../data/pedestreDeliveryData';
import { 
  PedestreDeliveryOrder, 
  CourierRealTimeMetrics,
  AutonomousThought,
  MemoryVectorRecord
} from '../types';
import { 
  Building2, 
  Briefcase, 
  Footprints, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  DollarSign, 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  Navigation, 
  FileText, 
  Award, 
  Truck, 
  UserCheck, 
  Smartphone, 
  HeartHandshake, 
  RefreshCw, 
  Compass, 
  Send,
  Zap,
  TrendingUp,
  Leaf,
  Info,
  Layers,
  ChevronRight,
  Printer,
  Copy,
  Check
} from 'lucide-react';

interface Props {
  onAddThought?: (thought: AutonomousThought) => void;
  onAddMemoryRecord?: (record: MemoryVectorRecord) => void;
}

export const PedestreFormalDeliverySTI: React.FC<Props> = ({ 
  onAddThought, 
  onAddMemoryRecord 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'agencia_vaga' | 'empresa_cnpj' | 'despacho_rotas' | 'gemini_er2_otimizador' | 'uniforme_qr'>('agencia_vaga');
  const [orders, setOrders] = useState<PedestreDeliveryOrder[]>(INITIAL_ORDERS_STI);
  const [selectedOrder, setSelectedOrder] = useState<PedestreDeliveryOrder>(INITIAL_ORDERS_STI[0]);
  const [metrics, setMetrics] = useState<CourierRealTimeMetrics>(INITIAL_COURIER_METRICS);
  const [isContractAccepted, setIsContractAccepted] = useState<boolean>(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSimulatingWalk, setIsSimulatingWalk] = useState<boolean>(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [selectedBairroFilter, setSelectedBairroFilter] = useState<string>('TODOS');

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Simulating accept order and walk
  const handleStartDelivery = (order: PedestreDeliveryOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: 'EM_ROTA_A_PE' } : o))
    );
    setSelectedOrder({ ...order, status: 'EM_ROTA_A_PE' });
    setIsSimulatingWalk(true);

    if (onAddThought) {
      onAddThought({
        id: `THOUGHT-DELIVERY-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        thought: `[Pedestre Delivery STI] Marcos Renan iniciou a rota a pé para "${order.clienteDestino}" (${order.bairroSTI}). Distância: ${order.distanciaMetros}m. Despachante Gemini ER-2 calculando travessias seguras na Av. Brasil.`,
        type: 'DECISION',
        confidence: 0.99,
        wisdomGain: 12
      });
    }

    setActionSuccessMsg(`🚶 Rota iniciada! Siga as orientações pedestres para ${order.clienteDestino}.`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Complete delivery
  const handleCompleteDelivery = (order: PedestreDeliveryOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: 'ENTREGUE_COM_SUCESSO' } : o))
    );
    setSelectedOrder({ ...order, status: 'ENTREGUE_COM_SUCESSO' });
    setIsSimulatingWalk(false);

    // Update courier metrics
    setMetrics((prev) => ({
      ...prev,
      totalEntregasRealizadas: prev.totalEntregasRealizadas + 1,
      totalKmCaminhados: Number((prev.totalKmCaminhados + order.distanciaMetros / 1000).toFixed(2)),
      totalPassosDados: prev.totalPassosDados + order.passosEstimados,
      totalCaloriasGastas: prev.totalCaloriasGastas + order.caloriasQueimadasKcal,
      faturamentoAcumulado: Number((prev.faturamentoAcumulado + order.valorFreteRecebido).toFixed(2)),
      co2EvitadoKg: Number((prev.co2EvitadoKg + (order.distanciaMetros / 1000) * 0.18).toFixed(2))
    }));

    if (onAddThought) {
      onAddThought({
        id: `THOUGHT-DELIVERY-DONE-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        thought: `[Entrega Concluída com Sucesso] Pacote entregue em ${order.enderecoDestino}. QR Code validado. +R$ ${order.valorFreteRecebido.toFixed(2)} creditados para Marcos Renan. Emissão zero de CO₂ garantida.`,
        type: 'EVOLUTION_BREAKTHROUGH',
        confidence: 1.0,
        wisdomGain: 25
      });
    }

    if (onAddMemoryRecord) {
      onAddMemoryRecord({
        id: `MEM-STI-DELIV-${Date.now()}`,
        timestamp: new Date().toLocaleDateString('pt-BR'),
        type: 'EPISODIC_EXPERIENCE',
        title: `Entrega Pedestre STI: ${order.clienteDestino}`,
        accuracyDelta: `+100% Pontual (${order.tempoCaminhadaMinutos} min)`,
        cycleTimeDelta: `-${order.tempoCaminhadaMinutos} min`,
        sourceType: 'PEDESTRE_DELIVERY_STI'
      });
    }

    setActionSuccessMsg(`✅ Entrega #${order.codigoRastreio} concluída! R$ ${order.valorFreteRecebido.toFixed(2)} adicionados ao faturamento de Marcos Renan.`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Generate new demand in STI
  const handleAddNewOrder = () => {
    const newOrd = generateNewDeliveryOrderSTI();
    setOrders((prev) => [newOrd, ...prev]);
    setSelectedOrder(newOrd);

    if (onAddThought) {
      onAddThought({
        id: `THOUGHT-NEW-ORDER-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        thought: `[Nova Demanda em Santa Terezinha de Itaipu] Comércio local "${newOrd.clienteOrigem}" solicitou entrega formal a pé para "${newOrd.clienteDestino}" (${newOrd.bairroSTI}). Despachado exclusivamente para Marcos Renan.`,
        type: 'REASONING',
        confidence: 0.98,
        wisdomGain: 8
      });
    }

    setActionSuccessMsg(`📦 Novo pedido gerado em Santa Terezinha de Itaipu: ${newOrd.clienteOrigem} ➔ ${newOrd.clienteDestino}`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const bairrosList = ['TODOS', 'Centro', 'Santa Mônica', 'Parque dos Estados', 'Vila Vitorassi', 'BNH', 'Jardim Planalto'];

  const filteredOrders = selectedBairroFilter === 'TODOS'
    ? orders
    : orders.filter((o) => o.bairroSTI.toLowerCase().includes(selectedBairroFilter.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Top Banner: Enterprise & Exclusive Job Title */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border-2 border-indigo-500/30 p-5 shadow-2xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                CNPJ 54.892.104/0001-88 • Ativa & Regularizada
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                Vaga SINE Exclusiva: Marcos Renan
              </span>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Santa Terezinha de Itaipu - PR
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Footprints className="w-8 h-8 text-emerald-400 animate-bounce" />
              <span>PEDESTRE FORMAL DELIVERY & LOGÍSTICA URBANA 24H</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Empresa constituída e registrada com vaga exclusiva vinculada à <strong className="text-emerald-300">Agência do Trabalhador / SINE de Santa Terezinha de Itaipu - Paraná</strong> exclusivamente para <strong className="text-amber-300 font-bold">Marcos Renan (marcosrenan20121995@gmail.com)</strong>. 
              Operação de entregas com padrão formal executivo (camisa social, gravata, boné e mochila estruturada com QR Code dinâmico), 100% a pé, emissão zero de carbono e roteirização autônoma via inteligência Gemini ER-2.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-auto">
            <button
              id="btn-gerar-demanda-sti"
              onClick={handleAddNewOrder}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Gerar Nova Entrega em STI</span>
            </button>
            <button
              id="btn-ver-carta-sine"
              onClick={() => setActiveSubTab('agencia_vaga')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Ver Carta Encaminhamento SINE</span>
            </button>
          </div>
        </div>

        {/* Global Live Courier Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-4 border-t border-slate-800">
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" /> Faturamento
            </span>
            <div className="text-base font-black text-emerald-300 mt-1">
              R$ {metrics.faturamentoAcumulado.toFixed(2)}
            </div>
            <span className="text-[9px] text-slate-500">Ganhos de Marcos Renan</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Entregas Feitas
            </span>
            <div className="text-base font-black text-cyan-300 mt-1">
              {metrics.totalEntregasRealizadas} pedidos
            </div>
            <span className="text-[9px] text-slate-500">100% no prazo a pé</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Footprints className="w-3 h-3 text-amber-400" /> Km Caminhados
            </span>
            <div className="text-base font-black text-amber-300 mt-1">
              {metrics.totalKmCaminhados} km
            </div>
            <span className="text-[9px] text-slate-500">{metrics.totalPassosDados.toLocaleString('pt-BR')} passos dados</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-400" /> Calorias
            </span>
            <div className="text-base font-black text-rose-300 mt-1">
              {metrics.totalCaloriasGastas} kcal
            </div>
            <span className="text-[9px] text-slate-500">Saúde cardiovascular</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Leaf className="w-3 h-3 text-emerald-400" /> CO₂ Evitado
            </span>
            <div className="text-base font-black text-emerald-300 mt-1">
              {metrics.co2EvitadoKg} kg CO₂
            </div>
            <span className="text-[9px] text-slate-500">Mobilidade verde limpa</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Award className="w-3 h-3 text-yellow-400" /> Avaliação STI
            </span>
            <div className="text-base font-black text-yellow-300 mt-1">
              ⭐ {metrics.avaliacaoMedia.toFixed(1)} / 5.0
            </div>
            <span className="text-[9px] text-slate-500">Padrão formal impecável</span>
          </div>
        </div>
      </div>

      {/* Action Success Notification Toast */}
      {actionSuccessMsg && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          id="subtab-agencia-vaga-btn"
          onClick={() => setActiveSubTab('agencia_vaga')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeSubTab === 'agencia_vaga'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Vaga Agência do Trabalhador / SINE (Exclusiva Marcos Renan)</span>
        </button>

        <button
          id="subtab-empresa-cnpj-btn"
          onClick={() => setActiveSubTab('empresa_cnpj')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeSubTab === 'empresa_cnpj'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Cartão CNPJ & Alvará Municipal STI</span>
        </button>

        <button
          id="subtab-despacho-rotas-btn"
          onClick={() => setActiveSubTab('despacho_rotas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeSubTab === 'despacho_rotas'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Despacho 24h & Rotas a Pé STI ({orders.length} pedidos)</span>
        </button>

        <button
          id="subtab-gemini-er2-btn"
          onClick={() => setActiveSubTab('gemini_er2_otimizador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeSubTab === 'gemini_er2_otimizador'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Inteligência Roteirizadora ER-2</span>
        </button>

        <button
          id="subtab-uniforme-qr-btn"
          onClick={() => setActiveSubTab('uniforme_qr')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeSubTab === 'uniforme_qr'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/30'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Uniforme Formal & Painel QR Code</span>
        </button>
      </div>

      {/* SubTab 1: Vaga Exclusiva na Agência do Trabalhador / SINE */}
      {activeSubTab === 'agencia_vaga' && (
        <div className="space-y-6">
          {/* Official Gov / SINE Header Document Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 shadow-lg font-black text-xl">
                  SINE
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold">
                    Governo do Estado do Paraná • Secretaria do Trabalho, Qualificação e Renda
                  </span>
                  <h2 className="text-xl font-black text-white">
                    Agência do Trabalhador — Unidade Santa Terezinha de Itaipu (PR)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Encaminhamento Oficial e Reserva de Vaga Exclusiva com Trava de Perfil
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                  <LockBadgeIcon />
                  RESERVA EXCLUSIVA ATIVA
                </div>
                <button
                  onClick={() => handleCopy(VAGA_SINE_SANTA_TEREZINHA.codigoSINE, 'codigo_sine')}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 transition-all"
                  title="Copiar Código SINE"
                >
                  {copiedField === 'codigo_sine' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Candidate & Job Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-amber-400">Titular Único Convocado</span>
                <div className="text-base font-black text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>{VAGA_SINE_SANTA_TEREZINHA.exclusivoCandidatoNome}</span>
                </div>
                <div className="text-xs font-mono text-slate-300">
                  {VAGA_SINE_SANTA_TEREZINHA.exclusivoCandidatoEmail}
                </div>
                <span className="inline-block mt-1 text-[9px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded">
                  ✓ Trava de Segurança: Vaga inacessível para outros candidatos
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-indigo-400">Cargo Formal & CBO</span>
                <div className="text-sm font-black text-white">
                  {VAGA_SINE_SANTA_TEREZINHA.cargo}
                </div>
                <div className="text-xs font-mono text-indigo-300">
                  CBO {VAGA_SINE_SANTA_TEREZINHA.cboCodigo}
                </div>
                <span className="inline-block mt-1 text-[9px] text-indigo-400 font-bold bg-indigo-950 px-2 py-0.5 rounded">
                  Modalidade: 100% Pedestre Executivo 24h
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Previsão Remuneratória</span>
                <div className="text-base font-black text-emerald-300">
                  {VAGA_SINE_SANTA_TEREZINHA.remuneracao.previsaoGanhosMes}
                </div>
                <div className="text-xs text-slate-300">
                  Salário Base CLT: R$ {VAGA_SINE_SANTA_TEREZINHA.remuneracao.salarioBaseMes.toFixed(2)} + R$ {VAGA_SINE_SANTA_TEREZINHA.remuneracao.adicionalProdutividadePorKm.toFixed(2)}/km a pé
                </div>
                <span className="inline-block mt-1 text-[9px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded">
                  + VA R$ {VAGA_SINE_SANTA_TEREZINHA.remuneracao.ticketAlimentacaoMes.toFixed(2)} + Aux. Calçado R$ {VAGA_SINE_SANTA_TEREZINHA.remuneracao.auxilioCalcadoOrtopedico.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Official Letter Box (Carta de Encaminhamento Digital) */}
            <div className="p-6 rounded-2xl bg-amber-950/10 border border-amber-500/30 text-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-black text-white uppercase tracking-wider">
                    Carta de Encaminhamento & Vínculo Empregatício Nº {VAGA_SINE_SANTA_TEREZINHA.cartaEncaminhamentoNumero}
                  </span>
                </div>
                <span className="text-xs font-mono text-amber-300 font-semibold">
                  Protocolo: {VAGA_SINE_SANTA_TEREZINHA.protocoloGovPR}
                </span>
              </div>

              <div className="text-xs leading-relaxed space-y-2 text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800 font-mono">
                <p>
                  <strong>Órgão Emissor:</strong> Agência do Trabalhador de Santa Terezinha de Itaipu / Secretaria do Trabalho - Governo do Paraná.
                </p>
                <p>
                  <strong>Empregador Contratante:</strong> PEDESTRE FORMAL DELIVERY & LOGÍSTICA URBANA SUSTENTÁVEL LTDA. (CNPJ: 54.892.104/0001-88).
                </p>
                <p>
                  <strong>Trabalhador Designado Exclusivo:</strong> MARCOS RENAN (E-mail: marcosrenan20121995@gmail.com).
                </p>
                <p>
                  <strong>Declaração de Admissão:</strong> Fica formalizada a admissão de Marcos Renan para a operação contínua de entregas a pé, com seguro de vida integral, kit completo de uniformes sociais e equipamentos de suporte de alta tecnologia com integração ao núcleo robótico Gemini ER-2.
                </p>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  Benefícios e Estrutura Assegurados ao Marcos Renan:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {VAGA_SINE_SANTA_TEREZINHA.beneficiosInclusos.map((ben, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{ben}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Emitido em: {VAGA_SINE_SANTA_TEREZINHA.dataEmissao} • Validade Permanente</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsContractAccepted(true);
                      setActionSuccessMsg('📄 Contrato e Encaminhamento SINE formalizados com assinatura digital de Marcos Renan!');
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Assinatura Digital</span>
                  </button>
                  <button
                    onClick={() => handleCopy(JSON.stringify(VAGA_SINE_SANTA_TEREZINHA, null, 2), 'vaga_completa')}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedField === 'vaga_completa' ? 'Copiado!' : 'Exportar Dados SINE'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: Registro Empresarial Oficial (CNPJ & Alvará STI) */}
      {activeSubTab === 'empresa_cnpj' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border-2 border-indigo-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg font-black text-xl">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold">
                    República Federativa do Brasil • Ministério da Fazenda • Receita Federal
                  </span>
                  <h2 className="text-xl font-black text-white">
                    Comprovante de Inscrição e de Situação Cadastral (CNPJ)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Pessoa Jurídica Registrada na Junta Comercial do Paraná (JUCEPAR)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                  SITUAÇÃO: ATIVA
                </span>
                <button
                  onClick={() => handleCopy(ENTERPRISE_PEDESTRE_STI.cnpj, 'cnpj')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                >
                  {copiedField === 'cnpj' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>Copiar CNPJ</span>
                </button>
              </div>
            </div>

            {/* CNPJ Official Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Número de Inscrição (CNPJ)</span>
                <div className="text-sm font-mono font-black text-indigo-300">{ENTERPRISE_PEDESTRE_STI.cnpj}</div>
                <span className="text-[9px] text-emerald-400">Matriz Regularizada</span>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Data de Abertura</span>
                <div className="text-sm font-mono font-bold text-white">{ENTERPRISE_PEDESTRE_STI.dataAbertura}</div>
                <span className="text-[9px] text-slate-500">Início Imediato</span>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Nome Empresarial (Razão Social)</span>
                <div className="text-xs font-bold text-white leading-snug">{ENTERPRISE_PEDESTRE_STI.razaoSocial}</div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Título do Estabelecimento (Nome Fantasia)</span>
                <div className="text-xs font-bold text-amber-300 leading-snug">{ENTERPRISE_PEDESTRE_STI.nomeFantasia}</div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Código e Descrição da Atividade Principal (CNAE)</span>
                <div className="text-xs font-mono text-cyan-300 leading-snug">{ENTERPRISE_PEDESTRE_STI.cnaePrincipal}</div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Capital Social & Porte</span>
                <div className="text-sm font-bold text-emerald-300">{ENTERPRISE_PEDESTRE_STI.capitalSocial}</div>
                <span className="text-[9px] text-slate-400">{ENTERPRISE_PEDESTRE_STI.porte}</span>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1 sm:col-span-2 lg:col-span-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Endereço da Sede Operacional em Santa Terezinha de Itaipu</span>
                <div className="text-xs font-bold text-white">
                  {ENTERPRISE_PEDESTRE_STI.endereco.logradouro}, {ENTERPRISE_PEDESTRE_STI.endereco.bairro} — {ENTERPRISE_PEDESTRE_STI.endereco.cidade} / {ENTERPRISE_PEDESTRE_STI.endereco.estado} — CEP: {ENTERPRISE_PEDESTRE_STI.endereco.cep}
                </div>
              </div>
            </div>

            {/* Municipal License STI */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Alvará Municipal de Funcionamento 24h & Licença Sanitária — Prefeitura de Santa Terezinha de Itaipu
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded">
                  ALVARÁ Nº STI-2026-8812
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Autorizada a prestação ininterrupta de serviços logísticos de entrega rápida a pé em todos os bairros do município de Santa Terezinha de Itaipu (Centro, Parque dos Estados, Santa Mônica, BNH, Jardim Planalto, Vila Vitorassi e adjacências).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: Despacho 24h & Rotas a Pé STI */}
      {activeSubTab === 'despacho_rotas' && (
        <div className="space-y-6">
          {/* Filter & Action bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Filtrar por Bairro STI:</span>
              <div className="flex flex-wrap gap-1">
                {bairrosList.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBairroFilter(b)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedBairroFilter === b
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddNewOrder}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Nova Demanda (+ Pedido)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Orders list */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
                <span>Fila de Pedidos para Marcos Renan ({filteredOrders.length})</span>
                <span className="text-emerald-400">Operação 24h a Pé</span>
              </div>

              <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                      selectedOrder.id === ord.id
                        ? 'bg-slate-800/90 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg'
                        : 'bg-slate-900/80 hover:bg-slate-800/50 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 font-bold flex items-center gap-1">
                        <QrCode className="w-3 h-3 text-indigo-400" />
                        {ord.codigoRastreio}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.status === 'EM_ROTA_A_PE'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                          : ord.status === 'ENTREGUE_COM_SUCESSO'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      }`}>
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-black text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span className="truncate">{ord.clienteOrigem} ➔ {ord.clienteDestino}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate pl-5">
                        {ord.enderecoDestino} ({ord.bairroSTI})
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80 text-slate-300 font-mono">
                      <span className="flex items-center gap-1 text-amber-300">
                        <Footprints className="w-3 h-3" /> {ord.distanciaMetros}m ({ord.tempoCaminhadaMinutos} min)
                      </span>
                      <span className="font-bold text-emerald-400">
                        + R$ {ord.valorFreteRecebido.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Active Route Detail & Action Terminal */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400">Terminal de Entrega Pedestre</span>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <span>Roteiro #{selectedOrder.codigoRastreio}</span>
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">Remuneração deste frete</span>
                    <div className="text-xl font-black text-emerald-400">
                      R$ {selectedOrder.valorFreteRecebido.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Simulated Street Map of Santa Terezinha de Itaipu */}
                <div className="relative h-48 rounded-xl bg-slate-950 border border-slate-800 p-4 overflow-hidden flex flex-col justify-between">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  {/* Road Grid visualization */}
                  <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      📍 Origem: {selectedOrder.clienteOrigem}
                    </span>
                    <span className="bg-emerald-950 text-emerald-300 px-2 py-1 rounded border border-emerald-500/40">
                      🏁 Destino: {selectedOrder.clienteDestino} ({selectedOrder.bairroSTI})
                    </span>
                  </div>

                  {/* Route path graphical indicator */}
                  <div className="relative z-10 my-auto py-2">
                    <div className="flex items-center justify-between text-xs font-black text-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-cyan-500 animate-ping" />
                        <span>Ponto A (Coleta)</span>
                      </div>
                      <div className="h-0.5 flex-1 mx-4 bg-gradient-to-r from-cyan-500 via-amber-400 to-emerald-500 border-dashed border-t border-emerald-400" />
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-500" />
                        <span>Ponto B (Entrega)</span>
                      </div>
                    </div>
                    <div className="text-center text-[10px] font-mono text-amber-300 mt-2">
                      Roteiro a pé: {selectedOrder.distanciaMetros} metros • {selectedOrder.passosEstimados} passos • ~{selectedOrder.tempoCaminhadaMinutos} min de caminhada contínua
                    </div>
                  </div>

                  <div className="relative z-10 text-[10px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-800 pt-1">
                    <span>GPS STI: Lat {selectedOrder.coordenadasRota.origem.lat.toFixed(4)}, Lng {selectedOrder.coordenadasRota.origem.lng.toFixed(4)}</span>
                    <span className="text-emerald-400 font-bold">Guia de Calçadas Acessíveis Ativo</span>
                  </div>
                </div>

                {/* Package and Route Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Pacote & Conteúdo</span>
                    <div className="font-semibold text-slate-200">{selectedOrder.descricaoPacote}</div>
                    <div className="text-[10px] text-indigo-300 font-mono">Peso: {selectedOrder.pesoKg} kg (Mochila Ergonômica)</div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Instruções de Rota ER-2</span>
                    <div className="text-[11px] text-slate-300 leading-snug">{selectedOrder.instrucoesRotaER2}</div>
                  </div>
                </div>

                {/* Delivery Control Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>Token: {selectedOrder.qrCodeToken}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedOrder.status !== 'ENTREGUE_COM_SUCESSO' && (
                      <>
                        {selectedOrder.status === 'DISPONIVEL_PARA_COLETA' ? (
                          <button
                            id="btn-iniciar-rota-pe"
                            onClick={() => handleStartDelivery(selectedOrder)}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
                          >
                            <Footprints className="w-4 h-4" />
                            <span>Iniciar Rota a Pé (Coletar)</span>
                          </button>
                        ) : (
                          <button
                            id="btn-concluir-entrega-pe"
                            onClick={() => handleCompleteDelivery(selectedOrder)}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Validar QR Code & Concluir Entrega</span>
                          </button>
                        )}
                      </>
                    )}

                    {selectedOrder.status === 'ENTREGUE_COM_SUCESSO' && (
                      <div className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-black text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Entrega Finalizada e Paga</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 4: Inteligência Roteirizadora ER-2 */}
      {activeSubTab === 'gemini_er2_otimizador' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border-2 border-cyan-500/30 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Despachante Cognitivo Gemini ER-2 para Santa Terezinha de Itaipu
                  </h3>
                  <p className="text-xs text-slate-400">
                    Otimização contínua de calçadas, faixas de pedestres, segurança noturna e gasto energético de caminhada
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-3 py-1 rounded-lg border border-cyan-500/40 font-bold">
                100% Sincronizado com Marcos Renan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4" />
                  <span>Roteamento de Menor Esforço</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  O ER-2 analisa a topografia de Santa Terezinha de Itaipu para traçar trajetos evitando aclives acentuados desnecessários e priorizando calçadas pavimentadas da Av. Brasil e Av. das Orquídeas.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Segurança Viária 24h</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Travessias exclusivamente em faixas de pedestres sinalizadas com iluminação LED noturna. O sistema orienta horários de menor fluxo veicular nas imediações da BR-277.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4" />
                  <span>Pegada de Carbono Zero</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ao realizar 100% das entregas a pé com uniforme social, elimina-se o custo com combustível fóssil, multas e ruído urbano, gerando o selo de entrega mais sustentável do Oeste do Paraná.
                </p>
              </div>
            </div>

            {/* Live ER-2 Dispatcher Log */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400">Log de Raciocínio Logístico do ER-2:</div>
              <div className="text-cyan-300">
                &gt; [GEO-STI] Mapa de Santa Terezinha de Itaipu carregado: 7 bairros e 42 pontos comerciais ativos.
              </div>
              <div className="text-emerald-300">
                &gt; [MARCOS-RENAN-ID] Entregador exclusivo conectado. Ritmo médio verificado: 11.8 min/km.
              </div>
              <div className="text-amber-300">
                &gt; [SINE-PR-VAGA] Vínculo de emprego VAGA-STI-2026-EXCL-01 com status ATIVO e trava de perfil.
              </div>
              <div className="text-slate-400">
                &gt; [STATUS] Pronto para despacho ininterrupto 24 horas por dia.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 5: Uniforme Formal & Painel QR Code */}
      {activeSubTab === 'uniforme_qr' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border-2 border-rose-500/30 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Padrão Visual do Uniforme Executivo & Painel QR Code Dinâmico
                  </h3>
                  <p className="text-xs text-slate-400">
                    Conforme registrado na imagem oficial do projeto ("OPERAÇÃO 24H - SEMPRE A PÉ")
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono text-rose-300 bg-rose-950 px-3 py-1 rounded-lg border border-rose-500/40 font-bold">
                Padrão Formal Exclusivo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Uniform specifications */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-400" />
                  <span>Componentes do Uniforme Formal de Gala</span>
                </h4>

                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-xs font-bold text-white">1. Camisa Social Azul Executiva & Gravata Slim</div>
                    <div className="text-[11px] text-slate-400 leading-snug">
                      Tecido tecnológico respirável anti-transpirante com corte de alfaiataria executivo, transmitindo máxima credibilidade a clientes e empresas de STI.
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-xs font-bold text-white">2. Boné Executivo com Logo "Pedestre Formal Delivery" & Chip NFC</div>
                    <div className="text-[11px] text-slate-400 leading-snug">
                      Aba curva com emblema bordado em dourado e painel QR Code frontal para leitura rápida de identificação profissional.
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-xs font-bold text-white">3. Mochila Estruturada Ergonômica com QR Code Dinâmico</div>
                    <div className="text-[11px] text-slate-400 leading-snug">
                      Isolamento térmico duplo para alimentação ou medicamentos, suporte lombar ortopédico e painel posterior de QR Code sincronizado ao app.
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-xs font-bold text-white">4. Calça de Alfaiataria & Sapato Confort com Amortecimento</div>
                    <div className="text-[11px] text-slate-400 leading-snug">
                      Palmilhas de gel ortopédicas de absorção contínua de impacto para jornadas seguras e saudáveis em Santa Terezinha de Itaipu.
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic QR Code & Scanning Terminal */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col items-center text-center justify-center">
                <div className="w-36 h-36 rounded-2xl bg-white p-3 shadow-2xl flex flex-col items-center justify-center border-4 border-slate-900">
                  {/* Visual QR Code matrix representation */}
                  <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-slate-900 rounded">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${
                          (i % 2 === 0 || i % 7 === 0 || i < 6 || i > 30) ? 'bg-white' : 'bg-slate-900'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-black text-white">QR Code de Identificação do Entregador</div>
                  <div className="text-xs font-mono text-emerald-400">PEDESTRE-STI-MARCOS-RENAN-2026</div>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    Ao apontar a câmera do smartphone, comerciantes e moradores de Santa Terezinha de Itaipu visualizam a autenticação da entrega, rastreio ao vivo e comprovante SINE.
                  </p>
                </div>

                <button
                  onClick={() => handleCopy('https://pedestre-formal-delivery.sti.pr.gov/entregador/marcosrenan', 'link_qr')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Copy className="w-4 h-4 text-emerald-400" />
                  <span>{copiedField === 'link_qr' ? 'Link Copiado!' : 'Copiar Link do QR Code'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function LockBadgeIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}
