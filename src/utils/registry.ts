/**
 * Axiom — Versioned Contract Registry Utilities
 * Reads deployment addresses from deployments/registry.json with network fallbacks.
 */

import registryData from '../../deployments/registry.json';

export interface DeploymentEntry {
  version: string;
  contractAddress: string;
  deployedAt: string;
  commitHash: string;
  circuits: string[];
}

export function getActiveContractAddress(network: 'preview' | 'preprod' | string = 'preview'): string {
  const netKey = network === 'preprod' ? 'preprod' : 'preview';
  const entries: DeploymentEntry[] = (registryData.axiom as Record<string, DeploymentEntry[]>)[netKey] || [];
  if (entries.length > 0) {
    return entries[entries.length - 1].contractAddress;
  }

  // Fallback to environment variables
  if (netKey === 'preprod') {
    return (
      (typeof import.meta !== 'undefined' && (import.meta.env?.['VITE_PREPROD_CONTRACT_ADDRESS'] as string)) ||
      '0x5a89909bb8d9b9b0418d88a87957e084333d68df7e34037aac308719e2c2bd1b'
    );
  }
  return (
    (typeof import.meta !== 'undefined' && (import.meta.env?.['VITE_PREVIEW_CONTRACT_ADDRESS'] as string)) ||
    '0x0f064205a7609cc679f4b697ac6f4e7f47acd6485966c92bbd7c07fb5385080d'
  );
}

export function getContractHistory(network: 'preview' | 'preprod' | string = 'preview'): DeploymentEntry[] {
  const netKey = network === 'preprod' ? 'preprod' : 'preview';
  return (registryData.axiom as Record<string, DeploymentEntry[]>)[netKey] || [];
}
