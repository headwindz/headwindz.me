---
title: Introduction to web3
date: 2026-04-26
featured: true
tags: ['web3', 'blockchain', 'crypto']
summary: How blockchains, wallets, and smart contracts work, and where Web3 still depends on operators, off-chain data, and trust.
reviewed: 2026-11-17
---

# Introduction

A platform can suspend an account, freeze access, or shut down a service. Some Web3 applications try to reduce dependence on a single operator by letting users control on-chain assets with their own keys. That raises a practical question: which rights and operations remain available if the original service disappears?

Web3 is a broad label for applications built around shared protocols, cryptographic authorization, and distributed records. A key can authorize actions on an account. It does not automatically grant copyright, preserve an off-chain file, or remove administrator powers. This introduction traces a transaction and then examines the dependencies around it.

Two words come up constantly in web3 and are worth defining upfront:

- **Trustless**: some trust in an operator is replaced by verifiable protocol rules. Users still rely on assumptions about software, consensus, keys, and any external inputs.
- **Permissionless**: the protocol permits participation without an operator individually approving each user. Particular frontends, issuers, and regulated services can still restrict access.

# From web2 to web3: the ownership problem

In many Web2 services, a platform controls account access, distribution, and the database used by the application. Users can still own copyright in their work, and portability varies by service. The problem here is dependence on an operator, not a universal claim that platforms legally own everything users create.

Web3 aims to change that by moving critical state (e.g. assets, identity, permissions) onto public, permissionless ledgers. The core principle is straightforward: **users should own their data and digital assets, not platforms**.

The mechanism that makes this possible is decentralization.

<SketchDiagram
  src="/static/images/introduction-to-web3/ownership.svg"
  alt="Platform accounts depend on the operator’s database; key-authorized shared records can be read through another app."
  width={600}
  height={610}
/>

Platform accounts depend on the operator’s database. Key-authorized shared records can be read through another app.

# Decentralization vs distribution

These two terms are often confused.

- **Distributed**: computation or data is spread across multiple nodes. Authority can be centralized or decentralized.
- **Decentralized**: decision-making authority is spread across participants instead of resting with one operator. The degree of decentralization depends on which decisions and dependencies are being examined.

A centrally operated service can distribute its database across regions while retaining one owner of access policy. A public blockchain can distribute validation and block production among participants, although participants have different roles and need not all retain a complete history. Distribution concerns placement, and decentralization concerns authority.

The tradeoff is real: decentralization buys censorship resistance and fault tolerance, but at the cost of coordination overhead and throughput.

# Blockchain: the data structure

## Hash function

A cryptographic hash function maps arbitrary input to a fixed-length output. Useful properties include:

- **One-way (preimage resistance)**: given a hash output, it is computationally infeasible to recover the original input. You cannot reverse it.
- **Collision resistance**: finding two distinct inputs with the same hash should be computationally infeasible.
- **Deterministic**: the same input always produces the same output.
- **Avalanche effect**: a single bit change in the input produces a completely different output. There is no known practical shortcut for finding inputs that meet Bitcoin's hash target.

Bitcoin uses _SHA-256_. To illustrate: `SHA256("hello") = 2cf24db...` and `SHA256("hellp") = fdd7585...` — two inputs that differ by one character produce entirely unrelated hashes.

## Digital ledger

At the implementation level, a blockchain is a **hash linked list**. Each block contains:

- A set of transactions
- A timestamp
- The cryptographic hash of the previous block

Because each block commits to the hash of its predecessor, altering any block invalidates every block after it. This makes the chain **append only and tamper evident**.

<Web3Explainer kind="hashes" />

The linked list structure is well suited for ledgers. The dominant operation is appending new entries at the tail, not random access into history. Any node running the open source blockchain software initializes the same chain, appends new data, and syncs with peers.

The critical question is: if there is no central authority, how do nodes agree on which transactions to append?

## The consensus problem

In a decentralized network, you cannot assume all nodes are online, **honest**, or responsive. Blindly accepting every submitted transaction would let anyone fabricate balances. Requiring unanimous agreement from every node does not scale. Nodes also lack intrinsic motivation to verify transactions that do not involve them.

Creating many node identities does not make an invalid transaction acceptable: full nodes independently enforce validity rules. The harder question is selecting a shared history when several valid candidate blocks compete. A permissionless design also needs resistance to an actor manufacturing identities to gain influence.

Consensus combines validation rules, network assumptions, chain selection, and incentives. Rewards and penalties can make attacks expensive, but do not prove that every attacker must find an attack irrational. An attacker may have external incentives or access to resources the simplified model omits.

<SketchDiagram
  src="/static/images/introduction-to-web3/consensus.svg"
  alt="Independent nodes check signatures and balances before consensus selects among valid histories."
  width={600}
  height={555}
/>

Independent nodes check signatures and balances before consensus selects among valid histories.

### Proof of work

Proof of work (PoW) solves the consensus problem by tying the right to write the next block to a computational puzzle.

The protocol sets a target: the hash of a valid block header must be numerically smaller than a threshold value (equivalently, it must start with a certain number of leading zero bits). Because of the avalanche effect, there is no mathematical shortcut to find such an input. The only strategy is brute force: repeatedly try different values for a field in the block header called the **nonce** until one produces a hash that satisfies the target.

Key properties:

- **Costly to produce**: finding a valid hash requires significant computation.
- **Cheap to verify**: once a valid nonce is published, any node can hash it once and confirm.
- **Memoryless**: each attempt is independent. Past failures do not improve future odds. The probability of finding a valid hash is strictly proportional to compute power.

#### Why `waste` is the point

If casting a vote is free, votes can be manufactured. PoW ties block-production influence to verifiable work. A miner must spend real resources (hardware, electricity) to earn the right to propose a block. This ensures that the majority of block proposals come from participants with real economic skin in the game.

The result: block production rights are distributed in proportion to compute power, while sustained majority hash power can support censorship and reorganizations of valid history. It cannot authorize invalid signatures or arbitrary coin creation.

## Bitcoin: putting it all together

Bitcoin is the first and most well known application of PoW consensus. Its design combines several elegant mechanisms:

### Native currency and issuance

Bitcoin is not just a ledger, it is a **monetary system**. The protocol defines its own unit of account (BTC) and issues new coins algorithmically. The rules are encoded in open source software. No individual or institution can alter them unilaterally.

When a miner successfully finds a valid hash and produces a block, the protocol creates a **coinbase transaction** that mints new BTC to the miner's address. This is the block reward - the primary incentive that bootstrapped the network.

### Halving and fixed supply

The initial block subsidy was 50 BTC. It halves every 210,000 blocks, approximately four years at the target block interval. The subsidy after the April 2024 halving is 3.125 BTC per block; miners can also collect transaction fees. The issuance schedule approaches the familiar 21-million-BTC limit. [Bitcoin issuance rules](https://developer.bitcoin.org/devguide/block_chain.html).

### Difficulty adjustment

To keep the block interval stable at approximately 10 minutes, the network automatically adjusts the hash target every 2,016 blocks. When more miners join and blocks are found too quickly, difficulty increases. When miners leave, it decreases. This self regulating mechanism ensures predictable issuance regardless of total network hash rate.

### Price discovery

A monetary issuance rule does not establish a market price. Buyers and sellers set prices through trades, influenced by expected use, scarcity, liquidity, risk, and speculation. These market judgments are separate from the consensus rules that validate a transaction.

## A transaction end to end

Here is how a typical Bitcoin transaction works:

1. **Wallet creation**: install a Bitcoin wallet (e.g., Sparrow, Electrum, or a hardware wallet app). A cryptographic key pair is generated locally. The public key derives your address and the private key signs transactions. No registration or identity verification is required.

2. **Initiate transfer**: the sender signs a transaction transferring BTC to the recipient's address and broadcasts it to the network.

3. **Mempool**: peers may accept the transaction into their local mempools. Nodes can have different policies and different sets of unconfirmed transactions.

4. **Mining**: miners select transactions from the mempool, package them into candidate blocks, and begin computing hashes. Different miners can choose different transaction sets, but every proposed block must satisfy consensus rules and be independently verifiable.

5. **Block found**: the first miner to find a valid hash broadcasts the block. Other nodes verify it (checking transaction validity and hash correctness) and, if valid, append it to their local chain.

6. **Confirmation**: the transaction is now onchain. Additional blocks built on top provide further confirmation and security.

<SketchDiagram
  src="/static/images/introduction-to-web3/transaction.svg"
  alt="A Bitcoin payment moves through signing, relay, mining, verification, and additional confirmations."
  width={600}
  height={610}
/>

A Bitcoin payment moves through signing, relay, mining, verification, and additional confirmations.

# Wallets and key management

The transaction walkthrough above glossed over wallets. Wallet choice is one of the first practical decisions every crypto user makes, and getting it wrong has led to billions in irretrievable losses.

## Custodial vs non-custodial

The most important distinction:

- **Custodial wallet**: a third party (usually a centralized exchange like Coinbase or Binance) holds your private keys on your behalf. You authenticate with a username and password. Convenient, but you are trusting the custodian. If they are hacked, insolvent, or freeze your account, you may not be able to access your funds.
- **Non-custodial wallet**: you hold your own private keys. The user controls signing, but may still depend on wallet software, RPC services, and applications. Key custody and service dependencies are separate questions.

The maxim in the space: **"not your keys, not your coins."** Multiple exchange collapses (Mt. Gox, FTX) have illustrated what happens when custodians fail.

## Hot vs cold wallets

This axis describes internet connectivity:

- **Hot wallet**: connected to the internet. Software wallets (MetaMask, Phantom), mobile apps, browser extensions. Convenient for frequent transactions, but represents a larger attack surface.
- **Cold wallet**: offline. Hardware wallets (Ledger, Trezor) store private keys on a dedicated device that never exposes the key to an internet-connected computer. Paper wallets (printed keys) are the extreme case.

<SketchDiagram
  src="/static/images/introduction-to-web3/custody.svg"
  alt="Who holds the keys and whether the signer is online are separate wallet decisions."
  width={600}
  height={600}
/>

Who holds the keys and whether the signer is online are separate wallet decisions.

Choose custody according to the operations you need, the recovery process you understand, and the risks you can manage. Neither custody model removes all failure modes.

## Seed phrases

A **seed phrase** (also called a recovery phrase or mnemonic) is a human-readable backup of your wallet's master key — typically 12 or 24 words generated from the BIP-39 word list. Every key and address in a hierarchical deterministic wallet is derived deterministically from this single seed.

This means:

- If your device is lost or destroyed, the seed phrase restores your entire wallet on any compatible software.
- If someone else obtains your seed phrase, they have full control of all your funds, permanently and irrecoverably.

Security practices that follow from this:

- Write the seed phrase on paper (or metal). Enter it only into the trusted wallet recovery process you intentionally selected; never provide it to support agents, unsolicited sites, or messages.
- Store multiple copies in separate physical locations.
- Restoring a seed into an online wallet changes its exposure. A hardware-wallet recovery process normally keeps the seed entry on the device; follow the device's documented process.

## Connections, signatures, and approvals

Connecting a wallet usually lets a site see an address and request actions. It does not itself authorize every transfer. A transaction or signed message can grant more authority: an ERC-20 approval lets a spender transfer tokens up to an allowance, and permit signatures can authorize allowances without the holder submitting the approval transaction themselves. Disconnecting a site does not revoke an existing on-chain allowance. [ERC-20 allowances](https://eips.ethereum.org/EIPS/eip-20), [ERC-2612 permits](https://eips.ethereum.org/EIPS/eip-2612).

Before signing, check the network, recipient or spender, asset, amount, and requested permissions. Use a local development chain or testnet for experiments. Test tokens have no intended monetary value, and a seed phrase used for experiments should not protect real assets.

Public chains are also public records. Addresses are pseudonymous rather than automatically anonymous: transfers and contract interactions can link activity across apps. Keep secrets and personal data off public transaction inputs and contract storage.

# Forks, the longest chain rule, and double spending

## Natural forks

Two miners can find valid blocks at nearly the same time, creating a temporary fork: two competing chain tips. Miners choose which branch to extend. Over time, one branch accumulates more work and becomes longer. The network converges on the **longest chain** (more precisely, the chain with the most cumulative proof of work).

## Why tampering fails

Each block commits to its predecessor. Changing historical contents breaks those commitments, so a competing valid history must redo the relevant proof of work and satisfy the chain-selection rule. More confirmations increase a minority attacker's difficulty of catching up under the model's assumptions; the hash links alone do not make recomputation grow exponentially with the number of blocks.

## The 51% attack

The 51% attack is the most discussed theoretical threat to proof-of-work blockchains. Understanding it precisely matters, both for evaluating Bitcoin's security and for separating the attack's capabilities from its economic feasibility.

### How it works, step by step

1. The attacker secretly acquires more than 50% of the network's total hash rate.
2. While the public chain continues to grow normally, the attacker mines a **private shadow chain** in secret, starting from some block in the past.
3. On the public chain, the attacker makes a large purchase. For example, buys \$10 million of goods or withdraws from an exchange.
4. Once the goods are delivered or the withdrawal confirmed, the attacker releases the shadow chain. Because it was mined with majority hash power, it is longer than the public chain and will have accumulated more proof of work.
5. All honest nodes follow the longest chain rule and switch to the attacker's chain. The purchase transaction, which existed on the old public chain, no longer exists. The attacker keeps both the goods and the coins.

This is a **double-spend**: the same coins are spent twice: once to buy something real, and once recovered via chain reorganization.

<Web3Explainer kind="fork" />

### What 51% can and cannot do

It is important to be precise about the limits of the attack:

- **Can do**: reverse the attacker's own recent transactions (double spending), censor specific transactions from being included in blocks, disrupt the network by refusing to extend any valid chain.
- **Cannot do**: forge valid signatures for keys the attacker does not control, spend arbitrary other users' outputs, or make full nodes accept coin creation that violates their rules. Deeper reorganizations are more costly, rather than cryptographically impossible merely because the blocks are old.

The attack window is also time limited. The attacker must maintain majority hash rate continuously for the duration of the reorg. The deeper into history they want to reach, the more blocks they must re-mine in secret before revealing their chain, therefore requiring sustained majority power for longer.

### Cost and incentives

Maintaining a competitive private chain requires hash power, electricity, and time while the public chain continues to grow. Costs depend on hardware availability, energy prices, attack duration, and access to rented or already-controlled capacity. Do not infer a universal dollar threshold from a chain's market capitalization.

Smaller PoW networks have experienced successful reorganizations and double spends. Ethereum Classic's 2020 attacks are one example. ETC used Ethash then and later changed to Etchash; it is not a SHA-256 mining chain. [ECIP-1099 describes that transition](https://ecips.ethereumclassic.org/ECIPs/ecip-1099).

Economic incentives can discourage attacks, but “a rational attacker cannot profit” is too strong. Damage to market confidence is only one term in an attacker's incentives. The protocol's actual validation and chain-selection rules remain the starting point. [Bitcoin block-chain guide](https://developer.bitcoin.org/devguide/block_chain.html).

# Ethereum and smart contracts

Bitcoin is a decentralized settlement layer for value transfer. Ethereum extends the blockchain model with a critical addition: **smart contracts** — programs deployed and executed directly on the blockchain. Unlike Bitcoin's scripting system, Ethereum smart contracts are Turing-complete, meaning they can express any computation, from simple token transfers to complex financial logic. Think of them as vending machines that run on the blockchain: you put in the right inputs, and the contract executes automatically, subject to the deployed code and any administrator or upgrade permissions.

## What is a smart contract

A smart contract is code stored on the blockchain. Its deployed bytecode is immutable, but many production systems use explicit upgrade patterns (for example, proxy architectures) with predefined governance controls. It executes deterministically: given the same inputs, every node produces the same output. This makes it a **trust-minimized, self-enforcing agreement**.

Example: two parties bet on tomorrow's weather. Traditionally, a trusted third party holds the stake. With a smart contract, both parties deposit funds into the contract. An **oracle** feeds the weather result, and the contract automatically pays the winner. The contract can apply a payout rule, but it still depends on the oracle's data and update process. Incorrect or manipulated weather data can produce an incorrect payout.

## Why this matters

Smart contracts enable an entirely new class of applications:

- **DeFi (decentralized finance)**: lending, borrowing, swaps, and yield farming without banks. Automated market makers (AMMs) replace traditional order books.
- **NFTs (non-fungible tokens)**: distinct token records. Owning a token does not automatically transfer copyright or legal title to an associated asset.
- **DAOs (decentralized autonomous organizations)**: governance structures encoded in smart contracts — token weighted voting, transparent treasuries, programmable rules.
- **RWA (real-world asset tokenization)**: tokens representing claims linked to assets such as bonds or real estate. Custody, legal enforceability, and redemption remain off-chain dependencies.

In short: **Bitcoin is decentralized money. Ethereum is a decentralized compute platform.** Web3 is the application layer built on top.

## Gas and transaction fees

Every Ethereum operation including transferring tokens, calling a smart contract function and deploying code, consumes **gas**. Gas is the unit of computational work. Each EVM opcode has an assigned gas cost. A basic ETH transfer to an ordinary account without code or extra data uses 21,000 gas. Contract execution can add to that cost.

**Transaction fee = gas used × gas price (in gwei)**

Since [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559), the fee model has two components:

- **Base fee**: set algorithmically by the protocol based on block demand. It is burned (permanently removed from supply), not paid to validators.
- **Priority fee (tip)**: set by the user to incentivize a validator to include the transaction sooner. Goes to the validator.

<Web3Explainer kind="gas" />

Practical implications:

- **Gas limit**: the maximum gas you are willing to spend. If execution exceeds it, the transaction reverts but you still pay for gas consumed up to that point.
- **Gwei**: 1 gwei = 10⁻⁹ ETH. Gas prices are quoted in gwei.
- Smart contract interactions can cost orders of magnitude more gas than simple transfers. Complex DeFi operations may cost hundreds of thousands of gas.
- L2 networks exist largely to reduce gas costs — they amortize the cost of L1 settlement across many L2 transactions.

## Ethereum's shift to proof of stake

Ethereum launched with PoW and migrated to **proof of stake (PoS)** in September 2022 (the Merge). Understanding the difference is important for developers building on Ethereum today.

In PoS, validators stake ETH as collateral instead of competing through computation. Activating an Ethereum validator requires at least 32 ETH. Proposer selection is weighted by effective stake, and committees attest to blocks. Pooling lets users participate with smaller amounts, but introduces dependencies on the pool or provider. [Ethereum proof of stake](https://ethereum.org/developers/docs/consensus-mechanisms/pos/).

The security guarantee comes from **slashing**: validators that sign contradictory blocks or act dishonestly have a portion of their staked ETH automatically destroyed by the protocol. Economic loss replaces computational cost as the deterrent.

<SketchDiagram
  src="/static/images/introduction-to-web3/consensus-cost.svg"
  alt="Proof of work spends hardware and electricity; proof of stake puts ETH collateral at risk."
  width={600}
  height={600}
/>

Proof of work spends hardware and electricity; proof of stake puts ETH collateral at risk.

Key practical differences for developers:

- **Finality**: Under normal conditions, PoS Ethereum finalizes checkpoints in roughly two epochs (about 13 minutes) via Casper FFG checkpointing. PoW Bitcoin uses probabilistic finality (more confirmations = more security).
- **Energy**: PoS uses ~99.95% less energy than PoW, removing a major political and regulatory friction point for institutional adoption.
- **Validator set**: distinguish validator records from independent operators. A large record count alone does not establish decentralized control.

# The web3 ecosystem

## Current state

Today's internet is a hybrid. Most services are still web2 (centralized servers, platform controlled data), but an increasing number of financial and coordination functions are moving onchain. DeFi protocols manage billions in liquidity. NFT marketplaces have created new creator economies. DAOs govern protocol treasuries and development roadmaps.

## Stablecoins

Volatility is Bitcoin and Ethereum's biggest barrier to everyday use. A currency whose value can move 20% in a day is a poor medium of exchange. **Stablecoins** solve this by pegging to a stable reference asset, say the US dollar.

### The three designs

**Fiat-backed** (for example USDC or USDT): an issuer holds reserves and offers redemption under its terms. Reserve composition, eligibility, freezing powers, and settlement arrangements differ. The target market price is not guaranteed: USDC depegged during the March 2023 banking stress. [Circle's account](https://www.circle.com/pressroom/3-3-billion-of-usdc-reserve-risk-removed-dollar-de-peg-closes).

**Crypto-backed**: a borrower deposits collateral into a contract and issues stablecoins against it. If the position falls below its liquidation threshold, the protocol can sell collateral to cover debt. Ratios and asset eligibility are protocol-specific. DAI has also used centralized stablecoins and real-world assets as backing, so “crypto-backed” is not a guarantee of purely decentralized collateral.

**Algorithmic** (historical example: UST/LUNA): incentives expand or contract token supply to target a price, sometimes relying on a paired volatile token rather than fully external reserves. In a confidence crisis, redemption into more volatile tokens can accelerate dilution and selling. UST's May 2022 collapse illustrates this failure mode; it does not establish a universal theorem about every design labeled algorithmic.

<SketchDiagram
  src="/static/images/introduction-to-web3/stablecoins.svg"
  alt="Compare reserve redemption, collateral liquidation, and algorithmic supply incentives."
  width={600}
  height={615}
/>

Compare reserve redemption, collateral liquidation, and algorithmic supply incentives.

### Peg mechanics

Regardless of design, many stablecoin designs use arbitrage around issuance or redemption to support the peg. If USDC trades at 0.99, arbitrageurs buy it and redeem at the issuer for 1.00, profiting 0.01 and pushing the price back up. If it trades at 1.01, they mint new USDC at 1.00 and sell into the market, pushing the price back down. This pressure depends on access, confidence, fees, liquidity, and settlement timing; it is not a guarantee.

For any stablecoin, examine the redemption path: who can use it, what assets are delivered, how long it takes, and which permissions can halt it. The [stablecoin guide](/blog/web3-stablecoins) compares these mechanisms and their failure conditions.

### Why stablecoins matter

Stablecoins are the lifeblood of DeFi. Most lending, borrowing, and liquidity provision uses them as a unit of account. They are also increasingly significant outside DeFi:

- Businesses in high inflation economies use USDC for dollar savings without a bank account
- Cross-border transfers can move value on-chain outside banking hours. Compare the full route, including purchase, transfer, compliance, exchange, and cash-out costs, rather than treating on-chain settlement as the whole payment.

## Scaling challenges

The **blockchain trilemma** is a useful way to discuss tensions among decentralization, security, and scalability, not a proof that exactly two properties can be achieved. Block interval, transaction throughput, confirmation, and finality measure different things; for example, Bitcoin's target 10-minute block interval is not deterministic finality.

Layer 2 (L2) systems move execution away from the main chain while using L1 contracts to settle results. Rollups publish data needed to reconstruct state on Ethereum and use either fault proofs or validity proofs. State channels instead let participants exchange signed updates and settle disputes onchain. The security mechanism matters more than the L2 label.

<SketchDiagram
  src="/static/images/introduction-to-web3/rollup-layers.svg"
  alt="L2 execution depends on published transaction data and L1 rules for settling state claims."
  width={600}
  height={625}
/>

L2 execution depends on published transaction data and L1 rules for settling state claims.

### Optimistic rollups

Optimistic rollups execute transactions outside L1 and submit state claims alongside transaction data published on Ethereum. Claims are accepted unless successfully challenged during a configured dispute period, often around seven days. Fault-proof systems can re-execute disputed computation to reject an invalid claim. Who can propose or challenge, and which emergency powers exist, depends on the deployment. [Optimistic rollup mechanics](https://ethereum.org/developers/docs/scaling/optimistic-rollups/).

A canonical withdrawal to L1 generally waits for the dispute period and any other bridge requirements. This is different from the quick confirmation shown by an L2 sequencer. Liquidity providers can offer faster exits in exchange for fees and additional counterparty or contract risk.

An optimistic rollup depends on its implemented proof system, data availability, and an honest party being able to challenge invalid state claims within the allowed window. Check the actual deployment and upgrade permissions rather than inferring security from whether a dispute has occurred.

### Zk rollups

ZK rollups submit cryptographic validity proofs showing that state transitions follow the rules encoded in their proof circuits. Ethereum verifies the proofs rather than re-executing the entire batch. Despite the name, a ZK rollup does not necessarily hide transaction details: validity and privacy are separate properties. [ZK-rollup mechanics](https://ethereum.org/developers/docs/scaling/zk-rollups/).

Validity proofs remove the optimistic fraud-challenge window, but proof generation, submission, and L1 finality still take time. Security also depends on the proof implementation, data availability, bridge contracts, and upgrade controls. EVM compatibility and tooling vary by chain rather than following a universal optimistic-versus-ZK maturity ranking.

<SketchDiagram
  src="/static/images/introduction-to-web3/rollup-comparison.svg"
  alt="Optimistic rollups allow disputes; validity rollups generate proofs. Both still wait for L1 settlement."
  width={600}
  height={625}
/>

Optimistic rollups allow disputes; validity rollups generate proofs. Both still wait for L1 settlement.

### State channels

State channels (Lightning Network on Bitcoin, payment channels) are a different model: two parties lock funds onchain, then conduct an unlimited number of off-chain transactions by exchanging signed state updates directly between themselves. Only the opening and closing transactions touch the blockchain. This enables near-zero cost, near-instant transactions between channel participants.

The limitation is the setup. You need a pre-funded channel with each counterparty, or a routing network of connected channels. This works well for repeated bilateral interactions (e.g., micropayments between two services), but does not generalize to arbitrary smart contract execution.

### Data availability and blobs

A state root commits to a result but does not reveal the transactions needed to reconstruct it. Users need available data to independently check state and exercise exits. Ethereum's EIP-4844 introduced **blobs**, a separate data market that rollups can use instead of more expensive execution calldata. Blob data is retained for a limited protocol-defined period, so historical retrieval also depends on archival infrastructure. Validiums use validity proofs with data stored outside Ethereum, adding different availability assumptions. [Data availability](https://ethereum.org/developers/docs/data-availability/).

### Choosing an L2

Compare the actual deployment, rather than choosing solely by proof type:

- **Execution**: supported tooling, contract compatibility, and costs for your workload.
- **Settlement and exits**: sequencer confirmation, proof or dispute timing, L1 finality, and withdrawal restrictions.
- **Control**: upgrade keys, emergency councils, permission to challenge, and options if the sequencer stops.
- **Data availability**: where transaction data is published and how users reconstruct state.

[L2Beat](https://l2beat.com/scaling/summary) tracks individual networks and their risk assumptions. Recheck a network's current documentation and contracts before depending on it.

## Bridge risk

A **bridge** coordinates value or messages across chains. Lock-and-mint is one design; burn-and-mint and liquidity-based transfers use different mechanisms. They add attack surfaces beyond either chain alone.

> **Caution**: A bridge adds assumptions about message verification, custody, administrators, and both chains' finality. Audit scope and incident history matter, but an audit or insurance product does not guarantee recovery.

Practical implications for developers:

- Prefer native assets on their home chain whenever possible.
- When bridging is unavoidable, inspect message verification, upgrade powers, exit restrictions, and audit scope. Insurance, if available, has its own coverage limits and exclusions.

## AI and web3

AI software can use blockchain accounts to make payments or interact with contracts. A blockchain verifies transaction authorization and contract execution. It does not establish that an agent made a sensible decision, or that its off-chain inputs were true.

### AI agents with wallets

An AI agent can use wallet tooling such as [Coinbase AgentKit](https://www.coinbase.com/developer-platform/discover/launches/introducing-agentkit) to submit transactions. The operator still chooses custody, permissions, and spending limits. An on-chain record shows submitted transactions, not every model decision or off-chain action. Give agents bounded allowances and explicit approval rules for consequential actions.

### Verifiable inference

A deeper problem: how do you trust an AI model's output? If a smart contract needs to act on an AI generated decision (e.g., a credit score, a fraud signal, a trading recommendation), it needs a way to verify the model ran correctly without rerunning the entire inference onchain, which is prohibitively expensive. **Zero-knowledge machine learning (ZKML)** addresses this: a prover runs inference off-chain and generates a ZK proof that the computation was performed correctly with a specific model. The smart contract verifies the proof. This can establish execution of the committed computation, but cannot establish the truth of an input or the quality of a prediction. Projects like [Giza](https://www.gizatech.xyz/) and [EZKL](https://ezkl.xyz/) are building this infrastructure today.

### Decentralized model marketplaces

Today, frontier AI models are controlled by a small number of labs. A decentralized marketplace would allow model weights to be owned as onchain assets, inference to be sold permissionlessly, and fine tuned adapters to accrue value back to their creators. [Bittensor](https://bittensor.com/) is the most prominent attempt: a blockchain that rewards nodes for producing useful machine learning outputs, with validation handled by the network rather than a central authority. Evaluating output quality remains a challenge: token incentives do not by themselves establish that a model is useful or reliable.

### Oracles and data provenance

AI models are only as good as their training data. Onchain data provenance, recording the origin, transformation history, and licensing terms of datasets as immutable ledger entries, can make commitments and provenance records independently inspectable. Those records still need a trustworthy connection to the actual dataset; centralized pipelines can also maintain signed audit logs. Combined with cryptographic attestations of model training, this could enable auditable AI systems where regulators, users, or counterparties can verify exactly what data shaped a model's behavior.

# Tradeoffs and risks

Web3 is powerful, but it has real constraints that are worth understanding honestly before building or investing.

## Throughput and latency

Public blockchains coordinate execution, validation, and data propagation across many participants. Bitcoin targets a roughly ten-minute block interval; Ethereum uses twelve-second slots, which can be missed. Neither interval is a guarantee of transaction inclusion or finality. [Ethereum blocks](https://ethereum.org/developers/docs/blocks/).

Rollups can increase throughput by batching work and amortizing settlement costs. Compare sustained activity with capacity under a specified workload: a token transfer, a complex swap, and a database write are different operations. Raw TPS figures without workload, measurement period, and finality assumptions are misleading.

## Immutability risk

The **immutability** property that makes blockchains trustworthy, is also what makes mistakes catastrophic. A bug in a deployed smart contract cannot be silently patched the way a web server can push a hotfix. It requires either a governance controlled upgrade mechanism (which exists in many production protocols but reintroduces a trust vector), or accepting that the vulnerable code will remain exploitable indefinitely.

Failures can come from contract code or the authority around it. The 2016 DAO exploit used reentrancy; the 2022 Ronin incident involved compromised validator keys. Reviewing bytecode alone cannot reveal every operational risk. [Ethereum DAO history](https://ethereum.org/ethereum-forks/), [UN report on the Ronin incident](https://digitallibrary.un.org/record/3989812/files/S_2022_668-EN.pdf).

For developers: formal verification, extensive auditing by multiple independent firms, timelocked upgrades, and bug bounty programs are not optional for high value contracts. They are table stakes.

## UX barrier

Using web3 today requires understanding concepts that have no analog in web2: private key management, gas estimation, transaction confirmation times, token approvals, chain switching, and seed phrase security. A new user must make security critical decisions before they can do anything useful.

**Account abstraction** makes account behavior programmable. [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) defines infrastructure for smart accounts, including bundlers and optional paymasters. Ethereum also activated [EIP-7702 with Pectra](https://ethereum.org/roadmap/pectra/) in May 2025, allowing an externally owned account to delegate execution to contract code. Batching, gas sponsorship, recovery, and session permissions depend on wallet implementation. A paymaster can sponsor gas or arrange token reimbursement; the underlying Ethereum fee is still paid in ETH.

These features can reduce onboarding friction, but introduce security decisions about delegated code, recovery authorities, and spending permissions. A familiar interface should still explain what a signature authorizes and how that authority can be revoked.

## Regulatory uncertainty

Token issuance, custody, payments, and governance can fall under different legal regimes. The EU’s MiCA became fully applicable on 30 December 2024, with transitional arrangements for qualifying service providers ending by 1 July 2026 at the latest. This is a specific framework, not a worldwide classification of every token or DAO. Check current rules for the jurisdiction and activity involved. [ESMA on MiCA transitional measures](https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-143-transitional-measures).

## Speculation and scams

Open token creation makes it possible to launch a project without advance platform review. Readers should recognize several recurring abuse patterns without assuming that this article measures their prevalence:

- **Rug pull**: developers raise funds, then drain the liquidity pool and disappear. The token becomes worthless instantly.
- **Pump and dump**: coordinated buying inflates a token's price; insiders sell at the peak while retail investors hold the bag.
- **Honeypot contracts**: tokens that allow buying but not selling — the contract's transfer function reverts for non-owner addresses.
- **Phishing**: fake wallet interfaces, malicious token approvals, and impersonated support channels targeting private keys and seed phrases.

Recovery depends on the custody arrangement, available evidence, jurisdiction, counterparties, and enforcement. An on-chain transfer may be difficult to reverse, but that does not establish that every victim has no legal recourse. Treat unexpected urgency, impersonation, and requests for secret keys as signals to stop and verify the operation.

## Thought question: who should be able to freeze funds?

> You hold your own keys, but a stablecoin issuer can stop your tokens from moving. How decentralized is that ownership? If the tokens were stolen from you, would you want the issuer to have that power?

Decentralization is not an absolute property of an entire application. Ask which layer distributes authority and which decisions remain under someone’s control. A public blockchain can validate transactions across independent nodes while a token contract still gives its issuer permission to block addresses. Self-custody removes a custodian’s control over your signing keys. It does not remove the token issuer’s controls.

USDT and USDC illustrate this boundary. Their issuers can restrict token transfers associated with particular addresses. This does not give them your private key or control over every asset in your wallet. Circle’s [blocklisting policy](https://help.circle.com/support/en/understand-circle-s-stablecoin-blocklisting-process?id=support_article_view&sysparm_article=KB0011513) explains that blocking an address can prevent it from sending or receiving USDC, including to comply with applicable law or valid legal orders. Blocking transfers is different from reversing a completed transaction.

The tradeoff became concrete after the **29 October 2026 Binance hack**. Binance [reported compromised hot wallets](https://www.binance.com/en/square/post/382966351297065). In its 2 November statement, [Tether reported freezing more than $1.5 billion in USDT](https://tether.io/news/tether-freezes-over-1-5-billion-from-binance-hack-keeping-funds-out-of-north-koreas-reach/) linked to the incident. That intervention restricted the attackers’ access to those tokens. A freeze, however, is not by itself a completed recovery or reimbursement.

The same authority that can help contain theft also limits censorship resistance. Using a public chain does not exempt users, issuers, or service providers from applicable laws and regulations. The design question is which powers are acceptable, who can exercise them, and what review or remedy exists when they are used incorrectly.

Before calling a system decentralized, ask: **who can freeze transfers, change the rules, or deny redemption, and what can a user do about it?**

# Conclusion

Web3 combines shared ledgers, cryptographic authorization, and programmable contracts to let participants verify and act on shared state. These mechanisms can reduce dependence on a platform operator, while introducing responsibilities around keys, transaction costs, contract behavior, and the systems connecting the chain to the outside world.

To assess a Web3 application, trace one operation: who signs, who validates it, which state becomes public, and which services or administrators can still affect the result. Then ask what remains usable if the original frontend disappears.

That separates a verifiable on-chain record from broader claims about ownership, safety, or decentralization. The [stablecoin guide](/blog/web3-stablecoins) applies the same questions to a particular payment mechanism.
