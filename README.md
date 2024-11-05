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

4. Verify it!

```sh
yarn verify <hash>
```

### Example

For testing purposes, we have a transaction that we have never broadcast, this way you can try it yourself.
`yarn verify 1444898574163502210266027213349187100527371546664615897979409831152649883708`
