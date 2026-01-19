import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// WalletConnect Project ID - get yours at https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'cb44e6bd7a2139350e8c0fb2d0fea8cb';

export const config = getDefaultConfig({
  appName: 'LiquidX',
  projectId,
  chains: [sepolia],
  ssr: false,
});
