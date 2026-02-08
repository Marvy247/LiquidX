import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { wagmiAdapter } from '@/lib/reown-config'
import { SuiClientProvider, WalletProvider as SuiWalletProvider } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui.js/client'
import { LIQUIDX_CONFIG } from '@/lib/liquidx-config'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
})

// SUI network configuration
const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
}

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Ethereum wallet provider */}
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        {/* SUI wallet provider */}
        <SuiClientProvider networks={networks} defaultNetwork={LIQUIDX_CONFIG.SUI_NETWORK}>
          <SuiWalletProvider autoConnect>
            {children}
          </SuiWalletProvider>
        </SuiClientProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
