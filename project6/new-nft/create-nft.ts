import {createNft, fetchDigitalAsset, mplTokenMetadata} from "@metaplex-foundation/mpl-token-metadata";
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

// address from our nft collection https://explorer.solana.com/address/Fo8kZGwHNbuSK7PxvQQ94Ypcb4HHcratZk9JmqxiNLa?cluster=devnet
// const collectionAddress = new PublicKey("Fo8kZGwHNbuSK7PxvQQ94Ypcb4HHcratZk9JmqxiNLa");
// Can do it via umi. If do via new PublicKey (from solana web3.js), later still need convert to umi public key
const collectionAddress = publicKey("Fo8kZGwHNbuSK7PxvQQ94Ypcb4HHcratZk9JmqxiNLa");

console.log(`Creating NFT...`);

// Each nft has its own mint address
const mint = generateSigner(umi);

const transaction = await createNft(umi, {
    mint: mint,
    name: "My NFT",
    uri: "https://raw.githubusercontent.com/lohszeying/solana-bootcamp/refs/heads/master/project6/new-nft/sample-nft-test.json",
    sellerFeeBasisPoints: percentAmount(0),
    collection: {
        key: collectionAddress,
        // when we first make this nft, verified set to false. when sign or verify our collection, then change to true
        verified: false,
    }
});

await transaction.sendAndConfirm(umi);

const createdNft = await fetchDigitalAsset(umi, mint.publicKey);

console.log(`Created NFT! Address is ${getExplorerLink("address", createdNft.mint.publicKey, "devnet")}`);
// NFT created at https://explorer.solana.com/address/6cF8UU8JKAy9QsMCZm9Gz45warFZ8inJWjAJZVcTA23k?cluster=devnet