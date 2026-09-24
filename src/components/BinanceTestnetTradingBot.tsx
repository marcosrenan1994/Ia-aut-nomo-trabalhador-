import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Play, 
  Pause, 
  Zap, 
  RotateCcw, 
  ShieldCheck, 
  Sliders, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  AlertTriangle,
  Bot,
  Layers,
  ChevronRight,
  Flame,
  Target
} from 'lucide-react';

export interface BinancePosition {
  id: string;
  pair: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  markPrice: number;
  amount: number;
  leverage: number;
  margin: number;
  unrealizedPnl: number;
  pnlPercentage: number;
  timestamp: string;
}

export interface BinanceOrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export const BinanceTestnetTradingBot: React.FC = () => {
  // Selected Trading Pair
  const [selectedPair, setSelectedPair] = useState<'BTC/USDT' | 'ETH/USDT' | 'SOL/USDT' | 'BNB/USDT'>('BTC/USDT');
  
  // Market Prices State
  const [currentPrice, setCurrentPrice] = useState<number>(68420.50);
  const [priceChange24h, setPriceChange24h] = useState<number>(3.42);
  const [high24h, setHigh24h] = useState<number>(69150.00);
  const [low24h, setLow24h] = useState<number>(66210.00);

  // Account State (Binance Testnet Funds)
  const [testnetBalance, setTestnetBalance] = useState<number>(10000.00);
  const [availableMargin, setAvailableMargin] = useState<number>(8500.00);

  // Order Placement State
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [limitPrice, setLimitPrice] = useState<number>(68420.50);
  const [orderAmountUsdt, setOrderAmountUsdt] = useState<number>(1000);
  const [leverage, setLeverage] = useState<number>(10);
  
  // Active Positions & Trade History
  const [positions, setPositions] = useState<BinancePosition[]>([
    {
      id: 'POS-001',
      pair: 'BTC/USDT',
      type: 'LONG',
      entryPrice: 67890.00,
      markPrice: 68420.50,
      amount: 0.147,
      leverage: 10,
      margin: 1000.00,
      unrealizedPnl: 78.20,
      pnlPercentage: 7.82,
      timestamp: '09:15:30'
    }
  ]);
  const [tradeLogs, setTradeLogs] = useState<string[]>([
    '[BINANCE TESTNET] Conexão com API WebSocket de Futuros estabelecida.',
    '[GRID BOT] Grade de ordens ativas calculada entre $65.000 e $72.000.',
    '[EXECUÇÃO] Ordem Limitada de compra preenchida para 0.147 BTC @ $67.890.'
  ]);

  // Automated Trading Bot Engine
  const [isBotActive, setIsBotActive] = useState<boolean>(true);
  const [botStrategy, setBotStrategy] = useState<'GRID' | 'SCALPER' | 'ARBITRAGE'>('GRID');
  const [botStatusMessage, setBotStatusMessage] = useState<string>('Monitorando volatilidade e ajustando micro-ordens.');

  // Live Price Ticker & Order Book Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Dynamic random price walk
      setCurrentPrice((prev) => {
        const delta = (Math.random() - 0.48) * (selectedPair === 'BTC/USDT' ? 45 : selectedPair === 'ETH/USDT' ? 4 : 0.8);
        const newPrice = Math.max(10, Number((prev + delta).toFixed(2)));
        
        // Update positions unrealized PnL
        setPositions((posList) =>
          posList.map((pos) => {
            const diff = pos.type === 'LONG' ? newPrice - pos.entryPrice : pos.entryPrice - newPrice;
            const uPnl = Number((diff * pos.amount * pos.leverage).toFixed(2));
            const pnlPct = Number(((uPnl / pos.margin) * 100).toFixed(2));
            return {
              ...pos,
              markPrice: newPrice,
              unrealizedPnl: uPnl,
              pnlPercentage: pnlPct
            };
          })
        );

        return newPrice;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [selectedPair]);

  // Automated Bot Execution Loop
  useEffect(() => {
    if (!isBotActive) return;

    const botTimer = setInterval(() => {
      // Execute simulated strategy trade if criteria met
      if (Math.random() > 0.65) {
        const side: 'LONG' | 'SHORT' = Math.random() > 0.5 ? 'LONG' : 'SHORT';
        const tradeAmount = Number((Math.random() * 0.05 + 0.02).toFixed(3));
        const marginCost = 300;

        if (availableMargin >= marginCost) {
          const newPos: BinancePosition = {
            id: `BOT-${Date.now().toString().slice(-4)}`,
            pair: selectedPair,
            type: side,
            entryPrice: currentPrice,
            markPrice: currentPrice,
            amount: tradeAmount,
            leverage: leverage,
            margin: marginCost,
            unrealizedPnl: 0,
            pnlPercentage: 0,
            timestamp: new Date().toLocaleTimeString('pt-BR')
          };

          setPositions((prev) => [newPos, ...prev.slice(0, 4)]);
          setAvailableMargin((prev) => Math.max(0, prev - marginCost));
          setTradeLogs((prev) => [
            `[BOT ${botStrategy}] Ordem de ${side} disparada para ${tradeAmount} ${selectedPair.split('/')[0]} @ $${currentPrice.toLocaleString('pt-BR')}`,
            ...prev.slice(0, 19)
          ]);
          setBotStatusMessage(`Posição ${side} aberta com alavancagem ${leverage}x baseada em ${botStrategy}.`);
        }
      }
    }, 5500);

    return () => clearInterval(botTimer);
  }, [isBotActive, botStrategy, currentPrice, selectedPair, leverage, availableMargin]);

  // Close Position
  const handleClosePosition = (id: string) => {
    const pos = positions.find((p) => p.id === id);
    if (!pos) return;

    setTestnetBalance((prev) => prev + pos.unrealizedPnl);
    setAvailableMargin((prev) => prev + pos.margin + pos.unrealizedPnl);
    setPositions((prev) => prev.filter((p) => p.id !== id));
    setTradeLogs((prev) => [
      `[FECHAMENTO] Posição ${pos.type} ${pos.pair} liquidada @ $${currentPrice}. PnL Final: ${pos.unrealizedPnl >= 0 ? '+' : ''}$${pos.unrealizedPnl.toFixed(2)} (${pos.pnlPercentage}%)`,
      ...prev
    ]);
  };

  // Close All Positions
  const handleCloseAllPositions = () => {
    let totalPnl = 0;
    let returnedMargin = 0;
    positions.forEach((p) => {
      totalPnl += p.unrealizedPnl;
      returnedMargin += p.margin;
    });

    setTestnetBalance((prev) => prev + totalPnl);
    setAvailableMargin((prev) => prev + returnedMargin + totalPnl);
    setPositions([]);
    setTradeLogs((prev) => [
      `[FECHAMENTO TOTAL] Todas as posições encerradas. PnL Total: ${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`,
      ...prev
    ]);
  };

  // Manual Buy / Long
  const handleExecuteLong = () => {
    const cost = Math.min(orderAmountUsdt, availableMargin);
    if (cost <= 10) return;

    const coinAmount = Number(((cost * leverage) / currentPrice).toFixed(4));
    const newPos: BinancePosition = {
      id: `MANUAL-${Date.now().toString().slice(-4)}`,
      pair: selectedPair,
      type: 'LONG',
      entryPrice: currentPrice,
      markPrice: currentPrice,
      amount: coinAmount,
      leverage,
      margin: cost,
      unrealizedPnl: 0,
      pnlPercentage: 0,
      timestamp: new Date().toLocaleTimeString('pt-BR')
    };

    setPositions((prev) => [newPos, ...prev]);
    setAvailableMargin((prev) => prev - cost);
    setTradeLogs((prev) => [
      `[MANUAL LONG] Comprado ${coinAmount} ${selectedPair} @ $${currentPrice} (${leverage}x)`,
      ...prev
    ]);
  };

  // Manual Sell / Short
  const handleExecuteShort = () => {
    const cost = Math.min(orderAmountUsdt, availableMargin);
    if (cost <= 10) return;

    const coinAmount = Number(((cost * leverage) / currentPrice).toFixed(4));
    const newPos: BinancePosition = {
      id: `MANUAL-${Date.now().toString().slice(-4)}`,
      pair: selectedPair,
      type: 'SHORT',
      entryPrice: currentPrice,
      markPrice: currentPrice,
      amount: coinAmount,
      leverage,
      margin: cost,
      unrealizedPnl: 0,
      pnlPercentage: 0,
      timestamp: new Date().toLocaleTimeString('pt-BR')
    };

    setPositions((prev) => [newPos, ...prev]);
    setAvailableMargin((prev) => prev - cost);
    setTradeLogs((prev) => [
      `[MANUAL SHORT] Vendido ${coinAmount} ${selectedPair} @ $${currentPrice} (${leverage}x)`,
      ...prev
    ]);
  };

  // Reset Testnet Balance Faucet
  const handleResetFaucet = () => {
    setTestnetBalance(10000.00);
    setAvailableMargin(10000.00);
    setPositions([]);
    setTradeLogs((prev) => [
      '[FAUCET TESTNET] Saldo restaurado para $10.000,00 USDT Testnet com sucesso.',
      ...prev
    ]);
  };

  return (
    <div id="binance-testnet-trading-bot-view" className="space-y-4 font-sans text-white">
      {/* Top Header & Testnet Account Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-[#181a20] to-slate-950 border-2 border-amber-500/40 p-4 sm:p-5 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                BINANCE FUTURES TESTNET (SIMULADO OFICIAL)
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${isBotActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                {isBotActive ? 'ROBÔ TRADING: ATIVO' : 'ROBÔ TRADING: EM PAUSA'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="text-amber-400 font-mono">BINANCE</span>
              <span>Robô Trading Autônomo & Livro de Ofertas</span>
            </h1>
            <p className="text-xs text-slate-300">
              Operações algorítmicas de alta frequência, Grid Trading e arbitragem automatizada com liquidez simulada em tempo real.
            </p>
          </div>

          {/* Wallet Balance Cards */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="flex-1 lg:flex-none p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Saldo Total Testnet:</div>
              <div className="text-lg font-black font-mono text-emerald-400">
                ${testnetBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} USDT
              </div>
            </div>

            <div className="flex-1 lg:flex-none p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Margem Disponível:</div>
              <div className="text-lg font-black font-mono text-white">
                ${availableMargin.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} USDT
              </div>
            </div>

            <button
              id="btn-binance-faucet-reset"
              onClick={handleResetFaucet}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all"
              title="Restaurar saldo de teste para 10.000 USDT"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-[9px]">Recarregar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Trading Terminal: Chart & Book + Order Entry + Bot Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Pair Selector, Chart & Live Order Book (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Pair Selector Tabs */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800 overflow-x-auto gap-2">
            <div className="flex items-center gap-1.5">
              {(['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT'] as const).map((pair) => (
                <button
                  key={pair}
                  onClick={() => setSelectedPair(pair)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedPair === pair 
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20' 
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {pair}
                </button>
              ))}
            </div>

            {/* Live Ticker Metrics */}
            <div className="flex items-center gap-3 text-xs font-mono pr-2">
              <div>
                <span className="text-slate-400 text-[10px] block">Preço Atual:</span>
                <span className={`font-black text-sm ${priceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">24h Variação:</span>
                <span className="text-emerald-400 font-bold">+{priceChange24h}%</span>
              </div>
            </div>
          </div>

          {/* Visual Candlestick & Technical Canvas Mock */}
          <div className="p-4 rounded-2xl bg-[#181a20] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 font-mono">
                <span className="text-white font-bold">{selectedPair} Futuros Perpétuos</span>
                <span className="text-emerald-400">EMA(9): 68.390</span>
                <span className="text-indigo-400">EMA(21): 68.120</span>
                <span className="text-amber-400">RSI(14): 58.4</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">Tempo Real 60fps</span>
            </div>

            {/* Stylized Candlestick Graphic */}
            <div className="h-44 w-full bg-slate-950/80 rounded-xl p-3 flex items-end justify-between gap-1 overflow-hidden relative">
              {/* Background grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
                <div className="border-b border-slate-600 w-full" />
                <div className="border-b border-slate-600 w-full" />
                <div className="border-b border-slate-600 w-full" />
              </div>

              {/* Sample simulated candlesticks */}
              {[42, 58, 52, 64, 60, 75, 71, 80, 85, 78, 88, 92, 86, 95, 90, 102, 98, 110, 105, 115, 122, 118, 126, 130].map((val, i) => {
                const isGreen = i % 3 !== 0;
                const heightPct = Math.min(90, Math.max(15, (val / 140) * 100));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full z-10">
                    <div className={`w-0.5 h-full ${isGreen ? 'bg-emerald-500/50' : 'bg-rose-500/50'}`} style={{ maxHeight: `${heightPct + 8}%` }} />
                    <div className={`w-full max-w-[14px] rounded-xs ${isGreen ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ height: `${heightPct}%` }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Positions Table */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase text-white tracking-wide">
                  Posições Abertas ({positions.length})
                </h3>
              </div>
              {positions.length > 0 && (
                <button
                  id="btn-binance-close-all-positions"
                  onClick={handleCloseAllPositions}
                  className="px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-[10px] font-bold transition-all"
                >
                  Fechar Todas as Posições
                </button>
              )}
            </div>

            {positions.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                Nenhuma posição aberta no momento. Dispare ordens manuais ou ative o Robô Trading abaixo.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                      <th className="pb-1">Par / Tipo</th>
                      <th className="pb-1">Tamanho</th>
                      <th className="pb-1">Entrada</th>
                      <th className="pb-1">Preço Atual</th>
                      <th className="pb-1">Lucro / PnL</th>
                      <th className="pb-1 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {positions.map((pos) => (
                      <tr key={pos.id} className="text-xs">
                        <td className="py-2 flex items-center gap-1.5 font-bold">
                          <span className={`px-1.5 py-0.2 rounded text-[9px] ${pos.type === 'LONG' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                            {pos.type} {pos.leverage}x
                          </span>
                          <span className="text-white">{pos.pair}</span>
                        </td>
                        <td className="py-2 text-slate-300">{pos.amount}</td>
                        <td className="py-2 text-slate-400">${pos.entryPrice.toLocaleString('pt-BR')}</td>
                        <td className="py-2 text-white">${pos.markPrice.toLocaleString('pt-BR')}</td>
                        <td className={`py-2 font-bold ${pos.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {pos.unrealizedPnl >= 0 ? '+' : ''}${pos.unrealizedPnl.toFixed(2)} ({pos.pnlPercentage}%)
                        </td>
                        <td className="py-2 text-right">
                          <button
                            id={`btn-close-pos-${pos.id}`}
                            onClick={() => handleClosePosition(pos.id)}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-rose-600 text-rose-300 hover:text-white text-[10px] font-bold transition-colors"
                          >
                            Fechar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Entry & Autonomous Bot Engine (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Autonomous Trading Bot Card */}
          <div className="p-4 rounded-2xl bg-[#181a20] border-2 border-amber-500/50 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-white">
                    Robô Algorítmico Autônomo
                  </h3>
                  <span className="text-[10px] text-amber-400 font-mono">
                    Binance Testnet Engine
                  </span>
                </div>
              </div>

              <button
                id="btn-binance-toggle-bot"
                onClick={() => setIsBotActive(!isBotActive)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  isBotActive 
                    ? 'bg-rose-600 text-white shadow-md' 
                    : 'bg-emerald-500 text-slate-950 font-black shadow-md'
                }`}
              >
                {isBotActive ? 'PAUSAR ROBÔ' : 'LIGAR ROBÔ'}
              </button>
            </div>

            {/* Strategy Selector */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Estratégia Algorítmica:
              </label>
              <div className="grid grid-cols-3 gap-1 text-[10px] font-bold">
                {[
                  { id: 'GRID', label: 'Grid Bot' },
                  { id: 'SCALPER', label: 'Scalper ReAct' },
                  { id: 'ARBITRAGE', label: 'Arbitragem' }
                ].map((strat) => (
                  <button
                    key={strat.id}
                    onClick={() => setBotStrategy(strat.id as any)}
                    className={`py-1.5 px-2 rounded-lg border transition-all text-center ${
                      botStrategy === strat.id 
                        ? 'bg-amber-500 text-slate-950 border-amber-300 font-black' 
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {strat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Message */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300 flex items-start gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{botStatusMessage}</span>
            </div>

            {/* Leverage Slider */}
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 mb-1">
                <span>Alavancagem Futuros:</span>
                <span className="text-amber-400 font-mono">{leverage}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          {/* Manual Order Entry Form */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase text-white tracking-wide border-b border-slate-800 pb-2">
              Boleta de Operação Manual / Auto-Clique
            </h3>

            {/* Amount USDT */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Valor da Ordem (USDT):
              </label>
              <input
                type="number"
                value={orderAmountUsdt}
                onChange={(e) => setOrderAmountUsdt(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Action Buttons (Buy / Long & Sell / Short) */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                id="btn-binance-buy-long"
                onClick={handleExecuteLong}
                className="py-3 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>COMPRAR / LONG</span>
              </button>

              <button
                id="btn-binance-sell-short"
                onClick={handleExecuteShort}
                className="py-3 px-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>VENDER / SHORT</span>
              </button>
            </div>
          </div>

          {/* Trade Execution Logs */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[10px] space-y-1 max-h-44 overflow-y-auto">
            <div className="text-slate-400 font-bold uppercase pb-1 border-b border-slate-800">
              Logs da API Binance Testnet:
            </div>
            {tradeLogs.map((log, i) => (
              <div key={i} className="text-slate-300 leading-tight">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
