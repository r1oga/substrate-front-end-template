// React and Semantic UI elements.
import React, { useState, useEffect } from 'react'
import { Form, Input, Grid, Checkbox } from 'semantic-ui-react'
// Pre-built Substrate front-end utilities for connecting to a node
// and making a transaction.
import { useSubstrate } from './substrate-lib'
import { TxButton } from './substrate-lib/components'
// Polkadot-JS utilities for hashing data.
import { blake2AsHex } from '@polkadot/util-crypto'

// Our main Proof Of Existence Component which is exported.
export function Main(props) {
  // Establish an API to talk to our Substrate node.
  const { api } = useSubstrate()
  // Get the selected user from the `AccountSelector` component.
  const { accountPair } = props
  // React hooks for all the state variables we track.
  // Learn more at: https://reactjs.org/docs/hooks-intro.html
  const [status, setStatus] = useState('')
  const [tested, setTested] = useState('')
  const [tester, setTester] = useState('')
  const [positive, setPositive] = useState(false)
  const [hash, setHash] = useState('')

  // React hook to update the owner and block number information for a file.
  // useEffect(() => {
  //   let unsubscribe

  //   // Polkadot-JS API query to the `proofs` storage item in our pallet.
  //   // This is a subscription, so it will always get the latest value,
  //   // even if it changes.
  //   api.query.templateModule
  //     .tests(test, result => {
  //       // Our storage item returns a tuple, which is represented as an array.
  //       setOwner(result[0].toString())
  //       setBlock(result[1].toNumber())
  //     })
  //     .then(unsub => {
  //       unsubscribe = unsub
  //     })

  //   return () => unsubscribe && unsubscribe()
  //   // This tells the React hook to update whenever the file digest changes
  //   // (when a new file is chosen), or when the storage subscription says the
  //   // value of the storage item has updated.
  // }, [hash, api.query.templateModule])

  return (
    <Grid.Column>
      <h1>Publish COVID Test</h1>
      <Form>
        <Form.Field>
          <Input
            type='text'
            id='tested'
            label='Tested'
            onChange={(_, { value }) => setTested(value)}
          />
        </Form.Field>
        <Form.Field>
          <Input
            type='text'
            id='tester'
            label='Tester'
            onChange={(_, { value }) => setTester(value)}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label='🦠 Positive'
            onChange={(_, { checked }) => setPositive(checked)}
          />
        </Form.Field>
        <Form.Field>
          <TxButton
            accountPair={accountPair}
            label={'Publish test'}
            setStatus={setStatus}
            type='SIGNED-TX'
            attrs={{
              palletRpc: 'templateModule',
              callable: 'insertTest',
              inputParams: [tested, tester, positive],
              paramFields: [true, true, true]
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  )
}

export default function TemplateModule(props) {
  const { api } = useSubstrate()
  return api.query.templateModule && api.query.templateModule.tests ? (
    <Main {...props} />
  ) : null
}
