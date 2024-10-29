# hash-verifier

Verify the message hash you are signing!

## Getting the hash

Query the `mana` transaction relayer with the method `getDataByMessageHash` and store it in the `data.json` file.
As parameter, pass in the `hash` you wish to verify.

example:

```sh
curl -X POST http://localhost:3001/stark_rpc/0x534e5f5345504f4c4941 \
-H "Content-Type: application/json" \
-d '{
  "id": 1,
  "method": "getDataByMessageHash",
  "params": {
    "hash": "0x0776f504b334b9c2e45993b3439f16ed5ce035343887d2d802251639793a8936"
  }
} > data.json'
```

Run `yarn verify <hash>`. The result will be printed on your screen!
