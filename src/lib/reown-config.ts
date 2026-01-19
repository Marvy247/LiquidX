import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { sepolia } from '@reown/appkit/networks'

// Get projectId from env
const projectId = 'cb44e6bd7a2139350e8c0fb2d0fea8cb';

// Create the Wagmi adapter
const metadata = {
  name: 'LiquidX',
  description: 'Earn $LQX rewards while bridging USDC from Ethereum to Stacks',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://liquidx.vercel.app',
  icons: [
    typeof window !== 'undefined' 
      ? `${window.location.origin}/logo.png` 
      : 'https://liquidx.vercel.app/logo.png'
  ]
}

const networks = [sepolia] as [typeof sepolia, ...typeof sepolia[]];

export const wagmiAdapter = new WagmiAdapter({
  ssr: false,
  projectId,
  networks,
})

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  themeMode: 'dark',
  themeVariables: {
    '--apkt-font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  features: {
    analytics: true,
  },
})

export type AppKit = typeof appKit