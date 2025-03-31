use anchor_lang::prelude::*;

declare_id!("");

pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod favourites {
    use super::*;

    // This is now a solana instruction handler
    pub fn set_favourites() -> Return<()> {
        // Fill in later
    }
}

// account macro
#[account]
// Total space used by all the items inside
#[derive(InitSpace)]
pub struct Favourites {
    pub number: u64,

    #[max_len(50)]
    pub colour: String,

    #[max_len(5, 50)]
    pub hobbies: Vec<String>,
}