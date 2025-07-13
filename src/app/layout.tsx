// src/app/layout.tsx
import './globals.css';
import React from 'react';
import WalletStyles from '@/components/WalletStyles'; // 👈 loads wallet adapter styles on client only

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletStyles /> {/* ✅ Load wallet CSS safely */}
        {children}
      </body>
    </html>
  );
}
