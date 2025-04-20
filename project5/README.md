1. Create mint authority - `solana-keygen grind --starts-with bos:1`
   - **Note:** The `bos5y8eoEcSoUgPZmffMyQH2tUUW6bEaDQ28U3VLUYD` is public key, but the file itself is private key.
2. `solana config set --keypair bos5y8eoEcSoUgPZmffMyQH2tUUW6bEaDQ28U3VLUYD.json`
   - Note: If want to set back to default keypair, can use `solana config set --keypair ~/.config/solana/id.json`
3. `solana config set --url devnet`
4. Airdrop sol to that new wallet addr: `solana airdrop 2 bos5y8eoEcSoUgPZmffMyQH2tUUW6bEaDQ28U3VLUYD --url devnet`
5. Check balance: `solana balance`
6. Make token mint - `solana-keygen grind --starts-with mnt:1`
7. Create new token on SOL blockchain (new SPL token) - `spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --enable-metadata mntBw1DTpTNXsPC9yhkwfJEJRhBivSdkN9PrzAC79B9.json`
   - For program-id, go to https://solana.com/developers/guides/token-extensions/getting-started
9. Go to Solana explorer (devnet), can check with `mntBw1DTpTNXsPC9yhkwfJEJRhBivSdkN9PrzAC79B9`
   - Currently, got nothing much, says unknown token, etc. Add metadata. Can upload image and json file somewhere public in the internet. If want to add it to mainnet then add it to decentralised storage service, eg. iris? Kinda like blockchain but for json files, images, rather than SOL blockchain for transaction. Designed to keep things online for long time cuz not owned by anyone. Resilient by attacks.
   - For our purpose can just use raw github links. Link has to open image/json files directly.
10. `spl-token initialize-metadata mntBw1DTpTNXsPC9yhkwfJEJRhBivSdkN9PrzAC79B9 'Example' 'EXMPL' https://raw.githubusercontent.com/lohszeying/solana-bootcamp/refs/heads/master/project5/new-token/metadata.json`
11. Can view changes at https://explorer.solana.com/address/mntBw1DTpTNXsPC9yhkwfJEJRhBivSdkN9PrzAC79B9?cluster=devnet
12. Now we have token mint. Use token mint to mint token. As mint authority, I can mint into anyone's acc. Can mint into my own acc
   - `spl-token create-account mntBw1DTpTNXsPC9yhkwfJEJRhBivSdkN9PrzAC79B9` - We're making PDA, associated token acc to store these tokens into own personal acc
13. Mint some new token: `spl-token mint mntBw1DTpTNXsPC9yhkwfJEJRhBivSdkN9PrzAC79B9 1000`
14. Go to explorer sonala (devnet), and check for `bos5y8eoEcSoUgPZmffMyQH2tUUW6bEaDQ28U3VLUYD`, under token tab, can see got 1k token.