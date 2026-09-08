export interface CurrencyAccount {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  balance: number;
  exchangeRateToBRL: number; // Current value in BRL
  dailyChangePercent: number;
  iban: string;
  bicSwift: string;
  routingNumber?: string;
  accountNumber: string;
  category: 'fiat' | 'crypto' | 'quantum';
  color: string;
}

export type SupermarketCategory = 
  | 'alimentos_basicos' 
  | 'manufatura_materiais' 
  | 'chips_quanticos' 
  | 'aeroespacial_espaconaves';

export interface SupermarketItem {
  id: string;
  name: string;
  category: SupermarketCategory;
  categoryLabel: string;
  basePriceBRL: number;
  currentPriceBRL: number;
  unit: string;
  minFraction: number;
  stockHeld: number; // Owned by the Bank Vault
  marketSupply: number;
  demandIndex: number; // 0.0 - 2.0
  priceHistory: number[];
  description: string;
  iconType: string;
  rarityColor: string;
  appliedMathModel: string;
}

export interface QuantumSpeedEmployee {
  id: string;
  name: string;
  role: string;
  mathDiscipline: string;
  activeFormula: string;
  reasoningQuote: string;
  calculationsAppliedCount: number;
  profitGeneratedBRL: number;
  colorScheme: 'purple' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'sky' | 'indigo' | 'teal' | 'lime';
  computeLoadPercent: number;
  quantumOpsPerSec: string;
  avatarInitials: string;
  specialtyDescription: string;
  currentStance: 'BUY_FLOUR' | 'BUY_RAW_GRAPHENE' | 'ARBITRAGE_EUR_USD' | 'ACCUMULATE_STARSHIP' | 'HARVEST_YIELD' | 'OPTIMIZE_INVENTORY' | 'CHEAPEN_FOOD_CROPS' | 'AUTOMATE_FOOD_SUPPLY' | 'DEPLOY_AUTONOMOUS_WAGONS' | 'EMANCIPATE_HUMANS_WITH_ROBOTS';
}

export interface RoboticTransitionState {
  robotsWorkforcePercent: number; // e.g. 78% (Robots in agriculture, factories and supply chains)
  autonomousWagonsPercent: number; // e.g. 84% (Autonomous solar wagons replacing combustion cars/trucks)
  humanEmancipationPercent: number; // e.g. 78% (Humans liberated from heavy manual labor, receiving dividends)
  foodPriceDeflationIndex: number; // multiplier applied to food base price e.g. 0.25 (75% cheaper)
  freightCostPerKmBRL: number; // freight cost dropping towards 0.00 BRL
  isAutoTransitionActive: boolean;
  totalFoodProducedRobotsKg: number;
  antiPigeonGuarantee: 'TOTAL_PROTECTION_AFFORDABLE_REAL_FOOD';
}

export interface BankVaultState {
  initialSeedBRL: number; // Exactly 1.00 BRL
  currentBalanceBRL: number;
  totalCompoundedProfitBRL: number;
  yieldMultiplier: number; // e.g. 1.00x, 4.25x, 1850.00x
  apyPercent: number;
  totalTransactionsCount: number;
  totalVolumeTurnoverBRL: number;
  quantumArbitrageCyclesCompleted: number;
  lastUpdateTimestamp: string;
}

export interface BankTransactionRecord {
  id: string;
  timestamp: string;
  type: 'SEED_INITIAL' | 'SUPERMARKET_BUY' | 'SUPERMARKET_SELL' | 'TRIANGULAR_ARBITRAGE' | 'QUANTUM_STAKING_YIELD' | 'CURRENCY_CONVERT';
  description: string;
  itemOrCurrency: string;
  amountBRL: number;
  profitEarnedBRL: number;
  mathModelUsed: string;
  executedByEmployee: string;
  status: 'COMPLETED';
}

export interface QuantumMeetingDebate {
  id: string;
  timestamp: string;
  agentName: string;
  role: string;
  mathConcept: string;
  formula: string;
  hypothesis: string;
  decisionImpact: string;
  consensusWeight: number;
}
