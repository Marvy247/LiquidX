// SUI address validation utilities

/**
 * Validates if a string is a valid SUI address
 * SUI addresses are 66 characters long and start with '0x'
 */
export function isValidSuiAddress(address: string): boolean {
  if (!address) return false;
  
  // SUI addresses are 66 characters long (0x + 64 hex characters)
  if (address.length !== 66) return false;
  
  // Must start with 0x
  if (!address.startsWith('0x')) return false;
  
  // Must be valid hex after 0x
  const hexPart = address.slice(2);
  return /^[0-9a-fA-F]{64}$/.test(hexPart);
}

/**
 * Normalizes a SUI address to lowercase
 */
export function normalizeSuiAddress(address: string): string {
  return address.toLowerCase();
}

/**
 * Formats a SUI address for display (truncated)
 */
export function formatSuiAddress(address: string, startChars = 8, endChars = 6): string {
  if (!address || address.length < startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}
