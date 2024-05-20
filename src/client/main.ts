import {
  Connection,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

import { getLocalAccount, getProgram, createAccountWithSeed, pingProgram } from './util';
import dotenv from 'dotenv';
import { HELLO_COUNTER_SIZE } from './structs/HelloCounter';
import { ExpressionCalculator, Operation } from './structs/ExpressionCalculator';
dotenv.config();

const {
  SOLANA_NETWORK,
  PROGRAM_SEED
} = process.env;


async function main() {
  if (PROGRAM_SEED === undefined) {
    throw new Error('PROGRAM_SEED is not defined');
  }

  let connection = new Connection(`http://api.${SOLANA_NETWORK}.solana.com`, 'confirmed');

  const localAccount = await getLocalAccount();
  console.log(`Local account public key: ${localAccount.publicKey}`);
  const program = await getProgram('hello_solana');
  console.log(`Program public key: ${program.publicKey}`);
  let clientPubKey = await createAccountWithSeed(connection, localAccount, PROGRAM_SEED, program.publicKey, HELLO_COUNTER_SIZE, LAMPORTS_PER_SOL);
  console.log(`Client public key: ${clientPubKey}`);
  await pingProgram(connection, program.publicKey, clientPubKey, localAccount, ExpressionCalculator.create(3.45, 123.45, Operation.Multiply));
}

main();