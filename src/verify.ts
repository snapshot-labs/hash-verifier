import { clients } from '@snapshot-labs/sx';
import { RpcProvider } from 'starknet';
import { starknetSepolia } from '@snapshot-labs/sx';
import fs from 'fs';
import axios from 'axios';
const { EthereumTx } = clients;


// These values doesn't matter for this script, but it's required to instantiate the EthereumTx client
const starkProvider = new RpcProvider({
    nodeUrl: 'http://127.0.0.1:5050/rpc'
  });
const ethUrl = 'http://127.0.0.1:8545';

let ethTxClient = new EthereumTx({
    starkProvider: starkProvider as any,
    ethUrl,
    networkConfig: starknetSepolia,
});

async function fetchData(url: string, hash: string): Promise<any> {
    try {
        const response = await axios.post(
            url,
            {
                id: 1,
                method: 'getDataByMessageHash',
                params: {
                    hash: hash,
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        // Return the JSON data from the response
        return response.data.result;
    } catch (error) {
        console.error('Error fetching data');
    }
}

export async function verify(expectedHash: string, url: string) {
    let json = await fetchData(url, expectedHash);
    if (json == null) {
        console.error(`\nNo data found for hash \`${expectedHash}\`\n.`);
        process.exit(1);
    }
    json = {sender: '0x9988529d1c3EdF65dE72ad4d3EC4345e130038E7', ...json}
    let computedHash;
    const type = json.type.toLowerCase();

    console.log(`Type: \`${json.type}\``);
    console.log(`Sender: \`${json.sender}\``);
    console.dir(json.data, {depth: null});
    if (type === 'vote') {
        console.log("Authenticating vote...");
        console.log("Sender: ", json.sender);
        computedHash = await ethTxClient.getVoteHash(json.sender, json.data);
    } else if (type === 'propose') {
        computedHash = await ethTxClient.getProposeHash(json.sender, json.data);
    } else if (type === 'updateproposal') {
        computedHash = await ethTxClient.getUpdateProposalHash(json.sender, json.data);
    } else {
        console.error('Invalid type specified. Use "vote", "proposal", or "updateProposal".');
        process.exit(1);
    }

    if (computedHash === expectedHash) {
        console.log(`\n✅ ${type} hash verified successfully.\n`);
    } else {
        console.log(`❌ Verification failed. Expected ${expectedHash}, but got ${computedHash}.`);
    }
}