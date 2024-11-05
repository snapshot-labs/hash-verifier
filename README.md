# hash-verifier

## Context

The [Ethereum Transaction Authenticator](https://github.com/snapshot-labs/sx-starknet/blob/develop/starknet/src/authenticators/eth_tx.cairo) allows users to perform actions with their Ethereum account (Gnosis Safe...).

Actions can be creating a new proposal (`propose`), updating a proposal (`updateProposal`) or voting on a proposal (`vote`).

The flow for the user is quite simple: they `commit` their action to the Starknet Commit Contract. This contract then bridges the data to Starknet, and the commit is stored on Starknet. Once stored, our transaction relayer, [Mana](https://github.com/snapshot-labs/sx-monorepo/tree/master/apps/mana), triggers the action on Starknet, without the user having to interact with Starknet at all.

The piece of data that the user commits to is a `hash`, not the full data. This means that, in the UI, the user does not see what data he is signing, he only sees a hash of it. To avoid malicious users taking advantage of this, we've created this repository to allow users to easily check the data they're signing.

By using this tool, you can see **what** you are signing, and **independently** ensure that you are committing the correct data.

## How to?

1. Clone this repository:

```sh
git clone https://github.com/snapshot-labs/hash-verifier.git
cd hash-verifier
```

2. Install:

```sh
yarn
```

3. Copy the hash from your Gnosis Safe UI (both hex and decimal formats are supported)

<img width="654" alt="Screenshot 2024-11-05 at 14 38 22" src="https://github.com/user-attachments/assets/c867fd97-65ba-4ec5-a07a-cc61aaed5b73">


5. Verify it

```sh
yarn verify <hash>
```

<img width="1217" alt="Screenshot 2024-11-05 at 14 40 30" src="https://github.com/user-attachments/assets/32abc44e-c51f-443e-9e55-e7606f605099">


## Example

For testing purposes, we have a transaction that we have never broadcast, this way you can try it yourself.

```sh
yarn verify 0x62abf12fcadc73d129acf8f762a806654936daca722c2ec546dcdcb2ec9c91b
```

## What's going on under the hood?

What this simple script does is fairly simple:
1. First we use the code in `./src/index.ts` to parse the command and transform the hash to its hexadecimal format.
2. In `./src/verify.ts` we then query `https://mana.box` to get the information related to the hash that was given as input.
3. Next we display the information on your screen.
4. Finally, we hash all this information and checks that it corresponds to the hash given as input. If it does, we display a little check mark.