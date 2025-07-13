'use client';

import './globals.css';
import { ReactNode, useMemo } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

export default function RootLayout({ children }: { children: ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // The wallets array can be used to specify which wallets you want to support.
  // An empty array means all default wallets will be supported.
  const wallets = useMemo(() => [], [network]);

  return (
    <html lang="en">
      <body>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              {/* This is a simple layout structure.
                The header contains the title and the wallet connect button.
                The main content of each page will be rendered where {children} is.
              */}
              <div className="flex flex-col min-h-screen">
                <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Right of Title dApp</h1>
                  <WalletMultiButton />
                </header>
                <main className="flex-grow">
                  {children}
                </main>
              </div>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
}