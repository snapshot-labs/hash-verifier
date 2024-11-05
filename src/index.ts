#!/usr/bin/env ts-node

import yargs, { Options } from 'yargs';
import { hideBin } from 'yargs/helpers';
import {verify} from './verify';

// Define the shape of the arguments
interface Arguments extends yargs.ArgumentsCamelCase<yargs.InferredOptionTypes<typeof commandBuilder>> {}

// Define the command builder object
const commandBuilder: { [key: string]: Options } = {
    hash: {
      describe: 'The hash to verify',
      type: 'string',
      demandOption: true,
    },
    network: {
      alias: 'n',
      describe: 'The network to use',
      choices: ['mainnet', 'sepolia'],
      default: 'mainnet',
      type: 'string',
      demandOption: false,
    },
    'mana-url': {
      alias: 'u',
      describe: 'The URL of the mana instance',
      type: 'string',
      default: 'https://mana.box/',
      demandOption: false,
    },
  };
  
  // Define the command handler function
  const commandHandler = (argv: Arguments) => {
    const chainId = argv.network === 'mainnet' ? '0x534e5f4d41494e' : '0x534e5f5345504f4c4941';

    let manaUrl: string = argv.manaUrl as string;
    if (!manaUrl.endsWith('/')) {
        manaUrl += '/';
    }
    manaUrl += 'stark_rpc/' + chainId;

    const hash = validateHash(argv.hash as string);

    console.log(`Verifying hash: \`${hash}\` with network \`${argv.network}\` and mana URL \`${manaUrl}\``);

    verify(hash as string, manaUrl);
  };

  // Converts decimal representation to hex representation, if necessary
  function validateHash(hash: string): string {
    if (hash.startsWith('0x')) {
      return hash;
    } else {
        console.log('You passed in a decimal hash. Converting to hex...');
        return '0x' + BigInt(hash).toString(16);
    }
  }
  
  yargs(hideBin(process.argv))
    .command('verify <hash>', 'Verify the hash of a `vote`, a `propose` or an `update_proposal` action', commandBuilder, commandHandler)
    .strict()
    .help()
    .argv;