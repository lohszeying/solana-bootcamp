# Steps for project 2

1. cd into `voting-dapp` and run npm run dev
2. On Windows WSL, use `cd ~`, then run `solana-test-validator`.
3. To run anchor test, use `anchor test --skip-deploy --skip-local-validator`.

# Steps for project 3

1. To check for route, can go to `http://localhost:3000/api/vote`
2. We can also see the above in blink: `https://dial.to/?action=solana-action:<the above localhost api>`, for example `https://dial.to/?action=solana-action:http://localhost:3000/api/vote`
3. Can deploy via `anchor deploy` (check in anchor folder)
4. When testing, use `anchor test --skip-local-validator` (If facing issues with test failing, then use `solana-test-validator --reset`)