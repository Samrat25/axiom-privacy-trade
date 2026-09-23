import { describe, it, expect } from 'vitest';
import {
  runComprehensiveRiskAnalysis,
  SUPPORTED_GEMINI_MODELS,
  invokeWithModelFallback,
  ComprehensiveAnalysisSchema
} from '../src/utils/agent';
import { StrategyParams } from '../src/utils/contract';

describe('Axiom Level 6 Multi-Regime ZK Risk Analyst & Model Fallback', () => {
  const conservativeParams: StrategyParams = {
    asset: 'ADA',
    maxPositionPct: 15,
    stopLossPct: 6,
    timelineDays: 30,
    timelineExpiry: 1760000000n
  };

  const aggressiveParams: StrategyParams = {
    asset: 'BTC',
    maxPositionPct: 50,
    stopLossPct: 25,
    timelineDays: 14,
    timelineExpiry: 1760000000n
  };

  it('1. SUPPORTED_GEMINI_MODELS: exposes all 3 resilient production model fallbacks', () => {
    expect(SUPPORTED_GEMINI_MODELS).toContain('gemini-2.5-flash');
    expect(SUPPORTED_GEMINI_MODELS).toContain('gemini-2.0-flash');
    expect(SUPPORTED_GEMINI_MODELS).toContain('gemini-1.5-flash');
    expect(SUPPORTED_GEMINI_MODELS.length).toBe(3);
  });

  it('2. runComprehensiveRiskAnalysis: classifies conservative parameters into CAPITAL_PRESERVATION regime', async () => {
    const analysis = await runComprehensiveRiskAnalysis(conservativeParams, 10000, 'ADA');
    expect(analysis).toBeDefined();
    expect(analysis.regime).toBe('CAPITAL_PRESERVATION');
    expect(analysis.maxAllowedAllocationUsd).toBe(1500); // 15% of 10,000
    expect(analysis.zkCircuitCompliance).toBe(true);
    expect(analysis.confidenceScore).toBeGreaterThanOrEqual(90);
    expect(ComprehensiveAnalysisSchema.safeParse(analysis).success).toBe(true);
  });

  it('3. runComprehensiveRiskAnalysis: classifies high drawdown parameters into SPECULATIVE_EXPANSION regime', async () => {
    const analysis = await runComprehensiveRiskAnalysis(aggressiveParams, 20000, 'BTC');
    expect(analysis).toBeDefined();
    expect(analysis.regime).toBe('SPECULATIVE_EXPANSION');
    expect(analysis.maxAllowedAllocationUsd).toBe(10000); // 50% of 20,000
    expect(analysis.zkCircuitCompliance).toBe(true);
    expect(ComprehensiveAnalysisSchema.safeParse(analysis).success).toBe(true);
  });

  it('4. runComprehensiveRiskAnalysis: computes exact trailing stop-loss price and enforces position ceiling', async () => {
    const customSize = 800; // within 15% of 10,000 ($1,500)
    const analysis = await runComprehensiveRiskAnalysis(conservativeParams, 10000, 'ADA', customSize);
    expect(analysis.recommendedTradeSizeUsd).toBe(800);
    expect(analysis.trailingStopLossPriceUsd).toBeCloseTo(0.421 * (1 - 0.06), 3);
    expect(analysis.suggestedAction).toBe('BUY');
    expect(analysis.zkCircuitCompliance).toBe(true);
  });

  it('5. invokeWithModelFallback: throws informative error when GOOGLE_API_KEY is not configured', async () => {
    await expect(
      invokeWithModelFallback(async (llm) => llm.invoke('test'))
    ).rejects.toThrow(/GOOGLE_API_KEY is missing/);
  });
});
