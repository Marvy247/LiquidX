import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { sepolia } from '@reown/appkit/networks'

// Get projectId from env
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('VITE_WALLETCONNECT_PROJECT_ID is not set in environment variables')
}

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