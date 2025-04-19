#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

// public key: program id when anchor build
declare_id!("8fLP5YQ5Khu9h3YU2qPo6thL9V4UUGDmcp4qfiSHEuNd");

// Inside the program macro is where all the instructions are going to live.
// This is where I write CRUD app instructions
// Everytime I write a smart contract, start with the program state
#[program]
pub mod crudapp {
    use super::*;

    // need instruction to initialise a journal entry account
    pub fn create_journal_entry(ctx: Context<CreateEntry>, title: String, message: String) -> Result<()> {
        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.owner = *ctx.accounts.owner.key;
        journal_entry.title = title;
        journal_entry.message = message;
        Ok(())
    }

    pub fn update_journal_entry(ctx: Context<UpdateEntry>, _title: String, message: String) -> Result<()> {
        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.message = message;
        Ok(())
    }

    pub fn delete_journal_entry(_ctx: Context<DeleteEntry>, _title: String) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String)] // pulling the title from instruction
pub struct CreateEntry<'info> {
    // When defining context data structure, need to define all the accounts that are going to be passed through the given instructions u are writing
    #[account(
        init,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        space = 8 + JournalEntryState::INIT_SPACE,
        payer = owner,
    )]
    pub journal_entry: Account<'info, JournalEntryState>,

    // owner is paying to create entry, they are gonna change state of owner's account, so have to make account to be mutable
    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct UpdateEntry<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        realloc = 8 + JournalEntryState::INIT_SPACE,
        realloc::payer = owner,
        realloc::zero = true,
    )]
    pub journal_entry: Account<'info, JournalEntryState>,

    // we specify the owner, but need to pass that account through as well
    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteEntry<'info> {
    // adds close constrain. But close the acc if public key == signer of instruction
    // person who can close this can only be owner of the account
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        close = owner,
    )]
    pub journal_entry: Account<'info, JournalEntryState>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// State is where I hold data
// smart contracts in solana are stateless. so all the states are stored inside program account (with account macro)
#[account]
#[derive(InitSpace)] // calculate how much space it is on the chain
pub struct JournalEntryState {
    pub owner: Pubkey,
    // set max len for each string value (or else they can be infinitely long)
    #[max_len(50)]
    pub title: String,
    #[max_len(50)]
    pub message: String,
}