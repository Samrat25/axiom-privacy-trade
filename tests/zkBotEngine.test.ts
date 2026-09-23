import { describe, it, expect } from 'vitest';
import {
  runScenarioBacktest,
  generateZKAuditCertificate,
  generateProofHash,
  STRESS_SCENARIOS,
  type BotConfig
} from '../src/utils/zkBotEngine';

describe('Axiom ZK Execution Bot & Institutional Backtest Studio', () => {
  const mockConfig: BotConfig = {
    agentId: '0x111122223333444455556666777788889999aaaabbbbccccddddeeeeffff0000',
    asset: 'tNIGHT',
    initialCapitalUsd: 10000,
    maxPositionPct: 20,
    stopLossPct: 10,
    expiryHours: 72,
    riskRegime: 'CONSERVATIVE_GROWTH',
    tickIntervalMs: 5000
  };

  it('1. runScenarioBacktest (Flash Crash): halts execution when drawdown breaches stop-loss', () => {
    const result = runScenarioBacktest(mockConfig, 'flash_crash');
    expect(result.scenario.id).toBe('flash_crash');
    expect(result.circuitBreakerTriggered).toBe(true);
    expect(result.maxDrawdownPct).toBeGreaterThanOrEqual(mockConfig.stopLossPct);

    // Verify halt tick exists
    const haltTicks = result.ticks.filter(t => t.action === 'CIRCUIT_BREAKER_HALT');
    expect(haltTicks.length).toBeGreaterThan(0);
    expect(haltTicks[0].zkProofStatus).toBe('REJECTED_BOUNDS');
    expect(haltTicks[0].reason).toContain('Stop-loss limit breached');
  });

  it('2. runScenarioBacktest (Bull Surge): enforces max position size ceiling on trades', () => {
    const result = runScenarioBacktest(mockConfig, 'bull_surge');
    expect(result.scenario.id).toBe('bull_surge');
    expect(result.circuitBreakerTriggered).toBe(false);
    expect(result.totalTrades).toBeGreaterThan(0);
    expect(result.finalCapitalUsd).toBeGreaterThan(mockConfig.initialCapitalUsd);

    // Verify every BUY trade satisfies maxPositionPct
    const buyTicks = result.ticks.filter(t => t.action === 'BUY');
    buyTicks.forEach(tick => {
      expect(tick.positionPct).toBeLessThanOrEqual(mockConfig.maxPositionPct);
      expect(tick.zkProofStatus).toBe('VALIDATED_ZK');
    });
  });

  it('3. runScenarioBacktest (MEV Sandwich Attack): guarantees 100% privacy and $0 MEV loss', () => {
    const result = runScenarioBacktest(mockConfig, 'mev_sandwich_attack');
    expect(result.scenario.id).toBe('mev_sandwich_attack');
    expect(result.mevExtractedByPredatorsUsd).toBe(0);
    expect(result.mevProtectedUsd).toBe(STRESS_SCENARIOS.mev_sandwich_attack.mevAttemptsUsd);
    expect(result.privacyPreservationScorePct).toBe(100);
  });

  it('4. runScenarioBacktest (Choppy Consolidation): generates valid ZK proof hashes without errors', () => {
    const result = runScenarioBacktest(mockConfig, 'choppy_consolidation');
    expect(result.ticks.length).toBe(STRESS_SCENARIOS.choppy_consolidation.priceDeltasPct.length);
    result.ticks.forEach(tick => {
      expect(tick.proofHash).toMatch(/^0x[a-f0-9]{64}$/);
      expect(tick.proofLatencyMs).toBeGreaterThan(0);
    });
  });

  it('5. generateZKAuditCertificate: produces cryptographically signed institutional audit certificate', () => {
    const result = runScenarioBacktest(mockConfig, 'bull_surge');
    const cert = generateZKAuditCertificate(mockConfig, result);

    expect(cert.certificateId).toMatch(/^AXIOM-CERT-[A-Z0-9]+-\d+$/);
    expect(cert.contractAddress).toBe('0x2428cd4ae7c2cd0bb501e1e9162de3003b103c1063c220e0d5cfc3f0b438e524');
    expect(cert.network).toBe('Midnight Preprod Testnet');
    expect(cert.strategyCommitmentHash).toMatch(/^0x[a-f0-9]{64}$/);
    expect(cert.verificationHash).toMatch(/^0x[a-f0-9]{64}$/);
    expect(cert.mevImmunityVerified).toBe(true);
    expect(cert.zkCircuitCompliance).toBe('VERIFIED_COMPACT_V0.24');
  });
});
