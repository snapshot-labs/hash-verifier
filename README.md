# hash-verifier

Want to verify the Snapshot data you're signing with your Gnosis Safe? Follow these 3 easy steps!

1. Clone this repository:

```sh
git clone https://github.com/snapshot-labs/hash-verifier.git
cd hash-verifier
```

2. Install:

```sh
yarn
```

3. Copy the hash from your Gnosis Safe UI (both hex and decimal formats are supported!)

<img width="654" alt="Screenshot 2024-11-05 at 14 38 22" src="https://github.com/user-attachments/assets/c867fd97-65ba-4ec5-a07a-cc61aaed5b73">


5. Verify it!

```sh
yarn verify <hash>
```

<img width="1217" alt="Screenshot 2024-11-05 at 14 40 30" src="https://github.com/user-attachments/assets/32abc44e-c51f-443e-9e55-e7606f605099">


### Example

For testing purposes, we have a transaction that we have never broadcast, this way you can try it yourself.

```sh
yarn verify 0x62abf12fcadc73d129acf8f762a806654936daca722c2ec546dcdcb2ec9c91b
```
