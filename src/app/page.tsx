'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { useState } from 'react';
import idl from '../../title_dapp_idl.json'; // Adjust the path if needed

// --- UI Components ---
const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 disabled:bg-gray-400"
  />
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="px-3 py-2 text-black bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

// --- Main dApp Component ---
export default function YourComponent() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [propertyAddress, setPropertyAddress] = useState('');

  // 🔁 Replace this with your real program ID
  const programId = new web3.PublicKey('9EPgwkBx2D9HS1XXJ3ydANnpewDGVsig9BpNLtb3w4Si');

  const getProgram = () => {
    if (!wallet.publicKey) return null;

    const provider = new AnchorProvider(
      connection,
      wallet as any,
      { preflightCommitment: 'processed' }
    );

    return new Program(idl as any, programId, provider);
  };

  const program = getProgram();

  const handleRegisterProperty = async () => {
    if (!program) {
      console.error("Program not initialized. Is your wallet connected?");
      return;
    }

    try {
      const newPropertyAccount = web3.Keypair.generate();

      await program.methods
        .registerProperty(propertyAddress)
        .accounts({
          property: newPropertyAccount.publicKey,
          owner: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([newPropertyAccount])
        .rpc();

      console.log("Property registered successfully!");
      alert(`Property registered! Account: ${newPropertyAccount.publicKey.toBase58()}`);
    } catch (error) {
      console.error("Error registering property:", error);
      alert("Failed to register property. See console for details.");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Register New Property</h1>
      <Input
        type="text"
        value={propertyAddress}
        onChange={(e) => setPropertyAddress(e.target.value)}
        placeholder="Enter property address"
      />
      <Button onClick={handleRegisterProperty} disabled={!wallet.publicKey}>
        Register a New Property
      </Button>
    </div>
  );
}