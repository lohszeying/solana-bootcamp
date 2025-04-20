import {
    findMetadataPda,
    mplTokenMetadata,
    verifyCollectionV1
} from "@metaplex-foundation/mpl-token-metadata";
import {airdropIfRequired, getExplorerLink, getKeypairFromFile} from "@solana-developers/helpers";
// umi instance is a way to talk to metaplex tools
import {createUmi} from "@metaplex-foundation/umi-bundle-defaults";
import {keypairIdentity, generateSigner, percentAmount, publicKey} from "@metaplex-foundation/umi"
import {Connection, LAMPORTS_PER_SOL, clusterApiUrl} from "@solana/web3.js";

// create connection
const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromFile();

await airdropIfRequired(connection, user.publicKey, 1 * LAMPORTS_PER_SOL, 0.5 * LAMPORTS_PER_SOL);

console.log("Loaded user", user.publicKey.toBase58());

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));

console.log("Set up Umi instance for user");

const collectionAddress = publicKey("Fo8kZGwHNbuSK7PxvQQ94Ypcb4HHcratZk9JmqxiNLa");

const nftAddress = publicKey("6cF8UU8JKAy9QsMCZm9Gz45warFZ8inJWjAJZVcTA23k");

const transaction = await verifyCollectionV1(umi, {
    metadata: findMetadataPda(umi, {mint: nftAddress}),
    collectionMint: collectionAddress,
    // the user running umi
    authority: umi.identity
});

transaction.sendAndConfirm(umi);

console.log(`NFT ${nftAddress} verified as member of collection ${collectionAddress}! See explorer at ${getExplorerLink("address", nftAddress, "devnet")}`);
// https://explorer.solana.com/address/6cF8UU8JKAy9QsMCZm9Gz45warFZ8inJWjAJZVcTA23k?cluster=devnet