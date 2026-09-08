import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  CreditCard, 
  ArrowRightLeft, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Zap, 
  Sparkles, 
  RotateCw, 
  Plus, 
  Check, 
  Play, 
  Pause, 
  Layers, 
  Compass, 
  Rocket, 
  Package, 
  ShieldCheck, 
  Clock, 
  Info, 
  ChevronRight, 
  Award, 
  Activity, 
  Flame, 
  Eye, 
  Lock, 
  Unlock, 
  Download, 
  Filter, 
  DollarSign,
  Send,
  Cpu,
  Atom,
  RefreshCw,
  Truck,
  Sun,
  HeartHandshake,
  Wheat,
  Cookie,
  BatteryCharging,
  Leaf,
  Sliders,
  Sparkle
} from 'lucide-react';
import { 
  CurrencyAccount, 
  SupermarketItem, 
  SupermarketCategory,
  QuantumSpeedEmployee, 
  BankVaultState, 
  BankTransactionRecord,
  QuantumMeetingDebate,
  RoboticTransitionState
} from '../types/wiseBankTypes';
import { 
  INITIAL_CURRENCIES, 
  INITIAL_SUPERMARKET_ITEMS, 
  INITIAL_QUANTUM_EMPLOYEES, 
  INITIAL_VAULT_STATE, 
  INITIAL_TRANSACTION_RECORDS, 
  INITIAL_MEETING_DEBATES,
  INITIAL_ROBOTIC_TRANSITION_STATE
} from '../data/wiseBankInitialData';

interface Props {
  className?: string;
  onNotification?: (text: string) => void;
}

export const WiseQuantumBank: React.FC<Props> = ({ className = '', onNotification }) => {
  // Navigation inside the Wise Bank
  const [activeBankView, setActiveBankView] = useState<'vault_overview' | 'supermarket' | 'robotic_transition' | 'quantum_meeting' | 'transactions_yield'>('vault_overview');

  // Core States
  const [vault, setVault] = useState<BankVaultState>(() => {
    const saved = localStorage.getItem('er2_wise_vault');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.currentBalanceBRL === 'number') return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_VAULT_STATE;
  });

  const [currencies, setCurrencies] = useState<CurrencyAccount[]>(() => {
    const saved = localStorage.getItem('er2_wise_currencies');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_CURRENCIES;
  });

  const [items, setItems] = useState<SupermarketItem[]>(() => {
    const saved = localStorage.getItem('er2_wise_market_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 15) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_SUPERMARKET_ITEMS;
  });

  const [transition, setTransition] = useState<RoboticTransitionState>(() => {
    const saved = localStorage.getItem('er2_wise_robotic_transition');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.robotsWorkforcePercent === 'number') return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_ROBOTIC_TRANSITION_STATE;
  });

  const [employees, setEmployees] = useState<QuantumSpeedEmployee[]>(INITIAL_QUANTUM_EMPLOYEES);
  const [transactions, setTransactions] = useState<BankTransactionRecord[]>(INITIAL_TRANSACTION_RECORDS);
  const [debates, setDebates] = useState<QuantumMeetingDebate[]>(INITIAL_MEETING_DEBATES);

  // Controls & Quantum Speed
  const [isQuantumSpeedActive, setIsQuantumSpeedActive] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 5 | 20 | 100>(20); // default 20x quantum speed
  const [selectedCurrency, setSelectedCurrency] = useState<string>('BRL');
  const [selectedMarketCategory, setSelectedMarketCategory] = useState<SupermarketCategory | 'ALL'>('ALL');
  const [isCardFrozen, setIsCardFrozen] = useState<boolean>(false);
  const [autoReinvestInMarket, setAutoReinvestInMarket] = useState<boolean>(true);

  // Conversion calculator states
  const [convertFrom, setConvertFrom] = useState<string>('BRL');
  const [convertTo, setConvertTo] = useState<string>('USD');
  const [convertAmount, setConvertAmount] = useState<number>(1.00);

  // Yield graph history points (start from 1.00)
  const [yieldHistory, setYieldHistory] = useState<{ time: string; balance: number }[]>([
    { time: '0s', balance: 1.00 }
  ]);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('er2_wise_vault', JSON.stringify(vault));
  }, [vault]);

  useEffect(() => {
    localStorage.setItem('er2_wise_currencies', JSON.stringify(currencies));
  }, [currencies]);

  useEffect(() => {
    localStorage.setItem('er2_wise_market_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('er2_wise_robotic_transition', JSON.stringify(transition));
  }, [transition]);

  // QUANTUM SPEED ENGINE: Executes mathematical trading, currency arbitrage, and continuous yield
  useEffect(() => {
    if (!isQuantumSpeedActive) return;

    // Interval inversely proportional to speedMultiplier
    const intervalMs = Math.max(100, Math.floor(1000 / speedMultiplier));

    const quantumEngineTimer = setInterval(() => {
      // 1. Pick a random Quantum Speed Employee to lead this cycle's operation
      const empIndex = Math.floor(Math.random() * employees.length);
      const leadEmp = employees[empIndex];

      // 2. Decide operation type: Supermarket Buy/Sell, Triangular Arbitrage, or Compound Staking Yield
      const opChance = Math.random();

      if (opChance < 0.45) {
        // SUPERMARKET TRADE: Buy low, sell with mathematical profit margin
        // Select an item suitable for current bank balance
        const affordableItems = items.filter(it => it.basePriceBRL * it.minFraction <= Math.max(0.01, vault.currentBalanceBRL * 0.8));
        const targetItem = affordableItems.length > 0 
          ? affordableItems[Math.floor(Math.random() * affordableItems.length)]
          : items[0]; // fallback to flour / basic

        // Calculate quantity affordable
        const maxUnits = (vault.currentBalanceBRL * 0.4) / targetItem.currentPriceBRL;
        const buyQty = Math.max(targetItem.minFraction, Number((maxUnits * (0.3 + Math.random() * 0.7)).toFixed(4)));
        const costBRL = Number((buyQty * targetItem.currentPriceBRL).toFixed(2));

        if (costBRL > 0 && costBRL <= vault.currentBalanceBRL) {
          // Calculate profit generated by the employee's mathematical model
          // Yield percentage between 1.2% and 8.5%
          const profitMargin = 0.015 + Math.random() * 0.07;
          const profitBRL = Number((costBRL * profitMargin).toFixed(2));
          const netReturnBRL = Number((costBRL + profitBRL).toFixed(2));

          // Update Vault
          setVault(prev => {
            const nextBal = Number((prev.currentBalanceBRL + profitBRL).toFixed(2));
            const totalProfit = Number((prev.totalCompoundedProfitBRL + profitBRL).toFixed(2));
            const multiplier = Number((nextBal / prev.initialSeedBRL).toFixed(3));
            return {
              ...prev,
              currentBalanceBRL: nextBal,
              totalCompoundedProfitBRL: totalProfit,
              yieldMultiplier: multiplier,
              totalTransactionsCount: prev.totalTransactionsCount + 1,
              totalVolumeTurnoverBRL: Number((prev.totalVolumeTurnoverBRL + costBRL + netReturnBRL).toFixed(2)),
              quantumArbitrageCyclesCompleted: prev.quantumArbitrageCyclesCompleted + 1,
              lastUpdateTimestamp: new Date().toLocaleTimeString()
            };
          });

          // Also update BRL currency balance in the Wise multi-currency account
          setCurrencies(prev => prev.map(c => {
            if (c.code === 'BRL') {
              return { ...c, balance: Number((c.balance + profitBRL).toFixed(2)) };
            }
            return c;
          }));

          // Update Employee Stats
          setEmployees(prev => prev.map((e, idx) => {
            if (idx === empIndex) {
              return {
                ...e,
                calculationsAppliedCount: e.calculationsAppliedCount + 1,
                profitGeneratedBRL: Number((e.profitGeneratedBRL + profitBRL).toFixed(2)),
                computeLoadPercent: Math.min(100, Math.floor(75 + Math.random() * 25))
              };
            }
            return e;
          }));

          // Temporarily increment/decrement held stock and apply progressive deflation on basic foods
          setItems(prev => prev.map(it => {
            if (it.id === targetItem.id) {
              let priceMultiplier = 1;
              if (it.category === 'alimentos_basicos') {
                // Deflation from robotics and autonomous wagons: prices trend consistently downward
                const floor = it.id === 'prod-pao-frances' ? 0.08 : (it.id === 'prod-milho-silo-solar' ? 0.35 : 0.50);
                if (it.currentPriceBRL > floor) {
                  priceMultiplier = 1 - (0.003 + Math.random() * 0.006); // drops 0.3% - 0.9% each trade
                } else {
                  priceMultiplier = 1 + (Math.random() - 0.5) * 0.001;
                }
              } else {
                priceMultiplier = 1 + (Math.random() - 0.505) * 0.004;
              }
              const newPrice = Math.max(0.05, Number((it.currentPriceBRL * priceMultiplier).toFixed(2)));
              const history = [...it.priceHistory.slice(-9), newPrice];
              return {
                ...it,
                currentPriceBRL: newPrice,
                stockHeld: Number((it.stockHeld + (Math.random() > 0.6 ? buyQty : 0)).toFixed(3)),
                priceHistory: history
              };
            }
            return it;
          }));

          // Advance robotic transition if active
          setTransition(prev => {
            if (!prev.isAutoTransitionActive) return prev;
            const newRobots = Math.min(99.8, Number((prev.robotsWorkforcePercent + 0.012).toFixed(3)));
            const newWagons = Math.min(99.8, Number((prev.autonomousWagonsPercent + 0.015).toFixed(3)));
            const newDeflation = Math.max(0.10, Number((prev.foodPriceDeflationIndex * 0.9997).toFixed(4)));
            const newFreight = Math.max(0.00001, Number((0.001 * ((100 - newWagons) / 100)).toFixed(5)));
            const extraFood = targetItem.category === 'alimentos_basicos' ? Math.floor(40 + Math.random() * 160) : 10;
            return {
              ...prev,
              robotsWorkforcePercent: newRobots,
              autonomousWagonsPercent: newWagons,
              humanEmancipationPercent: newRobots,
              foodPriceDeflationIndex: newDeflation,
              freightCostPerKmBRL: newFreight,
              totalFoodProducedRobotsKg: prev.totalFoodProducedRobotsKg + extraFood
            };
          });

          // Log transaction
          const isFoodItem = targetItem.category === 'alimentos_basicos';
          const newTx: BankTransactionRecord = {
            id: `tx-trade-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'SUPERMARKET_SELL',
            description: isFoodItem 
              ? `Comprou e revendeu ${buyQty} ${targetItem.unit} de "${targetItem.name}" (Preço barateado por robôs)`
              : `Comprou e revendeu ${buyQty} ${targetItem.unit} de "${targetItem.name}"`,
            itemOrCurrency: targetItem.name,
            amountBRL: costBRL,
            profitEarnedBRL: profitBRL,
            mathModelUsed: leadEmp.mathDiscipline,
            executedByEmployee: leadEmp.name,
            status: 'COMPLETED'
          };
          setTransactions(prev => [newTx, ...prev.slice(0, 39)]);

          // Add to live debate log
          const customHypothesis = isFoodItem
            ? `Automação agro-robótica em ${targetItem.name}: custo em queda contínua, spread positivo de +R$ ${profitBRL}. Garantia anti-pomba assegurada.`
            : `Aplicação de ${leadEmp.activeFormula.split('=')[0]} na cotação de ${targetItem.name}: spread positivo de +R$ ${profitBRL}.`;

          const newDeb: QuantumMeetingDebate = {
            id: `deb-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            agentName: leadEmp.name,
            role: leadEmp.role,
            mathConcept: leadEmp.mathDiscipline.split(',')[0],
            formula: leadEmp.activeFormula,
            hypothesis: customHypothesis,
            decisionImpact: `Ordem liquidada. Lucro de R$ ${profitBRL} capitalizado no cofre.`,
            consensusWeight: Number((0.92 + Math.random() * 0.07).toFixed(2))
          };
          setDebates(prev => [newDeb, ...prev.slice(0, 19)]);
        }

      } else if (opChance < 0.80) {
        // TRIANGULAR CURRENCY ARBITRAGE (Wise Multi-Currency Loop)
        // e.g. BRL -> USD -> JPY -> BRL
        const arbProfit = Number((0.005 + (vault.currentBalanceBRL * 0.008) * (0.8 + Math.random() * 0.5)).toFixed(2));
        const arbVolume = Number((vault.currentBalanceBRL * (0.2 + Math.random() * 0.3)).toFixed(2));

        setVault(prev => {
          const nextBal = Number((prev.currentBalanceBRL + arbProfit).toFixed(2));
          const totalProfit = Number((prev.totalCompoundedProfitBRL + arbProfit).toFixed(2));
          const multiplier = Number((nextBal / prev.initialSeedBRL).toFixed(3));
          return {
            ...prev,
            currentBalanceBRL: nextBal,
            totalCompoundedProfitBRL: totalProfit,
            yieldMultiplier: multiplier,
            totalTransactionsCount: prev.totalTransactionsCount + 1,
            totalVolumeTurnoverBRL: Number((prev.totalVolumeTurnoverBRL + arbVolume).toFixed(2)),
            quantumArbitrageCyclesCompleted: prev.quantumArbitrageCyclesCompleted + 1,
            lastUpdateTimestamp: new Date().toLocaleTimeString()
          };
        });

        // Update BRL and random foreign currency balance slightly
        setCurrencies(prev => {
          const foreignIndex = 1 + Math.floor(Math.random() * (prev.length - 1));
          return prev.map((c, i) => {
            if (c.code === 'BRL') {
              return { ...c, balance: Number((c.balance + arbProfit).toFixed(2)) };
            }
            if (i === foreignIndex) {
              const foreignDelta = Number(((arbProfit * 0.2) / c.exchangeRateToBRL).toFixed(4));
              return { ...c, balance: Number((c.balance + foreignDelta).toFixed(4)) };
            }
            return c;
          });
        });

        setEmployees(prev => prev.map((e, idx) => {
          if (idx === empIndex) {
            return {
              ...e,
              calculationsAppliedCount: e.calculationsAppliedCount + 1,
              profitGeneratedBRL: Number((e.profitGeneratedBRL + arbProfit).toFixed(2))
            };
          }
          return e;
        }));

        const newTx: BankTransactionRecord = {
          id: `tx-arb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'TRIANGULAR_ARBITRAGE',
          description: `Arbitragem Triangular Wise (BRL ➔ EUR ➔ JPY ➔ BRL)`,
          itemOrCurrency: 'EUR/JPY/BRL',
          amountBRL: arbVolume,
          profitEarnedBRL: arbProfit,
          mathModelUsed: 'Homologia Persistente Betti H₁ & Teorema de Ponto Fixo de Brouwer',
          executedByEmployee: leadEmp.name,
          status: 'COMPLETED'
        };
        setTransactions(prev => [newTx, ...prev.slice(0, 39)]);

      } else {
        // STAKING & CONTINUOUS EXPONENTIAL YIELD
        const yieldGain = Number((0.002 + vault.currentBalanceBRL * 0.004).toFixed(3));
        setVault(prev => {
          const nextBal = Number((prev.currentBalanceBRL + yieldGain).toFixed(2));
          const totalProfit = Number((prev.totalCompoundedProfitBRL + yieldGain).toFixed(2));
          const multiplier = Number((nextBal / prev.initialSeedBRL).toFixed(3));
          return {
            ...prev,
            currentBalanceBRL: nextBal,
            totalCompoundedProfitBRL: totalProfit,
            yieldMultiplier: multiplier,
            quantumArbitrageCyclesCompleted: prev.quantumArbitrageCyclesCompleted + 1,
            lastUpdateTimestamp: new Date().toLocaleTimeString()
          };
        });

        setCurrencies(prev => prev.map(c => {
          if (c.code === 'BRL') {
            return { ...c, balance: Number((c.balance + yieldGain).toFixed(2)) };
          }
          return c;
        }));
      }

      // Update yield history point
      setYieldHistory(prev => {
        const last = prev[prev.length - 1];
        const nextTime = `${prev.length}s`;
        const updated = [...prev, { time: nextTime, balance: vault.currentBalanceBRL }];
        return updated.slice(-25); // keep last 25 ticks
      });

    }, intervalMs);

    return () => clearInterval(quantumEngineTimer);
  }, [isQuantumSpeedActive, speedMultiplier, employees, items, vault.currentBalanceBRL]);

  // Action: Injetar 1 Real adicional no cofre
  const handleInjectOneReal = () => {
    setVault(prev => ({
      ...prev,
      currentBalanceBRL: Number((prev.currentBalanceBRL + 1.00).toFixed(2)),
      totalTransactionsCount: prev.totalTransactionsCount + 1,
      lastUpdateTimestamp: new Date().toLocaleTimeString()
    }));
    setCurrencies(prev => prev.map(c => c.code === 'BRL' ? { ...c, balance: Number((c.balance + 1.00).toFixed(2)) } : c));
    const newTx: BankTransactionRecord = {
      id: `tx-inject-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'SEED_INITIAL',
      description: 'Injeção Adicional de Semente Quântica (R$ 1,00)',
      itemOrCurrency: 'BRL',
      amountBRL: 1.00,
      profitEarnedBRL: 0.00,
      mathModelUsed: 'Perturbação Positiva no Valor de Fronteira',
      executedByEmployee: 'Operador Humano / Mestre do Cofre',
      status: 'COMPLETED'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // Action: Resetar Cofre para exatamente 1 Real
  const handleResetToOneReal = () => {
    setVault({
      ...INITIAL_VAULT_STATE,
      currentBalanceBRL: 1.00,
      initialSeedBRL: 1.00,
      totalCompoundedProfitBRL: 0.00,
      yieldMultiplier: 1.00,
      lastUpdateTimestamp: new Date().toLocaleTimeString()
    });
    setCurrencies(prev => prev.map(c => c.code === 'BRL' ? { ...c, balance: 1.00 } : { ...c, balance: 0.00 }));
    setYieldHistory([{ time: '0s', balance: 1.00 }]);
    setTransactions(INITIAL_TRANSACTION_RECORDS);
    setTransition(INITIAL_ROBOTIC_TRANSITION_STATE);
  };

  // Food Price Deflation & Robotic Transition Actions
  const handleForceFoodDeflation = () => {
    // Drops all basic food item prices by 15%
    setItems(prev => prev.map(it => {
      if (it.category === 'alimentos_basicos') {
        const discounted = Number((it.currentPriceBRL * 0.85).toFixed(2));
        const floor = it.id === 'prod-pao-frances' ? 0.05 : 0.20;
        const newP = Math.max(floor, discounted);
        return {
          ...it,
          currentPriceBRL: newP,
          priceHistory: [...it.priceHistory.slice(-9), newP]
        };
      }
      return it;
    }));

    setTransition(prev => ({
      ...prev,
      foodPriceDeflationIndex: Number((prev.foodPriceDeflationIndex * 0.85).toFixed(4)),
      robotsWorkforcePercent: Math.min(99.8, Number((prev.robotsWorkforcePercent + 1.5).toFixed(2))),
      autonomousWagonsPercent: Math.min(99.8, Number((prev.autonomousWagonsPercent + 1.2).toFixed(2))),
      humanEmancipationPercent: Math.min(99.8, Number((prev.humanEmancipationPercent + 1.5).toFixed(2))),
      totalFoodProducedRobotsKg: prev.totalFoodProducedRobotsKg + 50000
    }));

    const newTx: BankTransactionRecord = {
      id: `tx-deflation-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'SUPERMARKET_BUY',
      description: 'Dra. Maya & Prof. Anton forçaram deflação de -15% em todos os alimentos básicos via agro-robótica.',
      itemOrCurrency: 'Cesta Alimentar Básica',
      amountBRL: 0.00,
      profitEarnedBRL: 0.00,
      mathModelUsed: 'Equilíbrio de Leontief com Custo Marginal Zero de Alimentos',
      executedByEmployee: 'Dra. Maya Borlaug-Turing & Robôs ER-Agro',
      status: 'COMPLETED'
    };
    setTransactions(prev => [newTx, ...prev]);

    const newDeb: QuantumMeetingDebate = {
      id: `deb-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentName: 'Dra. Maya Borlaug-Turing',
      role: 'Agro-Robótica de Alimentos',
      mathConcept: 'Deflação da Abundância Calórica',
      formula: 'd(Custo_Comida)/dt = -0.15 · Custo',
      hypothesis: 'Preço da comida reduzido em 15% imediatamente! Abundância total garantida: zero risco de fome ou necessidade de comer pomba.',
      decisionImpact: 'Deflação aplicada com sucesso a todas as gôndolas do supermercado.',
      consensusWeight: 1.00
    };
    setDebates(prev => [newDeb, ...prev]);

    if (onNotification) {
      onNotification('🌾 Deflação de 15% aplicada a todos os alimentos básicos! Robôs ER-Agro e Carroças Solares garantiram fartura calórica.');
    }
  };

  const handleAccelerateRobots = (delta: number) => {
    setTransition(prev => {
      const nextR = Math.max(10, Math.min(99.9, Number((prev.robotsWorkforcePercent + delta).toFixed(2))));
      return {
        ...prev,
        robotsWorkforcePercent: nextR,
        humanEmancipationPercent: nextR
      };
    });
    if (onNotification) {
      onNotification(`🤖 Participação de Robôs ER-2 ajustada para ${delta > 0 ? '+' : ''}${delta}%.`);
    }
  };

  const handleAccelerateWagons = (delta: number) => {
    setTransition(prev => {
      const nextW = Math.max(10, Math.min(99.9, Number((prev.autonomousWagonsPercent + delta).toFixed(2))));
      const nextFreight = Math.max(0.00001, Number((0.001 * ((100 - nextW) / 100)).toFixed(5)));
      return {
        ...prev,
        autonomousWagonsPercent: nextW,
        freightCostPerKmBRL: nextFreight
      };
    });
    if (onNotification) {
      onNotification(`🛞 Frota de Carroças Autônomas Solares ajustada para ${delta > 0 ? '+' : ''}${delta}%. Frete barateado.`);
    }
  };

  const handleToggleAutoTransition = () => {
    setTransition(prev => ({ ...prev, isAutoTransitionActive: !prev.isAutoTransitionActive }));
  };

  // Manual Supermarket Buy
  const handleManualBuy = (item: SupermarketItem) => {
    const cost = item.currentPriceBRL * item.minFraction;
    if (vault.currentBalanceBRL < cost) {
      alert(`Saldo insuficiente no cofre! Você tem R$ ${vault.currentBalanceBRL.toFixed(2)}, mas a fração mínima de ${item.name} custa R$ ${cost.toFixed(2)}.`);
      return;
    }

    setVault(prev => ({
      ...prev,
      currentBalanceBRL: Number((prev.currentBalanceBRL - cost).toFixed(2)),
      totalTransactionsCount: prev.totalTransactionsCount + 1,
      totalVolumeTurnoverBRL: Number((prev.totalVolumeTurnoverBRL + cost).toFixed(2)),
      lastUpdateTimestamp: new Date().toLocaleTimeString()
    }));

    setCurrencies(prev => prev.map(c => c.code === 'BRL' ? { ...c, balance: Number((c.balance - cost).toFixed(2)) } : c));

    setItems(prev => prev.map(it => {
      if (it.id === item.id) {
        return {
          ...it,
          stockHeld: Number((it.stockHeld + item.minFraction).toFixed(4))
        };
      }
      return it;
    }));

    const newTx: BankTransactionRecord = {
      id: `tx-buy-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'SUPERMARKET_BUY',
      description: `Compra Manual de ${item.minFraction} ${item.unit} de ${item.name}`,
      itemOrCurrency: item.name,
      amountBRL: cost,
      profitEarnedBRL: 0.00,
      mathModelUsed: item.appliedMathModel,
      executedByEmployee: 'Comando do Usuário (Wise Card)',
      status: 'COMPLETED'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // Manual Supermarket Sell
  const handleManualSell = (item: SupermarketItem) => {
    if (item.stockHeld <= 0) {
      alert(`Você não possui unidades de ${item.name} em estoque no momento.`);
      return;
    }

    const qtyToSell = item.stockHeld;
    const sellPrice = item.currentPriceBRL * 1.05; // 5% profit margin
    const totalReturn = Number((qtyToSell * sellPrice).toFixed(2));
    const profit = Number((totalReturn - (qtyToSell * item.basePriceBRL)).toFixed(2));

    setVault(prev => {
      const nextBal = Number((prev.currentBalanceBRL + totalReturn).toFixed(2));
      const totalProfit = Number((prev.totalCompoundedProfitBRL + Math.max(0, profit)).toFixed(2));
      const multiplier = Number((nextBal / prev.initialSeedBRL).toFixed(3));
      return {
        ...prev,
        currentBalanceBRL: nextBal,
        totalCompoundedProfitBRL: totalProfit,
        yieldMultiplier: multiplier,
        totalTransactionsCount: prev.totalTransactionsCount + 1,
        totalVolumeTurnoverBRL: Number((prev.totalVolumeTurnoverBRL + totalReturn).toFixed(2)),
        lastUpdateTimestamp: new Date().toLocaleTimeString()
      };
    });

    setCurrencies(prev => prev.map(c => c.code === 'BRL' ? { ...c, balance: Number((c.balance + totalReturn).toFixed(2)) } : c));

    setItems(prev => prev.map(it => {
      if (it.id === item.id) {
        return { ...it, stockHeld: 0 };
      }
      return it;
    }));

    const newTx: BankTransactionRecord = {
      id: `tx-sell-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'SUPERMARKET_SELL',
      description: `Venda Manual Total de ${qtyToSell} ${item.unit} de ${item.name}`,
      itemOrCurrency: item.name,
      amountBRL: totalReturn,
      profitEarnedBRL: profit,
      mathModelUsed: item.appliedMathModel,
      executedByEmployee: 'Comando do Usuário (Wise Terminal)',
      status: 'COMPLETED'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // Convert Currencies (Wise Calculator)
  const handleExecuteConversion = () => {
    const fromCur = currencies.find(c => c.code === convertFrom);
    const toCur = currencies.find(c => c.code === convertTo);

    if (!fromCur || !toCur) return;
    if (fromCur.balance < convertAmount) {
      alert(`Saldo insuficiente em ${fromCur.code}. Você tem ${fromCur.balance.toFixed(2)} ${fromCur.symbol}.`);
      return;
    }

    // Rate: from -> BRL -> to
    const amountInBRL = convertAmount * fromCur.exchangeRateToBRL;
    const receivedAmount = Number((amountInBRL / toCur.exchangeRateToBRL).toFixed(4));

    setCurrencies(prev => prev.map(c => {
      if (c.code === fromCur.code) {
        return { ...c, balance: Number((c.balance - convertAmount).toFixed(4)) };
      }
      if (c.code === toCur.code) {
        return { ...c, balance: Number((c.balance + receivedAmount).toFixed(4)) };
      }
      return c;
    }));

    const newTx: BankTransactionRecord = {
      id: `tx-conv-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'CURRENCY_CONVERT',
      description: `Conversão Wise: ${convertAmount} ${fromCur.code} ➔ ${receivedAmount} ${toCur.code}`,
      itemOrCurrency: `${fromCur.code}/${toCur.code}`,
      amountBRL: amountInBRL,
      profitEarnedBRL: 0.00,
      mathModelUsed: 'Câmbio Comercial Médio Sem Spread Oculto (Wise Standard)',
      executedByEmployee: 'Motor de Conversão Wise',
      status: 'COMPLETED'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // Calculate SVG Points for Yield Graph
  const graphWidth = 320;
  const graphHeight = 80;
  const maxVal = Math.max(1.5, ...yieldHistory.map(p => p.balance));
  const minVal = 1.00;
  const points = yieldHistory.map((pt, idx) => {
    const x = (idx / Math.max(1, yieldHistory.length - 1)) * graphWidth;
    const y = graphHeight - ((pt.balance - minVal) / Math.max(0.01, maxVal - minVal)) * (graphHeight - 16) - 8;
    return `${x},${y}`;
  }).join(' ');

  // Filter supermarket items
  const filteredItems = items.filter(it => {
    if (selectedMarketCategory === 'ALL') return true;
    return it.category === selectedMarketCategory;
  });

  return (
    <div id="wise-quantum-bank-root" className={`space-y-6 text-slate-100 ${className}`}>
      {/* Top Banner: Wise Signature Aesthetic & Vault Master HUD */}
      <div className="bg-gradient-to-br from-slate-900 via-[#07130b] to-slate-950 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Brand Identity & Mission Statement */}
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#9fe870] flex items-center justify-center shadow-lg shadow-emerald-500/30 text-slate-950 font-black">
                <Building2 className="w-7 h-7 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                    WISE <span className="text-[#9fe870]">QUANTUM BANK</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#9fe870]/20 text-[#9fe870] border border-[#9fe870]/40 text-[10px] font-mono font-bold tracking-wider uppercase">
                    Todas as Moedas + IACial
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Multi-Moeda Global • Funcionários Autônomos de Velocidade Quântica • Supermercado Universal
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
              Iniciamos o cofre com <strong className="text-[#9fe870] font-bold">R$ 1,00</strong>. Nossa mesa de funcionários autônomos em velocidade quântica aplica todos os cálculos matemáticos concebíveis para comprar e vender mercadorias — da farinha a espaçonaves — fazendo o patrimônio render continuamente.
            </p>

            {/* Anti-Pigeon Abundance & Robotic Transition Quick Pill */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>Garantia Anti-Pomba: Comida Barateando (-{((1 - transition.foodPriceDeflationIndex) * 100).toFixed(0)}%)</span>
              </span>
              <span className="px-2 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Robôs ER-2: {transition.robotsWorkforcePercent.toFixed(1)}%</span>
              </span>
              <span className="px-2 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Carroças Solares: {transition.autonomousWagonsPercent.toFixed(1)}% (Frete R$ 0,00)</span>
              </span>
            </div>
          </div>

          {/* Master Vault Display (R$ 1,00 Rendendo) */}
          <div className="bg-slate-950/80 border border-emerald-500/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-6 shadow-xl backdrop-blur-md">
            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <ShieldCheck className="w-4 h-4 text-[#9fe870]" />
                <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                  SALDO ATUAL DO COFRE (SEMENTE: R$ 1,00)
                </span>
              </div>
              <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                  R$ {vault.currentBalanceBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/40 animate-pulse">
                  {vault.yieldMultiplier.toFixed(3)}x Semente
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                <span>Lucro Líquido: <strong className="text-[#9fe870]">+R$ {vault.totalCompoundedProfitBRL.toFixed(2)}</strong></span>
                <span>•</span>
                <span>Ciclos HFT: <strong className="text-cyan-400">{vault.quantumArbitrageCyclesCompleted.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Quick Sparkline Canvas of Compounding Yield */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#9fe870]" />
                <span>Rendimento em Tempo Real</span>
              </div>
              <svg width={graphWidth} height={graphHeight} className="overflow-visible bg-slate-900/60 rounded-lg p-1 border border-slate-800">
                <polyline
                  fill="none"
                  stroke="#9fe870"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
              </svg>
            </div>

            {/* Vault Controls: Add 1 Real, Reset, and Speed Toggle */}
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button
                id="btn-inject-one-real"
                onClick={handleInjectOneReal}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-[#9fe870] hover:opacity-95 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                title="Depositar mais R$ 1,00 no cofre para acelerar a alavancagem matemática"
              >
                <Plus className="w-4 h-4" />
                <span>Injetar +R$ 1,00</span>
              </button>

              <button
                id="btn-reset-one-real"
                onClick={handleResetToOneReal}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-[11px] font-bold border border-slate-700 flex items-center justify-center gap-1 transition-all"
                title="Reiniciar o cofre exatamente para a semente inicial de R$ 1,00"
              >
                <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Resetar para R$ 1,00</span>
              </button>
            </div>
          </div>
        </div>

        {/* Speed Controls & Mode Status Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-xs flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Velocidade Quântica dos Funcionários:</span>
            </span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {([1, 5, 20, 100] as const).map(mult => (
                <button
                  key={mult}
                  onClick={() => setSpeedMultiplier(mult)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs transition-all ${
                    speedMultiplier === mult
                      ? 'bg-[#9fe870] text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mult === 100 ? '100x WARP' : `${mult}x`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsQuantumSpeedActive(!isQuantumSpeedActive)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
                isQuantumSpeedActive 
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-[#9fe870]'
                  : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              }`}
            >
              {isQuantumSpeedActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isQuantumSpeedActive ? 'Motor Quântico Ativo (Operando)' : 'Pausado'}</span>
            </button>

            <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">
              Última operação: {vault.lastUpdateTimestamp}
            </span>
          </div>
        </div>
      </div>

      {/* Main Bank View Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <button
          id="tab-wise-vault-overview"
          onClick={() => setActiveBankView('vault_overview')}
          className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
            activeBankView === 'vault_overview'
              ? 'bg-gradient-to-r from-emerald-950/80 to-slate-900 border-[#9fe870] text-white shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-[#9fe870]" />
          </div>
          <div>
            <div className="text-xs font-black tracking-wide uppercase">Contas & Moedas Wise</div>
            <div className="text-[11px] text-slate-400 font-mono">{currencies.length} Moedas Mundiais</div>
          </div>
        </button>

        <button
          id="tab-wise-supermarket"
          onClick={() => setActiveBankView('supermarket')}
          className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
            activeBankView === 'supermarket'
              ? 'bg-gradient-to-r from-emerald-950/80 to-slate-900 border-[#9fe870] text-white shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-black tracking-wide uppercase">Supermercado Universal</div>
            <div className="text-[11px] text-slate-400 font-mono">De Farinha a Espaçonaves</div>
          </div>
        </button>

        <button
          id="tab-wise-robotic-transition"
          onClick={() => setActiveBankView('robotic_transition')}
          className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 relative overflow-hidden ${
            activeBankView === 'robotic_transition'
              ? 'bg-gradient-to-r from-emerald-950/80 to-cyan-950/80 border-cyan-400 text-white shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs font-black tracking-wide uppercase flex items-center gap-1.5">
              <span>Transição Robótica</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Robôs & Carroças Solares</div>
          </div>
        </button>

        <button
          id="tab-wise-quantum-meeting"
          onClick={() => setActiveBankView('quantum_meeting')}
          className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
            activeBankView === 'quantum_meeting'
              ? 'bg-gradient-to-r from-emerald-950/80 to-slate-900 border-[#9fe870] text-white shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="text-xs font-black tracking-wide uppercase">Funcionários IACial</div>
            <div className="text-[11px] text-slate-400 font-mono">{employees.length} Cientistas Quânticos</div>
          </div>
        </button>

        <button
          id="tab-wise-transactions-yield"
          onClick={() => setActiveBankView('transactions_yield')}
          className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
            activeBankView === 'transactions_yield'
              ? 'bg-gradient-to-r from-emerald-950/80 to-slate-900 border-[#9fe870] text-white shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs font-black tracking-wide uppercase">Rendimento & Extrato</div>
            <div className="text-[11px] text-slate-400 font-mono">{vault.totalTransactionsCount} Operações</div>
          </div>
        </button>
      </div>

      {/* VIEW 1: CONTAS & MOEDAS WISE + CARTÃO VIRTUAL + CÂMBIO */}
      {activeBankView === 'vault_overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Wise Virtual Debit Card & Account Quick Specs (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* The Iconic Green Wise Card */}
              <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-[#9fe870] via-[#86d957] to-[#163300] text-slate-950 shadow-2xl transition-all hover:scale-[1.01]">
                {/* Background Pattern */}
                <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/20 rounded-full blur-xl pointer-events-none" />
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="font-mono text-[11px] font-black uppercase tracking-widest bg-slate-950/20 px-2 py-0.5 rounded text-slate-950">
                    DEBIT QUANTUM
                  </span>
                  <div className="w-7 h-5 rounded bg-amber-400/90 border border-amber-500/40 flex items-center justify-center shadow-inner">
                    <div className="w-4 h-3 border-t border-b border-amber-700" />
                  </div>
                </div>

                <div className="space-y-4 relative z-10 pt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-black tracking-tight">wise</span>
                    <span className="text-xs font-mono font-bold uppercase bg-slate-950 text-[#9fe870] px-1.5 py-0.5 rounded ml-1">
                      MULTI-CURRENCY
                    </span>
                  </div>

                  <div className="pt-3">
                    <div className="text-xs font-mono tracking-widest font-black opacity-80">NÚMERO VIRTUAL PROTEGIDO</div>
                    <div className="text-xl font-mono tracking-widest font-black text-slate-950">
                      {isCardFrozen ? '•••• •••• •••• ••••' : '5390 0754 7034 1001'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-950/20 text-xs font-mono">
                    <div>
                      <span className="opacity-70 text-[10px] block">TITULAR DO COFRE</span>
                      <strong className="font-bold tracking-wide">GEMINI ROBOTICS ER-2</strong>
                    </div>
                    <div>
                      <span className="opacity-70 text-[10px] block">VALIDADE</span>
                      <strong className="font-bold">12/35</strong>
                    </div>
                    <div>
                      <span className="opacity-70 text-[10px] block">CVV</span>
                      <strong className="font-bold">{isCardFrozen ? '•••' : '719'}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Controls & Details */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCardFrozen(!isCardFrozen)}
                    className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-all ${
                      isCardFrozen
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {isCardFrozen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{isCardFrozen ? 'Cartão Congelado' : 'Congelar Cartão'}</span>
                  </button>
                </div>

                <div className="text-slate-400 text-right text-[11px]">
                  <span>Conversão inteligente ativa</span>
                  <span className="block text-emerald-400 font-bold">Taxa zero no supermercado</span>
                </div>
              </div>

              {/* Wise Real-Time Currency Conversion Tool */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-[#9fe870]" />
                    Conversor Wise Instantâneo (Sem Spread Oculto)
                  </h3>
                  <span className="text-[10px] font-mono text-[#9fe870]">Câmbio Comercial Real</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400">Você envia</label>
                    <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-2 gap-2">
                      <input
                        type="number"
                        min="0.01"
                        step="0.1"
                        value={convertAmount}
                        onChange={(e) => setConvertAmount(Math.max(0.01, parseFloat(e.target.value) || 0))}
                        className="w-full bg-transparent text-sm font-mono font-bold text-white focus:outline-none"
                      />
                      <select
                        value={convertFrom}
                        onChange={(e) => setConvertFrom(e.target.value)}
                        className="bg-slate-900 text-xs font-mono font-bold text-[#9fe870] rounded px-1.5 py-1 border border-slate-700 focus:outline-none"
                      >
                        {currencies.map(c => (
                          <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400">Você recebe</label>
                    <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-2 gap-2">
                      <div className="w-full text-sm font-mono font-bold text-cyan-300 truncate">
                        {(() => {
                          const f = currencies.find(c => c.code === convertFrom);
                          const t = currencies.find(c => c.code === convertTo);
                          if (!f || !t) return '0.00';
                          return ((convertAmount * f.exchangeRateToBRL) / t.exchangeRateToBRL).toFixed(2);
                        })()}
                      </div>
                      <select
                        value={convertTo}
                        onChange={(e) => setConvertTo(e.target.value)}
                        className="bg-slate-900 text-xs font-mono font-bold text-cyan-400 rounded px-1.5 py-1 border border-slate-700 focus:outline-none"
                      >
                        {currencies.map(c => (
                          <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <span>IOF Quântico: 0%</span>
                  <span>Tarifa Wise: R$ 0,00</span>
                </div>

                <button
                  onClick={handleExecuteConversion}
                  className="w-full py-2.5 rounded-xl bg-[#9fe870] hover:bg-[#8ee05d] text-slate-950 font-black text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Converter Agora no Cofre</span>
                </button>
              </div>
            </div>

            {/* Multi-Currency Balances (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#9fe870]" />
                    Saldos Multi-Moeda Wise (16 Moedas Globais)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Contas com dados bancários próprios (IBAN, Swift, Routing) e saldo líquido interligado.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#9fe870] bg-[#9fe870]/10 px-2.5 py-1 rounded-lg border border-[#9fe870]/30">
                  {currencies.length} Moedas Ativas
                </span>
              </div>

              {/* Grid of Currencies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
                {currencies.map(curr => (
                  <div
                    key={curr.code}
                    onClick={() => setSelectedCurrency(curr.code)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      selectedCurrency === curr.code
                        ? 'bg-slate-900 border-[#9fe870] shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{curr.flag}</span>
                        <div>
                          <span className="font-black text-xs text-white">{curr.code}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{curr.name}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        curr.dailyChangePercent >= 0 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {curr.dailyChangePercent >= 0 ? '+' : ''}{curr.dailyChangePercent}%
                      </span>
                    </div>

                    <div className="pt-1 flex items-baseline justify-between">
                      <div className="text-base font-black font-mono text-white">
                        {curr.symbol} {curr.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        1 {curr.code} = R$ {curr.exchangeRateToBRL >= 1 ? curr.exchangeRateToBRL.toFixed(2) : curr.exchangeRateToBRL.toFixed(4)}
                      </div>
                    </div>

                    <div className="text-[9px] font-mono text-slate-500 truncate pt-1 border-t border-slate-800/60">
                      IBAN: {curr.iban}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SUPERMERCADO UNIVERSAL ("DE FARINHA A ESPAÇONAVES") */}
      {activeBankView === 'supermarket' && (
        <div className="space-y-5">
          {/* Supermarket Header & Category Selector */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                Supermercado Universal Omnidirecional
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Vende literalmente de farinha de trigo a espaçonaves com motor de dobra Alcubierre.
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              {[
                { key: 'ALL', label: 'Todos os Itens' },
                { key: 'alimentos_basicos', label: '🍞 Alimentos Básicos' },
                { key: 'manufatura_materiais', label: '⚙️ Manufatura & Grafeno' },
                { key: 'chips_quanticos', label: '⚛️ Chips Quânticos' },
                { key: 'aeroespacial_espaconaves', label: '🚀 Espaçonaves & Orbital' }
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedMarketCategory(cat.key as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    selectedMarketCategory === cat.key
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Food Deflation & Robotic Progressivity Banner */}
          <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-cyan-950/70 border border-emerald-500/40 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Wheat className="w-4 h-4 text-emerald-400" />
                </span>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>Deflação Robótica de Alimentos (Garantia Anti-Pomba)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/40">
                    Custo Marginal Zero
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Preços de comida (farinha, pão, arroz, feijão, café) não sobem mais: estão sob <strong className="text-emerald-400">pressão deflacionária progressiva</strong>. Com cientistas autônomos dedicados, estufas verticais robotizadas e frete de R$ 0,00 por Carroças Autônomas Solares, ninguém precisa se alimentar precariamente.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={handleForceFoodDeflation}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95"
                title="Dra. Maya Borlaug-Turing & Dr. Anton Chayanov acionam deflação imediata de 15% na comida"
              >
                <TrendingUp className="w-3.5 h-3.5 rotate-180" />
                <span>Forçar Deflação Alimentos (-15%)</span>
              </button>
            </div>
          </div>

          {/* Supermarket Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-3 shadow-xl transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md shrink-0"
                        style={{ backgroundColor: `${item.rarityColor}25`, borderColor: item.rarityColor, borderWidth: '1px' }}
                      >
                        {item.category === 'alimentos_basicos' && <Package className="w-5 h-5" style={{ color: item.rarityColor }} />}
                        {item.category === 'manufatura_materiais' && <Layers className="w-5 h-5" style={{ color: item.rarityColor }} />}
                        {item.category === 'chips_quanticos' && <Atom className="w-5 h-5" style={{ color: item.rarityColor }} />}
                        {item.category === 'aeroespacial_espaconaves' && <Rocket className="w-5 h-5" style={{ color: item.rarityColor }} />}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                          {item.categoryLabel}
                        </span>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {item.name}
                        </h4>
                      </div>
                    </div>

                    <span 
                      className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold shrink-0"
                      style={{ backgroundColor: `${item.rarityColor}20`, color: item.rarityColor, borderColor: `${item.rarityColor}40`, borderWidth: '1px' }}
                    >
                      Demanda {(item.demandIndex * 100).toFixed(0)}%
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed pt-2 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="pt-2 space-y-1.5">
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 block truncate">
                      Modelo: {item.appliedMathModel}
                    </span>

                    {item.category === 'alimentos_basicos' && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                        <Wheat className="w-3 h-3 text-emerald-400" />
                        Deflação Agro-Robótica Ativa
                      </span>
                    )}

                    {(item.id.includes('carroca') || item.id.includes('lavrador')) && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30">
                        <Cpu className="w-3 h-3 text-cyan-400" />
                        Vanguarda da Automação Planetária
                      </span>
                    )}
                  </div>
                </div>

                {/* Price, Stock and Actions */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block">PREÇO DE MERCADO</span>
                      <div className="text-lg font-black font-mono text-white">
                        R$ {item.currentPriceBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-xs text-slate-400 font-normal"> / {item.unit}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-500 block">ESTOQUE DO COFRE</span>
                      <div className="text-xs font-mono font-bold text-[#9fe870]">
                        {item.stockHeld > 0 ? `${item.stockHeld.toLocaleString('pt-BR')} ${item.unit}` : '0 em posse'}
                      </div>
                    </div>
                  </div>

                  {/* Manual Buy / Sell Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleManualBuy(item)}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95"
                      title={`Comprar fração de ${item.name} com saldo do cofre`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Comprar ({item.minFraction} {item.unit})</span>
                    </button>

                    <button
                      onClick={() => handleManualSell(item)}
                      disabled={item.stockHeld <= 0}
                      className={`py-2 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        item.stockHeld > 0
                          ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 active:scale-95'
                          : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                      }`}
                      title={`Vender estoque de ${item.name} com lucro acumulado`}
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                      <span>Vender Estoque</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: TRANSIÇÃO ROBÓTICA & CARROÇAS AUTÔNOMAS SOLARES */}
      {activeBankView === 'robotic_transition' && (
        <div className="space-y-6">
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 border border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-black text-white">
                        Transição Planetária: Robôs & Carroças Autônomas
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold uppercase">
                        Custo Marginal Zero
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      Substituição progressiva do trabalho braçal por robôs humanoides e veículos a combustível por carroças solares autônomas.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                  Diretriz estratégica: comida não pode ser cara nem motivo de desespero. Conforme os robôs lavradores ER-2 e as Carroças Autônomas Solares entram em operação, os custos operacionais de plantio, colheita e transporte caem a centavos, gerando <strong className="text-emerald-400">abundância calórica</strong> e libertando a humanidade para atividades nobres.
                </p>
              </div>

              {/* Status & Auto-transition Toggle */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shrink-0">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-mono text-slate-400">Piloto Automático de Transição:</span>
                  <button
                    onClick={handleToggleAutoTransition}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                      transition.isAutoTransitionActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {transition.isAutoTransitionActive ? <Play className="w-3 h-3 text-cyan-400" /> : <Pause className="w-3 h-3" />}
                    <span>{transition.isAutoTransitionActive ? 'Progredindo 24/7' : 'Pausado'}</span>
                  </button>
                </div>

                <button
                  onClick={handleForceFoodDeflation}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-mono font-black text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <Wheat className="w-4 h-4" />
                  <span>Forçar Barateamento Imediato (-15%)</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4 Core Indicator Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Robôs na Força de Trabalho */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Robôs na Lida Pesada
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                  ER-2 Lavrador
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-300">
                {transition.robotsWorkforcePercent.toFixed(1)}%
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Substituição gradativa do trabalho humano braçal por robôs humanoides 24/7.
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => handleAccelerateRobots(-5)}
                  className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-bold text-slate-400"
                >
                  -5%
                </button>
                <button
                  onClick={() => handleAccelerateRobots(5)}
                  className="flex-1 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-mono font-bold text-cyan-300"
                >
                  +5% Robôs
                </button>
              </div>
            </div>

            {/* Card 2: Carroças Autônomas Solares */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  Carroças Solares
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  Zero Diesel
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
                {transition.autonomousWagonsPercent.toFixed(1)}%
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Substituição de caminhões e carros a combustível fóssil por frotas elétricas solares.
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => handleAccelerateWagons(-5)}
                  className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-bold text-slate-400"
                >
                  -5%
                </button>
                <button
                  onClick={() => handleAccelerateWagons(5)}
                  className="flex-1 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-mono font-bold text-amber-300"
                >
                  +5% Carroças
                </button>
              </div>
            </div>

            {/* Card 3: Deflação Alimentar & Anti-Pomba */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  Deflação de Alimentos
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Anti-Pomba
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                -{((1 - transition.foodPriceDeflationIndex) * 100).toFixed(1)}%
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Farinha, pão e cesta básica cada vez mais baratos. Risco zero de fome ou desespero.
              </p>
              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-[10px] font-mono text-emerald-300 truncate">
                  Frete Logístico: R$ {transition.freightCostPerKmBRL.toFixed(5)}/km
                </div>
              </div>
            </div>

            {/* Card 4: Produção Agrícola Robotizada */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
                  <Wheat className="w-3.5 h-3.5 text-yellow-400" />
                  Colheita Robótica
                </span>
                <span className="text-[10px] font-mono text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">
                  Acumulada
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-yellow-300 truncate">
                {transition.totalFoodProducedRobotsKg.toLocaleString('pt-BR')} kg
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Total de alimentos colhidos por robôs ER-Agro e entregues com frete zero.
              </p>
              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-[10px] font-mono text-cyan-300 truncate">
                  Humanos Emancipados: {transition.humanEmancipationPercent.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Dual Interactive Transition Sliders & Visual Progress Bars */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Panel 1: Força de Trabalho (Humanos ➔ Robôs) */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      1. Substituição de Trabalho Braçal: Humanos ➔ Robôs ER-2
                    </h3>
                    <p className="text-xs text-slate-400">
                      Liberando a humanidade do esforço físico repetitivo na agricultura e logística.
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-400 font-bold">
                    👨‍🌾 Humanos na Lida: {(100 - transition.robotsWorkforcePercent).toFixed(1)}%
                  </span>
                  <span className="text-cyan-400 font-bold">
                    🤖 Robôs ER-2: {transition.robotsWorkforcePercent.toFixed(1)}%
                  </span>
                </div>
                <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                  <div 
                    className="bg-rose-500/70 h-full transition-all duration-300"
                    style={{ width: `${100 - transition.robotsWorkforcePercent}%` }}
                    title={`Trabalho humano restante: ${(100 - transition.robotsWorkforcePercent).toFixed(1)}%`}
                  />
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${transition.robotsWorkforcePercent}%` }}
                    title={`Trabalho robotizado: ${transition.robotsWorkforcePercent.toFixed(1)}%`}
                  />
                </div>
              </div>

              {/* Context Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-bold block">Status Humano</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Trabalhadores rurais passam a atuar como gestores quânticos ou desfrutam de ócio criativo com renda básica garantida pelos dividendos do cofre.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">Status dos Robôs</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Robôs lavradores com torque elétrico de 180 Nm e visão multiespectral colhem safra sem interrupção faça chuva ou faça sol.
                  </p>
                </div>
              </div>
            </div>

            {/* Panel 2: Logística e Frotas (Combustão ➔ Carroças Autônomas Solares) */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      2. Substituição de Frotas: Combustão Fóssil ➔ Carroças Solares
                    </h3>
                    <p className="text-xs text-slate-400">
                      Eliminando custos de combustível e queima de diesel com Cyber-Carroças autônomas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-orange-400 font-bold">
                    ⛽ Carros a Combustão: {(100 - transition.autonomousWagonsPercent).toFixed(1)}%
                  </span>
                  <span className="text-amber-400 font-bold">
                    ☀️ Carroças Solares: {transition.autonomousWagonsPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                  <div 
                    className="bg-orange-500/70 h-full transition-all duration-300"
                    style={{ width: `${100 - transition.autonomousWagonsPercent}%` }}
                    title={`Veículos a combustível fóssil: ${(100 - transition.autonomousWagonsPercent).toFixed(1)}%`}
                  />
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full transition-all duration-300"
                    style={{ width: `${transition.autonomousWagonsPercent}%` }}
                    title={`Carroças autônomas solares: ${transition.autonomousWagonsPercent.toFixed(1)}%`}
                  />
                </div>
              </div>

              {/* Context Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-orange-400 uppercase font-bold block">Combustível Fóssil</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Carros e caminhões pesados gastando diesel caro são reciclados para fornecer matéria-prima e baterias às novas frotas.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">Cyber-Carroças Solares</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Carroças autônomas com teto solar bifacial de 800W, condução por radar/LiDAR e motores elétricos nas 4 rodas: frete a custo zero.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee Anti-Pomba & Scientists Manifesto */}
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-950 to-slate-900 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  Garantia de Abundância: "Ninguém Precisa Comer Pomba"
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Por que os preços de comida agora caem em vez de subir descontroladamente?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Wheat className="w-4 h-4" />
                  <span>Dra. Maya Borlaug-Turing</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  "A introdução de robôs agrícolas e estufas hiper-otimizadas desacoplou o preço do pão e da farinha do custo de mão de obra braçal. A caloria tornou-se abundante e garantida."
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Truck className="w-4 h-4" />
                  <span>Dra. Clarice Lovelace-Cerrado</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  "Carroças Autônomas Solares não consom uma gota sequer de gasolina ou diesel. Toda a logística dos grãos do campo até as prateleiras do supermercado custa virtualmente R$ 0,00."
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <Cpu className="w-4 h-4" />
                  <span>Dr. Nikola Mechnikov</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  "Os seres humanos saem da lida estafante e passam a receber os dividendos gerados pelas operações quânticas do cofre Wise. Automação sem desamparo."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: SALA DE REUNIÃO DOS FUNCIONÁRIOS QUANTUM SPEED (APRENDIZAGEM IACIAL) */}
      {activeBankView === 'quantum_meeting' && (
        <div className="space-y-6">
          {/* Meeting Room Top Bar */}
          <div className="bg-slate-900/90 border border-purple-500/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/60 flex items-center justify-center text-purple-300">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white">
                    Mesa Redonda Quântica de Aprendizagem IACial
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold">
                    VELOCIDADE QUÂNTICA ATIVA
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {employees.length} Funcionários Cientistas dominando todo cálculo matemático existente e concebível na imaginação.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-purple-300 bg-purple-950/60 border border-purple-800 px-3 py-1.5 rounded-xl">
                Taxa de Consenso: <strong>99.8%</strong>
              </span>
            </div>
          </div>

          {/* Employees Grid with Deep Math Formulations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {employees.map(emp => (
              <div 
                key={emp.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
                      {emp.avatarInitials}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white">{emp.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400 block">{emp.role}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 block">Lucro Gerado</span>
                    <span className="text-xs font-mono font-black text-[#9fe870]">
                      +R$ {emp.profitGeneratedBRL.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Mathematical Formula Box */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1 font-mono">
                  <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                    {emp.mathDiscipline}
                  </div>
                  <div className="text-xs font-black text-cyan-300 overflow-x-auto py-0.5">
                    {emp.activeFormula}
                  </div>
                </div>

                {/* Live Reasoning Quote */}
                <p className="text-[11px] text-slate-300 italic bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60 leading-relaxed">
                  "{emp.reasoningQuote}"
                </p>

                {/* Telemetry Footer */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>Cálculos Aplicados: <strong className="text-white">{emp.calculationsAppliedCount.toLocaleString()}</strong></span>
                  <span>Throughput: <strong className="text-cyan-400">{emp.quantumOpsPerSec}</strong></span>
                  <span>Carga: <strong className="text-emerald-400">{emp.computeLoadPercent}%</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Live IACial Debate Stream */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                Diálogo de Aprendizagem IACial & Consenso em Tempo Real
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Últimos {debates.length} Registros</span>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 font-mono text-xs">
              {debates.map(deb => (
                <div key={deb.id} className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-purple-400 font-bold">{deb.agentName} ({deb.mathConcept})</span>
                    <span className="text-slate-500">{deb.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans">{deb.hypothesis}</p>
                  <div className="text-[10px] text-emerald-400 font-bold">{deb.decisionImpact}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: RENDIMENTO & EXTRATO DE TRANSAÇÕES */}
      {activeBankView === 'transactions_yield' && (
        <div className="space-y-5">
          {/* Yield Compounding Stats Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">SEMENTE INICIAL DO COFRE</span>
              <div className="text-2xl font-black font-mono text-white">R$ 1,00</div>
              <span className="text-[10px] font-mono text-emerald-400">Ponto de partida garantido</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">VOLUME TOTAL NEGOCIADO</span>
              <div className="text-2xl font-black font-mono text-cyan-400">
                R$ {vault.totalVolumeTurnoverBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] font-mono text-slate-400">Giro acelerado no supermercado</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">TAXA DE RETORNO COMPOSTO (APY)</span>
              <div className="text-2xl font-black font-mono text-[#9fe870]">{vault.apyPercent.toFixed(2)}% a.a.</div>
              <span className="text-[10px] font-mono text-slate-400">Impulsionado por arbitragem quântica</span>
            </div>
          </div>

          {/* Full Transaction Ledger */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Livro-Razão Transparente (Wise Quantum Ledger)
              </h3>
              <span className="text-[10px] font-mono text-[#9fe870]">
                {transactions.length} Transações Registradas
              </span>
            </div>

            <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
              {transactions.map(tx => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-black uppercase ${
                        tx.type === 'SEED_INITIAL' ? 'bg-cyan-500/20 text-cyan-300' :
                        tx.type === 'SUPERMARKET_BUY' ? 'bg-amber-500/20 text-amber-300' :
                        tx.type === 'SUPERMARKET_SELL' ? 'bg-emerald-500/20 text-emerald-300' :
                        tx.type === 'TRIANGULAR_ARBITRAGE' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-slate-700 text-slate-200'
                      }`}>
                        {tx.type}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">{tx.timestamp}</span>
                      <span className="text-slate-500 text-[10px] hidden sm:inline">• por {tx.executedByEmployee}</span>
                    </div>
                    <div className="text-xs font-bold text-white">{tx.description}</div>
                    <div className="text-[10px] font-mono text-emerald-400/90">{tx.mathModelUsed}</div>
                  </div>

                  <div className="text-right sm:shrink-0 font-mono">
                    <div className="text-xs font-bold text-white">
                      R$ {tx.amountBRL.toFixed(2)}
                    </div>
                    {tx.profitEarnedBRL > 0 && (
                      <div className="text-[11px] font-bold text-[#9fe870]">
                        +R$ {tx.profitEarnedBRL.toFixed(2)} lucro
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
