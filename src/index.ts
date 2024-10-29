#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { clients } from '@snapshot-labs/sx';
import { RpcProvider } from 'starknet';
import { starknetSepolia } from '@snapshot-labs/sx';
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

// Required because Error in typescript doesn't have a code property by default
function isNodeJsError(err: unknown): err is NodeJS.ErrnoException {
    return err instanceof Error && 'code' in err;
}

// Helper function to load data from data.json
function loadJson() {
    const filePath = path.resolve(__dirname, '../data.json');
    
    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(rawData);
    } catch (err) {
        if (isNodeJsError(err)) {
        if (err.code === 'ENOENT') {
            console.error(`Error: File not found at ${filePath}. Please ensure data.json exists.`);
        } else {
            console.error(`Error reading file: ${err.message}`);
        }
    } else {
        console.error("An unexpected error occurred.");
    }
        process.exit(1);
    }
}

async function verify(expectedHash: string) {
    const json = loadJson().result;
    let computedHash;
    const type = json.type.toLowerCase();

    if (type === 'vote') {
        computedHash = await ethTxClient.getVoteHash(json.sender, json.data);
    } else if (type === 'proposal') {
        computedHash = await ethTxClient.getProposeHash(json.sender, json.data);
    } else if (type === 'updateproposal') {
        computedHash = await ethTxClient.getUpdateProposalHash(json.sender, json.data);
    } else {
        console.error('Invalid type specified. Use "vote", "proposal", or "updateProposal".');
        process.exit(1);
    }

    if (computedHash === expectedHash) {
        console.log(`✅ ${type} hash verified successfully.`);
    } else {
        console.log(`❌ Verification failed. Expected ${expectedHash}, but got ${computedHash}.`);
    }
}

// Parse CLI arguments
const args = process.argv.slice(2);

if (args.length < 1) {
    console.error('Error: Missing arguments. Usage: yarn verify <expectedHash>');
    process.exit(1);
}

const expectedHash = args[0];

verify(expectedHash!);