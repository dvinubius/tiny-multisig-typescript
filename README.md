# Tiny Multi Sig (typescript)

An **minimal** multi sig wallet app built with scaffold eth in solidity and react with **typescript**. 

## @dev

Ported from [JS version](https://github.com/dvinubius/tiny-multisig) 

## JS version live on [Rinkeby](https://tiny-multisig.surge.sh) 🤩

![multisigJS](https://user-images.githubusercontent.com/32189942/156662667-d8908ac2-0f8c-4c38-aa15-f62554acedf9.png)


In many ways just a Proof of Concept, not suitable for production.

## Specs

As a user I can create multisig safes.

Each safe has
- a set of owners
- a requirement for minimum confirmations

I can see an overview of safes where I am the creator or a co-owner

I can copy shareable links for any of my safes.

A safe can execute transactions with given
- ether amount
- execution calldata

I can enter a detailed view of a safe, and there
- create multisig transactions
- approve (confirm) existing transactions
- execute sufficiently approved transactions

As a user I can also view existing safes, without the right to interact with them (may be interesting for DAO treasuries' transparency).

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

🔏 Edit your smart contracts `MSFactory.sol`, `MultiSigSafe.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `MainPage.tsx` in `packages/react-app/src`

💼 Edit your deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app


# 📚 Documentation

Documentation, tutorials, challenges, and many more resources, visit: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)

# 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!

---

🙏 Please check out our [Gitcoin grant](https://gitcoin.co/grants/2851/scaffold-eth) too!
