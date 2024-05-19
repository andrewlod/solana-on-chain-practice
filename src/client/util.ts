import { AccountInfo, Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';
import { fs } from 'mz';
import path from 'path';
import os from 'os';
import yaml from 'yaml';

const CONFIG_FILE_PATH = path.resolve(
  os.homedir(),
  '.config',
  'solana',
  'cli',
  'config.yml'
);

const PROGRAM_PATH = path.resolve(__dirname, '../../dist/program');

export async function createKeypairFromFile(filePath: string): Promise<Keypair> {
  const secretKeyString = await fs.readFile(filePath, { encoding: 'utf8' });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return Keypair.fromSecretKey(secretKey);
}

export async function airdropAccount(connection: Connection, publicKey: PublicKey, lamports: number): Promise<void> {
  const airdropRequest = await connection.requestAirdrop(
    publicKey,
    lamports
  );

  const latestBlockhash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: airdropRequest
  });
}

export async function getLocalAccount(): Promise<Keypair> {
  const configYml = await fs.readFile(CONFIG_FILE_PATH, { encoding: 'utf8' });
  const keypairPath: string = await yaml.parse(configYml).keypair_path;
  return await createKeypairFromFile(keypairPath);
}

export async function getProgram(programName: string): Promise<Keypair> {
  return await createKeypairFromFile(
    path.join(PROGRAM_PATH, `${programName}-keypair.json`)
  );
}

export async function createAccountWithSeed(
  connection: Connection,
  keypair: Keypair,
  seed: string,
  programId: PublicKey,
  accountSpaceBytes: number,
  lamports: number
): Promise<PublicKey> {
  let clientPubKey = await PublicKey.createWithSeed(
    keypair.publicKey,
    seed,
    programId
  );

  const clientAccount = await connection.getAccountInfo(clientPubKey);

  if (clientAccount !== null) {
    return clientPubKey;
  }

  const transaction = new Transaction().add(
    SystemProgram.createAccountWithSeed({
      fromPubkey: keypair.publicKey,
      basePubkey: keypair.publicKey,
      seed,
      lamports,
      newAccountPubkey: clientPubKey,
      space: accountSpaceBytes,
      programId
    })
  );
  await sendAndConfirmTransaction(connection, transaction, [keypair]);

  return clientPubKey;
}

export async function pingProgram(
  connection: Connection,
  programId: PublicKey,
  clientPubKey: PublicKey,
  localKeypair: Keypair
) {
  const instruction = new TransactionInstruction({
    keys: [{
      pubkey: clientPubKey,
      isSigner: false,
      isWritable: true
    }],
    programId,
    data: Buffer.alloc(0)
  });

  await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [localKeypair]
  );
}