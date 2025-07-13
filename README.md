# Ventus

Ventus is used as an add-on for Airbnb's in order to prevent double bookings. This adds on an extra layer of security for booking systems by delegating a unique token recorded on the blockchain when registering or renting properties. There are multiple functions in the smart contract which connects to the wallet for each authorised transaction. This creates a more secure way to register ownership for a given property or listing. This reduces double bookings and keeps people safe from malicious intent. We designed our smart contract to be scalable to other booking services and property ownership platforms. 


## Apps

### anchor

This is a Solana program written in Rust using the Anchor framework.

#### Commands

You can use any normal anchor commands. Either move to the `anchor` directory and run the `anchor` command or prefix the command with `pnpm`, eg: `pnpm anchor`.

#### Sync the program id:

Running this command will create a new keypair in the `anchor/target/deploy` directory and save the address to the Anchor config file and update the `declare_id!` macro in the `./src/lib.rs` file of the program. This will also update the constant in the `anchor/src/counter-exports.ts` file.

```shell
pnpm run setup
```

#### Build the program:

```shell
pnpm anchor-build
```

#### Start the test validator with the program deployed:

```shell
pnpm anchor-localnet
```

#### Run the tests

```shell
pnpm anchor-test
```

#### Deploy to Devnet

```shell
pnpm anchor deploy --provider.cluster devnet
```

### web

This is a React app that uses the Anchor generated client to interact with the Solana program.

#### Commands

Start the web app

```shell
pnpm dev
```

Build the web app

```shell
pnpm build
```
