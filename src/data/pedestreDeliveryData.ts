import { 
  PedestreEnterpriseInfo, 
  SineAgenciaVaga, 
  PedestreDeliveryOrder, 
  CourierRealTimeMetrics 
} from '../types';

export const ENTERPRISE_PEDESTRE_STI: PedestreEnterpriseInfo = {
  cnpj: '54.892.104/0001-88',
  razaoSocial: 'PEDESTRE FORMAL DELIVERY & LOGÍSTICA URBANA SUSTENTÁVEL LTDA.',
  nomeFantasia: 'PEDESTRE FORMAL DELIVERY (OPERAÇÃO 24H - SEMPRE A PÉ)',
  dataAbertura: '06/09/2026',
  naturezaJuridica: '206-2 - Sociedade Empresária Limitada',
  cnaePrincipal: '53.20-2-02 - Serviços de entrega rápida e logística de proximidade',
  cnaesSecundarios: [
    '52.29-0-99 - Outras atividades auxiliares dos transportes terrestres',
    '74.90-1-04 - Intermediação de negócios e logística urbana inteligente',
    '62.01-5-01 - Desenvolvimento de programas de computador customizáveis sob encomenda'
  ],
  situacaoCadastral: 'ATIVA_E_REGULARIZADA',
  endereco: {
    logradouro: 'Avenida Brasil, 1420 - Sala 04 (Edifício Comercial Itaipu)',
    bairro: 'Centro',
    cidade: 'Santa Terezinha de Itaipu',
    estado: 'Paraná (PR)',
    cep: '85875-000',
    pais: 'Brasil'
  },
  capitalSocial: 'R$ 150.000,00 (Cento e cinquenta mil reais)',
  regimeTributario: 'Simples Nacional / InovAtiva Paraná',
  orgaoRegistro: 'Junta Comercial do Estado do Paraná (JUCEPAR) - Protocolo 26/994120-4',
  porte: 'Empresa de Pequeno Porte (EPP) / Startup de Logística Sustentável',
  operacao: {
    modalidade: '100% A PÉ (PEDESTRE FORMAL 24H)',
    coberturaGeografica: 'Santa Terezinha de Itaipu - PR & Conexão Trinacional',
    emissaoCarbono: '0.0 g CO₂ / Entrega (Eco-Zero Absoluto)',
    trajeObrigatorio: 'Uniforme Social Formal Completo + Gravata Slim + Mochila QR Code Dinâmico + Boné Executivo com NFC'
  }
};

export const VAGA_SINE_SANTA_TEREZINHA: SineAgenciaVaga = {
  id: 'VAGA-STI-2026-EXCL-01',
  codigoSINE: 'SINE-PR-STI-884920-A',
  agenciaTrabalhador: 'Agência do Trabalhador / SINE - Unidade Santa Terezinha de Itaipu',
  municipio: 'Santa Terezinha de Itaipu',
  uf: 'PR',
  cargo: 'Especialista em Logística Pedestre Formal 24h & Entrega Urbana de Alta Precisão',
  cboCodigo: '5191-10 - Entregador Pedestre / Courier Executivo de Proximidade',
  exclusivoCandidatoNome: 'Marcos Renan',
  exclusivoCandidatoEmail: 'marcosrenan20121995@gmail.com',
  statusVaga: 'RESERVADA_EXCLUSIVAMENTE_PARA_MARCOS_RENAN',
  remuneracao: {
    salarioBaseMes: 3480.00,
    adicionalProdutividadePorKm: 4.50,
    adicionalNoturno24hPct: 25.0,
    ticketAlimentacaoMes: 980.00,
    auxilioCalcadoOrtopedico: 450.00,
    seguroVidaSaudeIntegral: true,
    previsaoGanhosMes: 'R$ 5.800,00 a R$ 7.900,00 / mês (com bônus de pontualidade e km a pé)'
  },
  beneficiosInclusos: [
    'Registro Formal em Carteira de Trabalho Digital (CLT / Contrato Executivo)',
    'Kit Completo de Uniforme Social de Gala: Camisas Sociais de Alta Respirabilidade, Gravatas Slim, Calças de Alfaiataria e Bonés Executivos com Chip NFC e QR Code',
    'Mochila Térmica Estruturada Ergonômica com Painel LED/QR Code Dinâmico',
    'Smartphone Rugged 5G com aplicativo operacional conectado ao Gemini ER-2',
    'Auxílio Fisioterapia & Calçados Ortopédicos com Amortecimento de Impacto',
    'Seguro de Vida e Assistência Médica Integral 24h',
    'Plano de Participação nos Lucros e Resultados (PLR) da Logística Sustentável'
  ],
  jornadaTrabalho: 'Escala Flexível 24h com Intervalos Ergonomicamente Monitorados por IA',
  requisitos: [
    'Titularidade e Identificação Exclusiva reservada a Marcos Renan (marcosrenan20121995@gmail.com)',
    'Compromisso com o padrão visual formal de excelência (camisa social, gravata e mochila institucional)',
    'Pontualidade rigorosa e atendimento cortês aos comércios e residências de Santa Terezinha de Itaipu',
    'Conhecimento geográfico do município (Centro, Santa Mônica, Parque dos Estados, Vila Vitorassi, BNH, etc.)'
  ],
  cartaEncaminhamentoNumero: 'ENCAM-SINE-STI-2026-9921',
  dataEmissao: '06 de Setembro de 2026',
  protocoloGovPR: 'GOV-PR-SETP-STI-883921-2026'
};

export const INITIAL_ORDERS_STI: PedestreDeliveryOrder[] = [
  {
    id: 'ORDER-STI-101',
    codigoRastreio: 'STI-PED-2026-001',
    clienteOrigem: 'Padaria Boa Hora 24h',
    enderecoOrigem: 'Av. Brasil, 890 - Centro, Santa Terezinha de Itaipu',
    clienteDestino: 'Dra. Vanessa Martins (Consultório Odontológico)',
    enderecoDestino: 'Rua 1º de Maio, 410 - Centro, Santa Terezinha de Itaipu',
    bairroSTI: 'Centro',
    categoriaItem: 'PADARIA_GOURMET',
    descricaoPacote: 'Café da manhã executivo gourmet, croissants quentes e suco natural prensado a frio',
    pesoKg: 1.2,
    distanciaMetros: 680,
    passosEstimados: 890,
    caloriasQueimadasKcal: 42,
    tempoCaminhadaMinutos: 8,
    status: 'EM_ROTA_A_PE',
    valorFreteRecebido: 22.50,
    horarioCriacao: '16:15:30',
    coordenadasRota: {
      origem: { lat: -25.4385, lng: -54.3982 },
      destino: { lat: -25.4410, lng: -54.4012 }
    },
    instrucoesRotaER2: 'Siga a pé pela calçada da Av. Brasil em direção ao norte, vire à esquerda na Rua 1º de Maio. Travessia sinalizada na faixa de pedestres.',
    qrCodeToken: 'QR-TOKEN-STI-BOAHORA-410'
  },
  {
    id: 'ORDER-STI-102',
    codigoRastreio: 'STI-PED-2026-002',
    clienteOrigem: 'Farmácia Central 24 Horas STI',
    enderecoOrigem: 'Av. das Orquídeas, 320 - Bairro Santa Mônica',
    clienteDestino: 'Residencial Dona Carmen',
    enderecoDestino: 'Rua dos Ipês, 155 - Parque dos Estados',
    bairroSTI: 'Parque dos Estados',
    categoriaItem: 'FARMACIA_MEDICAMENTOS',
    descricaoPacote: 'Medicamentos essenciais de controle térmico e kit curativo urgente',
    pesoKg: 0.6,
    distanciaMetros: 1150,
    passosEstimados: 1520,
    caloriasQueimadasKcal: 78,
    tempoCaminhadaMinutos: 14,
    status: 'DISPONIVEL_PARA_COLETA',
    valorFreteRecebido: 28.00,
    horarioCriacao: '16:18:45',
    coordenadasRota: {
      origem: { lat: -25.4420, lng: -54.3940 },
      destino: { lat: -25.4480, lng: -54.3890 }
    },
    instrucoesRotaER2: 'Caminho sombreado pelas árvores da Av. das Orquídeas com calçamento tátil contínuo até o Parque dos Estados.',
    qrCodeToken: 'QR-TOKEN-STI-FARMA-155'
  },
  {
    id: 'ORDER-STI-103',
    codigoRastreio: 'STI-PED-2026-003',
    clienteOrigem: 'Tabelionato de Notas e Protestos STI',
    enderecoOrigem: 'Rua Adolfo Lollato, 215 - Centro',
    clienteDestino: 'Escritório de Engenharia Agro-Itaipu',
    enderecoDestino: 'Av. Brasil, 2100 - Vila Vitorassi',
    bairroSTI: 'Vila Vitorassi',
    categoriaItem: 'DOCUMENTOS_CARTORIO',
    descricaoPacote: 'Escritura pública com firma reconhecida e plantas topográficas lacradas',
    pesoKg: 0.8,
    distanciaMetros: 1420,
    passosEstimados: 1890,
    caloriasQueimadasKcal: 95,
    tempoCaminhadaMinutos: 17,
    status: 'DISPONIVEL_PARA_COLETA',
    valorFreteRecebido: 35.00,
    horarioCriacao: '16:20:10',
    coordenadasRota: {
      origem: { lat: -25.4390, lng: -54.3995 },
      destino: { lat: -25.4320, lng: -54.4120 }
    },
    instrucoesRotaER2: 'Rota expressa via passeio seguro da Av. Brasil com conexão direta para a Vila Vitorassi.',
    qrCodeToken: 'QR-TOKEN-STI-CARTORIO-2100'
  },
  {
    id: 'ORDER-STI-104',
    codigoRastreio: 'STI-PED-2026-004',
    clienteOrigem: 'Restaurante & Grill Sabores do Sul',
    enderecoOrigem: 'Rua Leonel Brizola, 85 - BNH',
    clienteDestino: 'Família Silveira (Casa 12)',
    enderecoDestino: 'Rua das Palmeiras, 340 - Jardim Planalto',
    bairroSTI: 'Jardim Planalto',
    categoriaItem: 'ALIMENTACAO_24H',
    descricaoPacote: 'Combo executivo artesanal na embalagem térmica selada a vácuo',
    pesoKg: 1.5,
    distanciaMetros: 890,
    passosEstimados: 1180,
    caloriasQueimadasKcal: 60,
    tempoCaminhadaMinutos: 11,
    status: 'ENTREGUE_COM_SUCESSO',
    valorFreteRecebido: 24.00,
    horarioCriacao: '15:45:00',
    coordenadasRota: {
      origem: { lat: -25.4450, lng: -54.4020 },
      destino: { lat: -25.4500, lng: -54.4050 }
    },
    instrucoesRotaER2: 'Entrega finalizada com sucesso! Código QR escaneado e validado pelo destinatário.',
    qrCodeToken: 'QR-TOKEN-STI-GRILL-340'
  }
];

export const INITIAL_COURIER_METRICS: CourierRealTimeMetrics = {
  totalEntregasRealizadas: 14,
  totalKmCaminhados: 18.6,
  totalPassosDados: 24800,
  totalCaloriasGastas: 1240,
  faturamentoAcumulado: 412.50,
  co2EvitadoKg: 4.85,
  avaliacaoMedia: 5.0,
  ritmoMedioMinKm: 11.8,
  statusOperacional: 'EM_SERVICO_24H_A_PE'
};

export function generateNewDeliveryOrderSTI(): PedestreDeliveryOrder {
  const origens = [
    { nome: 'Padaria Boa Hora 24h', end: 'Av. Brasil, 890 - Centro', cat: 'PADARIA_GOURMET' as const, peso: 1.1 },
    { nome: 'Farmácia Central STI', end: 'Av. das Orquídeas, 320 - Santa Mônica', cat: 'FARMACIA_MEDICAMENTOS' as const, peso: 0.5 },
    { nome: 'Laboratório Itaipu de Análises', end: 'Rua 1º de Maio, 102 - Centro', cat: 'FARMACIA_MEDICAMENTOS' as const, peso: 0.3 },
    { nome: 'Cartório Notarial STI', end: 'Rua Adolfo Lollato, 215 - Centro', cat: 'DOCUMENTOS_CARTORIO' as const, peso: 0.7 },
    { nome: 'Bistrô & Café Colonial Paraná', end: 'Av. Brasil, 1280 - Centro', cat: 'PADARIA_GOURMET' as const, peso: 1.4 },
    { nome: 'Lanchonete 24h Ponto Certo', end: 'Rua das Flores, 55 - Vila Vitorassi', cat: 'ALIMENTACAO_24H' as const, peso: 1.6 },
    { nome: 'Mega Eletrônicos & Peças STI', end: 'Av. das Nações, 410 - BNH', cat: 'ELETRONICOS_PECAS' as const, peso: 0.9 }
  ];

  const destinos = [
    { nome: 'Condomínio Residencial Itaipu', end: 'Rua dos Cravos, 450 - Santa Mônica', bairro: 'Santa Mônica' },
    { nome: 'Consultório Dr. Roberto', end: 'Av. Brasil, 1600 - Centro', bairro: 'Centro' },
    { nome: 'Residência Família Andrade', end: 'Rua 7 de Setembro, 88 - BNH', bairro: 'BNH' },
    { nome: 'Empresa AgroTech do Oeste', end: 'Rua Paraná, 310 - Jardim Planalto', bairro: 'Jardim Planalto' },
    { nome: 'Escritório Contábil Iguaçu', end: 'Rua 1º de Maio, 560 - Centro', bairro: 'Centro' },
    { nome: 'Residencial Vila Verde', end: 'Rua das Acácias, 720 - Parque dos Estados', bairro: 'Parque dos Estados' },
    { nome: 'Clínica Veterinária Vida Pet', end: 'Av. das Orquídeas, 890 - Santa Mônica', bairro: 'Santa Mônica' }
  ];

  const randOrigem = origens[Math.floor(Math.random() * origens.length)];
  const randDestino = destinos[Math.floor(Math.random() * destinos.length)];
  const distancia = Math.floor(Math.random() * 900) + 450; // 450m a 1350m
  const passos = Math.round(distancia * 1.32);
  const tempo = Math.ceil(distancia / 80); // ~80m por minuto a pé
  const calorias = Math.round(passos * 0.048);
  const valorFrete = Number((18.00 + (distancia / 1000) * 8.50).toFixed(2));
  const randNum = Math.floor(Math.random() * 900) + 100;

  return {
    id: `ORDER-STI-${Date.now()}-${randNum}`,
    codigoRastreio: `STI-PED-2026-${randNum}`,
    clienteOrigem: randOrigem.nome,
    enderecoOrigem: randOrigem.end,
    clienteDestino: randDestino.nome,
    enderecoDestino: randDestino.end,
    bairroSTI: randDestino.bairro,
    categoriaItem: randOrigem.cat,
    descricaoPacote: `Entrega formal prioritária a pé - Pacote lacrado com identificação QR Code`,
    pesoKg: randOrigem.peso,
    distanciaMetros: distancia,
    passosEstimados: passos,
    caloriasQueimadasKcal: calorias,
    tempoCaminhadaMinutos: tempo,
    status: 'DISPONIVEL_PARA_COLETA',
    valorFreteRecebido: valorFrete,
    horarioCriacao: new Date().toLocaleTimeString('pt-BR'),
    coordenadasRota: {
      origem: { lat: -25.4380 + (Math.random() * 0.01 - 0.005), lng: -54.3980 + (Math.random() * 0.01 - 0.005) },
      destino: { lat: -25.4410 + (Math.random() * 0.01 - 0.005), lng: -54.4010 + (Math.random() * 0.01 - 0.005) }
    },
    instrucoesRotaER2: `Rota pedestre otimizada pelo robô ER-2: Travessias em faixas seguras, calçadas acessíveis e menor tempo sob sombra natural em Santa Terezinha de Itaipu.`,
    qrCodeToken: `QR-STI-PEDESTRE-${randNum}-${Date.now().toString().slice(-4)}`
  };
}
