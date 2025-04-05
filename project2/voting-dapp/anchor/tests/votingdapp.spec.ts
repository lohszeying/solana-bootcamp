import { startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { BN, Program } from "@coral-xyz/anchor";
import { Voting } from '../target/types/voting';

const IDL = require('../target/idl/voting.json');

const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

describe('Voting', () => {
    it('Initialize Poll', async () => {
        const context = await startAnchor("", [
            {name: "voting", programId: votingAddress}
        ], []);
        const provider = new BankrunProvider(context);

        const votingProgram = new Program<Voting>(
            IDL,
            provider);
        const wallet = provider.wallet as anchor.Wallet;

        await votingProgram.methods.initializePoll(
            new anchor.BN(1),
            "What is your favorite type of peanut butter?",
            new anchor.BN(0),
            new anchor.BN(1843871461),
        ).rpc();

        const [pollingAddress] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
            votingAddress
        )

        const poll = await votingProgram.account.poll.fetch(pollingAddress);

        console.log(poll);

        expect(poll.pollId.toNumber()).toEqual(1);
        expect(poll.description).toEqual("What is your favorite type of peanut butter?");
        expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
    })
})
