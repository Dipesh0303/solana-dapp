import { WalletButton } from '../solana/solana-provider'
import { Test1ButtonInitialize, Test1List, Test1ProgramExplorerLink, Test1ProgramGuard } from './test_1-ui'
import { AppHero } from '../app-hero'
import { useWalletUi } from '@wallet-ui/react'

export default function Test1Feature() {
  const { account } = useWalletUi()

  return (
    <Test1ProgramGuard>
      <AppHero
        title="Test1"
        subtitle={
          account
            ? "Initialize a new test_1 onchain by clicking the button. Use the program's methods (increment, decrement, set, and close) to change the state of the account."
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <Test1ProgramExplorerLink />
        </p>
        {account ? (
          <Test1ButtonInitialize />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletButton />
          </div>
        )}
      </AppHero>
      {account ? <Test1List /> : null}
    </Test1ProgramGuard>
  )
}
