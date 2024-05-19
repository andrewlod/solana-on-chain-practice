import {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction
} from '@solana/web3.js';

import fs from 'mz/fs'
import path from 'path';

const SOLANA_NETWORK = 'devnet';

const PROGRAM_KEYPAIR_PATH = path.join(
  path.resolve(__dirname, '../../dist/program'),
  'hello_solana-keypair.json'
);

async function main() {
  let connection = new Connection(`http://api.${SOLANA_NETWORK}.solana.com`, 'confirmed');

  const secretKeyString = await fs.readFile(PROGRAM_KEYPAIR_PATH, { encoding: 'utf8' });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  const programKeypair = Keypair.fromSecretKey(secretKey);
  let programId = programKeypair.publicKey;

  const triggerKeypair = Keypair.generate();
  const airdropRequest = await connection.requestAirdrop(
    triggerKeypair.publicKey,
    LAMPORTS_PER_SOL
  );

  const latestBlockhash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: airdropRequest
  });

  const instruction = new TransactionInstruction({
    keys: [{
      pubkey: triggerKeypair.publicKey,
      isSigner: false,
      isWritable: true
    }],
    programId,
    data: Buffer.alloc(0)
  });
  await sendAndConfirmTransaction(
    connection, new Transaction().add(instruction),
    [triggerKeypair]
  );
}

main();