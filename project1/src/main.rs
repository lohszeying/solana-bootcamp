// Put this code at https://beta.solpg.io/

use anchor_lang::prelude::*;

declare_id!("");
pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod favourites {
    use super::*;

    // This is now a solana instruction handler
    pub fn set_favourites(context: Context<SetFavourites>, number: u64, colour: String, hobbies: Vec<String>) -> Result<()> {
        msg!("Greetings from {}", context.program_id);
        let user_public_key = context.accounts.user.key();

        msg!("User {user_public_key}'s favourite number is {number}, favourite colour is {colour}, and their hobbies are {hobbies:?}");

        context.accounts.favourites.set_inner(Favourites {
            number,
            colour,
            hobbies,
        });

        Ok(())
    }
}

// account macro
// Total space used by all the items inside
#[account]
#[derive(InitSpace)]
pub struct Favourites {
    pub number: u64,

    #[max_len(50)]
    pub colour: String,

    #[max_len(5, 50)]
    pub hobbies: Vec<String>,
}

// These items will live for the lifetime of a Solana account info object
#[derive(Accounts)]
pub struct SetFavourites<'info> {
    // Set options for this account, the signer is mutable
    #[account(mut)]
    pub user: Signer<'info>,

    // The user is the person who signs the transaction
    #[account(
        init_if_needed,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + Favourites::INIT_SPACE,
        seeds = [b"favourites", user.key().as_ref()],
        bump,
    )]
    pub favourites: Account<'info, Favourites>,

    pub system_program: Program<'info, System>,
}
