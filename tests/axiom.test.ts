import { describe, it, expect } from 'vitest';
import { AxiomContractSimulator, StrategyWitnesses } from '../managed/axiom';

describe('Axiom Compact Smart Contract Privacy & Verification Suite', () => {
  const defaultWitnesses: StrategyWitnesses = {
    getStrategyAsset: () => 'ADA',
    getMaxPositionPct: () => 20,
    getStopLossPct: () => 8,
    getStrategyExpiry: () => 1760000000n, // Future timestamp
    getPortfolioValue: () => 10000n,      // $10,000 portfolio
    getTradeAsset: () => 'ADA',
    getTradeSizeUsd: () => 1500n,         // $1,500 = 15% position (valid)
    localSecretKey: () => '0xprivatesecretkey123456789'
  };

  it('1. commitStrategy: successfully hashes strategy witnesses & records commitment on ledger', () => {
    const contract = new AxiomContractSimulator(defaultWitnesses);
    const agentId = '0xagent_1';

    const hash = contract.commitStrategy(agentId);

    expect(hash).toBeDefined();
    expect(hash.startsWith('0x')).toBe(true);
    expect(contract.agentCommitment.get(agentId)).toBe(hash);
  });

  it('2. executeTrade: executes and proves compliance when trade is within committed strategy bounds', () => {
    const contract = new AxiomContractSimulator(defaultWitnesses);
    const agentId = '0xagent_1';
    const tradeId = '0xtrade_101';

    contract.commitStrategy(agentId);
    const result = contract.executeTrade(agentId, tradeId, 1750000000n);

    expect(result.status).toBe('executed');
    expect(contract.tradeStatus.get(tradeId)).toBe(1);
    expect(contract.tradeCount).toBe(1);
  });

  it('3. executeTrade: rejects trade when position size exceeds maxPositionPct (20%)', () => {
    const excessiveWitnesses: StrategyWitnesses = {
      ...defaultWitnesses,
      getTradeSizeUsd: () => 2500n // $2,500 out of $10,000 = 25% > 20% max
    };

    const contract = new AxiomContractSimulator(excessiveWitnesses);
    const agentId = '0xagent_1';
    const tradeId = '0xtrade_102';

    contract.commitStrategy(agentId);
    const result = contract.executeTrade(agentId, tradeId, 1750000000n);

    expect(result.status).toBe('rejected');
    expect(result.reason).toContain('exceeds max position size');
    expect(contract.tradeStatus.get(tradeId)).toBe(2);
  });

  it('4. executeTrade: rejects trade when asset mismatches strategy or timeline is expired', () => {
    const mismatchedWitnesses: StrategyWitnesses = {
      ...defaultWitnesses,
      getTradeAsset: () => 'ETH' // Mismatch (Strategy is ADA)
    };

    const contract = new AxiomContractSimulator(mismatchedWitnesses);
    const agentId = '0xagent_1';
    const tradeId = '0xtrade_103';

    contract.commitStrategy(agentId);

    // Mismatched asset test
    const resultAsset = contract.executeTrade(agentId, tradeId, 1750000000n);
    expect(resultAsset.status).toBe('rejected');
    expect(resultAsset.reason).toContain('asset not in strategy');

    // Expired timestamp test
    const contractExpired = new AxiomContractSimulator(defaultWitnesses);
    contractExpired.commitStrategy(agentId);
    const resultExpiry = contractExpired.executeTrade(agentId, '0xtrade_104', 1800000000n); // > 1760000000n
    expect(resultExpiry.status).toBe('rejected');
    expect(resultExpiry.reason).toContain('strategy timeline expired');
  });

  it('5. unshieldWithdraw: verifies private balance and executes unshielding', () => {
    const contract = new AxiomContractSimulator(defaultWitnesses);
    const agentId = '0xagent_1';

    const validWithdraw = contract.unshieldWithdraw(agentId, 5000n);
    expect(validWithdraw.success).toBe(true);

    const invalidWithdraw = contract.unshieldWithdraw(agentId, 50000n);
    expect(invalidWithdraw.success).toBe(false);
    expect(invalidWithdraw.reason).toContain('insufficient private balance');
  });

  it('6. executeTrade: asserts getRiskCheckPassed() witness status', () => {
    const passingRiskWitnesses: StrategyWitnesses = {
      ...defaultWitnesses,
      getRiskCheckPassed: () => true,
    };
    const contractPassing = new AxiomContractSimulator(passingRiskWitnesses);
    const agentId = '0xagent_1';
    contractPassing.commitStrategy(agentId);

    const passRes = contractPassing.executeTrade(agentId, '0xtrade_risk_pass', 1750000000n);
    expect(passRes.status).toBe('executed');

    const failingRiskWitnesses: StrategyWitnesses = {
      ...defaultWitnesses,
      getRiskCheckPassed: () => false,
    };
    const contractFailing = new AxiomContractSimulator(failingRiskWitnesses);
    contractFailing.commitStrategy(agentId);

    const failRes = contractFailing.executeTrade(agentId, '0xtrade_risk_fail', 1750000000n);
    expect(failRes.status).toBe('rejected');
    expect(failRes.reason).toContain('risk model check failed');
  });
});
