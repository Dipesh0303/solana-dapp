import {
  Test1Account,
  getCloseInstruction,
  getTest1ProgramAccounts,
  getTest1ProgramId,
  getDecrementInstruction,
  getIncrementInstruction,
  getInitializeInstruction,
  getSetInstruction,
} from '@project/anchor'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { generateKeyPairSigner } from 'gill'
import { useWalletUi } from '@wallet-ui/react'
import { useWalletTransactionSignAndSend } from '../solana/use-wallet-transaction-sign-and-send'
import { useClusterVersion } from '@/components/cluster/use-cluster-version'
import { toastTx } from '@/components/toast-tx'
import { useWalletUiSigner } from '@/components/solana/use-wallet-ui-signer'
import { install as installEd25519 } from '@solana/webcrypto-ed25519-polyfill'

// polyfill ed25519 for browsers (to allow `generateKeyPairSigner` to work)
installEd25519()

export function useTest1ProgramId() {
  const { cluster } = useWalletUi()
  return useMemo(() => getTest1ProgramId(cluster.id), [cluster])
}

export function useTest1Program() {
  const { client, cluster } = useWalletUi()
  const programId = useTest1ProgramId()
  const query = useClusterVersion()

  return useQuery({
    retry: false,
    queryKey: ['get-program-account', { cluster, clusterVersion: query.data }],
    queryFn: () => client.rpc.getAccountInfo(programId).send(),
  })
}

export function useTest1InitializeMutation() {
  const { cluster } = useWalletUi()
  const queryClient = useQueryClient()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => {
      const test_1 = await generateKeyPairSigner()
      return await signAndSend(getInitializeInstruction({ payer: signer, test_1 }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await queryClient.invalidateQueries({ queryKey: ['test_1', 'accounts', { cluster }] })
    },
    onError: () => toast.error('Failed to run program'),
  })
}

export function useTest1DecrementMutation({ test_1 }: { test_1: Test1Account }) {
  const invalidateAccounts = useTest1AccountsInvalidate()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => await signAndSend(getDecrementInstruction({ test_1: test_1.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useTest1IncrementMutation({ test_1 }: { test_1: Test1Account }) {
  const invalidateAccounts = useTest1AccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async () => await signAndSend(getIncrementInstruction({ test_1: test_1.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useTest1SetMutation({ test_1 }: { test_1: Test1Account }) {
  const invalidateAccounts = useTest1AccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async (value: number) =>
      await signAndSend(
        getSetInstruction({
          test_1: test_1.address,
          value,
        }),
        signer,
      ),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useTest1CloseMutation({ test_1 }: { test_1: Test1Account }) {
  const invalidateAccounts = useTest1AccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(getCloseInstruction({ payer: signer, test_1: test_1.address }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useTest1AccountsQuery() {
  const { client } = useWalletUi()

  return useQuery({
    queryKey: useTest1AccountsQueryKey(),
    queryFn: async () => await getTest1ProgramAccounts(client.rpc),
  })
}

function useTest1AccountsInvalidate() {
  const queryClient = useQueryClient()
  const queryKey = useTest1AccountsQueryKey()

  return () => queryClient.invalidateQueries({ queryKey })
}

function useTest1AccountsQueryKey() {
  const { cluster } = useWalletUi()

  return ['test_1', 'accounts', { cluster }]
}
