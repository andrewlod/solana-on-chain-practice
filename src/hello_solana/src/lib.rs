use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
  account_info::{next_account_info, AccountInfo},
  entrypoint,
  entrypoint::ProgramResult,
  msg,
  pubkey::Pubkey,
  program_error::ProgramError
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
struct HelloCounter {
  pub counter: u64
}

entrypoint!(process_instruction);

fn process_instruction(
  program_id: &Pubkey,
  accounts: &[AccountInfo],
  instruction_data: &[u8],
) -> ProgramResult {
  // Iterating accounts is safer than indexing
  let accounts_iter = &mut accounts.iter();

  // Get the account to say hello to
  let account = next_account_info(accounts_iter)?;

  // The account must be owned by the program in order to modify its data
  if account.owner != program_id {
      msg!("Greeted account does not have the correct program id");
      return Err(ProgramError::IncorrectProgramId);
  }

  // Deserialize data from the account, modify the struct and serialize it back into the account
  let mut hello_counter = HelloCounter::try_from_slice(&account.data.borrow())?;
  hello_counter.counter += 1;
  hello_counter.serialize(&mut &mut account.data.borrow_mut()[..])?;

  msg!("This program has been executed {} time(s)", &hello_counter.counter);
  
  Ok(())
}