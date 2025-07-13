'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { useState } from 'react';

// IMPORTANT: Make sure the path to your IDL file is correct.
// If you created it in the root directory, this path should be correct.
import idl from '../../title_dapp_idl.json';

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
export default function TitleDappPage() {
  const { connection } = useConnection();
  const wallet = useWallet();

  // State variables to hold user input
  const [propertyAddress, setPropertyAddress] = useState('');
  const [tenantAddress, setTenantAddress] = useState('');
  const [propertyToDelegate, setPropertyToDelegate] = useState('');

  // 1. PASTE YOUR NEW PROGRAM ID FROM PLAYGROUND HERE
  const programId = new web3.PublicKey('9EPgwkBx2D9HS1XXJ3ydANnpewDGVsig9BpNLtb3w4Si');

  // 2. Function to create the program object for interacting with your on-chain program
  //    *** THIS FUNCTION HAS BEEN UPDATED TO FIX THE ERROR ***
  const getProgram = () => {
    // The provider is the connection to the blockchain, signed by the user's wallet.
    // We only create it if the wallet is connected.
    if (!wallet.publicKey || !wallet.signTransaction) {
        return null;
    }
    const provider = new AnchorProvider(
        connection, 
        wallet as any, // The wallet adapter provides the signing functions.
        { preflightCommitment: 'processed' }
    );
    // The program object is the main way we interact with our on-chain program.
    const program = new Program(idl as any, programId, provider);
    return program;
  };

  const program = getProgram();

  // --- Handler Functions to Call Your On-Chain Instructions ---

  const handleRegisterProperty = async () => {
    if (!program || !wallet.publicKey) {
      alert('Please connect your wallet!');
      return;
    }
    if (!propertyAddress) {
      alert('Please enter a property address!');
      return;
    }

    try {
      const newPropertyAccount = web3.Keypair.generate();
      console.log('Creating new property account:', newPropertyAccount.publicKey.toBase58());

      await program.methods
        .registerProperty(propertyAddress)
        .accounts({
          property: newPropertyAccount.publicKey,
          owner: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([newPropertyAccount])
        .rpc();

      alert('Property registered successfully! You can find the new property account address in the browser console (F12).');
      console.log('New Property Account Address:', newPropertyAccount.publicKey.toBase58());
      setPropertyAddress('');
    } catch (error) {
      console.error('Error registering property:', error);
      alert('Failed to register property. Check the console for details.');
    }
  };

  const handleDelegateTitle = async () => {
    if (!program || !wallet.publicKey) {
      alert('Please connect your wallet!');
      return;
    }
    if (!tenantAddress || !propertyToDelegate) {
        alert('Please enter both the property and tenant addresses!');
        return;
    }

    try {
        const tenantPubkey = new web3.PublicKey(tenantAddress);
        const propertyPubkey = new web3.PublicKey(propertyToDelegate);
        const newRentalTitleAccount = web3.Keypair.generate();

        const startDate = new BN(Math.floor(Date.now() / 1000));
        const endDate = new BN(startDate.toNumber() + 365 * 24 * 60 * 60);

        console.log('Delegating title for property:', propertyPubkey.toBase58());
        console.log('To tenant:', tenantPubkey.toBase58());

        await program.methods
            .delegateRentalTitle(tenantPubkey, startDate, endDate)
            .accounts({
                property: propertyPubkey,
                rentalTitle: newRentalTitleAccount.publicKey,
                owner: wallet.publicKey,
                systemProgram: web3.SystemProgram.programId,
            })
            .signers([newRentalTitleAccount])
            .rpc();

        alert('Rental title delegated successfully!');
        setTenantAddress('');
        setPropertyToDelegate('');
    } catch (error) {
        console.error('Error delegating title:', error);
        alert('Failed to delegate title. Check the console for details.');
    }
  };


  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center">Right of Title dApp</h1>
        
        {!wallet.publicKey ? (
          <p className="text-center text-gray-400">Please connect your wallet to use the dApp.</p>
        ) : (
          <div className="space-y-6">
            <div className="p-6 space-y-4 bg-gray-700 rounded-md">
              <h2 className="text-2xl font-semibold">1. Register a Property</h2>
              <p className="text-sm text-gray-300">
                Create an on-chain record for a property you own.
              </p>
              <div className="flex flex-col space-y-2">
                <label htmlFor="propertyAddress" className="font-medium">Property Address:</label>
                <Input
                  id="propertyAddress"
                  type="text"
                  placeholder="e.g., 123 Blockchain Lane, London"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                />
              </div>
              <Button onClick={handleRegisterProperty}>Register Property</Button>
            </div>

            <div className="p-6 space-y-4 bg-gray-700 rounded-md">
              <h2 className="text-2xl font-semibold">2. Delegate a Rental Title</h2>
              <p className="text-sm text-gray-300">
                Grant a tenant the right to rent your property.
              </p>
              <div className="flex flex-col space-y-2">
                <label htmlFor="propertyToDelegate" className="font-medium">Property Account Address:</label>
                 <Input
                  id="propertyToDelegate"
                  type="text"
                  placeholder="Enter the on-chain address of the property"
                  value={propertyToDelegate}
                  onChange={(e) => setPropertyToDelegate(e.target.value)}
                />
                <label htmlFor="tenantAddress" className="font-medium">Tenant's Wallet Address:</label>
                <Input
                  id="tenantAddress"
                  type="text"
                  placeholder="Enter the tenant's Solana wallet address"
                  value={tenantAddress}
                  onChange={(e) => setTenantAddress(e.target.value)}
                />
              </div>
              <Button onClick={handleDelegateTitle}>Delegate Title</Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
