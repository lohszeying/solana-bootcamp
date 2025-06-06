import {ActionGetRequest, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse} from "@solana/actions";
import {Connection, PublicKey, Transaction} from "@solana/web3.js";
import {Voting} from '@/../anchor/target/types/voting';
import {BN, Program} from "@coral-xyz/anchor";

// Using @ will pull me back to the src folder
const IDL = require('@/../anchor/target/idl/voting.json')

export const OPTIONS = GET;
export async function GET(request: Request) {
  const actionMetadata: ActionGetRequest = {
    icon: "https://images.getrecipekit.com/20230102102018-peanut_butter_01_520x500.webp?aspect_ratio=1:1&quality=90&",
    title: "Vote for your favourite type of peanut butter!",
    description: "Vote between crunchy and smooth peanut butter",
    label: "Vote",
    links: {
      actions: [
        {
          label: "Vote for Crunchy",
          href: "/api/vote?candidate=Crunchy",
        },
        {
          label: "Vote for Smooth",
          href: "/api/vote?candidate=Smooth",
        }
      ]
    }
  }

  return Response.json(actionMetadata, {
    headers: ACTIONS_CORS_HEADERS
  });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const candidate = url.searchParams.get("candidate");

  if (candidate != "Crunchy" && candidate != "Smooth") {
    return new Response("Invalid candidate", { status: 400, headers: ACTIONS_CORS_HEADERS });
  }

  const connection = new Connection("http://127.0.0.1:8899", "confirmed");
  const program: Program<Voting> = new Program(IDL, {connection});

  const body: ActionPostRequest = await request.json();
  let voter;

  try {
    // make sure the voter is public key and give back an error that makes sense
    voter = new PublicKey(body.account);
  } catch (error) {
    return new Response("Invalid account", { status: 400, headers: ACTIONS_CORS_HEADERS });
  }

  const instruction = await program.methods.vote(candidate, new BN(1))
      .accounts(
          {
            signer: voter,
          }
      ).instruction();

  // blockhash expires after 150 blocks
  const blockhash = await connection.getLatestBlockhash();

  const transaction = new Transaction({
    feePayer: voter,
    blockhash: blockhash.blockhash,
    lastValidBlockHeight: blockhash.lastValidBlockHeight,
  }).add(instruction);

  const response = await createPostResponse({
    // @ts-ignore
    fields: {
      transaction: transaction,
    },
  });

  return Response.json(response, {headers: ACTIONS_CORS_HEADERS});
}