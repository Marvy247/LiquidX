import { useCurrentAccount, ConnectButton } from '@mysten/dapp-kit';
import { useEffect } from 'react';

interface SuiWalletButtonProps {
  onAddressChange?: (address: string) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export function SuiWalletButton({ onAddressChange }: SuiWalletButtonProps) {
  const currentAccount = useCurrentAccount();

  useEffect(() => {
    if (currentAccount?.address && onAddressChange) {
      onAddressChange(currentAccount.address);
    }
  }, [currentAccount?.address, onAddressChange]);

  return <ConnectButton />;
}
