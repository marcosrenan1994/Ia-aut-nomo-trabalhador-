import React, { useState } from 'react';
import { 
  Brain, 
  Building2, 
  Bot, 
  Factory, 
  Footprints, 
  Cpu, 
  Zap, 
  Wrench, 
  HardDrive, 
  Sliders, 
  Droplet, 
  Users, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Globe,
  Award,
  Flame
} from 'lucide-react';

interface IntellectualVaultHubProps {
  onSelectModule: (moduleId: string) => void;
  activeModuleId: string;
}

export const IntellectualVaultHub: React.FC<IntellectualVaultHubProps> = ({
  onSelectModule,
  activeModuleId
}) => {
  const VAULT_MODULES = [
    {
      id: 'orchestrator_sand_playground',
      title: 'Playground do Orquestrador (Cinemática 6-DOF & Grãos de Areia)',
      category: 'Criatividade & Cinemática 6-DOF',
      icon: Flame,
      color: 'from-amber-500 via-orange-600 to-cyan-600',
      badge: 'Gerador de Imagens por Grãos',
      description: 'O Orquestrador gera o que quiser usando seu próprio gerador de imagens por grãos de areia colorida despejados pelo braço 6-DOF para exibir os postos de trabalho dos empregados IA autônomos.'
    },
    {
      id: 'wise_quantum_bank',
      title: 'Wise Quantum Bank & Deflação de Alimentos',
      category: 'Economia & Finanças',
      icon: Building2,
      color: 'from-emerald-600 to-teal-700',
      badge: 'R$ 1,00 Rendendo',
      description: 'Supermercado Universal (da farinha a espaçonaves), funcionários autônomos quânticos e transição robótica.'
    },
    {
      id: 'workstation_6dof',
      title: 'Bancada Robótica Salomão 6-DOF',
      category: 'Hardware & Cinemática',
      icon: Bot,
      color: 'from-indigo-600 to-blue-700',
      badge: 'Cinemática Direta/Inversa',
      description: 'Articulações rotacionais J1-J6, torque em Nm, sensor térmico e feedback milimétrico de precisão.'
    },
    {
      id: 'global_physical_industry',
      title: 'Indústrias Físicas Tangíveis',
      category: 'Manufatura & Automação',
      icon: Factory,
      color: 'from-amber-600 to-orange-700',
      badge: 'Chão de Fábrica',
      description: 'Linhas de montagem autônomas, forjamento laser, fundição de precisão e produção sem operadores humanos.'
    },
    {
      id: 'pedestre_formal_delivery',
      title: 'Pedestre Formal Delivery STI',
      category: 'Logística & Transporte',
      icon: Footprints,
      color: 'from-purple-600 to-pink-700',
      badge: 'Entrega Autônoma',
      description: 'Frota de pedestres robóticos para transporte de insumos urbanos com despacho formal e rastreio.'
    },
    {
      id: 'wisdom',
      title: 'Cérebro Sábio & Consciência Reflexiva',
      category: 'Cognição & Meta-Planejamento',
      icon: Brain,
      color: 'from-rose-600 to-red-700',
      badge: 'Auto-Planejamento',
      description: 'Introspecção metacognitiva, formulação de hipóteses, heurísticas e índice cognitivo adaptativo.'
    },
    {
      id: 'autonomous',
      title: 'Auto-Aprendizado Fabril',
      category: 'Machine Learning',
      icon: Zap,
      color: 'from-cyan-600 to-blue-800',
      badge: 'Ciclos Recursivos',
      description: 'Evolução contínua de precisão, calibração de ferramentas e mitigação de erros mecânicos.'
    },
    {
      id: 'orchestrator',
      title: 'Orquestrador de Tarefas Industriais',
      category: 'Planejamento Operacional',
      icon: Cpu,
      color: 'from-blue-600 to-indigo-800',
      badge: 'Passo a Passo',
      description: 'Geração e execução de rotinas detalhadas de solda, montagem, inspeção e calibração de peças.'
    },
    {
      id: 'toolkit',
      title: 'Kit de Ferramentas (End-Effectors)',
      category: 'Ferramental',
      icon: Wrench,
      color: 'from-slate-700 to-slate-800',
      badge: 'Atuadores',
      description: 'Garras pneumáticas, solda laser quântica, paquímetro micrométrico e trocadores rápidos.'
    },
    {
      id: 'memory',
      title: 'Memória & Núcleo Quântico',
      category: 'Armazenamento & Telemetria',
      icon: HardDrive,
      color: 'from-teal-600 to-emerald-800',
      badge: 'Cache Sincronizado',
      description: 'Histórico de execuções, vetores de estilo e persistência offline-online com paridade total.'
    },
    {
      id: 'teleop',
      title: 'Teleoperação Manual 6-DOF',
      category: 'Controle Direto',
      icon: Sliders,
      color: 'from-amber-700 to-yellow-800',
      badge: 'Jog Manual',
      description: 'Controle angular das 6 juntas e acionamento manual de ferramentas com parada de emergência.'
    },
    {
      id: 'water_sorter',
      title: 'Container Sorter 3D (Água)',
      category: 'Algoritmos & Otimização',
      icon: Droplet,
      color: 'from-sky-600 to-blue-700',
      badge: 'Visual 3D',
      description: 'Resolução do problema clássico de retenção de líquido tridimensional com renderização em tempo real.'
    },
    {
      id: 'quantum_meeting_room',
      title: 'Sala de Reunião Autônoma',
      category: 'Conselho Consultivo',
      icon: Users,
      color: 'from-indigo-600 to-purple-800',
      badge: 'Reunião 24/7',
      description: 'Debate executivo e deliberações estratégicas contínuas entre os agentes robóticos.'
    }
  ];

  return (
    <div id="intellectual-vault-hub" className="space-y-4 font-sans text-white">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-purple-950/60 to-slate-950 border-2 border-purple-500/40 p-4 sm:p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                PAINEL VIRTUAL INTELECTUAL // NÚCLEO CENTRAL
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Módulos e Centrais Avançadas do Sistema</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Todas as centrais especializadas (Wise Quantum Bank, Robótica 6-DOF, Indústrias, Memória e Teleoperação) preservadas e organizadas de forma limpa como opções sob demanda.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Vault Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {VAULT_MODULES.map((mod) => {
          const Icon = mod.icon;
          const isCurrent = activeModuleId === mod.id;
          return (
            <div
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                isCurrent 
                  ? 'bg-slate-900 border-cyan-400 shadow-xl shadow-cyan-500/20 ring-2 ring-cyan-400/50' 
                  : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${mod.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800 text-[9px] font-mono font-bold">
                    {mod.badge}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{mod.category}</div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug line-clamp-2">
                    {mod.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400">
                <span>{isCurrent ? 'Módulo em Exibição' : 'Abrir este Módulo'}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
