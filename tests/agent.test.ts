import { describe, it, expect } from 'vitest';
import { decideTradeNode, AgentState, PriceTick } from '../src/utils/agent';
import { StrategyParams } from '../src/utils/contract';

describe('Axiom LangGraph Trading Agent Decision Engine Suite', () => {
  const sampleParams: StrategyParams = {
    asset: 'ADA',
    maxPositionPct: 20,
    stopLossPct: 8,
    timelineDays: 30,
    timelineExpiry: 2000000000n // Future timestamp relative to test ticks
  };

  it('1. DecideTrade: triggers stop_loss_triggered when price drawdown breaches stopLossPct (-8%)', async () => {
    const drawdownTick: PriceTick = {
      asset: 'ADA',
      priceUsd: 0.35,
      changePct24h: -9.5, // Exceeds 8% stop loss threshold
      timestamp: 1750000000n
    };

    const state: Partial<AgentState> = {
      strategyParams: sampleParams,
      currentPriceTick: drawdownTick,
      loopCount: 1
    };

    const result = await decideTradeNode(state as AgentState);
    expect(result.decisionAction).toBe('stop_loss_triggered');
  });

  it('2. DecideTrade: triggers expired action when strategy timeline timestamp has elapsed', async () => {
    const expiredParams: StrategyParams = {
      ...sampleParams,
      timelineExpiry: 1700000000n // Expired before tick timestamp
    };

    const normalTick: PriceTick = {
      asset: 'ADA',
      priceUsd: 0.42,
      changePct24h: 0.5,
      timestamp: 1750000000n
    };

    const state: Partial<AgentState> = {
      strategyParams: expiredParams,
      currentPriceTick: normalTick,
      loopCount: 1
    };

    const result = await decideTradeNode(state as AgentState);
    expect(result.decisionAction).toBe('expired');
  });

  it('3. DecideTrade: remains in monitor loop when prices are within normal risk parameters', async () => {
    const normalTick: PriceTick = {
      asset: 'ADA',
      priceUsd: 0.42,
      changePct24h: 0.2, // Normal fluctuation
      timestamp: 1750000000n
    };

    const state: Partial<AgentState> = {
      strategyParams: sampleParams,
      currentPriceTick: normalTick,
      loopCount: 1
    };

    const result = await decideTradeNode(state as AgentState);
    expect(result.decisionAction).toBe('monitor');
  });
});
