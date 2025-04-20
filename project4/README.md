# Readme

- `anchor deploy --provider.cluster localnet`
- `anchor keys sync` - sync the program id
- cd to crud-app directory and `npm run dev` to run frontend.
- Remember to also do `anchor build` (to also build TS typing for frontend as well)

Note: If RustRover or Webstorm ide is complaining about unable to get `journalEntryState` in `crudapp-data-access.tsx`, cancel exclusion directory on anchor/target.