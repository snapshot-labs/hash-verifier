import { clients, starknetMainnet, starknetSepolia } from '@snapshot-labs/sx';
import axios from 'axios';
import { RpcProvider } from 'starknet';
const { EthereumTx } = clients;

const starkProviderMainnet = new RpcProvider({
  nodeUrl: 'https://starknet-mainnet.infura.io/v3/e881110087914af69a1ca2c49aa56d14'
});
const ethUrlMainnet = 'https://mainnet.infura.io/v3/e881110087914af69a1ca2c49aa56d14';

const starknetProviderSepolia = new RpcProvider({
  nodeUrl: 'https://starknet-sepolia.infura.io/v3/e881110087914af69a1ca2c49aa56d14'
});
const ethUrlSepolia = 'https://sepolia.infura.io/v3/e881110087914af69a1ca2c49aa56d14';

async function fetchData(url: string, hash: string): Promise<any> {
  try {
    const response = await axios.post(
      url,
      {
        id: 1,
        method: 'getDataByMessageHash',
        params: {
          hash: hash
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Return the JSON data from the response
    return response.data.result;
  } catch (error) {
    console.error('Error fetching data');
  }
}

export async function verify(expectedHash: string, url: string, network: string) {
  const networkConfig = network === 'mainnet' ? starknetMainnet : starknetSepolia;
  const ethurl = network === 'mainnet' ? ethUrlMainnet : ethUrlSepolia;
  const starkProvider = network === 'mainnet' ? starkProviderMainnet : starknetProviderSepolia;

  const ethTxClient = new EthereumTx({
    starkProvider: starkProvider,
    ethUrl: ethurl,
    networkConfig: networkConfig
  });

  const json = await fetchData(url, expectedHash);
  if (json == null) {
    console.error(`\nNo data found for hash \`${expectedHash}\`\n.`);
    process.exit(1);
  }
  let computedHash;
  const type = json.type.toLowerCase();

  console.log(`Type: \`${json.type}\``);
  console.log(`Sender: \`${json.sender}\``);
  console.dir(json.data, { depth: null });
  if (type === 'vote') {
    console.log('Authenticating vote...');
    console.log('Sender: ', json.sender);
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
