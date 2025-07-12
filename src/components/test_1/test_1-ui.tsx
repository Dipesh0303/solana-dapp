import { ellipsify } from '@wallet-ui/react'
import {
  useTest1AccountsQuery,
  useTest1CloseMutation,
  useTest1DecrementMutation,
  useTest1IncrementMutation,
  useTest1InitializeMutation,
  useTest1Program,
  useTest1ProgramId,
  useTest1SetMutation,
} from './test_1-data-access'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExplorerLink } from '../cluster/cluster-ui'
import { Test1Account } from '@project/anchor'
import { ReactNode } from 'react'

export function Test1ProgramExplorerLink() {
  const programId = useTest1ProgramId()

  return <ExplorerLink address={programId.toString()} label={ellipsify(programId.toString())} />
}

export function Test1List() {
  const test_1AccountsQuery = useTest1AccountsQuery()

  if (test_1AccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!test_1AccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {test_1AccountsQuery.data?.map((test_1) => (
        <Test1Card key={test_1.address} test_1={test_1} />
      ))}
    </div>
  )
}

export function Test1ProgramGuard({ children }: { children: ReactNode }) {
  const programAccountQuery = useTest1Program()

  if (programAccountQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!programAccountQuery.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }

  return children
}

function Test1Card({ test_1 }: { test_1: Test1Account }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test1: {test_1.data.count}</CardTitle>
        <CardDescription>
          Account: <ExplorerLink address={test_1.address} label={ellipsify(test_1.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <Test1ButtonIncrement test_1={test_1} />
          <Test1ButtonSet test_1={test_1} />
          <Test1ButtonDecrement test_1={test_1} />
          <Test1ButtonClose test_1={test_1} />
        </div>
      </CardContent>
    </Card>
  )
}

export function Test1ButtonInitialize() {
  const mutationInitialize = useTest1InitializeMutation()

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Test1 {mutationInitialize.isPending && '...'}
    </Button>
  )
}

export function Test1ButtonIncrement({ test_1 }: { test_1: Test1Account }) {
  const incrementMutation = useTest1IncrementMutation({ test_1 })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}

export function Test1ButtonSet({ test_1 }: { test_1: Test1Account }) {
  const setMutation = useTest1SetMutation({ test_1 })

  return (
    <Button
      variant="outline"
      onClick={() => {
        const value = window.prompt('Set value to:', test_1.data.count.toString() ?? '0')
        if (!value || parseInt(value) === test_1.data.count || isNaN(parseInt(value))) {
          return
        }
        return setMutation.mutateAsync(parseInt(value))
      }}
      disabled={setMutation.isPending}
    >
      Set
    </Button>
  )
}

export function Test1ButtonDecrement({ test_1 }: { test_1: Test1Account }) {
  const decrementMutation = useTest1DecrementMutation({ test_1 })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}

export function Test1ButtonClose({ test_1 }: { test_1: Test1Account }) {
  const closeMutation = useTest1CloseMutation({ test_1 })

  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (!window.confirm('Are you sure you want to close this account?')) {
          return
        }
        return closeMutation.mutateAsync()
      }}
      disabled={closeMutation.isPending}
    >
      Close
    </Button>
  )
}
