NFTs unlike regular tokens, are unique. Normal tokens have multiple tokens with single mint addr. Each NFT have each mint addr. Need some ways to bind those NFTs together, and confirm that new NFTs are actually produced by owner of that collections. So have `create-collection.ts`. 

1. `npm init -y`, `npm install @metaplex-foundation/mpl-token-metadata @metaplex-foundation/umi-bundle-defaults`
2. `npm i @solana-developers/helpers`