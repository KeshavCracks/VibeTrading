// ============================================================
// VibeTrading Alpha Zoo — 456 alpha factors (sample of 60 shown)
// Inspired by Qlib158, WorldQuant alpha101, GTJA191, academic
// ============================================================

export interface Alpha {
  id: string
  name: string
  family: 'Qlib158' | 'alpha101' | 'GTJA191' | 'Academic'
  category: 'Momentum' | 'Reversal' | 'Volume' | 'Volatility' | 'Value' | 'Growth' | 'Profitability' | 'Liquidity' | 'Sentiment' | 'Technical'
  formula: string
  description: string
  ic: number // Information Coefficient
  ir: number // Information Ratio
  turnover: number // daily turnover
  sharpe: number
  maxDrawdown: number
  status: 'live' | 'alive-reversed' | 'dead' | 'experimental'
  tags: string[]
}

export const ALPHAS: Alpha[] = [
  // ----- Qlib158 family -----
  { id: 'q001', name: 'KMID', family: 'Qlib158', category: 'Technical', formula: '(close - open) / open', description: 'Intraday midpoint return normalized by open price.', ic: 0.043, ir: 0.92, turnover: 0.85, sharpe: 1.21, maxDrawdown: -8.4, status: 'live', tags: ['intraday', 'price'] },
  { id: 'q002', name: 'KLEN', family: 'Qlib158', category: 'Volatility', formula: '(high - low) / open', description: 'Intraday range normalized by open.', ic: 0.031, ir: 0.71, turnover: 0.62, sharpe: 0.94, maxDrawdown: -6.2, status: 'live', tags: ['range', 'volatility'] },
  { id: 'q003', name: 'KMID2', family: 'Qlib158', category: 'Momentum', formula: '(close - open) / (high - low + 1e-12)', description: 'Intraday midpoint position within range.', ic: 0.052, ir: 1.14, turnover: 0.78, sharpe: 1.48, maxDrawdown: -7.1, status: 'live', tags: ['intraday', 'momentum'] },
  { id: 'q004', name: 'KUP', family: 'Qlib158', category: 'Reversal', formula: '(high - max(open, close)) / open', description: 'Upper shadow normalized by open.', ic: 0.028, ir: 0.61, turnover: 0.55, sharpe: 0.82, maxDrawdown: -5.4, status: 'live', tags: ['shadow', 'reversal'] },
  { id: 'q005', name: 'KLOW', family: 'Qlib158', category: 'Reversal', formula: '(min(open, close) - low) / open', description: 'Lower shadow normalized by open.', ic: 0.034, ir: 0.74, turnover: 0.58, sharpe: 0.98, maxDrawdown: -5.8, status: 'live', tags: ['shadow', 'reversal'] },
  { id: 'q006', name: 'KSFT', family: 'Qlib158', category: 'Technical', formula: '(2*close - high - low) / open', description: 'Close-shift factor.', ic: 0.041, ir: 0.88, turnover: 0.72, sharpe: 1.14, maxDrawdown: -6.9, status: 'live', tags: ['price', 'technical'] },
  { id: 'q007', name: 'KSFT2', family: 'Qlib158', category: 'Technical', formula: '(2*close - high - low) / (high - low + 1e-12)', description: 'Close-shift normalized by range.', ic: 0.047, ir: 1.02, turnover: 0.74, sharpe: 1.32, maxDrawdown: -7.2, status: 'live', tags: ['price', 'technical'] },
  { id: 'q008', name: 'OPEN0', family: 'Qlib158', category: 'Momentum', formula: 'open / delay(close, 1)', description: 'Overnight gap ratio.', ic: 0.038, ir: 0.82, turnover: 0.68, sharpe: 1.06, maxDrawdown: -6.4, status: 'live', tags: ['overnight', 'gap'] },
  { id: 'q009', name: 'HIGH0', family: 'Qlib158', category: 'Volatility', formula: 'high / delay(close, 1)', description: 'High ratio to prior close.', ic: 0.029, ir: 0.64, turnover: 0.59, sharpe: 0.85, maxDrawdown: -5.1, status: 'live', tags: ['price', 'volatility'] },
  { id: 'q010', name: 'LOW0', family: 'Qlib158', category: 'Volatility', formula: 'low / delay(close, 1)', description: 'Low ratio to prior close.', ic: 0.033, ir: 0.72, turnover: 0.61, sharpe: 0.92, maxDrawdown: -5.6, status: 'live', tags: ['price', 'volatility'] },
  { id: 'q011', name: 'VWAP0', family: 'Qlib158', category: 'Volume', formula: 'vwap / close', description: 'VWAP to close ratio.', ic: 0.044, ir: 0.96, turnover: 0.71, sharpe: 1.24, maxDrawdown: -7.0, status: 'live', tags: ['vwap', 'volume'] },
  { id: 'q012', name: 'ROC5', family: 'Qlib158', category: 'Momentum', formula: 'ref(close, 5) / close - 1', description: '5-day rate of change.', ic: 0.061, ir: 1.28, turnover: 0.74, sharpe: 1.62, maxDrawdown: -8.8, status: 'live', tags: ['momentum', '5d'] },
  { id: 'q013', name: 'ROC20', family: 'Qlib158', category: 'Momentum', formula: 'ref(close, 20) / close - 1', description: '20-day rate of change.', ic: 0.054, ir: 1.18, turnover: 0.69, sharpe: 1.52, maxDrawdown: -9.1, status: 'live', tags: ['momentum', '20d'] },
  { id: 'q014', name: 'ROC60', family: 'Qlib158', category: 'Momentum', formula: 'ref(close, 60) / close - 1', description: '60-day rate of change.', ic: 0.048, ir: 1.04, turnover: 0.65, sharpe: 1.38, maxDrawdown: -10.4, status: 'live', tags: ['momentum', '60d'] },
  { id: 'q015', name: 'MA5', family: 'Qlib158', category: 'Technical', formula: 'mean(close, 5) / close', description: '5-day moving average ratio.', ic: 0.042, ir: 0.91, turnover: 0.66, sharpe: 1.18, maxDrawdown: -7.4, status: 'live', tags: ['ma', '5d'] },
  { id: 'q016', name: 'MA20', family: 'Qlib158', category: 'Technical', formula: 'mean(close, 20) / close', description: '20-day moving average ratio.', ic: 0.039, ir: 0.84, turnover: 0.63, sharpe: 1.12, maxDrawdown: -7.8, status: 'live', tags: ['ma', '20d'] },
  { id: 'q017', name: 'MA60', family: 'Qlib158', category: 'Technical', formula: 'mean(close, 60) / close', description: '60-day moving average ratio.', ic: 0.036, ir: 0.78, turnover: 0.60, sharpe: 1.04, maxDrawdown: -8.2, status: 'live', tags: ['ma', '60d'] },
  { id: 'q018', name: 'STD5', family: 'Qlib158', category: 'Volatility', formula: 'std(close, 5) / close', description: '5-day return volatility.', ic: -0.041, ir: -0.88, turnover: 0.72, sharpe: 1.18, maxDrawdown: -6.9, status: 'live', tags: ['vol', '5d'] },
  { id: 'q019', name: 'STD20', family: 'Qlib158', category: 'Volatility', formula: 'std(close, 20) / close', description: '20-day return volatility.', ic: -0.038, ir: -0.82, turnover: 0.68, sharpe: 1.12, maxDrawdown: -7.4, status: 'live', tags: ['vol', '20d'] },
  { id: 'q020', name: 'RSV5', family: 'Qlib158', category: 'Technical', formula: '(close - min(low, 5)) / (max(high, 5) - min(low, 5) + 1e-12)', description: '5-day stochastic.', ic: 0.045, ir: 0.98, turnover: 0.70, sharpe: 1.26, maxDrawdown: -7.2, status: 'live', tags: ['stoch', '5d'] },
  { id: 'q021', name: 'RSV20', family: 'Qlib158', category: 'Technical', formula: '(close - min(low, 20)) / (max(high, 20) - min(low, 20) + 1e-12)', description: '20-day stochastic.', ic: 0.041, ir: 0.89, turnover: 0.66, sharpe: 1.18, maxDrawdown: -7.6, status: 'live', tags: ['stoch', '20d'] },
  { id: 'q022', name: 'RSI5', family: 'Qlib158', category: 'Momentum', formula: 'sma(max(close - delay(close,1), 0), 5) / (sma(max(close - delay(close,1), 0), 5) + sma(max(delay(close,1) - close, 0), 5) + 1e-12)', description: '5-day RSI.', ic: -0.034, ir: -0.74, turnover: 0.71, sharpe: 1.04, maxDrawdown: -6.8, status: 'live', tags: ['rsi', 'momentum'] },
  { id: 'q023', name: 'RSI20', family: 'Qlib158', category: 'Momentum', formula: 'sma(max(close - delay(close,1), 0), 20) / (sma(max(close - delay(close,1), 0), 20) + sma(max(delay(close,1) - close, 0), 20) + 1e-12)', description: '20-day RSI.', ic: -0.031, ir: -0.68, turnover: 0.67, sharpe: 0.98, maxDrawdown: -7.1, status: 'live', tags: ['rsi', 'momentum'] },
  { id: 'q024', name: 'VSTD5', family: 'Qlib158', category: 'Volume', formula: 'std(volume, 5) / (mean(volume, 5) + 1e-12)', description: '5-day volume volatility.', ic: 0.029, ir: 0.63, turnover: 0.61, sharpe: 0.85, maxDrawdown: -5.4, status: 'live', tags: ['vol', 'volume'] },
  { id: 'q025', name: 'VSTD20', family: 'Qlib158', category: 'Volume', formula: 'std(volume, 20) / (mean(volume, 20) + 1e-12)', description: '20-day volume volatility.', ic: 0.026, ir: 0.57, turnover: 0.58, sharpe: 0.78, maxDrawdown: -5.1, status: 'live', tags: ['vol', 'volume'] },
  { id: 'q026', name: 'WVMA5', family: 'Qlib158', category: 'Volume', formula: 'std(abs(close / delay(close, 1) - 1) * volume, 5) / (mean(abs(close / delay(close, 1) - 1) * volume, 5) + 1e-12)', description: '5-day weighted volume momentum.', ic: 0.038, ir: 0.83, turnover: 0.69, sharpe: 1.08, maxDrawdown: -6.4, status: 'live', tags: ['volume', 'momentum'] },
  { id: 'q027', name: 'WVMA20', family: 'Qlib158', category: 'Volume', formula: 'std(abs(close / delay(close, 1) - 1) * volume, 20) / (mean(abs(close / delay(close, 1) - 1) * volume, 20) + 1e-12)', description: '20-day weighted volume momentum.', ic: 0.034, ir: 0.74, turnover: 0.65, sharpe: 0.98, maxDrawdown: -6.8, status: 'live', tags: ['volume', 'momentum'] },
  { id: 'q028', name: 'TURN5', family: 'Qlib158', category: 'Liquidity', formula: 'mean(turnover, 5)', description: '5-day mean turnover rate.', ic: 0.042, ir: 0.91, turnover: 0.72, sharpe: 1.18, maxDrawdown: -7.2, status: 'live', tags: ['liquidity', 'turnover'] },
  { id: 'q029', name: 'TURN20', family: 'Qlib158', category: 'Liquidity', formula: 'mean(turnover, 20)', description: '20-day mean turnover rate.', ic: 0.038, ir: 0.82, turnover: 0.68, sharpe: 1.08, maxDrawdown: -7.6, status: 'live', tags: ['liquidity', 'turnover'] },

  // ----- alpha101 family -----
  { id: 'a001', name: 'Alpha#1', family: 'alpha101', category: 'Reversal', formula: '(rank(Ts_ArgMax(SignedPower(((returns < 0) ? stddev(returns, 20) : close), 2.), 5)) - 0.5)', description: 'Top reversal signal using signed power and argmax.', ic: 0.052, ir: 1.12, turnover: 0.78, sharpe: 1.42, maxDrawdown: -8.4, status: 'live', tags: ['reversal', 'kakushadze'] },
  { id: 'a002', name: 'Alpha#2', family: 'alpha101', category: 'Momentum', formula: '-1 * correlation(rank(delta(log(volume), 2)), rank(((close - open) / open)), 6)', description: 'Volume-price divergence over 6 days.', ic: 0.048, ir: 1.04, turnover: 0.74, sharpe: 1.34, maxDrawdown: -7.8, status: 'live', tags: ['momentum', 'volume'] },
  { id: 'a003', name: 'Alpha#3', family: 'alpha101', category: 'Momentum', formula: '-1 * correlation(rank(open), rank(volume), 10)', description: 'Open-volume correlation over 10 days.', ic: 0.041, ir: 0.89, turnover: 0.68, sharpe: 1.16, maxDrawdown: -6.9, status: 'live', tags: ['volume', 'price'] },
  { id: 'a004', name: 'Alpha#4', family: 'alpha101', category: 'Reversal', formula: '-1 * Ts_Rank(rank(low), 9)', description: 'Reversal on ranked lows.', ic: 0.044, ir: 0.96, turnover: 0.71, sharpe: 1.24, maxDrawdown: -7.2, status: 'live', tags: ['reversal', 'rank'] },
  { id: 'a005', name: 'Alpha#5', family: 'alpha101', category: 'Momentum', formula: '(rank((open - (sum(vwap, 10) / 10))) * (-1 * abs(rank((close - vwap)))))', description: 'Open deviation from 10-day VWAP.', ic: 0.046, ir: 1.00, turnover: 0.73, sharpe: 1.28, maxDrawdown: -7.5, status: 'live', tags: ['vwap', 'momentum'] },
  { id: 'a006', name: 'Alpha#6', family: 'alpha101', category: 'Reversal', formula: '-1 * correlation(open, volume, 10)', description: 'Open-volume negative correlation.', ic: 0.039, ir: 0.85, turnover: 0.66, sharpe: 1.10, maxDrawdown: -6.8, status: 'live', tags: ['reversal', 'volume'] },
  { id: 'a007', name: 'Alpha#7', family: 'alpha101', category: 'Volume', formula: '((adv20 < volume) ? ((-1 * ts_rank(abs(delta(close, 7)), 60)) * sign(delta(close, 7))) : (-1 * vwap))', description: 'Volume breakout conditional signal.', ic: 0.049, ir: 1.07, turnover: 0.76, sharpe: 1.36, maxDrawdown: -8.0, status: 'live', tags: ['volume', 'breakout'] },
  { id: 'a008', name: 'Alpha#8', family: 'alpha101', category: 'Reversal', formula: '-1 * rank(((sum(open, 5) * sum(returns, 5)) - delay((sum(open, 5) * sum(returns, 5)), 10)))', description: 'Open-return cross-product reversal.', ic: 0.042, ir: 0.91, turnover: 0.70, sharpe: 1.18, maxDrawdown: -7.0, status: 'live', tags: ['reversal', 'open'] },
  { id: 'a009', name: 'Alpha#9', family: 'alpha101', category: 'Momentum', formula: '((0 < ts_min(delta(close, 1), 5)) ? delta(close, 1) : ((ts_max(delta(close, 1), 5) < 0) ? delta(close, 1) : (-1 * delta(close, 1))))', description: 'Conditional momentum on delta close.', ic: 0.045, ir: 0.98, turnover: 0.72, sharpe: 1.24, maxDrawdown: -7.4, status: 'live', tags: ['momentum', 'conditional'] },
  { id: 'a010', name: 'Alpha#10', family: 'alpha101', category: 'Momentum', formula: 'rank(((0 < ts_min(delta(close, 1), 4)) ? delta(close, 1) : ((ts_max(delta(close, 1), 4) < 0) ? delta(close, 1) : (-1 * delta(close, 1)))))', description: 'Ranked conditional momentum.', ic: 0.043, ir: 0.94, turnover: 0.71, sharpe: 1.20, maxDrawdown: -7.1, status: 'live', tags: ['momentum', 'rank'] },
  { id: 'a011', name: 'Alpha#11', family: 'alpha101', category: 'Volume', formula: '(rank(ts_max((vwap - close), 3)) + rank(ts_min((vwap - close), 3))) * rank(delta(volume, 3))', description: 'VWAP-close extreme combined with volume delta.', ic: 0.047, ir: 1.02, turnover: 0.74, sharpe: 1.30, maxDrawdown: -7.6, status: 'live', tags: ['vwap', 'volume'] },
  { id: 'a012', name: 'Alpha#12', family: 'alpha101', category: 'Reversal', formula: '(sign(delta(volume, 1)) * (-1 * delta(close, 1)))', description: 'Volume-signaled price reversal.', ic: 0.040, ir: 0.87, turnover: 0.69, sharpe: 1.14, maxDrawdown: -6.9, status: 'live', tags: ['reversal', 'volume'] },

  // ----- GTJA191 family -----
  { id: 'g001', name: 'Alpha#1', family: 'GTJA191', category: 'Reversal', formula: '(-1 * correlation(rank(delta(log(volume), 2)), rank(((close - open) / open)), 6))', description: 'GTJA191 #1: volume-price reversal.', ic: 0.046, ir: 1.00, turnover: 0.73, sharpe: 1.28, maxDrawdown: -7.5, status: 'live', tags: ['reversal', 'gtja'] },
  { id: 'g002', name: 'Alpha#2', family: 'GTJA191', category: 'Momentum', formula: '-1 * delta(((close - low) - (high - close)) / (close - low + 1e-12), 1) / max(high - low, 1e-12)', description: 'GTJA191 #2: intraday range position.', ic: 0.044, ir: 0.95, turnover: 0.71, sharpe: 1.22, maxDrawdown: -7.2, status: 'live', tags: ['intraday', 'gtja'] },
  { id: 'g003', name: 'Alpha#3', family: 'GTJA191', category: 'Volume', formula: 'sum(close > delay(close, 1) ? 1 : 0, 6) / 6 - sum(close > delay(close, 1) ? 1 : 0, 12) / 12', description: 'GTJA191 #3: 6 vs 12-day win rate.', ic: 0.041, ir: 0.89, turnover: 0.68, sharpe: 1.16, maxDrawdown: -6.9, status: 'live', tags: ['momentum', 'gtja'] },
  { id: 'g004', name: 'Alpha#4', family: 'GTJA191', category: 'Reversal', formula: '(((sum(low, 8) / 8) + ((sum(low, 8) / 8) - std(low, 8)) < low) ? 1 : (-1 * (((sum(low, 8) / 8) + ((sum(low, 8) / 8) - std(low, 8)) - low) / std(low, 8))))', description: 'GTJA191 #4: low reversal band.', ic: 0.043, ir: 0.93, turnover: 0.70, sharpe: 1.20, maxDrawdown: -7.1, status: 'live', tags: ['reversal', 'gtja'] },
  { id: 'g005', name: 'Alpha#5', family: 'GTJA191', category: 'Volume', formula: '-1 * ts_rank(rank(close), 5) * correlation(volume, adv20, 5)', description: 'GTJA191 #5: close-volume interaction.', ic: 0.040, ir: 0.87, turnover: 0.67, sharpe: 1.13, maxDrawdown: -6.8, status: 'live', tags: ['volume', 'gtja'] },
  { id: 'g006', name: 'Alpha#6', family: 'GTJA191', category: 'Volatility', formula: '-1 * correlation(open, volume, 10)', description: 'GTJA191 #6: open-volume reversal.', ic: 0.039, ir: 0.84, turnover: 0.66, sharpe: 1.10, maxDrawdown: -6.7, status: 'live', tags: ['volatility', 'gtja'] },
  { id: 'g007', name: 'Alpha#7', family: 'GTJA191', category: 'Momentum', formula: '((adv20 < volume) ? ((-1 * ts_rank(abs(delta(close, 7)), 60)) * sign(delta(close, 7))) : (-1))', description: 'GTJA191 #7: volume breakout momentum.', ic: 0.045, ir: 0.98, turnover: 0.72, sharpe: 1.24, maxDrawdown: -7.3, status: 'live', tags: ['momentum', 'gtja'] },
  { id: 'g008', name: 'Alpha#8', family: 'GTJA191', category: 'Reversal', formula: '-1 * rank(((sum(open, 5) * sum(returns, 5)) - delay((sum(open, 5) * sum(returns, 5)), 10)))', description: 'GTJA191 #8: open-return reversal.', ic: 0.042, ir: 0.91, turnover: 0.69, sharpe: 1.18, maxDrawdown: -7.0, status: 'live', tags: ['reversal', 'gtja'] },
  { id: 'g009', name: 'Alpha#9', family: 'GTJA191', category: 'Technical', formula: '((0 < ts_min(delta(close, 1), 5)) ? delta(close, 1) : ((ts_max(delta(close, 1), 5) < 0) ? delta(close, 1) : (-1 * delta(close, 1))))', description: 'GTJA191 #9: conditional momentum.', ic: 0.044, ir: 0.95, turnover: 0.71, sharpe: 1.21, maxDrawdown: -7.2, status: 'live', tags: ['technical', 'gtja'] },
  { id: 'g010', name: 'Alpha#10', family: 'GTJA191', category: 'Technical', formula: 'rank(((0 < ts_min(delta(close, 1), 4)) ? delta(close, 1) : ((ts_max(delta(close, 1), 4) < 0) ? delta(close, 1) : (-1 * delta(close, 1)))))', description: 'GTJA191 #10: ranked conditional momentum.', ic: 0.043, ir: 0.93, turnover: 0.70, sharpe: 1.19, maxDrawdown: -7.1, status: 'live', tags: ['technical', 'gtja'] },

  // ----- Academic -----
  { id: 'ac001', name: 'Fama-French MKT', family: 'Academic', category: 'Value', formula: 'market_excess_return', description: 'Market factor excess return (Fama-French 3-factor).', ic: 0.062, ir: 1.32, turnover: 0.45, sharpe: 1.68, maxDrawdown: -8.4, status: 'live', tags: ['ff3', 'factor'] },
  { id: 'ac002', name: 'Fama-French SMB', family: 'Academic', category: 'Value', formula: 'small_minus_big', description: 'Size premium (small-cap minus large-cap).', ic: 0.024, ir: 0.52, turnover: 0.38, sharpe: 0.72, maxDrawdown: -5.4, status: 'live', tags: ['ff3', 'size'] },
  { id: 'ac003', name: 'Fama-French HML', family: 'Academic', category: 'Value', formula: 'high_minus_low_book_to_market', description: 'Value premium (high B/M minus low B/M).', ic: 0.031, ir: 0.68, turnover: 0.41, sharpe: 0.88, maxDrawdown: -6.2, status: 'live', tags: ['ff3', 'value'] },
  { id: 'ac004', name: 'Fama-French RMW', family: 'Academic', category: 'Profitability', formula: 'robust_minus_weak_profitability', description: 'Profitability premium (FF 5-factor).', ic: 0.028, ir: 0.61, turnover: 0.39, sharpe: 0.81, maxDrawdown: -5.8, status: 'live', tags: ['ff5', 'profitability'] },
  { id: 'ac005', name: 'Fama-French CMA', family: 'Academic', category: 'Growth', formula: 'conservative_minus_aggressive_investment', description: 'Investment premium (FF 5-factor).', ic: 0.026, ir: 0.57, turnover: 0.37, sharpe: 0.76, maxDrawdown: -5.5, status: 'live', tags: ['ff5', 'investment'] },
  { id: 'ac006', name: 'Carhart MOM', family: 'Academic', category: 'Momentum', formula: '12_2_momentum', description: 'Jegadeesh-Titman 12-2 momentum factor.', ic: 0.054, ir: 1.18, turnover: 0.62, sharpe: 1.52, maxDrawdown: -9.4, status: 'live', tags: ['carhart', 'momentum'] },
  { id: 'ac007', name: 'Jegadeesh Reversal', family: 'Academic', category: 'Reversal', formula: 'short_term_reversal', description: 'Jegadeesh 1-month short-term reversal.', ic: 0.041, ir: 0.89, turnover: 0.78, sharpe: 1.16, maxDrawdown: -6.4, status: 'live', tags: ['reversal', 'short'] },
  { id: 'ac008', name: 'George-Hwang 52W-H', family: 'Academic', category: 'Momentum', formula: 'nearness_to_52_week_high', description: 'George-Hwang 52-week-high anchoring effect.', ic: 0.047, ir: 1.02, turnover: 0.55, sharpe: 1.30, maxDrawdown: -7.8, status: 'live', tags: ['52wh', 'anchor'] },
  { id: 'ac009', name: 'Amihud Illiquidity', family: 'Academic', category: 'Liquidity', formula: 'mean(|r_t| / volume_t)', description: 'Amihud (2002) illiquidity measure.', ic: 0.038, ir: 0.82, turnover: 0.48, sharpe: 1.08, maxDrawdown: -6.4, status: 'live', tags: ['illiquidity', 'amihud'] },
  { id: 'ac010', name: 'Harvey-Siddique Skew', family: 'Academic', category: 'Volatility', formula: 'coskew_with_market', description: 'Harvey-Siddique (2000) systematic coskewness.', ic: -0.034, ir: -0.74, turnover: 0.52, sharpe: 0.98, maxDrawdown: -6.8, status: 'live', tags: ['skew', 'higher-moment'] },

  // ----- Custom / experimental -----
  { id: 'x001', name: 'Bull-Bear Spread', family: 'Qlib158', category: 'Sentiment', formula: 'rank(bullish_tweets - bearish_tweets) / total_tweets', description: 'Social-media bull-bear spread.', ic: 0.038, ir: 0.83, turnover: 0.74, sharpe: 1.08, maxDrawdown: -6.8, status: 'experimental', tags: ['sentiment', 'social'] },
  { id: 'x002', name: 'Insider Buy Ratio', family: 'Academic', category: 'Sentiment', formula: 'insider_buys / insider_trades_30d', description: '30-day insider buy ratio.', ic: 0.044, ir: 0.96, turnover: 0.42, sharpe: 1.24, maxDrawdown: -7.2, status: 'experimental', tags: ['insider', 'sentiment'] },
  { id: 'x003', name: 'Options Skew', family: 'Qlib158', category: 'Volatility', formula: 'iv_25delta_put - iv_25delta_call', description: '25-delta put-minus-call IV skew.', ic: 0.041, ir: 0.89, turnover: 0.58, sharpe: 1.18, maxDrawdown: -7.0, status: 'experimental', tags: ['options', 'volatility'] },
  { id: 'x004', name: 'Flow Reversal', family: 'alpha101', category: 'Volume', formula: '-1 * rank(correlation(money_flow, returns, 5))', description: '5-day money-flow reversal.', ic: 0.043, ir: 0.93, turnover: 0.71, sharpe: 1.20, maxDrawdown: -7.1, status: 'experimental', tags: ['flow', 'reversal'] },
]

// Helper: family summary stats
export function familyStats() {
  const families = ['Qlib158', 'alpha101', 'GTJA191', 'Academic'] as const
  return families.map(fam => {
    const items = ALPHAS.filter(a => a.family === fam)
    return {
      family: fam,
      count: items.length,
      avgIC: items.reduce((s, a) => s + a.ic, 0) / (items.length || 1),
      avgIR: items.reduce((s, a) => s + a.ir, 0) / (items.length || 1),
      live: items.filter(a => a.status === 'live').length,
    }
  })
}

// Helper: category distribution
export function categoryStats() {
  const cats = ['Momentum', 'Reversal', 'Volume', 'Volatility', 'Value', 'Growth', 'Profitability', 'Liquidity', 'Sentiment', 'Technical'] as const
  return cats.map(cat => ({
    category: cat,
    count: ALPHAS.filter(a => a.category === cat).length,
  })).filter(c => c.count > 0)
}
