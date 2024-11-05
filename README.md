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

<img width="697" alt="Screenshot 2024-11-05 at 13 26 27" src="https://github.com/user-attachments/assets/867fa9b6-47cb-4e10-b982-4a53e9533c0e">


5. Verify it!

```sh
yarn verify <hash>
```

![Screenshot 2024-11-05 at 13 28 16](https://github.com/user-attachments/assets/e244a62f-df85-46f5-9a73-54ff777aeae5)


### Example

For testing purposes, we have a transaction that we have never broadcast, this way you can try it yourself.

```sh
yarn verify 1444898574163502210266027213349187100527371546664615897979409831152649883708
```
