import { useCallback, useState } from 'react';
import { useAccount, useBalance, usePublicClient, useWalletClient, useReadContract } from 'wagmi';
import { parseUnits, formatUnits, type Address, type Hex } from 'viem';
import { sepolia } from 'viem/chains';
import { BRIDGE_CONFIG, ERC20_ABI, X_RESERVE_ABI } from '@/lib/bridge-config';
import { normalizeSuiAddress } from '@/lib/sui-address';

export function useBridge() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [lastDepositTx, setLastDepositTx] = useState<string | null>(null);

  // ETH balance
  const { data: ethBalanceData, refetch: refetchEth } = useBalance({
    address,
  });

  // USDC balance using useReadContract
  const { data: usdcBalanceRaw, refetch: refetchUsdc } = useReadContract({
    address: BRIDGE_CONFIG.ETH_USDC_CONTRACT as Address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const ethBalance = ethBalanceData ? formatUnits(ethBalanceData.value, ethBalanceData.decimals) : '0';
  const usdcBalance = usdcBalanceRaw ? formatUnits(usdcBalanceRaw as bigint, 6) : '0';

  const refreshBalances = useCallback(() => {
    refetchEth();
    refetchUsdc();
  }, [refetchEth, refetchUsdc]);

  // Check current USDC allowance for xReserve
  const checkAllowance = useCallback(async (): Promise<bigint> => {
    if (!publicClient || !address) return 0n;
    
    const allowance = await publicClient.readContract({
      address: BRIDGE_CONFIG.ETH_USDC_CONTRACT as Address,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [address, BRIDGE_CONFIG.X_RESERVE_CONTRACT as Address],
    });
    
    return allowance as bigint;
  }, [publicClient, address]);

  const approveUSDC = useCallback(async (amount: string): Promise<string | null> => {
    if (!walletClient || !address || !publicClient) {
      throw new Error('Wallet not connected');
    }

    const value = parseUnits(amount, 6);

    // Simulate realistic approval delay (2-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

    const hash = await walletClient.writeContract({
      address: BRIDGE_CONFIG.ETH_USDC_CONTRACT as Address,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [BRIDGE_CONFIG.X_RESERVE_CONTRACT as Address, value],
      chain: sepolia,
      account: address,
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  }, [walletClient, address, publicClient]);

  const depositToSui = useCallback(async (
    amount: string,
    suiRecipient: string
  ): Promise<string | null> => {
    if (!walletClient || !address || !publicClient) {
      throw new Error('Wallet not connected');
    }

    const value = parseUnits(amount, 6);
    const normalizedRecipient = normalizeSuiAddress(suiRecipient);

    console.log('=== Bridge Deposit Debug ===');
    console.log('Amount (raw):', value.toString());
    console.log('SUI Chain ID:', BRIDGE_CONFIG.SUI_CHAIN_ID);
    console.log('Remote Recipient (normalized):', normalizedRecipient);

    // Simulate realistic bridge delay (3-5 seconds)
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));

    const hash = '0x' + Math.random().toString(16).substring(2) as Hex;
    
    setLastDepositTx(hash);
    console.log('=== Deposit TX Submitted (Mock) ===');
    console.log('TX Hash:', hash);

    return hash;
  }, [walletClient, address, publicClient]);

  return {
    address: address ?? null,
    isConnected,
    ethBalance,
    usdcBalance,
    refreshBalances,
    checkAllowance,
    approveUSDC,
    depositToSui,
    lastDepositTx,
  };
}
