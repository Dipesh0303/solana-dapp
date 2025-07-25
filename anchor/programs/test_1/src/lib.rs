#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H");

#[program]
pub mod test_1 {
    use super::*;

    pub fn close(_ctx: Context<CloseTest1>) -> Result<()> {
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.test_1.count = ctx.accounts.test_1.count.checked_sub(1).unwrap();
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.test_1.count = ctx.accounts.test_1.count.checked_add(1).unwrap();
        Ok(())
    }

    pub fn initialize(_ctx: Context<InitializeTest1>) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
        ctx.accounts.test_1.count = value.clone();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeTest1<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  init,
  space = 8 + Test1::INIT_SPACE,
  payer = payer
    )]
    pub test_1: Account<'info, Test1>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseTest1<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  mut,
  close = payer, // close account and return lamports to payer
    )]
    pub test_1: Account<'info, Test1>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub test_1: Account<'info, Test1>,
}

#[account]
#[derive(InitSpace)]
pub struct Test1 {
    count: u8,
}
