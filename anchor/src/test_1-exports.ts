// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, address, getBase58Decoder, SolanaClient } from 'gill'
import { SolanaClusterId } from '@wallet-ui/react'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Test1, TEST1_DISCRIMINATOR, TEST1_PROGRAM_ADDRESS, getTest1Decoder } from './client/js'
import Test1IDL from '../target/idl/test_1.json'

export type Test1Account = Account<Test1, string>

// Re-export the generated IDL and type
export { Test1IDL }

// This is a helper function to get the program ID for the Test1 program depending on the cluster.
export function getTest1ProgramId(cluster: SolanaClusterId) {
  switch (cluster) {
    case 'solana:devnet':
    case 'solana:testnet':
      // This is the program ID for the Test1 program on devnet and testnet.
      return address('6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF')
    case 'solana:mainnet':
    default:
      return TEST1_PROGRAM_ADDRESS
  }
}

export * from './client/js'

export function getTest1ProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getTest1Decoder(),
    filter: getBase58Decoder().decode(TEST1_DISCRIMINATOR),
    programAddress: TEST1_PROGRAM_ADDRESS,
  })
}
