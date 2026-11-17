'use client'

import { useState } from 'react'
import { Blocks, Code2, KeyRound, Layers, Network, ShieldCheck } from 'lucide-react'

const concepts = [
  {
    name: 'Ownership',
    Icon: KeyRound,
    mechanism: 'Keys authorize actions',
    detail:
      'A wallet lets you sign without a platform account. Control of a token does not automatically grant copyright or preserve an off-chain file.',
  },
  {
    name: 'Shared records',
    Icon: Blocks,
    mechanism: 'Nodes verify history',
    detail:
      'Hash-linked blocks expose changes. Consensus selects a shared history; proof of work and proof of stake make influence costly in different ways.',
  },
  {
    name: 'Applications',
    Icon: Code2,
    mechanism: 'Contracts apply rules',
    detail:
      'Programmable state enables stablecoins, DeFi, NFTs, and DAOs. Oracles, issuers, and upgrade keys can still affect the outcome.',
  },
  {
    name: 'Wallets',
    Icon: ShieldCheck,
    mechanism: 'Custody is a responsibility',
    detail:
      'Who holds the keys? What does a signature permit? Recovery, token approvals, and public transaction history matter as much as connecting an app.',
  },
  {
    name: 'Scaling',
    Icon: Layers,
    mechanism: 'Execute in batches, settle on L1',
    detail:
      'Rollups reduce per-transaction settlement costs. Compare data availability, proof or dispute timing, sequencer control, and bridge exits.',
  },
  {
    name: 'Trust boundaries',
    Icon: Network,
    mechanism: 'Trace what remains outside',
    detail:
      'Bridges, frontends, AI agents, and real-world claims add dependencies. Ask who can change the system and what survives if its operator disappears.',
  },
]

export default function Web3Overview() {
  const [active, setActive] = useState(0)
  const concept = concepts[active]
  return (
    <div className="post-cover web3-overview" aria-label="Explore the Web3 article overview">
      <div className="web3-concepts" role="group" aria-label="Article themes">
        {concepts.map(({ name, Icon }, index) => (
          <button key={name} aria-pressed={active === index} onClick={() => setActive(index)}>
            <Icon size={20} aria-hidden="true" />
            <span>{name}</span>
          </button>
        ))}
      </div>
      <div className="web3-concept-detail" aria-live="polite">
        <strong>{concept.mechanism}</strong>
        <p>{concept.detail}</p>
      </div>
    </div>
  )
}
