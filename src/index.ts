#!/usr/bin/env ts-node

import { poseidonHashMany } from 'micro-starknet';
import { CallData, cairo, selector } from 'starknet';
import * as fs from 'fs';
import * as path from 'path';

// Helper function to load data from data.json
function loadData() {
    const filePath = path.resolve(__dirname, '../data.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
}

// Helper function to compute vote commit
function computeVoteCommit(data: any) {
    const vote = data;

    const voteCommitPreImage = CallData.compile({
        target: data.space.address,
        selector: selector.getSelectorFromName('vote'),
        ...vote
    });

    return `0x${poseidonHashMany(voteCommitPreImage.map((v: string) => BigInt(v))).toString(16)}`;
}

// Helper function to compute proposal commit
function computeProposalCommit(data: any) {
    const proposal = {
        author: data.signer.address,
        metadataUri: ['0x1', '0x4'],
        executionStrategy: {
            address: '0x0000000000000000000000000000000000005678',
            params: ['0x0'],
        },
        userProposalValidationParams: [
            '0xffffffffffffffffffffffffffffffffffffffffff',
            '0x1234',
            '0x5678',
            '0x9abc',
        ]
    };

    const proposeCommitPreImage = CallData.compile({
        target: data.space.address,
        selector: selector.getSelectorFromName('propose'),
        ...proposal
    });

    return `0x${poseidonHashMany(proposeCommitPreImage.map((v: string) => BigInt(v))).toString(16)}`;
}

// Helper function to compute update proposal commit
function computeUpdateProposalCommit(data: any) {
    const updateProposal = {
        author: data.signer.address,
        proposalId: cairo.uint256('0x1'),
        executionStrategy: {
            address: '0x0000000000000000000000000000000000005678',
            params: ['0x0'],
        },
        metadataUri: ['0x1', '0x5']
    };

    const updateCommitPreImage = CallData.compile({
        target: data.space.address,
        selector: selector.getSelectorFromName('update_proposal'),
        ...updateProposal
    });

    return `0x${poseidonHashMany(updateCommitPreImage.map((v: string) => BigInt(v))).toString(16)}`;
}

// Main function
function verify(type: string, expectedHash: string) {
    const data = loadData();
    let computedHash = '';

    if (type === 'vote') {
        computedHash = computeVoteCommit(data);
    } else if (type === 'proposal') {
        computedHash = computeProposalCommit(data);
    } else if (type === 'updateProposal') {
        computedHash = computeUpdateProposalCommit(data);
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

if (args.length < 2) {
    console.error('Error: Missing arguments. Usage: yarn verify [vote | proposal | updateProposal] expectedHash');
    process.exit(1);
}

const [type, expectedHash] = args;

if (!expectedHash) {
    console.error('Error: expectedHash is required.');
    process.exit(1);
}

verify(type!, expectedHash);