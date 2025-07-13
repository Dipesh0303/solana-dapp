'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { ReactNode, useMemo } from 'react';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

export function AppProviders({ children }: { children: ReactNode }) {
  // *** THIS IS THE KEY CHANGE ***
  // We explicitly set the network to 'devnet'.
  const network = WalletAdapterNetwork.Devnet;

  // This line now uses our 'network' variable to get the correct public RPC URL for the Devnet.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // You can add specific wallets you want to support here.
  // An empty array means all default wallets will be supported.
  const wallets = useMemo(() => [], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}