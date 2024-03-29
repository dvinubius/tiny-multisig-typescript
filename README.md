# Tiny Multi Sig (typescript)

A **minimal** multi sig wallet app built with scaffold eth in solidity and react with **typescript**. 

## @dev

Ported from [JS version](https://github.com/dvinubius/tiny-multisig) 

## Live on [Rinkeby](https://tiny-multisig-ts.surge.sh) 🤩 

Screenshots below taken from the JS Demo. This one is just as pretty, promise.

![tiny-multisig](https://user-images.githubusercontent.com/32189942/156881313-c1205bcc-5585-4514-938b-3e8d3f5895d9.png)

Still a Proof of Concept, not ready for production.

## Specs

As a user I can create multisig vaults.

Each vault has
- a set of owners
- a requirement for minimum confirmations

I can see an overview of vaults where I am the creator or a co-owner

I can copy shareable links for any of my vaults.

A vault can execute transactions with given
- ether amount
- execution calldata

I can enter a detailed view of a vault, and there
- create multisig transactions
- approve (confirm) existing transactions
- execute sufficiently approved transactions

As a user I can also view existing vaults, without the right to interact with them (may be interesting for DAO treasuries' transparency).

### Use

Feel free to fork an build on top!

For questions DM me on Twitter [@dvinubius](https://twitter.com/messages/compose?recipient_id=1347938190385172486)


# 🏗 Scaffold-Eth Typescript

This is based on the typescript repo of scaffold.eth. The directories that you'll use are:

```bash
packages/vite-app-ts/
packages/hardhat-ts/
```

# 🏄‍♂️ Building on scaffold-eth-typescript

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)


> install your dependencies:

```bash
yarn install
```

> in a second terminal window, start a hardhat node:

```bash
yarn chain
```

> in a third terminal window, 🛰 deploy your contract and start the app:

```bash
# build hardhat & external contracts types
yarn contracts:build 
# deploy your hardhat contracts
yarn deploy
# start vite 
yarn start 
```

🌍 You need an RPC key for production deployments/Apps, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js`

🔏 Edit your smart contracts `MSFactory.sol`, `MultiSigVault.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `MainPage.tsx` in `packages/react-app/src`

💼 Edit your deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app


# 📚 Documentation

Documentation, tutorials, challenges, and many more resources, visit: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)

# 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!

---

🙏 Please check out our [Gitcoin grant](https://gitcoin.co/grants/2851/scaffold-eth) too!
