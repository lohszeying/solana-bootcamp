import {createNft, fetchDigitalAsset, mplTokenMetadata} from "@metaplex-foundation/mpl-token-metadata";
import {airdropIfRequired, getExplorerLink, getKeypairFromFile} from "@solana-developers/helpers";
// umi instance is a way to talk to metaplex tools
import {createUmi} from "@metaplex-foundation/umi-bundle-defaults";
import {keypairIdentity, generateSigner, percentAmount} from "@metaplex-foundation/umi"
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

const collectionMint = generateSigner(umi);

// Collections themselves are NFT, they are just NFT that point to other NFT. Can do fancy things like collections pointing to collections.
const transaction = await createNft(umi, {
    mint: collectionMint,
    name: "My Collection",
    symbol: "MC",
    // json file i uploaded somewhere and can access directly
    uri: "https://raw.githubusercontent.com/lohszeying/solana-bootcamp/refs/heads/master/project6/new-nft/sample-nft-collection.json",
    // A way to make money on secondary sales
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true,
})

await transaction.sendAndConfirm(umi);

const createdCollectionNft = await fetchDigitalAsset(umi, collectionMint.publicKey);

console.log(`Created collection! Address is ${getExplorerLink("address", createdCollectionNft.publicKey, "devnet")}`)